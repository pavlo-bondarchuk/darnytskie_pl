from pathlib import Path
from lxml import html

root = Path(__file__).resolve().parents[1]
page = html.document_fromstring((root / "index.html").read_text(encoding="utf-8"))
page.set("lang", "pl")
for node in page.iter():
    for suffix, attribute in [("", None), ("-alt", "alt"), ("-aria", "aria-label")]:
        polish = node.get("data-pl" + suffix)
        if polish is None:
            continue
        original = node.get(attribute) if attribute else node.text
        node.set("data-uk" + suffix, original)
        if attribute:
            node.set(attribute, polish)
        else:
            node.text = polish
    for attribute in ("src", "href"):
        value = node.get(attribute, "")
        if value.startswith(("assets/", "css/", "js/")):
            node.set(attribute, "../" + value)
    if "srcset" in node.attrib:
        node.set("srcset", node.get("srcset").replace("assets/", "../assets/"))
    if "data-language" in node.attrib:
        node.set("aria-pressed", str(node.get("data-language") == "pl").lower())

title = "Darnytskie Wyroby — do stołu!"
description = "Kiełbasy, parówki i przekąski Darnytskie. Zobacz produkty i znajdź adresy sklepów w Łodzi i Sosnowcu."
page.find(".//title").text = title
page.xpath('//meta[@property="og:title"]')[0].set("content", title)
for node in page.xpath('//meta[@name="description" or @property="og:description"]'):
    node.set("content", description)
output = html.tostring(page, encoding="unicode", doctype="<!doctype html>")
(root / "pl/index.html").write_text(output + "\n", encoding="utf-8")
