import shutil
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.worksheet.formula import ArrayFormula

SRC = r'C:\Users\ADMIN\Downloads\mvp testing.xlsx'
OUT = 'MVP_testing_V1_to_V2_SIMULATED.xlsx'
wb = openpyxl.load_workbook(SRC)

INK, ACC = '1B1F27', 'C2410C'
hf = Font(name='Arial', bold=True, color='FFFFFF', size=10)
hfill = PatternFill('solid', fgColor=INK)
base = Font(name='Arial', size=10)
bold = Font(name='Arial', size=10, bold=True)
sim = PatternFill('solid', fgColor='FDE7DA')
box = Border(bottom=Side(style='thin', color='D9DCE3'))
BANNER = ('SIMULATED DATA. The V2 round below is illustrative: no V2 was built or tested. '
          'Replace every shaded cell with real observations.')


def sheet(title, headers, rows, widths, banner=True):
    ws = wb.create_sheet(title)
    r = 1
    if banner:
        c = ws.cell(1, 1, BANNER)
        c.font = Font(name='Arial', bold=True, color=ACC, size=10)
        c.fill = sim
        ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=len(headers))
        r = 3
    for j, h in enumerate(headers, 1):
        c = ws.cell(r, j, h)
        c.font, c.fill = hf, hfill
        c.alignment = Alignment(wrap_text=True, vertical='center')
    for i, row in enumerate(rows, r + 1):
        for j, v in enumerate(row, 1):
            c = ws.cell(i, j, v)
            c.font, c.border = base, box
            c.alignment = Alignment(wrap_text=True, vertical='top')
    for j, w in enumerate(widths, 1):
        ws.column_dimensions[L(j)].width = w
    ws.freeze_panes = ws.cell(r + 1, 1)
    return ws, r


# ---------------- V2 Changes
CH = [('L1', 'Recognition layer', 'Filters were computed but never shown', 'Show filter chips (place, year, people) only when they split the candidate set; highlight the one that splits it most', 'Built', 'Simulated'),
      ('L2', 'Express', 'Rule-based clue reading missed phrasing and hard-filtered on wrong clues', 'LLM reads the memory; uncertain clues become soft ranking signals; clue chips are editable', 'Built', 'Simulated'),
      ('L3', 'Recover', 'Long unranked list of recovery categories', '2 or 3 ranked recovery actions from what was already tried, each with a reason', 'Built', 'Simulated'),
      ('L4', 'Match', 'Loop works when clues are right', 'Kept as is', 'Kept', 'Simulated'),
      ('L5', 'Match', 'Only 6 of 12 photos in the best group were shown; too many similar photos', 'Rank by clue match; add "Show all in this group"', 'Built', 'Simulated'),
      ('L6', 'Measurement', 'No time, inspection or recovery logging', 'Log session events in the app (time, photos opened, recovery steps)', 'Built', 'Simulated')]
sheet('V2 Changes', ['Learning', 'Journey stage', 'V1 problem', 'What V2 changed', 'Status', 'Basis'],
      CH, [10, 18, 46, 70, 10, 12])

# ---------------- V2 Sessions
H = ['Session', 'User', 'Task', 'Query typed (simulated)', 'Clues read correctly', 'First attempt found it',
     'Recovery used (count)', 'Strategy switches', 'Candidates inspected', 'Time to retrieval (s)',
     'Found intended photo', 'Confidence (1-5)', 'V2 features used', 'Observation (simulated)']
