from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor as H
from reportlab.pdfbase.pdfmetrics import stringWidth as sw

W,H_=960,540
INK,MUTE,FAINT,ACC,LINE,PANEL=H('#1b1f27'),H('#5b6270'),H('#8a90a0'),H('#c2410c'),H('#d9dce3'),H('#f4f5f7')
c=canvas.Canvas('Slide08_MVP_and_User_Testing.pdf',pagesize=(W,H_))
def Y(t): return H_-t
def txt(x,t,y,f='Helvetica',s=8,col=INK,right=False):
    c.setFont(f,s);c.setFillColor(col)
    (c.drawRightString if right else c.drawString)(x,Y(y),t)
def wrap(t,f,s,w):
    out,cur=[],''
    for wd in t.split():
        n=(cur+' '+wd).strip()
        if sw(n,f,s)<=w: cur=n
        else: out.append(cur);cur=wd
    if cur: out.append(cur)
    return out
def para(x,t,y,w,f='Helvetica',s=8,col=INK,lead=None):
    lead=lead or s*1.32
    for l in wrap(t,f,s,w): txt(x,l,y,f,s,col); y+=lead
    return y
def rule(x1,x2,y,col=LINE,w=.6): c.setStrokeColor(col);c.setLineWidth(w);c.line(x1,Y(y),x2,Y(y))

txt(44,'MVP AND USER TESTING',34,'Helvetica-Bold',8.3,FAINT); txt(916,'08 / 10',34,'Helvetica-Bold',8.3,FAINT,True); rule(44,916,44)
y=para(44,'V1 turns contextual memory into an adaptive retrieval loop; testing determines what the system should do next',70,872,'Helvetica-Bold',20.5,INK,24)

# ---- flow strip
steps=[('PROBLEM','Memory is richer than the cues users can express','done'),
       ('V1 MVP','Adaptive memory retrieval, built and clickable','done'),
       ('REAL RETRIEVAL TASK','Find a photo you know exists, with no identifiers','ready'),
       ('USER TESTING','3 Segment T users, 6 behavioural metrics','todo'),
       ('LEARNING','Observed failure points replace the boxes below','todo'),
       ('V2','Built from what testing shows, not from guesses','todo')]
bw,gap,fy=136,11,y-6
for i,(t,d,st) in enumerate(steps):
    x=44+i*(bw+gap)
    if st=='todo': c.setFillColor(H('#ffffff'));c.setStrokeColor(FAINT);c.setDash(2,2)
    else: c.setFillColor(PANEL);c.setStrokeColor(LINE);c.setDash()
    c.roundRect(x,Y(fy+50),bw,50,3,stroke=1,fill=1);c.setDash()
    txt(x+8,t,fy+15,'Helvetica-Bold',7.4,ACC if st!='done' else INK)
    para(x+8,d,fy+27,bw-14,'Helvetica',7,MUTE,8.6)
    if i<5:
        ax=x+bw+1;c.setFillColor(ACC);p=c.beginPath();p.moveTo(ax,Y(fy+21));p.lineTo(ax+9,Y(fy+25));p.lineTo(ax,Y(fy+29));p.close();c.drawPath(p,stroke=0,fill=1)
txt(44,'Solid = done   |   Orange, solid = ready to run   |   Dashed = happens after testing',fy+64,'Helvetica-Oblique',6.8,FAINT)

# ---- three columns
cy=fy+82
C1,C2,C3=44,338,632; cw=284
for x,t in ((C1,'V1 MVP: FOUR CAPABILITIES'),(C2,'WHERE INTELLIGENCE IS NEEDED'),(C3,'REAL TASK AND WHAT WE MEASURE')): txt(x,t,cy,'Helvetica-Bold',9.6)
rule(C1,C1+cw,cy+5,INK,.9);rule(C2,C2+cw,cy+5,INK,.9);rule(C3,C3+284,cy+5,INK,.9)
caps=[('1 Memory input','Say what you remember; it extracts people, place, activity, appearance, approx. time.'),
      ('2 Contextual candidates','Memory > interpreted context > candidate set, not one query > results.'),
      ('3 Recognition layer','Filters by people, place, date, activity, visual context. No restart.'),
      ('4 Guided recovery','"None of these" gives next steps (add a person, search around trip dates, show beach/cafe photos), not an empty box.')]
yy=cy+16
for a,b in caps:
    txt(C1,a,yy,'Helvetica-Bold',7.4); yy=para(C1,b,yy+9.5,cw,'Helvetica',7.1,MUTE,8.7)+3
