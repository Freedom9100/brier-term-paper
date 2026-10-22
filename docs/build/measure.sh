#!/bin/zsh
# Пересборка -> PDF через Word -> замер заполненности страниц
set -e
S=/private/tmp/claude-501/-Users-emiltukhvatullin-Desktop-------Claude-Projects-kursovaya/a4256077-7fe6-4b18-975a-29c417c2e723/scratchpad
cd "$(dirname "$0")"
"$S/venv/bin/python" build_doc.py >/dev/null
mkdir -p /private/tmp/wordconv
cp "../Пояснительная_записка.docx" /private/tmp/wordconv/note.docx
rm -f /private/tmp/wordconv/note.pdf
osascript <<'OSA' >/dev/null 2>&1 || true
set hfs to (POSIX file "/private/tmp/wordconv/note.docx") as text
set outHfs to (POSIX file "/private/tmp/wordconv/note.pdf") as text
with timeout of 280 seconds
  tell application "Microsoft Word"
    close every document saving no
    open file name hfs
    delay 3
    save as active document file format format PDF file name outHfs
    delay 2
    close every document saving no
  end tell
end timeout
OSA
"$S/venv/bin/python" measure.py
