import { useState, useEffect, useRef } from "react";

const DRAWING_WOLF    = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";
const DRAWING_FOREST  = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/3d55b220c_whatsapp_image_1375833884351215.jpg";
const DRAWING_FIGURES = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/24cdd3ae8_whatsapp_image_855974756792686.jpg";
const DRAWING_GALLERY = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/a2b7907fc_whatsapp_image_1446971447177747.jpg";

const POEMS = [
  {
    id:1, num:"01", title:"Inbound", note:"Newark airport, gate C42",
    drawing: DRAWING_WOLF,
    lines:["Newark airport smells like carpet cleaner","and the specific anxiety of people who are almost somewhere.","","I have one bag checked and one theory about myself","I'm not ready to test yet.","","The woman at passport control asks the purpose of my visit.","I say: to live here.","She stamps the page.","Doesn't look up."],
  },
  {
    id:2, num:"02", title:"Cockroach", note:"3am, Brooklyn, first week",
    drawing: DRAWING_FIGURES,
    lines:["I watched one cross my kitchen floor","with such absolute certainty of direction —","not scurrying, not panicking,","just moving from one exact point to another","like it had somewhere specific to be.","","In the morning it was gone.","But something had passed through","and not apologised","and I was glad."],
  },
  {
    id:3, num:"03", title:"Still Here", note:"kitchen, Flatbush, Tuesday",
    drawing: DRAWING_FOREST,
    lines:["The tap drips.","I have a reference number.","I believe in process.","","I stood in this kitchen once","imagining one more minute —","and I got the minute.","And the one after.","","The tap drips.","I let it."],
  },
];

// ── SCRIBBLE PATHS — hand-drawn SVG marks ────────────────────────
const SCRIBBLES = [
  // loose circle
  "M 20 50 C 18 30, 40 15, 55 20 C 72 25, 80 40, 75 58 C 70 75, 50 82, 35 76 C 18 68, 16 60, 20 50",
  // scratchy underline
  "M 5 60 C 15 58, 30 63, 45 59 C 60 55, 75 62, 90 58",
  // wobbly cross
  "M 15 15 C 25 22, 40 28, 55 35 M 55 15 C 45 22, 30 28, 15 38",
  // spiral-ish
  "M 50 50 C 55 45, 62 44, 65 50 C 68 56, 63 65, 55 67 C 44 70, 35 62, 33 52 C 31 40, 40 30, 52 28 C 66 26, 76 36, 78 50",
  // dash marks
  "M 10 50 C 14 48, 18 52, 22 50 M 28 47 C 32 45, 36 49, 40 47 M 46 50 C 50 48, 54 52, 58 50",
  // messy arrow
  "M 10 50 C 25 50, 50 48, 70 50 M 60 42 C 65 46, 70 50, 65 56",
  // rough rectangle
  "M 15 20 C 20 18, 50 16, 75 20 C 78 25, 80 55, 78 75 C 72 78, 40 80, 18 78 C 14 72, 12 40, 15 20",
  // star scribble
  "M 50 10 C 52 28, 60 35, 80 35 C 65 42, 68 52, 78 68 C 62 55, 50 60, 38 70 C 44 52, 40 42, 22 38 C 42 36, 46 26, 50 10",
];

const FLOATING_WORDS = [
  "what if","remember","the gap","don't","ordinary","tuesday","almost","too late",
  "I forgot","the light","wait","still","gone","who said","I know","not yet",
  "the door","again","it was","no one","the shape of","before","after all","maybe",
];

// ── ANIMATED SCRIBBLE ────────────────────────────────────────────
function Scribble({ path, size=120, color="#111", opacity=0.12, delay=0, animate=true }) {
  const id = useRef(`sc-${Math.random().toString(36).slice(2)}`).current;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow:"visible", opacity }}>
      {animate && (
        <style>{`
          #${id} {
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
            animation: draw-${id} 1.8s ease ${delay}s forwards;
          }
          @keyframes draw-${id} { to { stroke-dashoffset: 0; } }
        `}</style>
      )}
      <path id={id} d={path} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        style={animate ? {} : { strokeDasharray:"none" }} />
    </svg>
  );
}