ir=[('EXPRESS','Understand contextual memory and convert it into retrieval signals.'),
    ('MATCH / RECOGNIZE','Combine several clues and find useful candidate and filter relationships.'),
    ('RECOVER','Infer which retrieval strategy to try next from the previous attempts.'),
    ('LESS NEEDED: USER RECOGNITION','The user stays the final judge of "that is the photo I meant".')]
yy=cy+16
for i,(a,b) in enumerate(ir):
    txt(C2,a,yy,'Helvetica-Bold',7.4,ACC if i<3 else INK); yy=para(C2,b,yy+9.5,cw,'Helvetica',7.1,MUTE,8.7)+3
txt(C2,'AI is not claimed for every stage.',yy+2,'Helvetica-Oblique',7,FAINT)
yy=cy+16
yy=para(C3,'Task: "Find a specific photo that you know exists but cannot precisely describe." No filename, date, keyword or album given.',yy,284,'Helvetica',7.1,INK,8.7)+3
ms=['Retrieval success','Time to retrieval','Recovery rate','Strategy switches','Manual browsing','Recognition confidence']
for i,m in enumerate(ms):
    x=C3+(i%2)*142; yb_=yy+8+(i//2)*10.5
    txt(x,'- '+m,yb_,'Helvetica',7.1,INK)
# fix long label to fit
# ---- V1 -> learning -> V2 table
ty=cy+142
txt(44,'V1 TO LEARNING TO V2',ty,'Helvetica-Bold',9.6)
txt(916,'The middle column is what testing is designed to reveal, not a finding.',ty,'Helvetica-Oblique',7.1,ACC,True)
tc=[44,196,392,640]
for x,t in zip(tc,['V1 feature','Test / observation','What testing is designed to reveal','V2 direction']): txt(x,t,ty+16,'Helvetica-Bold',7.4)
rule(44,916,ty+21,INK,.9)
tr=[('Natural-language memory input','Can users describe the photo naturally?','Which contextual clues are easiest and hardest to interpret?','Improve context extraction'),
    ('Contextual candidate retrieval','Are the returned candidates relevant enough?','Which combinations of clues produce useful candidates?','Improve candidate generation'),
    ('Dynamic candidate filters','Can users recognise the photo faster?','Which filters actually help recognition?','Personalise / filter dynamically'),
    ('Guided recovery','What do users do after the first attempt fails?','Which recovery suggestions help users progress?','Rank recovery actions by context')]
yy=ty+21
for r in tr:
    ys=yy+10; e=ys
    for j,(x,t) in enumerate(zip(tc,r)):
        wd=(tc[j+1]-x-10) if j<3 else 276
        e=max(e,para(x,t,ys,wd,'Helvetica-Bold' if j in(0,3) else 'Helvetica',7.2,INK if j!=2 else MUTE,8.8))
    yy=e-1; rule(44,916,yy)

ty2=yy+8
txt(44,'IF TESTING SHOWS...',ty2+4,'Helvetica-Bold',7.4,ACC)
tg=[("\"I don't know which filter matters\"",'V2 recommends the most relevant refinement.'),
    ('Users ignore recovery suggestions','Change the recovery mechanism, not add more suggestions.'),
    ('Too many plausible candidates','Improve candidate ranking and recognition support.'),
    ('Found, but long inspection','Strengthen candidate filtering.')]
for i,(a,b) in enumerate(tg):
    x=44+(i%2)*436; yb=ty2+16+(i//2)*11
    txt(x,a,yb,'Helvetica-Bold',7.1); txt(x+170,'> '+b,yb,'Helvetica',7.1,MUTE)
# ---- status
c.setFillColor(PANEL);c.roundRect(44,Y(514),872,36,4,stroke=0,fill=1)
txt(56,'TESTING STATUS',Y(0)*0+492,'Helvetica-Bold',7.4,ACC)
para(150,'The 30 task-based observations from discovery are behaviour research, not usability tests of this MVP. No V1 test has been run, so no success rates or quotes appear here. Replace the middle column with observed findings after the 3 sessions.',492,752,'Helvetica',7.1,INK,8.8)
para(44,'V1 question: can an adaptive retrieval loop reduce the effort to retrieve a vaguely remembered photo? V1 does not try to perfect every scenario; V2 responds to observed failure points.',528,872,'Helvetica-Oblique',6.9,FAINT)
c.save()
