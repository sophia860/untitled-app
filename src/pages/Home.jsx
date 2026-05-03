import { useState, useEffect, useRef } from "react";

const DRAWING_WOLF    = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";
const DRAWING_FOREST  = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/3d55b220c_whatsapp_image_1375833884351215.jpg";
const DRAWING_FIGURES = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/24cdd3ae8_whatsapp_image_855974756792686.jpg";
const DRAWING_GALLERY = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/a2b7907fc_whatsapp_image_1446971447177747.jpg";

const CREAM = "#f5f0e4";
const NAVY  = "#1a2a6c";

const SWARM_WORDS = [
  "thought","memory","fragment","mind","dying","living",
  "speaking","silence","grief","witness","ordinary","body",
  "word","record","archive","person","voice","time",
  "lost","found","held","gone","still","here",
];

const POEMS = [
  { id:1, num:"01", title:"Inbound", note:"Newark airport, gate C42", drawing: DRAWING_WOLF,
    lines:["Newark airport smells like carpet cleaner","and the specific anxiety of people who are almost somewhere.","","I have one bag checked and one theory about myself","I'm not ready to test yet.","","The woman at passport control asks the purpose of my visit.","I say: to live here.","She stamps the page.","Doesn't look up."] },
  { id:2, num:"02", title:"Cockroach", note:"3am, Brooklyn, first week", drawing: DRAWING_FIGURES,
    lines:["I watched one cross my kitchen floor","with such absolute certainty of direction —","not scurrying, not panicking,","just moving from one exact point to another","like it had somewhere specific to be.","","I put the glass back in the cupboard.","Left it to finish whatever it was doing.","Went to bed.","","In the morning it was gone.","But something had passed through","and not apologised","and I was glad."] },
  { id:3, num:"03", title:"Still Here", note:"kitchen, Flatbush, Tuesday", drawing: DRAWING_FOREST,
    lines:["The tap drips.","I have a reference number.","I believe in process.","","I stood in this kitchen once","imagining one more minute —","knowing I'd waste it,","just listening to the drip,","pretending it wasn't counting —","","and I got the minute.","And the one after.","","The tap drips.","I let it."] },
];

