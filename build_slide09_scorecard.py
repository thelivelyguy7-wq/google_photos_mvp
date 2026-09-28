from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor as H, white
from reportlab.pdfbase.pdfmetrics import stringWidth as sw

W, H_ = 960, 540
INK, MUTE, FAINT, ACC, LINE, PANEL = H('#1b1f27'), H('#5b6270'), H('#8a90a0'), H('#c2410c'), H('#d9dce3'), H('#f4f5f7')
c = canvas.Canvas('Slide09_Risks_and_Mitigations_Scorecard.pdf', pagesize=(W, H_))


def Y(t): return H_ - t


def txt(x, t, y, f='Helvetica', s=8, col=INK, right=False):
    c.setFont(f, s); c.setFillColor(col)
    (c.drawRightString if right else c.drawString)(x, Y(y), t)


def wrap(t, f, s, w):
    out, cur = [], ''
    for wd in t.split():
        n = (cur + ' ' + wd).strip()
        if sw(n, f, s) <= w: cur = n
        else: out.append(cur); cur = wd
    if cur: out.append(cur)
    return out


def para(x, t, y, w, f='Helvetica', s=8, col=INK, lead=None):
    lead = lead or s * 1.32
    for l in wrap(t, f, s, w): txt(x, l, y, f, s, col); y += lead
    return y


def rule(x1, x2, y, col=LINE, w=.6): c.setStrokeColor(col); c.setLineWidth(w); c.line(x1, Y(y), x2, Y(y))


txt(44, 'RISKS AND MITIGATIONS', 34, 'Helvetica-Bold', 8.3, FAINT)
txt(916, '09 / 10', 34, 'Helvetica-Bold', 8.3, FAINT, True)
rule(44, 916, 44)
y = para(44, 'Risk scorecard: each risk is tracked from its V1 baseline to its V2 result, so we can say which mitigations worked', 70, 872, 'Helvetica-Bold', 20.5, INK, 24)
para(44, 'Layout for the finished slide. The V1 and V2 columns stay empty until real sessions are run; nothing is filled in with invented numbers.', y + 2, 872, 'Helvetica', 10.3, MUTE)

X = [44, 164, 304, 484, 614, 700, 786, 916]
hy = 142
c.setFillColor(INK); c.rect(44, Y(hy + 30), 872, 30, stroke=0, fill=1)
heads = [['Risk'], ['Potential impact'], ['Mitigation in V2'], ['Signal we track'], ['V1', 'observed'], ['V2', 'result'], ['Status']]
for i, hh in enumerate(heads):
    for k, t in enumerate(hh):
        txt(X[i] + 6, t, hy + 12 + k * 10 if len(hh) > 1 else hy + 18, 'Helvetica-Bold', 7.6, white)

rows = [
    ('Clue misread at Express', 'A wrong clue hard-filters the set to empty or wrong.',
     'LLM clue reading, soft filters, editable clue chips.', 'Clues read correctly, zero-result rate'),
    ('Too many plausible candidates', 'Long inspection, lower confidence in the pick.',
     'Better ranking; filters that separate similar photos.', 'Candidates inspected, time, confidence'),
    ('Recovery suggestions ignored', 'Users freeze or leave after "none of these".',
     '2 or 3 ranked recovery actions with a reason.', 'Recovery rate, suggestions accepted'),
    ('Added latency from AI steps', 'Search feels slower than keyword search.',
     'Small fast model, cached clue patterns, latency budget.', 'Response time (P95), abandonment'),
    ('Privacy of personal photos', 'Loss of trust or policy breach.',
     'In-account processing, no third-party photo sharing, opt-in.', 'Opt-out rate, privacy complaints'),
    ('New risks found in testing', 'Failure modes we did not list.',
     'Add a row per new failure seen in sessions.', 'Repeat failure points'),
]
yy = hy + 30
cw = [X[i + 1] - X[i] - 12 for i in range(7)]
for r in rows:
    ys = yy + 13; e = ys
    for j, t in enumerate(r):
        f = 'Helvetica-Bold' if j == 0 else 'Helvetica'
        col = ACC if j == 0 else (INK if j == 2 else MUTE)
        e = max(e, para(X[j] + 6, t, ys, cw[j], f, 7.5, col, 9.4))
    txt(X[4] + 6, '--', ys, 'Helvetica', 7.5, FAINT)
    txt(X[5] + 6, '--', ys, 'Helvetica', 7.5, FAINT)
    txt(X[6] + 6, 'To measure', ys, 'Helvetica-Bold', 7.5, FAINT)
    yy = e + 5
    rule(44, 916, yy)

# note
c.setFillColor(PANEL); c.roundRect(44, Y(506), 872, 34, 4, stroke=0, fill=1)
txt(56, 'HOW TO FILL', 486, 'Helvetica-Bold', 7.4, ACC)
para(160, 'V1 observed = baseline from the real V1 sessions. V2 result = the same measure after V2. Status = Reduced, Unchanged, Worse or New. Set targets once the V1 baseline exists.', 486, 740, 'Helvetica', 7.4, INK, 9)
para(44, 'Risks drawn from the V1 build, the discovery findings and the simulated test report (Slide 8). Empty cells are deliberate.', 526, 872, 'Helvetica-Oblique', 6.9, FAINT)
c.save()
