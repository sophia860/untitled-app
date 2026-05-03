import { useState, useEffect, useRef } from "react";

const DRAWING_WOLF    = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";
const DRAWING_FOREST  = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/3d55b220c_whatsapp_image_1375833884351215.jpg";
const DRAWING_FIGURES = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/24cdd3ae8_whatsapp_image_855974756792686.jpg";
const DRAWING_GALLERY = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/a2b7907fc_whatsapp_image_1446971447177747.jpg";

const CREAM = "#f5f0e4";
const NAVY  = "#1a2a6c";
const INK   = "#111827";

const SWARM_WORDS = [
  "thought","memory","fragment","mind","dying","living",
  "speaking","silence","grief","witness","ordinary","body",
  "word","record","archive","person","voice","time",
  "lost","found","held","gone","still","here",
];

const POEMS = [
  {
    id:1, num:"01", title:"Inbound", note:"Newark airport, gate C42",
    drawing: DRAWING_WOLF,
    lines:[
      "Newark airport smells like carpet cleaner",
      "and the specific anxiety of people who are almost somewhere.",
      "","I have one bag checked and one theory about myself",
      "I'm not ready to test yet.",
      "","The woman at passport control asks the purpose of my visit.",
      "I say: to live here.","She stamps the page.","Doesn't look up.",
    ],
  },
  {
    id:2, num:"02", title:"Cockroach", note:"3am, Brooklyn, first week",
    drawing: DRAWING_FIGURES,
    lines:[
      "I watched one cross my kitchen floor",
      "with such absolute certainty of direction —",
      "not scurrying, not panicking,",
      "just moving from one exact point to another",
      "like it had somewhere specific to be.",
      "","I put the glass back in the cupboard.",
      "Left it to finish whatever it was doing.","Went to bed.",
      "","In the morning it was gone.",
      "But something had passed through","and not apologised","and I was glad.",
    ],
  },
  {
    id:3, num:"03", title:"Still Here", note:"kitchen, Flatbush, Tuesday",
    drawing: DRAWING_FOREST,
    lines:[
      "The tap drips.","I have a reference number.","I believe in process.",
      "","I stood in this kitchen once","imagining one more minute —",
      "knowing I'd waste it,","just listening to the drip,",
      "pretending it wasn't counting —",
      "","and I got the minute.","And the one after.",
      "","The tap drips.","I let it.",
    ],
  },
];

