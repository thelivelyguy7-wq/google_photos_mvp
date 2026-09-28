from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor as H, white
from reportlab.pdfbase.pdfmetrics import stringWidth as sw

W, H_ = 960, 540
INK, MUTE, FAINT, ACC, LINE, PANEL = H('#1b1f27'), H('#5b6270'), H('#8a90a0'), H('#c2410c'), H('#d9dce3'), H('#f4f5f7')
c = canvas.Canvas('Slide09_Risks_and_Mitigations.pdf', pagesize=(W, H_))


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
y = para(44, 'The biggest risk is not the model failing; it is a wrong clue silently emptying the results, so V1 is built to catch that first', 70, 872, 'Helvetica-Bold', 20.5, INK, 24)
para(44, 'Six risks to the adaptive retrieval loop, each with a mitigation and a signal we can measure in the usability sessions.', y + 2, 872, 'Helvetica', 10.3, MUTE)

# table
X = [44, 214, 402, 700, 916]
hy = 142
c.setFillColor(INK); c.rect(44, Y(hy + 22), 872, 22, stroke=0, fill=1)
for i, t in enumerate(['Risk', 'Potential impact', 'Mitigation strategy', 'Monitoring signals']):
    txt(X[i] + 8, t, hy + 14.5, 'Helvetica-Bold', 8.4, white)

rows = [
    ('Clue misread at Express', 'A wrong or unknown clue becomes a hard filter, so the result set is empty or wrong and the user starts over.',
     'Read clues with an LLM, treat uncertain ones as soft signals, and show the clues as chips the user can correct.',
     'Clues read correctly (% of sessions), zero-result rate, clue corrections per session'),
    ('Too many plausible candidates', 'Users inspect many similar photos, take longer, and are less sure they picked the right one.',
     'Rank so the intended photo is in the first 3, and show the filters that separate similar photos (place, year, people).',
     'Candidates inspected, time to retrieval, recognition confidence (1-5)'),
    ('Recovery suggestions ignored', 'After "none of these" users freeze or leave, the same dead end as an empty search box.',
     'Offer 2 or 3 ranked actions based on what was already tried, with a reason. Change the mechanism if they are ignored.',
     'Recovery rate, recovery suggestions accepted, strategy switches'),
    ('Added latency from AI steps', 'Reading the memory and ranking take time, so the search feels slower than plain keyword search.',
     'Use a small fast model, cache common clue patterns, and hold a latency budget for the Express step.',
     'Response time (P95), search abandonment rate'),
    ('Privacy of personal photos', 'Sending memory text or photos to a model may break user trust or policy.',
     'Process inside the user\'s own account, send no photo content to third parties, keep the feature opt-in.',
     'Opt-out rate, privacy complaints, data-access review'),
    ('Thin V1 evidence', 'Three users and simulated data can hide real failures or overstate success, so V2 is built on the wrong fix.',
     'Run the real sessions before V2, log events in the app, and add users until the same failures repeat.',
     'Sessions completed with real data, repeat failure points, logged vs hand-timed gaps'),
]
yy = hy + 22
cw = [X[i + 1] - X[i] - 16 for i in range(4)]
for r in rows:
    ys = yy + 13; e = ys
    for j, t in enumerate(r):
        f = 'Helvetica-Bold' if j == 0 else 'Helvetica'
        col = ACC if j == 0 else (INK if j == 2 else MUTE)
        e = max(e, para(X[j] + 8, t, ys, cw[j], f, 7.9, col, 9.8))
    yy = e + 3
    rule(44, 916, yy)
    yy += 0

# note
c.setFillColor(PANEL); c.roundRect(44, Y(506), 872, 34, 4, stroke=0, fill=1)
txt(56, 'NOTE', 486, 'Helvetica-Bold', 7.4, ACC)
para(160, 'Signals are what we measure; no target values are set yet because no real session has been run. The first three risks are the V2 priorities from Slide 8.', 486, 740, 'Helvetica', 7.4, INK, 9)
para(44, 'Risks drawn from the V1 build, the discovery findings and the simulated test report (Slide 8). Thresholds to be set after real usability sessions.', 526, 872, 'Helvetica-Oblique', 6.9, FAINT)
c.save()
