import { useState, useEffect, useRef } from "react";

const DRAWING_WOLF    = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";
const DRAWING_FOREST  = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/3d55b220c_whatsapp_image_1375833884351215.jpg";
const DRAWING_FIGURES = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/24cdd3ae8_whatsapp_image_855974756792686.jpg";
const DRAWING_GALLERY = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/a2b7907fc_whatsapp_image_1446971447177747.jpg";

const CREAM = "#ffffff";
const NAVY  = "#1a2a6c";

const SWARM_WORDS = [
  "thought","memory","fragment","mind","dying","living",
  "speaking","silence","grief","witness","ordinary","body",
  "word","record","archive","person","voice","time",
  "lost","found","held","gone","still","here",
];

const POEMS = [
  {
    id:1, num:"01", title:"Inbound",
    label:"NEWARK AIRPORT · GATE C42",
    body:"The woman at passport control asks the purpose of my visit. I say: to live here. She stamps the page. Doesn't look up.",
    drawing: DRAWING_WOLF,
    lines:["Newark airport smells like carpet cleaner","and the specific anxiety of people who are almost somewhere.","","I have one bag checked and one theory about myself","I'm not ready to test yet.","","The woman at passport control asks the purpose of my visit.","I say: to live here.","She stamps the page.","Doesn't look up."],
  },
  {
    id:2, num:"02", title:"Cockroach",
    label:"3AM · BROOKLYN · FIRST WEEK",
    body:"Something had passed through and not apologised. I was glad.",
    drawing: DRAWING_FIGURES,
    lines:["I watched one cross my kitchen floor","with such absolute certainty of direction —","not scurrying, not panicking,","just moving from one exact point to another","like it had somewhere specific to be.","","I put the glass back in the cupboard.","Left it to finish whatever it was doing.","Went to bed.","","In the morning it was gone.","But something had passed through","and not apologised","and I was glad."],
  },
  {
    id:3, num:"03", title:"Still Here",
    label:"KITCHEN · FLATBUSH · TUESDAY",
    body:"I stood in this kitchen once imagining one more minute — and I got the minute. And the one after.",
    drawing: DRAWING_FOREST,
    lines:["The tap drips.","I have a reference number.","I believe in process.","","I stood in this kitchen once","imagining one more minute —","knowing I'd waste it,","just listening to the drip,","pretending it wasn't counting —","","and I got the minute.","And the one after.","","The tap drips.","I let it."],
  },
];

// ── SWARM CANVAS ────────────────────────────────────────────────────
function SwarmCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x:0.5, y:0.5 });
  const rafRef    = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W, H, nodes;
    function buildNodes(w,h) {
      const c = Math.min(w,h);
      return SWARM_WORDS.map((word,i) => {
        const angle = (i/SWARM_WORDS.length)*Math.PI*2;
        const r     = c*0.27 + (i%4)*c*0.05;
        return { word, bx:w/2+Math.cos(angle)*r, by:h/2+Math.sin(angle)*r, i, size:10+(i%3)*2, op:0.2+(i%4)*0.07 };
      });
    }
    function resize() { W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; nodes=buildNodes(W,H); }
    resize();
    window.addEventListener("resize",resize);
    const onMove = e => { const r=canvas.getBoundingClientRect(),ex=e.touches?e.touches[0].clientX:e.clientX,ey=e.touches?e.touches[0].clientY:e.clientY; mouseRef.current={x:(ex-r.left)/r.width,y:(ey-r.top)/r.height}; };
    canvas.addEventListener("mousemove",onMove);
    canvas.addEventListener("touchmove",onMove,{passive:true});
    let t=0;
    function draw() {
      const cx=W/2,cy=H/2; ctx.clearRect(0,0,W,H); ctx.fillStyle=NAVY; ctx.fillRect(0,0,W,H);
      const mx=mouseRef.current.x*W, my=mouseRef.current.y*H;
      [0.18,0.31].forEach(rv=>{ ctx.beginPath(); ctx.arc(cx,cy,Math.min(W,H)*rv,0,Math.PI*2); ctx.strokeStyle="rgba(245,240,228,0.07)"; ctx.lineWidth=1; ctx.stroke(); });
      nodes.forEach(node => {
        const dx=Math.sin(t*0.35+node.i*0.75)*7, dy=Math.cos(t*0.28+node.i*0.6)*5;
        const ex=node.bx-mx, ey=node.by-my, dist=Math.sqrt(ex*ex+ey*ey), rep=Math.max(0,1-dist/160);
        const x=node.bx+dx+ex*rep*20, y=node.by+dy+ey*rep*20;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y); ctx.strokeStyle=`rgba(245,240,228,${0.05+rep*0.1})`; ctx.lineWidth=0.5; ctx.stroke();
        ctx.font=`${node.size}px "Times New Roman",serif`; ctx.fillStyle=`rgba(245,240,228,${node.op+rep*0.28})`; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(node.word,x,y);
      });
      ctx.beginPath(); ctx.arc(cx,cy,5,0,Math.PI*2); ctx.fillStyle=CREAM; ctx.fill();
      t+=0.016; rafRef.current=requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} />;
}