S2 = [('S7', 'U4', 'T1', 'beach cafe with my cousin sunset goa', 'Yes', 'Yes', 0, 0, 2, 31, 'Yes', 5, 'None needed',
       'Photo was in the first three. Editable clue chips were read but not changed.'),
      ('S8', 'U4', 'T4', 'hidden waterfall with friends', 'Yes', 'Yes', 0, 0, 4, 58, 'Yes', 4, 'Clue chips',
       '"friends" was kept as a soft signal and marked low match, so the waterfall photos still appeared. This was the failure in V1 (S2).'),
      ('S9', 'U5', 'T3', 'night party goa beach with my college friends', 'Yes', 'Yes', 0, 0, 5, 52, 'Yes', 4, 'Show all in group',
       'The guitar photo was outside the first 6 in V1; "Show all in this group" surfaced it.'),
      ('S10', 'U5', 'T5', 'boat ride kerala backwaters with my parents', 'Yes', 'Yes', 0, 0, 3, 37, 'Yes', 5, 'None needed',
       '"parents" was read as family.'),
      ('S11', 'U6', 'T2', 'trek near lonavala in rain', 'Yes', 'No', 1, 1, 6, 84, 'Yes', 3, 'Ranked recovery, filter chips',
       'Lonavala understood as Maharashtra. First set had several similar hiking photos; took the top recovery action "add time of day: morning".'),
      ('S12', 'U6', 'T6', 'hammock sunset', 'Yes', 'No', 1, 1, 7, 73, 'No', 4, 'Filter chips, ranked recovery',
       'Picked a near-identical Goa sunset from the cafe scenario, confidently. The place filter did not help because every candidate was in Goa.')]
ws2, r2 = sheet('V2 Sessions', H, S2, [9, 7, 7, 40, 14, 14, 14, 12, 13, 14, 14, 12, 26, 72])
a2, b2 = r2 + 1, r2 + len(S2)
for i in range(a2, b2 + 1):
    for j in range(4, 15):
        ws2.cell(i, j).fill = sim

# ---------------- V2 Participants (simulated, new users, same task pairs)
sheet('V2 Participants', ['User', 'Status', 'Profile', 'Photos use', 'Retrieval behaviour (screener)', 'Segment match', 'Tasks'],
      [('U4', 'SIMULATED', 'Working professional, 31', 'Google Photos, weekly', 'Retries with new words when search fails', 'Segment T: effortful-path retriever', 'T1, T4'),
       ('U5', 'SIMULATED', 'Working professional, 27', 'Google Photos, daily', 'Scrolls the timeline when search fails', 'Segment T: effortful-path retriever', 'T3, T5'),
       ('U6', 'SIMULATED', 'Graduate student, 25', 'Google Photos, weekly', 'Gives up after several misses', 'Segment T: effortful-path retriever', 'T2, T6')],
      [8, 14, 26, 22, 44, 34, 12])
wb['V2 Participants'].cell(2, 1)  # keep banner row

# ---------------- V1 vs V2 metrics
v1 = lambda col: f"Sessions!${col}$4:${col}$9"
v2 = lambda col: f"'V2 Sessions'!${col}${a2}:${col}${b2}"
metrics = [
    ('Retrieval success (% of sessions)', 'Higher', '0%',
     lambda R: f'=COUNTIF({R("K")},"Yes")/COUNTA({R("K")})'),
    ('First-attempt success (% of sessions)', 'Higher', '0%',
     lambda R: f'=COUNTIF({R("F")},"Yes")/COUNTA({R("F")})'),
    ('Recovery rate (% of failed first attempts that ended in success)', 'Higher', '0%',
     lambda R: f'=COUNTIFS({R("F")},"No",{R("K")},"Yes")/COUNTIF({R("F")},"No")'),
    ('Median time to retrieval, successful sessions (s)', 'Lower', '0', None),
    ('Average strategy switches per session', 'Lower', '0.0',
     lambda R: f'=AVERAGE({R("H")})'),
    ('Average candidates inspected per session', 'Lower', '0.0',
     lambda R: f'=AVERAGE({R("I")})'),
    ('Average recognition confidence (1-5)', 'Higher', '0.0',
     lambda R: f'=AVERAGE({R("L")})'),
    ('Clues read correctly (% of sessions)', 'Higher', '0%',
     lambda R: f'=COUNTIF({R("E")},"Yes")/COUNTA({R("E")})'),
    ('Confident but wrong (sessions with confidence 4+ and wrong photo)', 'Lower', '0',
     lambda R: f'=COUNTIFS({R("K")},"No",{R("L")},">=4")'),
]
wm = wb.create_sheet('V1 vs V2 Metrics')
wm['A1'] = BANNER
wm['A1'].font = Font(name='Arial', bold=True, color=ACC)
wm['A1'].fill = sim
wm.merge_cells('A1:G1')
for j, h in enumerate(['Metric', 'V1', 'V2', 'Change', 'Better when', 'Reading', 'Note'], 1):
    c = wm.cell(3, j, h)
    c.font, c.fill = hf, hfill