// ── SWARM CANVAS ──────────────────────────────────────────────────────────
function SwarmCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W, H, nodes;

    function buildNodes(w, h) {
      const c = Math.min(w, h);
      return SWARM_WORDS.map((word, i) => {
        const angle  = (i / SWARM_WORDS.length) * Math.PI * 2;
        const radius = c * 0.27 + (i % 4) * c * 0.05;
        return { word, bx: w/2 + Math.cos(angle)*radius, by: h/2 + Math.sin(angle)*radius, i, size: 10+(i%3)*2, op: 0.2+(i%4)*0.07 };
      });
    }

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      nodes = buildNodes(W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const r  = canvas.getBoundingClientRect();
      const ex = e.touches ? e.touches[0].clientX : e.clientX;
      const ey = e.touches ? e.touches[0].clientY : e.clientY;
      mouseRef.current = { x:(ex-r.left)/r.width, y:(ey-r.top)/r.height };
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive:true });

    let t = 0;
    function draw() {
      const cx = W/2, cy = H/2;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = NAVY;
      ctx.fillRect(0,0,W,H);

      const mx = mouseRef.current.x * W;
      const my = mouseRef.current.y * H;

      // orbit rings
      [0.19, 0.32].forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, Math.min(W,H)*r, 0, Math.PI*2);
        ctx.strokeStyle = "rgba(245,240,228,0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      nodes.forEach(node => {
        const drift  = Math.sin(t*0.35 + node.i*0.75) * 7;
        const driftY = Math.cos(t*0.28 + node.i*0.6)  * 5;
        const dx   = node.bx - mx, dy = node.by - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const rep  = Math.max(0, 1 - dist/160);
        const x = node.bx + drift  + dx*rep*20;
        const y = node.by + driftY + dy*rep*20;

        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(245,240,228,${0.06+rep*0.1})`;
        ctx.lineWidth = 0.5; ctx.stroke();

        ctx.font = `${node.size}px "Times New Roman", serif`;
        ctx.fillStyle = `rgba(245,240,228,${node.op+rep*0.28})`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(node.word, x, y);
      });

      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2);
      ctx.fillStyle = CREAM; ctx.fill();

      t += 0.016;
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",display:"block" }} />;
}

// ── ORBIT SECTION — drawing floating in ring + big type ──────────────────
function OrbitSection({ num, headline, sub, drawing, children, flipped = false, dark = false }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){setV(true);obs.disconnect();} }, { threshold:0.08 });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const bg   = dark ? NAVY  : CREAM;
  const fg   = dark ? CREAM : NAVY;

  return (
    <section ref={ref} style={{
      background: bg, color: fg,
      padding: "100px 0",
      position: "relative", overflow: "hidden",
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 1s ease, transform 1s ease",
    }}>
      {/* oversized section number — bleeds off edge */}
      <div style={{
        position: "absolute", top: "32px",
        [flipped ? "right" : "left"]: "-20px",
        fontSize: "clamp(100px,18vw,200px)",
        fontWeight: 400, fontStyle: "italic",
        color: dark ? "rgba(245,240,228,0.05)" : "rgba(26,42,108,0.05)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        fontFamily: "'Times New Roman', Times, serif",
      }}>{num}</div>

      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "0 40px",
        display: "flex",
        flexDirection: flipped ? "row-reverse" : "row",
        alignItems: "center", gap: "60px",
        flexWrap: "wrap",
      }}>
        {/* orbit ring + drawing */}
        <div style={{ flex: "0 0 auto", position: "relative", width: "clamp(200px,35vw,380px)", height: "clamp(200px,35vw,380px)" }}>
          {/* outer ring */}
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            border: `1px solid ${dark ? "rgba(245,240,228,0.12)" : "rgba(26,42,108,0.12)"}`,
          }} />
          {/* inner ring */}
          <div style={{
            position: "absolute", inset: "15%",
            borderRadius: "50%",
            border: `1px solid ${dark ? "rgba(245,240,228,0.08)" : "rgba(26,42,108,0.08)"}`,
          }} />
          {/* lines through circle */}
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%" }} aria-hidden="true">
            {[30,90,150,210].map((deg,i) => {
              const rad = deg * Math.PI/180;
              const cx = 50, cy = 50, r = 50;
              return <line key={i}
                x1={`${cx+r*Math.cos(rad)}%`} y1={`${cy+r*Math.sin(rad)}%`}
                x2={`${cx-r*Math.cos(rad)}%`} y2={`${cy-r*Math.sin(rad)}%`}
                stroke={dark ? "rgba(245,240,228,0.06)" : "rgba(26,42,108,0.06)"}
                strokeWidth="1" />;
            })}
          </svg>
          {/* drawing */}
          <div style={{
            position: "absolute", inset: "18%",
            borderRadius: "50%", overflow: "hidden",
          }}>
            <img src={drawing} alt="" style={{
              width:"100%", height:"100%",
              objectFit:"cover",
              opacity: dark ? 0.55 : 0.7,
              mixBlendMode: dark ? "screen" : "multiply",
            }} />
          </div>
        </div>

        {/* text */}
        <div style={{ flex: 1, minWidth: "260px" }}>
          <p style={{
            fontSize:"10px", letterSpacing:".28em",
            textTransform:"uppercase",
            color: dark ? "rgba(245,240,228,0.35)" : "rgba(26,42,108,0.35)",
            marginBottom:"20px",
            display:"flex", alignItems:"center", gap:"10px",
          }}>
            <span style={{ display:"inline-block",width:6,height:6,borderRadius:"50%",background:"currentColor" }} />
            {sub}
          </p>
          <h2 style={{
            fontSize:"clamp(32px,5.5vw,72px)",
            fontWeight:400, fontStyle:"italic",
            lineHeight:1.08, letterSpacing:"-.01em",
            marginBottom:"28px",
          }}>{headline}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [openPoem, setOpenPoem] = useState(null);
  const [email, setEmail]       = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [scrollY, setScrollY]   = useState(0);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navPast = scrollY > 80;

  return (
    <div style={{ fontFamily:"'Times New Roman', Times, Georgia, serif", overflowX:"hidden", background: CREAM, color: NAVY }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        a{color:inherit;text-decoration:none}
        img{display:block}
        button,input{font-family:inherit}
        ::selection{background:${NAVY};color:${CREAM}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .read-btn{font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;opacity:.35;transition:opacity .2s;background:none;border:none;padding:0;color:inherit}
        .read-btn:hover{opacity:1}
        .buy-btn{display:inline-block;border:1.5px solid rgba(245,240,228,.45);color:${CREAM};padding:16px 44px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;transition:background .25s}
        .buy-btn:hover{background:rgba(245,240,228,.1)}
        .sub-btn{background:${NAVY};color:${CREAM};border:none;padding:15px 28px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}
        .sub-btn:hover{opacity:.75}
        .ptitle{cursor:pointer;transition:opacity .2s}
        .ptitle:hover{opacity:.6}
      `}</style>

      {/* NAV */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        padding:"20px 36px",display:"flex",justifyContent:"space-between",alignItems:"center",
        background: navPast ? "rgba(245,240,228,.97)" : "transparent",
        borderBottom: navPast ? `1px solid rgba(26,42,108,.1)` : "none",
        backdropFilter: navPast ? "blur(8px)" : "none",
        transition:"background .4s,border .4s",
      }}>
        <span style={{ fontSize:"12px",letterSpacing:".18em",textTransform:"uppercase",color:navPast?NAVY:CREAM,transition:"color .4s" }}>
          Bea Sophia
        </span>
        <div style={{ display:"flex",gap:"28px" }}>
          {[["Poems","#poems"],["Collection","#collection"],["About","#about"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontSize:"10px",letterSpacing:".22em",textTransform:"uppercase",color:navPast?NAVY:CREAM,opacity:.4,transition:"color .4s,opacity .2s" }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO — full swarm */}
      <section style={{ position:"relative",height:"100vh",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
        <SwarmCanvas />
        <div style={{ position:"relative",zIndex:2,textAlign:"center",padding:"0 40px",animation:"fadeUp 1.2s ease .3s both",pointerEvents:"none" }}>
          <p style={{ fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",color:CREAM,opacity:.4,marginBottom:"28px" }}>
            The Page Gallery — 2025
          </p>
          <h1 style={{ fontSize:"clamp(26px,5vw,62px)",fontWeight:400,fontStyle:"italic",lineHeight:1.15,color:CREAM,maxWidth:"620px",letterSpacing:"-.01em" }}>
            What happens to a thought<br />when the person who had it dies?
          </h1>
        </div>
        <div style={{ position:"absolute",bottom:"36px",display:"flex",gap:"28px",flexWrap:"wrap",justifyContent:"center",animation:"fadeIn 1.5s ease 1.2s both",zIndex:2,padding:"0 20px" }}>
          <a href="#poems" style={{ fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",color:CREAM,borderBottom:`1px solid rgba(245,240,228,.4)`,paddingBottom:"3px" }}>Read free poems</a>
          <a href="#collection" style={{ fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",color:CREAM,opacity:.4,borderBottom:`1px solid rgba(245,240,228,.2)`,paddingBottom:"3px" }}>Buy the collection — £12</a>
        </div>
      </section>

      {/* INTRO STRIP */}
      <div style={{ background:CREAM,padding:"80px 40px",borderBottom:`1px solid rgba(26,42,108,.08)` }}>
        <p style={{ fontSize:"clamp(18px,2.8vw,32px)",fontStyle:"italic",lineHeight:1.6,maxWidth:"680px",color:NAVY,opacity:.7 }}>
          Walk around inside someone else's mind.<br />The poems are what we found.
        </p>
      </div>

      {/* POEMS — orbit sections */}
      <div id="poems">
        {POEMS.map((poem, i) => (
          <OrbitSection
            key={poem.id}
            num={poem.num}
            headline={poem.title}
            sub={poem.note}
            drawing={poem.drawing}
            flipped={i % 2 !== 0}
            dark={i % 2 !== 0}
          >
            {openPoem === poem.id ? (
              <div style={{ animation:"fadeIn .5s ease" }}>
                <div style={{
                  borderLeft:`2px solid ${i%2!==0?"rgba(245,240,228,.15)":"rgba(26,42,108,.12)"}`,
                  paddingLeft:"20px", marginBottom:"24px",
                }}>
                  {poem.lines.map((line,j)=>(
                    <p key={j} style={{ fontSize:"16px",lineHeight:2.1,minHeight:line===""?"1em":"auto" }}>
                      {line||"\u00A0"}
                    </p>
                  ))}
                </div>
                <button className="read-btn" onClick={()=>setOpenPoem(null)}>Close</button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize:"16px",fontStyle:"italic",opacity:.38,lineHeight:1.9,marginBottom:"20px" }}>
                  {poem.lines[0]}
                </p>
                <button className="read-btn" onClick={()=>setOpenPoem(poem.id)}>
                  Read the poem →
                </button>
              </div>
            )}
          </OrbitSection>
        ))}
      </div>

      {/* COLLECTION */}
      <section id="collection" style={{ background:NAVY,color:CREAM,padding:"140px 40px",position:"relative",overflow:"hidden" }}>
        {/* background swarm lines */}
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.05,pointerEvents:"none" }} aria-hidden="true">
          {Array.from({length:20}).map((_,i)=>{
            const a=(i/20)*Math.PI*2;
            return <line key={i} x1="50%" y1="50%" x2={`${50+55*Math.cos(a)}%`} y2={`${50+90*Math.sin(a)}%`} stroke={CREAM} strokeWidth="0.5"/>;
          })}
          <circle cx="50%" cy="50%" r="20%" stroke={CREAM} strokeWidth="0.5" fill="none"/>
        </svg>

        <div style={{ maxWidth:"900px",margin:"0 auto",position:"relative",zIndex:2 }}>
          <p style={{ fontSize:"10px",letterSpacing:".28em",textTransform:"uppercase",opacity:.3,marginBottom:"16px",display:"flex",alignItems:"center",gap:"10px" }}>
            <span style={{ display:"inline-block",width:6,height:6,borderRadius:"50%",background:CREAM }} />
            Collection 001
          </p>

          {/* giant bleeding headline */}
          <h2 style={{
            fontSize:"clamp(56px,12vw,160px)",
            fontWeight:400,fontStyle:"italic",
            lineHeight:.92,letterSpacing:"-.02em",
            marginBottom:"64px",
            marginLeft:"-4px",
          }}>The<br/>Only<br/>Life</h2>

          <div style={{ display:"flex",flexWrap:"wrap",gap:"60px",alignItems:"flex-end" }}>
            <div style={{ flex:1,minWidth:"240px" }}>
              <p style={{ fontSize:"17px",lineHeight:2,opacity:.42,marginBottom:"14px" }}>Twenty poems. New York. The body after the ward.</p>
              <p style={{ fontSize:"17px",lineHeight:2,opacity:.42,marginBottom:"52px" }}>Scotland in the bones. The city not yet earned.<br/>Things that survived and didn't know it yet.</p>
              <div style={{ marginBottom:"36px" }}>
                <span style={{ fontSize:"clamp(44px,7vw,80px)",fontWeight:300,letterSpacing:"-.02em" }}>£12</span>
                <span style={{ fontSize:"11px",opacity:.22,letterSpacing:".12em",marginLeft:"16px" }}>Digital PDF</span>
              </div>
              <a href="https://paypal.me/Sophiasharkey330" target="_blank" rel="noopener noreferrer" className="buy-btn">
                Buy the collection
              </a>
            </div>

            {/* orbit ring with gallery drawing */}
            <div style={{ flex:"0 0 auto",width:"clamp(180px,28vw,300px)",height:"clamp(180px,28vw,300px)",position:"relative" }}>
              <div style={{ position:"absolute",inset:0,borderRadius:"50%",border:"1px solid rgba(245,240,228,.1)" }} />
              <div style={{ position:"absolute",inset:"18%",borderRadius:"50%",overflow:"hidden" }}>
                <img src={DRAWING_GALLERY} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:.3,mixBlendMode:"screen" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background:CREAM,color:NAVY,padding:"140px 40px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"-60px",[scrollY>100?"left":"left"]:"60%",fontSize:"clamp(120px,22vw,280px)",fontWeight:400,fontStyle:"italic",color:"rgba(26,42,108,0.04)",lineHeight:1,userSelect:"none",pointerEvents:"none",fontFamily:"'Times New Roman',serif" }}>
          About
        </div>
        <div style={{ maxWidth:"680px",margin:"0 auto",position:"relative",zIndex:2 }}>
          <p style={{ fontSize:"10px",letterSpacing:".28em",textTransform:"uppercase",opacity:.3,marginBottom:"48px",display:"flex",alignItems:"center",gap:"10px" }}>
            <span style={{ display:"inline-block",width:6,height:6,borderRadius:"50%",background:NAVY }} />
            The Page Gallery
          </p>
          <p style={{ fontSize:"clamp(22px,3.5vw,40px)",fontStyle:"italic",fontWeight:400,lineHeight:1.5,marginBottom:"36px" }}>
            When I got sick, I realised that when people die, all their thoughts die with them.
          </p>
          <p style={{ fontSize:"17px",lineHeight:2,opacity:.5,marginBottom:"18px" }}>
            I started collecting fragments. Conversations overheard. Things said in the wrong order. Thoughts that lived in one mind and died there.
          </p>
          <p style={{ fontSize:"17px",lineHeight:2,opacity:.5,marginBottom:"56px" }}>
            That became The Page Gallery Journal. These poems are the second attempt at the same problem.
          </p>
          <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
            style={{ fontSize:"11px",letterSpacing:".2em",textTransform:"uppercase",opacity:.35,borderBottom:`1px solid rgba(26,42,108,.2)`,paddingBottom:"4px" }}>
            @bsophialovesgnochi
          </a>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background:NAVY,color:CREAM,padding:"120px 40px" }}>
        <div style={{ maxWidth:"520px",margin:"0 auto" }}>
          <p style={{ fontSize:"10px",letterSpacing:".28em",textTransform:"uppercase",opacity:.3,marginBottom:"28px",display:"flex",alignItems:"center",gap:"10px" }}>
            <span style={{ display:"inline-block",width:6,height:6,borderRadius:"50%",background:CREAM }} />
            Letters
          </p>
          <p style={{ fontSize:"clamp(28px,4.5vw,54px)",fontStyle:"italic",fontWeight:400,lineHeight:1.15,marginBottom:"20px" }}>
            New fragments,<br/>when they exist.
          </p>
          <p style={{ fontSize:"15px",opacity:.4,lineHeight:1.8,marginBottom:"44px" }}>
            No schedule. No newsletter voice.<br/>The thing itself when it's ready.
          </p>
          {subscribed ? (
            <p style={{ fontSize:"16px",fontStyle:"italic",opacity:.4 }}>You're in.</p>
          ) : (
            <form onSubmit={e=>{e.preventDefault();if(email)setSubscribed(true);}} style={{ display:"flex",maxWidth:"420px" }}>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                style={{ flex:1,padding:"15px 18px",border:`1px solid rgba(245,240,228,.2)`,borderRight:"none",background:"transparent",fontSize:"14px",outline:"none",color:CREAM,borderRadius:0 }} />
              <button type="submit" className="sub-btn" style={{ background:CREAM,color:NAVY }}>Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"24px 40px",borderTop:`1px solid rgba(245,240,228,.08)`,background:NAVY,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px" }}>
        <span style={{ fontSize:"11px",opacity:.2,color:CREAM }}>© Bea Sophia 2025</span>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{ fontSize:"10px",letterSpacing:".16em",textTransform:"uppercase",opacity:.2,color:CREAM }}>Instagram</a>
      </footer>
    </div>
  );
}
