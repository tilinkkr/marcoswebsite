from io import BytesIO
from textwrap import wrap

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen.canvas import Canvas


def build_agreement_pdf(
    *, agreement_id: str, canonical_hash: str, details: dict[str, str], policy_snapshot: str, consents: list[str]
) -> bytes:
    buffer = BytesIO()
    canvas = Canvas(buffer, pagesize=A4, pageCompression=1)
    width, height = A4
    margin = 54
    y = height - 58

    def new_page() -> None:
        nonlocal y
        canvas.showPage()
        canvas.setFillColor(HexColor("#141715"))
        y = height - 58

    def line(text: str, size: int = 9, leading: int = 13, bold: bool = False) -> None:
        nonlocal y
        font = "Helvetica-Bold" if bold else "Helvetica"
        for part in wrap(str(text), width=96) or [""]:
            if y < 40:
                new_page()
            canvas.setFont(font, size)
            canvas.drawString(margin, y, part)
            y -= leading

    canvas.setFillColor(HexColor("#141715"))
    canvas.setFont("Helvetica-Bold", 23)
    canvas.drawString(margin, y, "MARCOS")
    y -= 32
    canvas.setFont("Helvetica-Bold", 15)
    canvas.drawString(margin, y, "MEMBERSHIP RISK ACKNOWLEDGEMENT")
    y -= 28
    canvas.setStrokeColor(HexColor("#C97941"))
    canvas.line(margin, y, width - margin, y)
    y -= 25

    for label, value in details.items():
        line(f"{label.upper()}: {value}", bold=True)
    y -= 8
    line(f"CANONICAL ACCEPTANCE SHA-256: {canonical_hash}", size=7, leading=10)
    y -= 14
    line("EXACT RISK POLICY ACCEPTED", size=11, bold=True)
    y -= 5
    for block in policy_snapshot.split("\n\n"):
        heading, _, body = block.partition("\n")
        line(heading, bold=True)
        line(body)
        y -= 2
    line("CONSENT CHECKLIST", size=11, bold=True)
    for consent in consents:
        line(f"[ACCEPTED] {consent}")
    y -= 4
    line(
        "Generated electronically by MARCOS. This technical record requires final legal review before production use.",
        size=8,
    )
    canvas.save()
    return buffer.getvalue()