notes = {
    'Retrieval success (% of sessions)': 'Same 5 of 6: success did not move.',
    'Recovery rate (% of failed first attempts that ended in success)': 'V1 3 of 4, V2 1 of 2: too few cases to read.',
    'Confident but wrong (sessions with confidence 4+ and wrong photo)': 'New in V2 (S12): near-identical photos.',
    'Average recognition confidence (1-5)': 'Includes the confident-wrong session.',
}
for i, (m, better, fmt, fn) in enumerate(metrics, 4):
    wm.cell(i, 1, m).font = bold
    if fn:
        wm.cell(i, 2, fn(v1))
        wm.cell(i, 3, fn(v2))
    else:
        wm.cell(i, 2).value = ArrayFormula(f'B{i}', f'=MEDIAN(IF({v1("K")}="Yes",{v1("J")}))')
        wm.cell(i, 3).value = ArrayFormula(f'C{i}', f'=MEDIAN(IF({v2("K")}="Yes",{v2("J")}))')
    wm.cell(i, 4, f'=C{i}-B{i}')
    wm.cell(i, 5, better)
    wm.cell(i, 6, f'=IF(D{i}=0,"No change",IF((D{i}>0)=(E{i}="Higher"),"Improved","Worse"))')
    wm.cell(i, 7, notes.get(m, ''))
    for j in range(2, 8):
        wm.cell(i, j).font = base
    for j in (2, 3, 4):
        wm.cell(i, j).number_format = fmt if fmt != '0%' else '0%'
    wm.cell(i, 4).number_format = ('+0%;-0%;0%' if fmt == '0%' else '+0.0;-0.0;0' if fmt == '0.0' else '+0;-0;0')
wm['A14'] = ('V1 and V2 used different simulated users on the same 6 tasks (S1-S6 vs S7-S12). '
             'With 3 users each session is worth about 17 points, so read the pattern, not the exact size.')
wm['A14'].font = Font(name='Arial', italic=True, color='8A90A0', size=9)
for j, w in enumerate([66, 10, 10, 10, 13, 14, 52], 1):
    wm.column_dimensions[L(j)].width = w

# ---------------- V2 learnings and next iteration
LN = [('N1', 'Recognition', 'Two near-identical photos from different scenarios (Goa sunset) led to a confident wrong pick; a place filter does not help when every candidate shares the place.',
       'S12', 'High', 1, 'Show why a photo matched and what differs between similar candidates; ask "is this the one?" before ending; offer the differences (people, objects) as filters.', 'Product + ML', 'Simulated'),
      ('N2', 'Express', 'LLM clue reading with soft signals fixed the V1 failures (friends, parents, Lonavala).', 'S8, S10, S11', 'Info', 4, 'Keep; test on phrasing that is harder than these six scenarios.', 'ML', 'Simulated'),
      ('N3', 'Recover', 'Ranked recovery was used twice and helped once; the sample is too small to say it beats the V1 list.', 'S11, S12', 'Medium', 2, 'Run more sessions that reach recovery before changing it again.', 'Research', 'Simulated'),
      ('N4', 'Recognition', 'Filter chips helped when they split the set (time of day in S11) and did nothing when they did not (place in S12).', 'S11, S12', 'Medium', 3, 'Show only filters that split the current set, ranked by how well they split it.', 'Design + Eng', 'Simulated'),
      ('N5', 'Measurement', 'In-app logging replaced hand timing, so time and inspections are now recorded per session.', 'All V2', 'Info', 5, 'Keep; add the intended photo ID so success is checked automatically.', 'Eng', 'Simulated')]
sheet('V2 Learnings and Next', ['ID', 'Journey stage', 'Learning from the V2 round', 'Evidence', 'Severity', 'Priority (1 = first)', 'Change for the next iteration', 'Owner', 'Basis'],
      LN, [6, 16, 76, 14, 10, 12, 70, 14, 12])

