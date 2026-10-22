# -*- coding: utf-8 -*-
"""Замер заполненности страниц готового PDF."""
import pymupdf

PDF = "/private/tmp/wordconv/note.pdf"
MARGIN_PT = 2 / 2.54 * 72          # поля 2 см сверху и снизу
MIN_FILL = 60.0

doc = pymupdf.open(PDF)
print(f"страниц: {doc.page_count}")
problems = []
for num, page in enumerate(doc, 1):
    top = MARGIN_PT
    bottom = page.rect.height - MARGIN_PT
    area = bottom - top
    lowest = None
    for block in page.get_text("blocks"):
        if (block[4] or "").strip() or block[6] == 1:
            lowest = block[3] if lowest is None else max(lowest, block[3])
    for img in page.get_image_info():
        lowest = img["bbox"][3] if lowest is None else max(lowest, img["bbox"][3])
    head = " ".join(page.get_text().split())[:58]
    if lowest is None:
        print(f"стр.{num:2d}:   пустая")
        problems.append(num)
        continue
    fill = (lowest - top) / area * 100
    mark = "  <-- МАЛО" if fill < MIN_FILL and num != doc.page_count else ""
    if mark:
        problems.append(num)
    print(f"стр.{num:2d}: {fill:5.1f}%  {head}{mark}")
print("\nпроблемных страниц:", problems if problems else "нет")