function SwarmHero() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W, H, cx, cy, nodes;

    function buildNodes(w, h) {
      const c = Math.min(w, h);
      return SWARM_WORDS.map((word, i) => {
        const angle  = (i / SWARM_WORDS.length) * Math.PI * 2;
        const radius = c * 0.26 + (i % 4) * c * 0.055;
        return { word, baseX: w/2 + Math.cos(angle)*radius, baseY: h/2 + Math.sin(angle)*radius, angle, i, size: 10 + (i%3)*2, opacity: 0.22 + (i%4)*0.07 };
      });
    }

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      cx = W/2; cy = H/2;
      nodes = buildNodes(W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const ex = e.touches ? e.touches[0].clientX : e.clientX;
      const ey = e.touches ? e.touches[0].clientY : e.clientY;
      mouseRef.current = { x: (ex - rect.left)/rect.width, y: (ey - rect.top)/rect.height };
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive: true });

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = NAVY;
      ctx.fillRect(0, 0, W, H);

      const mx = mouseRef.current.x * W;
      const my = mouseRef.current.y * H;

      // orbit ring
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(W,H)*0.2, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(245,240,228,0.1)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      nodes.forEach((node) => {
        const drift  = Math.sin(t*0.35 + node.i*0.75) * 7;
        const driftY = Math.cos(t*0.28 + node.i*0.6)  * 5;
        const dx = node.baseX - mx;
        const dy = node.baseY - my;
        const dist   = Math.sqrt(dx*dx + dy*dy);
        const repel  = Math.max(0, 1 - dist/160);
        const x = node.baseX + drift  + dx*repel*18;
        const y = node.baseY + driftY + dy*repel*18;

        // line from centre
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(245,240,228,${0.07 + repel*0.1})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();

        ctx.font         = `${node.size}px "Times New Roman", serif`;
        ctx.fillStyle    = `rgba(245,240,228,${node.opacity + repel*0.28})`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.word, x, y);
      });

      // central dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI*2);
      ctx.fillStyle = CREAM;
      ctx.fill();

      t += 0.016;
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block" }} />;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){setV(true);obs.disconnect();} }, { threshold:0.1 });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity:v?1:0, transform:v?"translateY(0)":"translateY(28px)", transition:`opacity 1s ease ${delay}s,transform 1s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

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
    <div style={{ background:CREAM, color:INK, fontFamily:"'Times New Roman', Times, Georgia, serif", overflowX:"hidden" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        a{color:inherit;text-decoration:none}
        img{display:block}
        button,input{font-family:inherit}
        ::selection{background:${NAVY};color:${CREAM}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .nl { font-size:10px;letter-spacing:.22em;text-transform:uppercase;transition:opacity .2s; }
        .bullet{display:flex;align-items:center;gap:10px;font-size:10px;letter-spacing:.22em;text-transform:uppercase}
        .bullet::before{content:'';display:block;width:6px;height:6px;border-radius:50%;background:currentColor}
        .ptitle{cursor:pointer;transition:color .2s}.ptitle:hover{color:${NAVY}}
        .buy-btn{display:inline-block;border:1.5px solid rgba(245,240,228,.4);color:${CREAM};padding:16px 44px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;transition:background .25s}.buy-btn:hover{background:rgba(245,240,228,.1)}
        .sub-btn{background:${NAVY};color:${CREAM};border:none;padding:15px 28px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}.sub-btn:hover{opacity:.75}
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
        <span style={{ fontSize:"12px",letterSpacing:".18em",textTransform:"uppercase", color: navPast ? NAVY : CREAM, transition:"color .4s" }}>Bea Sophia</span>
        <div style={{ display:"flex",gap:"28px" }}>
          {[["Poems","#poems"],["Collection","#collection"],["About","#about"]].map(([l,h])=>(
            <a key={l} href={h} className="nl" style={{ color: navPast ? NAVY : CREAM, opacity:.4 }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:"relative",height:"100vh",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
        <SwarmHero />
        <div style={{ position:"relative",zIndex:2,textAlign:"center",padding:"0 40px",animation:"fadeUp 1.2s ease .3s both",pointerEvents:"none" }}>
          <p style={{ fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",color:CREAM,opacity:.4,marginBottom:"28px" }}>The Page Gallery — 2025</p>
          <h1 style={{ fontSize:"clamp(28px,5vw,64px)",fontWeight:400,fontStyle:"italic",lineHeight:1.15,color:CREAM,maxWidth:"640px",letterSpacing:"-.01em" }}>
            What happens to a thought<br />when the person who had it dies?
          </h1>
        </div>
        <div style={{ position:"absolute",bottom:"36px",display:"flex",gap:"28px",animation:"fadeIn 1.5s ease 1.2s both",zIndex:2 }}>
          <a href="#poems" style={{ fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",color:CREAM,borderBottom:`1px solid rgba(245,240,228,.4)`,paddingBottom:"3px" }}>Read free poems</a>
          <a href="#collection" style={{ fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",color:CREAM,opacity:.4,borderBottom:`1px solid rgba(245,240,228,.2)`,paddingBottom:"3px" }}>Buy the collection — £12</a>
        </div>
      </section>

      {/* POEMS */}
      <section id="poems" style={{ padding:"120px 40px",borderTop:`1px solid rgba(26,42,108,.1)` }}>
        <FadeIn><p className="bullet" style={{ color:NAVY,marginBottom:"80px" }}>Free poems</p></FadeIn>
        {POEMS.map((poem,i)=>(
          <FadeIn key={poem.id} delay={.08} style={{ marginBottom:"110px" }}>
            <div style={{ maxWidth:"660px", marginLeft:i%2===0?"0":"auto", borderTop:`1px solid rgba(26,42,108,.1)`, paddingTop:"40px" }}>
              <div style={{ display:"flex", justifyContent:i%2===0?"flex-end":"flex-start", marginBottom:"28px" }}>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
                  <div style={{ width:1,height:52,background:NAVY,opacity:.18 }} />
                  <div style={{ width:"clamp(68px,9vw,110px)",height:"clamp(68px,9vw,110px)",borderRadius:"50%",overflow:"hidden",border:`1.5px solid rgba(26,42,108,.2)` }}>
                    <img src={poem.drawing} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:.6,mixBlendMode:"multiply" }} />
                  </div>
                </div>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"18px" }}>
                <span style={{ fontSize:"11px",color:NAVY,opacity:.35,letterSpacing:".2em" }}>{poem.num}</span>
                <span style={{ fontSize:"11px",fontStyle:"italic",opacity:.3 }}>{poem.note}</span>
              </div>
              <h2 className="ptitle" onClick={()=>setOpenPoem(openPoem===poem.id?null:poem.id)}
                style={{ fontSize:"clamp(32px,5.5vw,68px)",fontWeight:400,fontStyle:"italic",lineHeight:1.06,marginBottom:"30px",letterSpacing:"-.01em" }}>
                {poem.title}
              </h2>
              {openPoem===poem.id ? (
                <div style={{ animation:"fadeIn .5s ease" }}>
                  <div style={{ borderLeft:`2px solid rgba(26,42,108,.12)`,paddingLeft:"22px",marginBottom:"28px" }}>
                    {poem.lines.map((line,j)=>(
                      <p key={j} style={{ fontSize:"17px",lineHeight:2.1,minHeight:line===""?"1em":"auto" }}>{line||"\u00A0"}</p>
                    ))}
                  </div>
                  <button onClick={()=>setOpenPoem(null)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",opacity:.28,padding:0 }}>Close</button>
                </div>
              ) : (
                <div onClick={()=>setOpenPoem(poem.id)} style={{ cursor:"pointer" }}>
                  <p style={{ fontSize:"16px",fontStyle:"italic",opacity:.32,lineHeight:1.9 }}>{poem.lines[0]}</p>
                  <p style={{ fontSize:"10px",letterSpacing:".18em",textTransform:"uppercase",color:NAVY,opacity:.28,marginTop:"14px" }}>Read</p>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </section>

      {/* COLLECTION */}
      <section id="collection" style={{ background:NAVY,color:CREAM,padding:"140px 40px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:.05 }} aria-hidden="true">
          {Array.from({length:18}).map((_,i)=>{
            const a=(i/18)*Math.PI*2;
            return <line key={i} x1="50%" y1="50%" x2={`${50+48*Math.cos(a)}%`} y2={`${50+85*Math.sin(a)}%`} stroke={CREAM} strokeWidth="0.5"/>;
          })}
          <circle cx="50%" cy="50%" r="19%" stroke={CREAM} strokeWidth="0.5" fill="none"/>
        </svg>
        <FadeIn style={{ position:"relative",zIndex:2 }}>
          <p className="bullet" style={{ color:CREAM,opacity:.35,justifyContent:"center",marginBottom:"44px" }}>Collection 001</p>
          <h2 style={{ fontSize:"clamp(48px,9vw,120px)",fontWeight:400,fontStyle:"italic",lineHeight:1.0,letterSpacing:"-.02em",marginBottom:"52px" }}>The Only Life</h2>
          <p style={{ fontSize:"17px",lineHeight:2,opacity:.42,maxWidth:"400px",margin:"0 auto 14px" }}>Twenty poems. New York. The body after the ward.</p>
          <p style={{ fontSize:"17px",lineHeight:2,opacity:.42,maxWidth:"400px",margin:"0 auto 56px" }}>Scotland in the bones. The city not yet earned.<br/>Things that survived and didn't know it yet.</p>
          <div style={{ marginBottom:"40px" }}>
            <span style={{ fontSize:"clamp(44px,6vw,72px)",fontWeight:300,letterSpacing:"-.02em" }}>£12</span>
            <p style={{ fontSize:"11px",opacity:.22,letterSpacing:".12em",marginTop:"8px" }}>Digital PDF · Yours immediately</p>
          </div>
          <a href="https://paypal.me/Sophiasharkey330" target="_blank" rel="noopener noreferrer" className="buy-btn">Buy the collection</a>
        </FadeIn>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding:"140px 40px",textAlign:"center" }}>
        <FadeIn>
          <p className="bullet" style={{ color:NAVY,justifyContent:"center",marginBottom:"56px" }}>About</p>
          <p style={{ fontSize:"clamp(22px,3.5vw,38px)",fontStyle:"italic",fontWeight:400,lineHeight:1.55,maxWidth:"680px",margin:"0 auto 36px",color:NAVY }}>
            When I got sick, I realised that when people die,<br/>all their thoughts die with them.
          </p>
          <p style={{ fontSize:"17px",lineHeight:1.95,opacity:.5,maxWidth:"460px",margin:"0 auto 18px" }}>
            I started collecting fragments. Conversations overheard. Things said in the wrong order. Thoughts that lived in one mind and died there.
          </p>
          <p style={{ fontSize:"17px",lineHeight:1.95,opacity:.5,maxWidth:"460px",margin:"0 auto 56px" }}>
            That became The Page Gallery Journal. These poems are the second attempt at the same problem.
          </p>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",marginBottom:"48px" }}>
            <div style={{ width:1,height:56,background:NAVY,opacity:.18 }} />
            <div style={{ width:"clamp(96px,14vw,160px)",height:"clamp(96px,14vw,160px)",borderRadius:"50%",overflow:"hidden",border:`1.5px solid rgba(26,42,108,.18)` }}>
              <img src={DRAWING_GALLERY} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:.6,mixBlendMode:"multiply" }} />
            </div>
          </div>
          <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
            style={{ fontSize:"11px",letterSpacing:".2em",textTransform:"uppercase",color:NAVY,opacity:.35,borderBottom:`1px solid rgba(26,42,108,.2)`,paddingBottom:"4px" }}>
            @bsophialovesgnochi
          </a>
        </FadeIn>
      </section>

      {/* NEWSLETTER */}
      <section style={{ borderTop:`1px solid rgba(26,42,108,.1)`,padding:"120px 40px",textAlign:"center" }}>
        <FadeIn>
          <p className="bullet" style={{ color:NAVY,justifyContent:"center",marginBottom:"28px" }}>Letters</p>
          <p style={{ fontSize:"clamp(26px,4vw,50px)",fontStyle:"italic",fontWeight:400,lineHeight:1.2,color:NAVY,marginBottom:"18px" }}>New fragments,<br/>when they exist.</p>
          <p style={{ fontSize:"15px",opacity:.4,lineHeight:1.8,marginBottom:"44px" }}>No schedule. No newsletter voice.<br/>The thing itself when it's ready.</p>
          {subscribed ? (
            <p style={{ fontSize:"16px",fontStyle:"italic",opacity:.4 }}>You're in.</p>
          ) : (
            <form onSubmit={e=>{e.preventDefault();if(email)setSubscribed(true);}} style={{ display:"flex",maxWidth:"420px",margin:"0 auto" }}>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                style={{ flex:1,padding:"15px 18px",border:`1px solid rgba(26,42,108,.2)`,borderRight:"none",background:CREAM,fontSize:"14px",outline:"none",color:INK,borderRadius:0 }} />
              <button type="submit" className="sub-btn">Subscribe</button>
            </form>
          )}
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:"24px 40px",borderTop:`1px solid rgba(26,42,108,.08)`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px" }}>
        <span style={{ fontSize:"11px",opacity:.2,color:NAVY }}>© Bea Sophia 2025</span>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{ fontSize:"10px",letterSpacing:".16em",textTransform:"uppercase",opacity:.2,color:NAVY }}>Instagram</a>
      </footer>
    </div>
  );
}