// ── CORRIDOR CANVAS ──────────────────────────────────────────────
function CorridorCanvas({ scrollY }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const mouseRef  = useRef({ x:0.5, y:0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W, H;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const onMove = e => {
      const r  = canvas.getBoundingClientRect();
      const ex = e.touches ? e.touches[0].clientX : e.clientX;
      const ey = e.touches ? e.touches[0].clientY : e.clientY;
      mouseRef.current = { x:(ex-r.left)/r.width, y:(ey-r.top)/r.height };
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove, { passive:true });

    let t = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0,0,W,H);

      const cx = W/2 + (mouseRef.current.x - 0.5)*30;
      const cy = H/2 + (mouseRef.current.y - 0.5)*20;

      // depth layers — receding corridor lines
      for (let layer = 0; layer < 8; layer++) {
        const progress = layer / 7;
        const alpha    = 0.04 + progress * 0.06;
        const spread   = 0.08 + progress * 0.42;

        ctx.beginPath();
        // top line
        ctx.moveTo(cx, cy);
        ctx.lineTo(W * (0.5 - spread), 0);
        // bottom line
        ctx.moveTo(cx, cy);
        ctx.lineTo(W * (0.5 - spread), H);
        // right top
        ctx.moveTo(cx, cy);
        ctx.lineTo(W * (0.5 + spread), 0);
        // right bottom
        ctx.moveTo(cx, cy);
        ctx.lineTo(W * (0.5 + spread), H);

        ctx.strokeStyle = `rgba(17,17,17,${alpha})`;
        ctx.lineWidth   = 0.5 + progress * 0.5;
        ctx.stroke();
      }

      // wobbly horizon cross — hand-drawn feel
      const hy = cy + Math.sin(t*0.4)*3;
      ctx.beginPath();
      for (let x = 0; x < W; x += 4) {
        const y = hy + Math.sin(x*0.03 + t*0.5)*2.5 + Math.sin(x*0.08)*1;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(17,17,17,0.08)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // vertical wobble
      const vx = cx + Math.sin(t*0.3)*2;
      ctx.beginPath();
      for (let y = 0; y < H; y += 4) {
        const x = vx + Math.sin(y*0.04 + t*0.4)*2;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(17,17,17,0.06)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // scattered pencil dots
      for (let i = 0; i < 40; i++) {
        const seed = i * 137.5;
        const px   = ((seed * 0.618) % 1) * W;
        const py   = ((seed * 0.382) % 1) * H;
        const dist = Math.sqrt((px-cx)*(px-cx) + (py-cy)*(py-cy));
        const a    = Math.max(0, 0.06 - dist/(W*0.8));
        if (a < 0.005) continue;
        ctx.beginPath();
        ctx.arc(px + Math.sin(t*0.2+i)*1.5, py + Math.cos(t*0.25+i)*1.5, 1.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(17,17,17,${a})`;
        ctx.fill();
      }

      t += 0.012;
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />;
}

// ── FLOATING WORD ────────────────────────────────────────────────
function FloatingWord({ word, x, y, size, opacity, delay }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){setV(true);obs.disconnect();} }, {threshold:0.1});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[]);
  return (
    <div ref={ref} style={{
      position:"absolute", left:`${x}%`, top:`${y}%`,
      fontSize:`${size}px`, fontStyle:"italic",
      color:"#111", opacity: v ? opacity : 0,
      transform: v ? "translateY(0) rotate(" + (Math.sin(x*0.3)*8-4) + "deg)" : "translateY(10px)",
      transition:`opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
      fontFamily:"'Times New Roman',serif",
      whiteSpace:"nowrap", pointerEvents:"none",
      userSelect:"none",
    }}>{word}</div>
  );
}

// ── FADE IN ──────────────────────────────────────────────────────
function FadeIn({children,delay=0,style={}}) {
  const ref=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{ const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect();}},{threshold:0.08}); if(ref.current)obs.observe(ref.current); return()=>obs.disconnect(); },[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(28px)",transition:`opacity 1s ease ${delay}s,transform 1s ease ${delay}s`,...style}}>{children}</div>;
}