# ---------------- V1 to V2 sheet: add result columns
vt = wb['V1 to V2']
adds = ['V2 built', 'V2 result (simulated)', 'Status', 'Basis']
for k, h in enumerate(adds):
    c = vt.cell(3, 7 + k, h)
    c.font, c.fill = hf, hfill
    c.alignment = Alignment(wrap_text=True, vertical='center')
data = [
    ('LLM reads the memory; soft clues; editable chips', 'Clues read correctly 50% to 100% (3 of 6 to 6 of 6). Failures in V1 (friends, parents, Lonavala) did not recur.', 'Improved'),
    ('Ranking by clue match; show all photos in the group', 'Photos inspected 7.0 to 4.5; first-attempt success 33% to 67%; median time 96 s to 52 s. Overall success unchanged at 5 of 6.', 'Improved'),
    ('Filter chips shown only when they split the set', 'Used in 3 of 6 sessions; helped in 2 (S11 time of day), no help in S12 (all candidates in Goa).', 'Partly improved'),
    ('2 or 3 ranked recovery actions with a reason', 'Recovery needed in 2 of 6 sessions (V1: 4 of 6). Recovery rate 75% to 50% but on 4 and 2 cases: inconclusive.', 'Inconclusive'),
]
for i, (b, r_, s_) in enumerate(data, 4):
    for j, v in enumerate((b, r_, s_, 'Simulated')):
        c = vt.cell(i, 7 + j, v)
        c.font, c.border = base, box
        c.alignment = Alignment(wrap_text=True, vertical='top')
        c.fill = sim
    vt.cell(i, 10).fill = sim
extra = [('(New) Session logging', 'Time, photos opened and recovery steps were hand-timed in V1', 'Logged in the app for all 6 V2 sessions', 'Which measures are reliable?', 'Hand timing was coarse', 'Keep logging; add the intended photo ID',
          'Event log in the app', 'No hand timing needed in V2.', 'Improved', 'Simulated'),
         ('(New finding) Near-identical photos', 'Did users pick the right photo when two look alike?', 'S12: confident wrong pick (confidence 4)', 'Does the loop create false confidence?', 'Finishing fast is not the same as finding the right photo', 'Explain matches and differences before the user confirms',
          'Not built', 'New failure in V2, not a V1 finding.', 'New', 'Simulated')]
for i, row in enumerate(extra, 8):
    for j, v in enumerate(row, 1):
        c = vt.cell(i, j, v)
        c.font, c.border = base, box
        c.alignment = Alignment(wrap_text=True, vertical='top')
    for j in range(7, 11):
        vt.cell(i, j).fill = sim
for j, w in zip('GHIJ', [40, 60, 16, 12]):
    vt.column_dimensions[j].width = w

# ---------------- Read Me additions
rm = wb['Read Me']
n = rm.max_row + 2
rm.cell(n, 1, 'V2 ROUND (SIMULATED)').font = Font(name='Arial', bold=True, color=ACC)
rm.cell(n + 1, 1, 'Added sheets: V2 Changes | V2 Participants | V2 Sessions | V1 vs V2 Metrics | V2 Learnings and Next. '
        'The V1 to V2 sheet gained V2 built, V2 result, Status and Basis columns. All V2 content is simulated: no V2 was built or tested.').font = base
rm.cell(n + 1, 1).alignment = Alignment(wrap_text=True, vertical='top')

wb.move_sheet('V1 vs V2 Metrics', offset=0)
wb.calculation.fullCalcOnLoad = True
wb.save(OUT)

# ---------------- expected values for checking
def calc(rows):
    ok = [r for r in rows if r[10] == 'Yes']
    fails = [r for r in rows if r[5] == 'No']
    return dict(success=len(ok) / 6, first=sum(r[5] == 'Yes' for r in rows) / 6,
                rec=sum(r[10] == 'Yes' for r in fails) / len(fails),
                median=sorted(r[9] for r in ok)[len(ok) // 2], sw=sum(r[7] for r in rows) / 6,
                insp=sum(r[8] for r in rows) / 6, conf=sum(r[11] for r in rows) / 6,
                clues=sum(r[4] == 'Yes' for r in rows) / 6,
                cw=sum(r[10] == 'No' and r[11] >= 4 for r in rows))
print(calc(S2))
