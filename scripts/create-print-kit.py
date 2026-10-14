from pathlib import Path
from shutil import copyfile
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics import renderPDF
from reportlab.lib.utils import simpleSplit

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)
ASSETS = ROOT / "public" / "downloads"
ASSETS.mkdir(parents=True, exist_ok=True)
INK, SOFT, COBALT, LINE = map(HexColor, ["#0B0E0C", "#5A625C", "#214FDB", "#E6E8E4"])

def text(c, x, y, value, size=11, font="Helvetica", color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)

def paragraph(c, x, y, value, width, size=12, leading=18):
    for line in simpleSplit(value, "Helvetica", size, width):
        text(c, x, y, line, size, color=SOFT)
        y -= leading
    return y

def logo(c, x, y, size=30):
    c.saveState()
    c.translate(x, y)
    c.scale(size/64, size/64)
    c.setStrokeColor(COBALT)
    c.setLineWidth(2.5)
    for points in [[(13,42),(29,49),(29,15),(13,8)],[(21,50),(37,57),(37,23),(29,19),(29,49),(21,45)],[(37,57),(51,50),(51,16),(37,23)]]:
        p=c.beginPath()
        p.moveTo(*points[0])
        for point in points[1:]:
            p.lineTo(*point)
        p.close()
        c.drawPath(p)
    c.restoreState()
    text(c, x+size+8, y+size*.36, "DataQuire", size*.8, "Times-Bold")

def qr(c, x, y, size):
    q = QrCodeWidget("https://dataquire.si/estimator")
    x0,y0,x1,y1=q.getBounds()
    d=Drawing(size,size,transform=[size/(x1-x0),0,0,size/(y1-y0),0,0])
    d.add(q)
    renderPDF.draw(d,c,x,y)

flyer = OUT / "dataquire-flyer.pdf"
c=canvas.Canvas(str(flyer),pagesize=(612,792))
c.setTitle("DataQuire: operating history valuation")
c.setAuthor("DataQuire")
logo(c,48,710,30)
text(c,48,667,"THE AI DATA BROKERAGE",9,color=COBALT)
for y,line in [(614,"Your operating history"),(565,"may have licensing value.")]:
    text(c,48,y,line,37,"Times-Bold")
paragraph(c,48,518,"DataQuire values, prepares, and licenses operational records to AI labs. You retain the business and underlying data, and approve the terms in writing.",480,13,20)
c.setStrokeColor(LINE)
c.line(48,445,564,445)
for n,title,copy,y in [
    ("01","Get an indicative range.","About 60 seconds. No commitment. No raw file uploads.",407),
    ("02","Define the boundary.","Rights, approved sources, exclusions, and processing are agreed before access.",324),
    ("03","Approve every deal.","Buyers see approved de-identified samples. Scope and payment are in writing.",241)
]:
    text(c,48,y,n,26,"Times-Italic",COBALT)
    text(c,99,y+2,title,19,"Times-Bold")
    paragraph(c,99,y-23,copy,427,11,16)
c.line(48,192,564,192)
text(c,48,157,"See what your data is worth",21,"Times-Bold")
text(c,48,131,"dataquire.si/estimator",12,color=COBALT)
text(c,48,103,"No upfront fees. Indicative estimates are not offers.",10,color=SOFT)
qr(c,477,103,76)
text(c,48,52,"hello@dataquire.si",10,color=SOFT)
text(c,329,52,"De-identification reduces risk; it does not eliminate it.",8,color=SOFT)
c.showPage()
c.save()

postcard = OUT / "dataquire-postcard.pdf"
# Finished trim: 6 by 4 in. Bleed: 0.125 in on every side.
c=canvas.Canvas(str(postcard),pagesize=(450,306))
c.setTitle("DataQuire: 6 x 4 inch referral postcard")
c.setAuthor("DataQuire")
logo(c,27,253,23)
text(c,27,220,"THE EXIT WITHOUT THE EXIT",8,color=COBALT)
text(c,27,188,"A license for the record",26,"Times-Bold")
text(c,27,156,"you already own.",26,"Times-Bold")
paragraph(c,27,126,"Keep the company and the data. Get an indicative range before deciding whether to explore a license.",305,10,15)
c.setStrokeColor(LINE)
c.line(27,78,423,78)
text(c,27,55,"See what your data is worth",15,"Times-Bold")
text(c,27,35,"dataquire.si/estimator",9,color=COBALT)
qr(c,356,94,67)
text(c,27,18,"No upfront fees. Indicative range, not an offer.",7,color=SOFT)
# Crop marks remain outside the 6 by 4 in trim boundary.
c.setLineWidth(.3)
c.setStrokeColor(SOFT)
for x,y,dx,dy in [(9,9,-1,0),(9,9,0,-1),(441,9,1,0),(441,9,0,-1),(9,297,-1,0),(9,297,0,1),(441,297,1,0),(441,297,0,1)]:
    c.line(x+dx*3,y+dy*3,x+dx*7,y+dy*7)
c.showPage()
c.save()
for artifact in [flyer,postcard]:
    copyfile(artifact, ASSETS/artifact.name)
    print(artifact)
