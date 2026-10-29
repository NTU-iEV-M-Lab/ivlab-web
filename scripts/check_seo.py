#!/usr/bin/env python3
"""Validate Hugo output before Pages upload. Uses only the Python standard library."""

import argparse
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET


BASE_URL = "https://ntu-iev-m-lab.github.io/ivlab-web/"
SECTIONS = ("", "professor/", "member/", "publication/", "research/", "projects/")
ROUTES = tuple(prefix + section for prefix in ("", "en/") for section in SECTIONS)
EXCLUDED = ("categories/", "tags/", "en/categories/", "en/tags/")
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "x": "http://www.w3.org/1999/xhtml"}
BLOCKING = {"noindex", "nofollow", "none"}


class SEOError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise SEOError(message)


class Head(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.meta = defaultdict(list)
        self.canonical = []
        self.title = []
        self.lang = None
        self.in_head = False
        self.in_title = False
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "html":
            self.lang = attrs.get("lang", "").lower()
        if tag == "head":
            self.in_head = True
        if not self.in_head:
            return
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            name = attrs.get("name", attrs.get("property", "")).lower()
            self.meta[name].append(attrs.get("content", ""))
        if tag == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonical.append(attrs.get("href", ""))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "head":
            self.in_head = False

    def handle_data(self, value):
        if self.in_head and self.in_title:
            self.title.append(value)

    @property
    def directives(self):
        values = [value for key, items in self.meta.items()
                  if key == "robots" or key.startswith("googlebot") for value in items]
        return set(re.split(r"[,;\s]+", " ".join(values).lower())) - {""}


def read_head(path):
    require(path.is_file(), f"Missing page: {path}")
    return Head(path.read_text(encoding="utf-8"))


def public_file(root, url, base):
    """Reject external hosts, lost project prefixes and traversal in generated URLs."""
    parsed, expected = urlsplit(url), urlsplit(base)
    require(parsed.scheme == expected.scheme and parsed.netloc == expected.netloc,
            f"Incorrect URL origin: {url}")
    require(not parsed.query and not parsed.fragment, f"Non-canonical Sitemap URL: {url}")
    path = unquote(parsed.path)
    require(path.startswith(expected.path), f"Missing project prefix: {url}")
    relative = path[len(expected.path):]
    require(".." not in Path(relative).parts, f"Unsafe URL path: {url}")
    result = root / relative
    return result / "index.html" if path.endswith("/") else result


def check(root, mode, base=BASE_URL):
    base = base.rstrip("/") + "/"
    root = Path(root)
    descriptions = set()
    for route in ROUTES:
        url = base + route
        head = read_head(root / route / "index.html")
        require(head.canonical == [url], f"Incorrect/duplicate canonical: {url}")
        require(head.lang == ("en" if route.startswith("en/") else "zh-tw"),
                f"Incorrect HTML language: {url}")
        title = "".join(head.title).strip()
        require(bool(title), f"Empty title: {url}")
        descriptions_for_page = head.meta["description"]
        require(len(descriptions_for_page) == 1 and descriptions_for_page[0].strip(),
                f"Missing/duplicate description: {url}")
        description = descriptions_for_page[0]
        require(description not in descriptions, f"Repeated description: {url}")
        descriptions.add(description)
        require(description != "National Taiwan University Department of Mechanical Engineering",
                f"Generic Hero text reused as description: {url}")
        if not route.startswith("en/"):
            require(re.search(r"[\u3400-\u9fff]", description), f"Unlocalized description: {url}")
        og_title = head.meta["og:title"]
        require(len(og_title) == 1 and og_title[0] and og_title[0] in title,
                f"Incorrect/duplicate Open Graph title: {url}")
        if route not in ("", "en/"):
            home = read_head(root / ("en/" if route.startswith("en/") else "") / "index.html")
            require(og_title != home.meta["og:title"], f"Inner page uses home OG title: {url}")
        require(head.meta["og:description"] == [description], f"Inconsistent OG description: {url}")
        if mode == "production":
            require(bool(head.meta["robots"]), f"Missing explicit robots policy: {url}")
            require(not (head.directives & BLOCKING), f"Indexing blocked: {url}: {head.directives}")
        else:
            require({"noindex", "nofollow"} <= head.directives, f"Preview is indexable: {url}")

    index_path = root / "sitemap.xml"
    require(index_path.is_file(), "Missing Sitemap index")
    index = ET.parse(index_path).getroot()
    require(index.tag == "{" + NS["s"] + "}sitemapindex", "Expected multilingual Sitemap index")
    children = [n.text for n in index.findall("s:sitemap/s:loc", NS)]
    require(set(children) == {base + "zh/sitemap.xml", base + "en/sitemap.xml"}
            and len(children) == 2, "Incorrect language Sitemap URLs")
    entries = {}
    for url in children:
        child = public_file(root, url, base)
        require(child.is_file(), f"Missing language Sitemap: {url}")
        xml = ET.parse(child).getroot()
        require(xml.tag == "{" + NS["s"] + "}urlset", f"Invalid Sitemap: {url}")
        for node in xml.findall("s:url", NS):
            loc = node.findtext("s:loc", namespaces=NS)
            require(bool(loc) and loc not in entries, f"Empty/duplicate Sitemap URL: {loc}")
            head = read_head(public_file(root, loc, base))
            require(head.canonical == [loc], f"Sitemap/canonical mismatch: {loc}")
            if mode == "production":
                require(not (head.directives & BLOCKING), f"Excluded page in Sitemap: {loc}")
            links = node.findall("x:link", NS)
            alternates = {n.get("hreflang", "").lower(): n.get("href") for n in links}
            require(len(links) == len(alternates), f"Duplicate hreflang: {loc}")
            entries[loc] = alternates
    for route in ROUTES:
        url = base + route
        require(url in entries, f"Main page missing from Sitemap: {url}")
        section = route.removeprefix("en/")
        expected = {"zh-tw": base + section, "en": base + "en/" + section}
        require(entries[url] == expected, f"Incorrect/self-missing hreflang: {url}")
        for alternate in expected.values():
            require(entries.get(alternate) == expected, f"Non-reciprocal hreflang: {url}")
    for route in EXCLUDED:
        require(base + route not in entries, f"Empty taxonomy in Sitemap: {route}")
        head = read_head(root / route / "index.html")
        require({"noindex", "nofollow"} <= head.directives, f"Empty taxonomy is indexable: {route}")
    return len(entries)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    parser.add_argument("--mode", choices=("production", "development"), required=True)
    parser.add_argument("--base-url", default=BASE_URL)
    args = parser.parse_args()
    try:
        entries = check(args.directory, args.mode, args.base_url)
    except (SEOError, ET.ParseError, OSError) as error:
        print(f"SEO CHECK FAILED: {error}", file=sys.stderr)
        return 1
    print(f"SEO PASS ({args.mode}): 12 bilingual pages; canonical, metadata, robots, "
          f"{entries} Sitemap URLs and reciprocal hreflang; 4 empty taxonomies excluded.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