// ── WAVEFORM SVG ────────────────────────────────────────────────────
function Waveform({ color = CREAM, opacity = 0.18 }) {
  const pts = Array.from({length:120},(_,i) => {
    const x = (i/119)*100;
    const amp = 18 * Math.exp(-Math.pow((i-60)/28,2));
    const y   = 50 + amp*Math.sin(i*0.55);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{width:"100%",height:"80px",display:"block",opacity}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="0.6"/>
    </svg>
  );
}

// ── FADE IN ────────────────────────────────────────────────────────
function FadeIn({children,delay=0,style={}}) {
  const ref=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{ const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect();}},{threshold:0.08}); if(ref.current)obs.observe(ref.current); return()=>obs.disconnect(); },[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(32px)",transition:`opacity 1s ease ${delay}s,transform 1s ease ${delay}s`,...style}}>{children}</div>;
}

// ── MAIN ───────────────────────────────────────────────────────────
export default function Home() {
  const [openPoem,setOpenPoem] = useState(null);
  const [email,setEmail]       = useState("");
  const [subscribed,setSubscribed] = useState(false);
  const [scrollY,setScrollY]   = useState(0);
  useEffect(()=>{ const fn=()=>setScrollY(window.scrollY); window.addEventListener("scroll",fn,{passive:true}); return()=>window.removeEventListener("scroll",fn); },[]);
  const navPast = scrollY > 80;

  return (
    <div style={{fontFamily:"'Times New Roman',Times,Georgia,serif",overflowX:"hidden",background:CREAM,color:NAVY}}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        a{color:inherit;text-decoration:none}
        img{display:block}
        button,input{font-family:inherit}
        ::selection{background:${NAVY};color:${CREAM}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .num-circle{width:44px;height:44px;border-radius:50%;border:1px solid rgba(26,42,108,.25);display:flex;align-items:center;justify-content:center;font-size:12px;letter-spacing:.08em;flex-shrink:0}
        .bullet-label{display:flex;align-items:center;gap:9px;font-size:10px;letter-spacing:.24em;text-transform:uppercase;opacity:.4}
        .bullet-label::before{content:'';width:6px;height:6px;border-radius:50%;background:currentColor;flex-shrink:0}
        .read-link{font-size:10px;letter-spacing:.2em;text-transform:uppercase;opacity:.4;cursor:pointer;transition:opacity .2s;background:none;border:none;padding:0;color:inherit;display:inline-flex;align-items:center;gap:8px}
        .read-link:hover{opacity:1}
        .buy-btn{display:inline-block;border:1.5px solid rgba(26,42,108,.4);color:${NAVY};padding:16px 44px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;transition:background .25s}
        .buy-btn:hover{background:rgba(26,42,108,.06)}
        .sub-btn{background:${NAVY};color:${CREAM};border:none;padding:15px 28px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}
        .sub-btn:hover{opacity:.75}
        .nav-link{font-size:10px;letter-spacing:.2em;text-transform:uppercase;transition:color .4s,opacity .2s}
        .nav-link:hover{opacity:1 !important}
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"20px 36px",display:"flex",justifyContent:"space-between",alignItems:"center",background:navPast?"rgba(245,240,228,.97)":"transparent",borderBottom:navPast?"1px solid rgba(26,42,108,.08)":"none",backdropFilter:navPast?"blur(8px)":"none",transition:"background .4s,border .4s"}}>
        <span style={{fontSize:"12px",letterSpacing:".18em",textTransform:"uppercase",color:CREAM}}>Bea Sophia</span>
        <div style={{display:"flex",gap:"28px"}}>
          {[["Poems","#poems"],["Collection","#collection"],["About","#about"]].map(([l,h])=>(
            <a key={l} href={h} className="nav-link" style={{color:CREAM,opacity:.4}}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <SwarmCanvas />
        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 40px",animation:"fadeUp 1.2s ease .3s both",pointerEvents:"none"}}>
          <p style={{fontSize:"10px",letterSpacing:".32em",textTransform:"uppercase",color:CREAM,opacity:.35,marginBottom:"28px"}}>The Page Gallery — 2025</p>
          <h1 style={{fontSize:"clamp(26px,5vw,62px)",fontWeight:400,fontStyle:"italic",lineHeight:1.15,color:CREAM,maxWidth:"600px",letterSpacing:"-.01em"}}>
            What happens to a thought<br/>when the person who had it dies?
          </h1>
        </div>
        <div style={{position:"absolute",bottom:"36px",display:"flex",gap:"24px",flexWrap:"wrap",justifyContent:"center",animation:"fadeIn 1.5s ease 1.2s both",zIndex:2,padding:"0 20px"}}>
          <a href="#poems" style={{fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",color:CREAM,borderBottom:"1px solid rgba(245,240,228,.4)",paddingBottom:"3px"}}>Read free poems</a>
          <a href="#collection" style={{fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",color:CREAM,opacity:.35,borderBottom:"1px solid rgba(245,240,228,.18)",paddingBottom:"3px"}}>Buy the collection — £12</a>
        </div>
      </section>

      {/* DIVIDER — image strip */}
      <div style={{height:"clamp(120px,20vw,220px)",overflow:"hidden",borderTop:"1px solid rgba(26,42,108,.07)"}}>
        <img src={DRAWING_WOLF} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%",opacity:.25,mixBlendMode:"multiply"}}/>
      </div>

      {/* POEMS */}
      <div id="poems">
        {POEMS.map((poem,i) => {
          const align = i%2===0 ? "left" : "right";
          return (
            <FadeIn key={poem.id} style={{borderTop:"1px solid rgba(26,42,108,.07)"}}>
              <div style={{padding:"80px 36px"}}>
                {/* number + title row */}
                <div style={{display:"flex",alignItems:"flex-start",gap:"20px",marginBottom:"40px",justifyContent:align==="right"?"flex-end":"flex-start"}}>
                  <div className="num-circle">{poem.num}</div>
                  <h2 onClick={()=>setOpenPoem(openPoem===poem.id?null:poem.id)}
                    style={{fontSize:"clamp(30px,7vw,80px)",fontWeight:400,fontStyle:"italic",lineHeight:1.0,letterSpacing:"-.01em",cursor:"pointer",transition:"opacity .2s",maxWidth:"600px"}}>
                    {poem.title}
                  </h2>
                </div>

                {/* waveform */}
                <div style={{margin:"0 0 40px",padding:"0 4px"}}>
                  <Waveform color={NAVY} opacity={0.14}/>
                </div>

                {/* drawing strip */}
                <div style={{
                  height:"clamp(140px,22vw,240px)",overflow:"hidden",
                  marginBottom:"40px",
                  marginLeft: align==="right" ? "20%" : 0,
                  marginRight: align==="left"  ? "20%" : 0,
                  borderRadius:"2px",
                }}>
                  <img src={poem.drawing} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",opacity:.4,mixBlendMode:"multiply"}}/>
                </div>

                {/* label + body */}
                <div style={{maxWidth:"540px",marginLeft:align==="right"?"auto":"0",textAlign:align==="right"?"right":"left"}}>
                  <p className="bullet-label" style={{justifyContent:align==="right"?"flex-end":"flex-start",marginBottom:"16px"}}>{poem.label}</p>
                  <p style={{fontSize:"17px",lineHeight:1.95,opacity:.55,marginBottom:"28px"}}>{poem.body}</p>

                  {openPoem===poem.id ? (
                    <div style={{animation:"fadeIn .5s ease"}}>
                      <div style={{borderLeft:align==="right"?"none":"2px solid rgba(245,240,228,.15)",borderRight:align==="right"?"2px solid rgba(245,240,228,.15)":"none",paddingLeft:align==="right"?"0":"20px",paddingRight:align==="right"?"20px":"0",marginBottom:"24px"}}>
                        {poem.lines.map((line,j)=>(
                          <p key={j} style={{fontSize:"16px",lineHeight:2.1,minHeight:line===""?"1em":"auto"}}>{line||"\u00A0"}</p>
                        ))}
                      </div>
                      <button className="read-link" onClick={()=>setOpenPoem(null)}>Close</button>
                    </div>
                  ) : (
                    <button className="read-link" onClick={()=>setOpenPoem(poem.id)}>
                      Read the full poem <span style={{opacity:.4}}>→</span>
                    </button>
                  )}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* COLLECTION */}
      <section id="collection" style={{borderTop:"1px solid rgba(26,42,108,.07)",padding:"0"}}>
        {/* top image full bleed */}
        <div style={{height:"clamp(160px,25vw,280px)",overflow:"hidden"}}>
          <img src={DRAWING_GALLERY} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.3,mixBlendMode:"multiply"}}/>
        </div>

        <FadeIn style={{padding:"80px 36px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:"20px",marginBottom:"48px"}}>
            <div className="num-circle">04</div>
            <h2 style={{fontSize:"clamp(40px,9vw,120px)",fontWeight:400,fontStyle:"italic",lineHeight:.95,letterSpacing:"-.02em"}}>
              The<br/>Only<br/>Life
            </h2>
          </div>

          <Waveform color={NAVY} opacity={0.1}/>

          <div style={{maxWidth:"520px",marginTop:"40px"}}>
            <p className="bullet-label" style={{marginBottom:"20px"}}>Collection 001 · Twenty poems</p>
            <p style={{fontSize:"17px",lineHeight:2,opacity:.5,marginBottom:"12px"}}>New York. The body after the ward.</p>
            <p style={{fontSize:"17px",lineHeight:2,opacity:.5,marginBottom:"48px"}}>Scotland in the bones. The city not yet earned. Things that survived and didn't know it yet.</p>
            <div style={{marginBottom:"36px"}}>
              <span style={{fontSize:"clamp(40px,7vw,72px)",fontWeight:300,letterSpacing:"-.02em"}}>£12</span>
              <span style={{fontSize:"11px",opacity:.25,letterSpacing:".1em",marginLeft:"16px"}}>Digital PDF</span>
            </div>
            <a href="https://paypal.me/Sophiasharkey330" target="_blank" rel="noopener noreferrer" className="buy-btn">
              Buy the collection
            </a>
          </div>
        </FadeIn>
      </section>

      {/* ABOUT */}
      <FadeIn style={{borderTop:"1px solid rgba(26,42,108,.07)",padding:"80px 36px"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:"20px",marginBottom:"40px"}}>
          <div className="num-circle">05</div>
          <h2 style={{fontSize:"clamp(30px,6vw,72px)",fontWeight:400,fontStyle:"italic",lineHeight:1.05,letterSpacing:"-.01em",maxWidth:"560px"}}>
            All their thoughts<br/>die with them.
          </h2>
        </div>

        <Waveform color={NAVY} opacity={0.1}/>

        <div style={{maxWidth:"520px",marginTop:"40px"}} id="about">
          <p className="bullet-label" style={{marginBottom:"18px"}}>The Page Gallery</p>
          <p style={{fontSize:"17px",lineHeight:2,opacity:.55,marginBottom:"16px"}}>
            When I got sick, I realised that when people die, all their thoughts die with them.
          </p>
          <p style={{fontSize:"17px",lineHeight:2,opacity:.45,marginBottom:"16px"}}>
            I started collecting fragments. Conversations overheard. Things said in the wrong order. Thoughts that lived in one mind and died there.
          </p>
          <p style={{fontSize:"17px",lineHeight:2,opacity:.45,marginBottom:"44px"}}>
            That became The Page Gallery Journal. These poems are the second attempt at the same problem.
          </p>
          <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
            style={{fontSize:"11px",letterSpacing:".2em",textTransform:"uppercase",opacity:.35,borderBottom:"1px solid rgba(245,240,228,.2)",paddingBottom:"4px"}}>
            @bsophialovesgnochi
          </a>
        </div>
      </FadeIn>

      {/* NEWSLETTER */}
      <FadeIn style={{borderTop:"1px solid rgba(26,42,108,.07)",padding:"80px 36px"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:"20px",marginBottom:"36px"}}>
          <div className="num-circle">06</div>
          <h2 style={{fontSize:"clamp(28px,5vw,60px)",fontWeight:400,fontStyle:"italic",lineHeight:1.1,letterSpacing:"-.01em"}}>
            New fragments,<br/>when they exist.
          </h2>
        </div>
        <Waveform color={NAVY} opacity={0.08}/>
        <div style={{maxWidth:"420px",marginTop:"36px"}}>
          <p className="bullet-label" style={{marginBottom:"16px"}}>Letters</p>
          <p style={{fontSize:"15px",opacity:.4,lineHeight:1.8,marginBottom:"36px"}}>No schedule. No newsletter voice. The thing itself when it's ready.</p>
          {subscribed ? (
            <p style={{fontSize:"16px",fontStyle:"italic",opacity:.4}}>You're in.</p>
          ) : (
            <form onSubmit={e=>{e.preventDefault();if(email)setSubscribed(true);}} style={{display:"flex",maxWidth:"400px"}}>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                style={{flex:1,padding:"14px 16px",border:"1px solid rgba(26,42,108,.15)",borderRight:"none",background:"transparent",fontSize:"14px",outline:"none",color:CREAM,borderRadius:0}}/>
              <button type="submit" className="sub-btn">Subscribe</button>
            </form>
          )}
        </div>
      </FadeIn>

      {/* FOOTER */}
      <footer style={{padding:"24px 36px",borderTop:"1px solid rgba(26,42,108,.07)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
        <span style={{fontSize:"11px",opacity:.2}}>© Bea Sophia 2025</span>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{fontSize:"10px",letterSpacing:".16em",textTransform:"uppercase",opacity:.2}}>Instagram</a>
      </footer>
    </div>
  );
}