// ── MAIN ─────────────────────────────────────────────────────────
export default function Home() {
  const [openPoem,setOpenPoem]     = useState(null);
  const [email,setEmail]           = useState("");
  const [subscribed,setSubscribed] = useState(false);
  const [scrollY,setScrollY]       = useState(0);
  const heroRef = useRef(null);

  useEffect(()=>{ const fn=()=>setScrollY(window.scrollY); window.addEventListener("scroll",fn,{passive:true}); return()=>window.removeEventListener("scroll",fn); },[]);

  return (
    <div style={{fontFamily:"'Times New Roman',Times,Georgia,serif",overflowX:"hidden",background:"#fff",color:"#111"}}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        a{color:inherit;text-decoration:none}
        img{display:block} button,input{font-family:inherit}
        ::selection{background:#111;color:#fff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes drift{0%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(1deg)}100%{transform:translateY(0) rotate(-2deg)}}
        @keyframes scribble-in{from{stroke-dashoffset:400}to{stroke-dashoffset:0}}

        .num-badge{
          width:38px;height:38px;border-radius:50%;
          border:1.5px solid rgba(17,17,17,.25);
          display:flex;align-items:center;justify-content:center;
          font-size:11px;letter-spacing:.06em;flex-shrink:0;
        }
        .read-btn{font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;
          opacity:.35;transition:opacity .2s;background:none;border:none;padding:0;color:#111}
        .read-btn:hover{opacity:1}
        .buy-btn{display:inline-block;border:1.5px solid rgba(17,17,17,.4);color:#111;
          padding:14px 40px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;
          transition:background .25s,color .25s}
        .buy-btn:hover{background:#111;color:#fff}
        .sub-btn{background:#111;color:#fff;border:none;padding:14px 24px;
          font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}
        .sub-btn:hover{opacity:.7}

        .scribble-path{
          stroke-dasharray:400;
          stroke-dashoffset:400;
          animation: scribble-in 2s ease forwards;
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        padding:"18px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",
        background: scrollY > 60 ? "rgba(255,255,255,.95)" : "transparent",
        borderBottom: scrollY > 60 ? "1px solid rgba(17,17,17,.07)" : "none",
        backdropFilter: scrollY > 60 ? "blur(8px)" : "none",
        transition:"background .4s,border .4s",
      }}>
        <span style={{fontSize:"12px",letterSpacing:".18em",textTransform:"uppercase"}}>Bea Sophia</span>
        <div style={{display:"flex",gap:"24px"}}>
          {[["Poems","#poems"],["Collection","#collection"],["About","#about"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",opacity:.35,transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=1}
              onMouseLeave={e=>e.currentTarget.style.opacity=.35}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO — corridor */}
      <section ref={heroRef} style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <CorridorCanvas scrollY={scrollY} />

        {/* floating thought-words scattered in the corridor */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
          {FLOATING_WORDS.slice(0,14).map((word,i) => (
            <FloatingWord key={i} word={word}
              x={8 + (i*17.3)%82} y={10 + (i*23.7)%78}
              size={10+(i%4)*2} opacity={0.1+(i%3)*0.04}
              delay={0.3+i*0.12}
            />
          ))}
        </div>

        {/* scribbles on the walls */}
        <div style={{position:"absolute",top:"15%",left:"8%",animation:"drift 6s ease-in-out infinite",animationDelay:"0s"}}>
          <Scribble path={SCRIBBLES[0]} size={100} opacity={0.09} delay={0.5}/>
        </div>
        <div style={{position:"absolute",top:"25%",right:"10%",animation:"drift 7s ease-in-out infinite",animationDelay:"1s"}}>
          <Scribble path={SCRIBBLES[3]} size={80} opacity={0.07} delay={0.8}/>
        </div>
        <div style={{position:"absolute",bottom:"20%",left:"12%",animation:"drift 8s ease-in-out infinite",animationDelay:"2s"}}>
          <Scribble path={SCRIBBLES[1]} size={140} opacity={0.08} delay={1}/>
        </div>
        <div style={{position:"absolute",bottom:"30%",right:"8%",animation:"drift 6.5s ease-in-out infinite",animationDelay:"0.5s"}}>
          <Scribble path={SCRIBBLES[4]} size={90} opacity={0.07} delay={1.2}/>
        </div>

        {/* centre text */}
        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 32px",animation:"fadeUp 1.2s ease .4s both",pointerEvents:"none"}}>
          <p style={{fontSize:"10px",letterSpacing:".3em",textTransform:"uppercase",opacity:.3,marginBottom:"24px"}}>
            The Page Gallery — 2025
          </p>
          <h1 style={{
            fontSize:"clamp(26px,5.5vw,66px)",
            fontWeight:400,fontStyle:"italic",
            lineHeight:1.12,maxWidth:"580px",
            letterSpacing:"-.015em",
          }}>
            What happens to a thought<br/>when the person who had it dies?
          </h1>
          <p style={{fontSize:"13px",opacity:.3,letterSpacing:".06em",marginTop:"20px",fontStyle:"italic"}}>
            move through it ↓
          </p>
        </div>

        {/* bottom links */}
        <div style={{position:"absolute",bottom:"32px",display:"flex",gap:"24px",flexWrap:"wrap",justifyContent:"center",animation:"fadeIn 1.5s ease 1.4s both",zIndex:2,padding:"0 20px"}}>
          <a href="#poems" style={{fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",opacity:.4,borderBottom:"1px solid rgba(17,17,17,.3)",paddingBottom:"3px"}}>Read free poems</a>
          <a href="#collection" style={{fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",opacity:.25,borderBottom:"1px solid rgba(17,17,17,.15)",paddingBottom:"3px"}}>Buy the collection — £12</a>
        </div>
      </section>

      {/* WALK-IN STRIP — transition */}
      <div style={{
        padding:"60px 32px",
        background:"#fff",
        position:"relative",
        borderTop:"1px solid rgba(17,17,17,.06)",
        overflow:"hidden",
      }}>
        {/* scattered scribble behind text */}
        <div style={{position:"absolute",top:"10px",right:"5%",opacity:.06}}>
          <Scribble path={SCRIBBLES[6]} size={180} animate={false}/>
        </div>
        <p style={{fontSize:"clamp(18px,3vw,34px)",fontStyle:"italic",lineHeight:1.65,maxWidth:"620px",opacity:.6}}>
          Walk around inside someone else's mind.<br/>The poems are what we found.
        </p>
      </div>

      {/* POEMS */}
      <div id="poems">
        {POEMS.map((poem,i) => (
          <FadeIn key={poem.id} style={{borderTop:"1px solid rgba(17,17,17,.06)",position:"relative",overflow:"hidden"}}>

            {/* background scribble per section */}
            <div style={{
              position:"absolute",
              top: i%2===0 ? "20px" : "auto",
              bottom: i%2!==0 ? "20px" : "auto",
              [i%2===0?"right":"left"]: "4%",
              opacity:.05, pointerEvents:"none",
              transform:`rotate(${i*15-10}deg)`,
            }}>
              <Scribble path={SCRIBBLES[i+1]} size={200} animate={false}/>
            </div>

            <div style={{padding:"80px 32px",position:"relative",zIndex:1}}>
              {/* number + title */}
              <div style={{display:"flex",alignItems:"flex-start",gap:"16px",marginBottom:"36px"}}>
                <div className="num-badge">{poem.num}</div>
                <h2 onClick={()=>setOpenPoem(openPoem===poem.id?null:poem.id)}
                  style={{fontSize:"clamp(34px,7vw,90px)",fontWeight:400,fontStyle:"italic",lineHeight:.95,letterSpacing:"-.015em",cursor:"pointer",transition:"opacity .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=.6}
                  onMouseLeave={e=>e.currentTarget.style.opacity=1}>
                  {poem.title}
                </h2>
              </div>

              {/* drawing — torn edge feel */}
              <div style={{
                height:"clamp(130px,20vw,220px)",
                overflow:"hidden",
                marginBottom:"36px",
                position:"relative",
                marginLeft: i%2===0 ? "0" : "clamp(40px,15vw,160px)",
                marginRight: i%2===0 ? "clamp(40px,15vw,160px)" : "0",
              }}>
                <img src={poem.drawing} alt="" style={{
                  width:"100%",height:"100%",objectFit:"cover",
                  objectPosition:"center",
                  opacity:.55,
                  filter:"grayscale(40%) contrast(1.1)",
                  mixBlendMode:"multiply",
                }}/>
                {/* sketchy overlay */}
                <div style={{position:"absolute",inset:0,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",opacity:.6}}/>
              </div>

              {/* note */}
              <p style={{fontSize:"11px",fontStyle:"italic",opacity:.3,letterSpacing:".06em",marginBottom:"20px"}}>{poem.note}</p>

              {/* poem */}
              {openPoem===poem.id ? (
                <div style={{animation:"fadeIn .5s ease",maxWidth:"520px"}}>
                  <div style={{borderLeft:"1.5px solid rgba(17,17,17,.1)",paddingLeft:"20px",marginBottom:"24px"}}>
                    {poem.lines.map((line,j)=>(
                      <p key={j} style={{fontSize:"17px",lineHeight:2.1,minHeight:line===""?"1em":"auto",fontStyle:line===""?"normal":"italic"}}>{line||"\u00A0"}</p>
                    ))}
                  </div>
                  <button className="read-btn" onClick={()=>setOpenPoem(null)}>Close</button>
                </div>
              ) : (
                <div style={{maxWidth:"520px"}}>
                  <p style={{fontSize:"17px",fontStyle:"italic",opacity:.35,lineHeight:1.9,marginBottom:"20px"}}>{poem.lines[0]}</p>
                  <button className="read-btn" onClick={()=>setOpenPoem(poem.id)}>Read the poem →</button>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>

      {/* COLLECTION */}
      <section id="collection" style={{borderTop:"1px solid rgba(17,17,17,.06)",padding:"80px 32px",position:"relative",overflow:"hidden",background:"#fff"}}>
        {/* background scribbles */}
        <div style={{position:"absolute",top:"-20px",right:"-20px",opacity:.04,transform:"rotate(20deg)"}}>
          <Scribble path={SCRIBBLES[7]} size={280} animate={false}/>
        </div>
        <div style={{position:"absolute",bottom:"40px",left:"5%",opacity:.04}}>
          <Scribble path={SCRIBBLES[2]} size={160} animate={false}/>
        </div>

        <FadeIn style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:"16px",marginBottom:"40px"}}>
            <div className="num-badge">04</div>
            <h2 style={{fontSize:"clamp(44px,10vw,130px)",fontWeight:400,fontStyle:"italic",lineHeight:.9,letterSpacing:"-.025em"}}>
              The<br/>Only<br/>Life
            </h2>
          </div>

          {/* full-bleed image */}
          <div style={{height:"clamp(150px,22vw,260px)",overflow:"hidden",marginBottom:"44px",filter:"grayscale(30%) contrast(1.05)"}}>
            <img src={DRAWING_GALLERY} alt="" style={{width:"100%",height:"100%",objectFit:"cover",opacity:.45,mixBlendMode:"multiply"}}/>
          </div>

          <p style={{fontSize:"17px",lineHeight:2,opacity:.45,maxWidth:"480px",marginBottom:"12px"}}>Twenty poems. New York. The body after the ward.</p>
          <p style={{fontSize:"17px",lineHeight:2,opacity:.45,maxWidth:"480px",marginBottom:"48px"}}>Scotland in the bones. The city not yet earned. Things that survived and didn't know it yet.</p>

          <div style={{marginBottom:"36px",display:"flex",alignItems:"baseline",gap:"16px"}}>
            <span style={{fontSize:"clamp(40px,7vw,72px)",fontWeight:300,letterSpacing:"-.02em"}}>£12</span>
            <span style={{fontSize:"11px",opacity:.25,letterSpacing:".1em"}}>Digital PDF · Yours immediately</span>
          </div>
          <a href="https://paypal.me/Sophiasharkey330" target="_blank" rel="noopener noreferrer" className="buy-btn">
            Buy the collection
          </a>
        </FadeIn>
      </section>

      {/* ABOUT */}
      <section id="about" style={{borderTop:"1px solid rgba(17,17,17,.06)",padding:"80px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"30px",right:"6%",opacity:.05,transform:"rotate(-8deg)"}}>
          <Scribble path={SCRIBBLES[0]} size={160} animate={false}/>
        </div>
        <FadeIn style={{position:"relative",zIndex:1,maxWidth:"620px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:"16px",marginBottom:"36px"}}>
            <div className="num-badge">05</div>
            <h2 style={{fontSize:"clamp(28px,5vw,56px)",fontWeight:400,fontStyle:"italic",lineHeight:1.1,letterSpacing:"-.01em"}}>
              All their thoughts<br/>die with them.
            </h2>
          </div>
          <p style={{fontSize:"17px",lineHeight:2,opacity:.5,marginBottom:"16px"}}>When I got sick, I realised that when people die, all their thoughts die with them.</p>
          <p style={{fontSize:"17px",lineHeight:2,opacity:.4,marginBottom:"16px"}}>I started collecting fragments. Conversations overheard. Things said in the wrong order. Thoughts that lived in one mind and died there.</p>
          <p style={{fontSize:"17px",lineHeight:2,opacity:.4,marginBottom:"44px"}}>That became The Page Gallery Journal. These poems are the second attempt at the same problem.</p>
          <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
            style={{fontSize:"11px",letterSpacing:".2em",textTransform:"uppercase",opacity:.3,borderBottom:"1px solid rgba(17,17,17,.18)",paddingBottom:"4px"}}>
            @bsophialovesgnochi
          </a>
        </FadeIn>
      </section>

      {/* NEWSLETTER */}
      <FadeIn style={{borderTop:"1px solid rgba(17,17,17,.06)",padding:"80px 32px"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:"16px",marginBottom:"32px"}}>
          <div className="num-badge">06</div>
          <h2 style={{fontSize:"clamp(26px,4.5vw,52px)",fontWeight:400,fontStyle:"italic",lineHeight:1.1,letterSpacing:"-.01em"}}>
            New fragments,<br/>when they exist.
          </h2>
        </div>
        <p style={{fontSize:"15px",opacity:.35,lineHeight:1.9,marginBottom:"36px",maxWidth:"400px"}}>No schedule. No newsletter voice. The thing itself when it's ready.</p>
        {subscribed ? (
          <p style={{fontSize:"16px",fontStyle:"italic",opacity:.4}}>You're in.</p>
        ) : (
          <form onSubmit={e=>{e.preventDefault();if(email)setSubscribed(true);}} style={{display:"flex",maxWidth:"380px"}}>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
              style={{flex:1,padding:"14px 16px",border:"1px solid rgba(17,17,17,.18)",borderRight:"none",background:"#fff",fontSize:"14px",outline:"none",color:"#111",borderRadius:0}}/>
            <button type="submit" className="sub-btn">Subscribe</button>
          </form>
        )}
      </FadeIn>

      {/* FOOTER */}
      <footer style={{padding:"22px 32px",borderTop:"1px solid rgba(17,17,17,.06)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"}}>
        <span style={{fontSize:"11px",opacity:.2}}>© Bea Sophia 2025</span>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{fontSize:"10px",letterSpacing:".16em",textTransform:"uppercase",opacity:.2}}>Instagram</a>
      </footer>
    </div>
  );
}
