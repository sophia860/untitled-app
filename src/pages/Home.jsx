import { useState, useEffect, useRef } from "react";

const PHOTO_BEA = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/4415d70a3_whatsapp_image_1987811375197218.jpg";

const DRAWING_WOLF   = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";
const DRAWING_FOREST = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/3d55b220c_whatsapp_image_1375833884351215.jpg";

const POEMS = [
  {
    id:1, num:"01", title:"Retroactive Availability", note:"",
    lines:[
      "Four times in the same minute I said sorry",
      "for wanting you.",
      "",
      "You said anything.",
      "",
      "Said it at eleven twenty-eight,",
      "which is the exact minute I understood",
      "",
      "that a man who would do anything",
      "can also do nothing",
      "for years",
      "and not know the difference.",
    ],
  },
];

const SCRIBBLES = [
  "M 20 50 C 18 30, 40 15, 55 20 C 72 25, 80 40, 75 58 C 70 75, 50 82, 35 76 C 18 68, 16 60, 20 50",
  "M 5 60 C 15 58, 30 63, 45 59 C 60 55, 75 62, 90 58",
  "M 15 15 C 25 22, 40 28, 55 35 M 55 15 C 45 22, 30 28, 15 38",
  "M 50 50 C 55 45, 62 44, 65 50 C 68 56, 63 65, 55 67 C 44 70, 35 62, 33 52 C 31 40, 40 30, 52 28 C 66 26, 76 36, 78 50",
  "M 10 50 C 14 48, 18 52, 22 50 M 28 47 C 32 45, 36 49, 40 47 M 46 50 C 50 48, 54 52, 58 50",
  "M 10 50 C 25 50, 50 48, 70 50 M 60 42 C 65 46, 70 50, 65 56",
  "M 15 20 C 20 18, 50 16, 75 20 C 78 25, 80 55, 78 75 C 72 78, 40 80, 18 78 C 14 72, 12 40, 15 20",
  "M 50 10 C 52 28, 60 35, 80 35 C 65 42, 68 52, 78 68 C 62 55, 50 60, 38 70 C 44 52, 40 42, 22 38 C 42 36, 46 26, 50 10",
];

const FLOATING_WORDS = [
  "sorry","anything","eleven twenty-eight","for years","wanting","nothing",
  "the same minute","I understood","do anything","not know","the difference",
  "four times","you said","I said","said it","and not",
  "for wanting","can also","who would","years","understood","exact",
];

// ── CUSTOM CURSOR ─────────────────────────────────────────────────
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x:0, y:0 });
  const ring    = useRef({ x:0, y:0 });

  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);

    let raf;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px,${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position:"fixed", top:0, left:0, zIndex:9999, pointerEvents:"none",
        width:6, height:6, background:"#111", borderRadius:"50%",
        marginLeft:-3, marginTop:-3, mixBlendMode:"multiply",
      }}/>
      <div ref={ringRef} style={{
        position:"fixed", top:0, left:0, zIndex:9998, pointerEvents:"none",
        width:32, height:32, border:"1px solid rgba(17,17,17,0.3)", borderRadius:"50%",
        marginLeft:-16, marginTop:-16,
      }}/>
    </>
  );
}

// ── SCRIBBLE ─────────────────────────────────────────────────────
function Scribble({ path, size=120, color="#111", opacity=0.12, delay=0, animate=true }) {
  const id = useRef(`sc-${Math.random().toString(36).slice(2)}`).current;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow:"visible", opacity }}>
      {animate && (
        <style>{`
          #${id}{stroke-dasharray:300;stroke-dashoffset:300;animation:draw-${id} 1.8s ease ${delay}s forwards}
          @keyframes draw-${id}{to{stroke-dashoffset:0}}
        `}</style>
      )}
      <path id={id} d={path} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        style={animate ? {} : { strokeDasharray:"none" }} />
    </svg>
  );
}

// ── CORRIDOR CANVAS ───────────────────────────────────────────────
function CorridorCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x:0.5, y:0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W, H;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height };
    };
    canvas.addEventListener("mousemove", onMove);

    let t = 0, raf;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#fff"; ctx.fillRect(0,0,W,H);
      const cx = W/2 + (mouseRef.current.x-0.5)*30;
      const cy = H/2 + (mouseRef.current.y-0.5)*20;
      for (let l=0; l<8; l++) {
        const p = l/7;
        const s = 0.08 + p*0.42;
        ctx.beginPath();
        ctx.moveTo(cx,cy); ctx.lineTo(W*(0.5-s),0);
        ctx.moveTo(cx,cy); ctx.lineTo(W*(0.5-s),H);
        ctx.moveTo(cx,cy); ctx.lineTo(W*(0.5+s),0);
        ctx.moveTo(cx,cy); ctx.lineTo(W*(0.5+s),H);
        ctx.strokeStyle=`rgba(17,17,17,${0.04+p*0.06})`; ctx.lineWidth=0.5+p*0.5; ctx.stroke();
      }
      const hy=cy+Math.sin(t*0.4)*3;
      ctx.beginPath();
      for(let x=0;x<W;x+=4){ const y=hy+Math.sin(x*0.03+t*0.5)*2.5; if(!x)ctx.moveTo(x,y); else ctx.lineTo(x,y); }
      ctx.strokeStyle="rgba(17,17,17,0.08)"; ctx.lineWidth=1; ctx.stroke();
      t+=0.012; raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);

  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>;
}

// ── FLOATING WORD ─────────────────────────────────────────────────
function FloatingWord({ word, x, y, size, opacity, delay }) {
  const ref = useRef(null); const [v,setV] = useState(false);
  useEffect(()=>{ const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect();}},{threshold:0.1}); if(ref.current)obs.observe(ref.current); return()=>obs.disconnect(); },[]);
  return (
    <div ref={ref} style={{position:"absolute",left:`${x}%`,top:`${y}%`,fontSize:`${size}px`,fontStyle:"italic",color:"#111",
      opacity:v?opacity:0,transform:v?`translateY(0) rotate(${Math.sin(x*0.3)*8-4}deg)`:"translateY(10px)",
      transition:`opacity 1s ease ${delay}s,transform 1s ease ${delay}s`,fontFamily:"'Times New Roman',serif",
      whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none"}}>{word}</div>
  );
}

// ── FADE IN ───────────────────────────────────────────────────────
function FadeIn({children,delay=0,style={}}) {
  const ref=useRef(null); const [v,setV]=useState(false);
  useEffect(()=>{ const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect();}},{threshold:0.08}); if(ref.current)obs.observe(ref.current); return()=>obs.disconnect(); },[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(28px)",transition:`opacity .9s ease ${delay}s,transform .9s ease ${delay}s`,...style}}>{children}</div>;
}

// ── POEM — line by line reveal ────────────────────────────────────
function PoemBlock({ poem, open, onToggle }) {
  const [revealedLines, setRevealedLines] = useState([]);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (open) {
      setRevealedLines([]);
      let idx = 0;
      intervalRef.current = setInterval(() => {
        idx++;
        setRevealedLines(poem.lines.slice(0, idx));
        if (idx >= poem.lines.length) clearInterval(intervalRef.current);
      }, 90);
      return () => clearInterval(intervalRef.current);
    } else {
      setRevealedLines([]);
    }
  }, [open, poem.lines]);

  return (
    <FadeIn style={{borderTop:"1px solid rgba(17,17,17,.06)",position:"relative",overflow:"hidden"}}>
      {/* bg scribble */}
      <div style={{position:"absolute",top:"20px",right:"4%",opacity:.04,pointerEvents:"none",transform:"rotate(-8deg)"}}>
        <Scribble path={SCRIBBLES[1]} size={220} animate={false}/>
      </div>

      <div style={{padding:"80px 32px",position:"relative",zIndex:1}}>
        {/* number + title */}
        <div style={{display:"flex",alignItems:"flex-start",gap:"16px",marginBottom:"36px"}}>
          <div style={{width:38,height:38,borderRadius:"50%",border:"1.5px solid rgba(17,17,17,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,letterSpacing:".06em",flexShrink:0}}>
            {poem.num}
          </div>
          <h2
            onClick={onToggle}
            onMouseEnter={()=>setHovered(true)}
            onMouseLeave={()=>setHovered(false)}
            style={{fontSize:"clamp(34px,7vw,90px)",fontWeight:400,fontStyle:"italic",lineHeight:.95,
              letterSpacing:"-.015em",cursor:"pointer",transition:"opacity .2s, letter-spacing .4s",
              opacity: hovered ? 0.55 : 1,
              letterSpacing: hovered ? "0.01em" : "-.015em",
            }}>
            {poem.title}
          </h2>
        </div>

        {/* poem body — line by line */}
        {open ? (
          <div style={{paddingLeft:54}}>
            {revealedLines.map((line,j) => (
              <p key={j} style={{
                fontSize:"clamp(16px,2vw,22px)",fontStyle:"italic",lineHeight:1.9,
                minHeight:"1.9em",color:line===""?"transparent":"#111",
                opacity: revealedLines.length > j ? 1 : 0,
                transform: revealedLines.length > j ? "translateY(0)" : "translateY(6px)",
                transition:"opacity .3s ease, transform .3s ease",
              }}>{line || "\u00a0"}</p>
            ))}
            <button
              onClick={onToggle}
              style={{marginTop:32,fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",
                cursor:"pointer",opacity:.35,background:"none",border:"none",color:"#111",
                transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=1}
              onMouseLeave={e=>e.currentTarget.style.opacity=.35}>
              Close
            </button>
          </div>
        ) : (
          <div style={{paddingLeft:54}}>
            <p style={{fontSize:"17px",fontStyle:"italic",opacity:.3,lineHeight:1.9,marginBottom:20}}>
              {poem.lines[0]}
            </p>
            <button
              onClick={onToggle}
              style={{fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",
                cursor:"pointer",opacity:.35,background:"none",border:"none",color:"#111",
                transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=1}
              onMouseLeave={e=>e.currentTarget.style.opacity=.35}>
              Read the poem →
            </button>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ── WRITER'S BLOCK PACK DEMO BLANK ────────────────────────────────
function DemoBlank({ prompt, placeholder }) {
  const [val, setVal] = useState("");
  const [active, setActive] = useState(false);
  const [flashed, setFlashed] = useState(false);
  const inputRef = useRef(null);

  const handleBlur = () => {
    setActive(false);
    if (val) { setFlashed(true); setTimeout(() => setFlashed(false), 400); }
  };

  return (
    <div style={{marginBottom:12}}>
      <p style={{fontSize:"clamp(15px,2vw,19px)",lineHeight:1.9,fontFamily:"'EB Garamond','Times New Roman',serif",color:"#EEE8DC"}}>
        {prompt}
        <span
          onClick={() => { inputRef.current.focus(); }}
          style={{
            display:"inline-block", position:"relative",
            minWidth:120, marginLeft:6,
            borderBottom: active ? "1.5px solid #C24B1A" : `1.5px solid rgba(194,75,26,0.25)`,
            transition:"border-color .25s, background .25s",
            background: flashed ? "rgba(42,110,74,0.2)" : "transparent",
            cursor:"text", paddingBottom:1,
          }}>
          <input
            ref={inputRef}
            value={val}
            onChange={e => setVal(e.target.value)}
            onFocus={() => setActive(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            style={{
              background:"transparent", border:"none", outline:"none",
              fontFamily:"'Courier Prime','Courier New',monospace",
              fontSize:"clamp(14px,1.8vw,17px)", color:"#C24B1A",
              width: Math.max(val.length * 9.5, 100) + "px",
              minWidth:100, maxWidth:300,
              caretColor:"#C24B1A",
              transition:"width .2s ease",
            }}
          />
        </span>
      </p>
    </div>
  );
}

// ── SHOP CARD ─────────────────────────────────────────────────────
function ShopCard({ title, price, description, tag, link, dark=false, children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: dark ? "#100E0C" : "#fff",
        border: dark ? "1px solid rgba(255,255,255,.08)" : "1px solid rgba(17,17,17,.1)",
        padding:"48px 40px",
        flex:"1 1 320px",
        transition:"transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hov ? "0 24px 60px rgba(0,0,0,.12)" : "0 2px 12px rgba(0,0,0,.04)",
        color: dark ? "#EEE8DC" : "#111",
        position:"relative",
        overflow:"hidden",
      }}>
      {tag && (
        <span style={{fontSize:9,letterSpacing:".25em",textTransform:"uppercase",
          background: dark ? "#C24B1A" : "#111",
          color:"#fff", padding:"4px 10px", marginBottom:20, display:"inline-block"}}>
          {tag}
        </span>
      )}
      <h3 style={{fontSize:"clamp(22px,3vw,32px)",fontStyle:"italic",fontWeight:400,marginBottom:12,marginTop: tag ? 12 : 0}}>
        {title}
      </h3>
      <p style={{fontSize:15,lineHeight:1.85,opacity:.55,marginBottom:28}}>
        {description}
      </p>
      {children}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginTop:28}}>
        <span style={{fontSize:"clamp(20px,3vw,28px)",fontStyle:"italic",opacity:.7}}>£{price}</span>
        <a href={link} target="_blank" rel="noopener noreferrer"
          style={{
            fontSize:11,letterSpacing:".2em",textTransform:"uppercase",
            border: dark ? "1px solid rgba(194,75,26,.7)" : "1.5px solid rgba(17,17,17,.4)",
            color: dark ? "#C24B1A" : "#111",
            padding:"12px 32px",
            transition:"background .25s,color .25s,border-color .25s",
            background: hov ? (dark ? "#C24B1A" : "#111") : "transparent",
            ...(hov ? { color: dark ? "#100E0C" : "#fff" } : {}),
          }}>
          Buy now
        </a>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────
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

  return (
    <div style={{fontFamily:"'Times New Roman',Times,Georgia,serif",overflowX:"hidden",background:"#fff",color:"#111",cursor:"none"}}>
      <Cursor />

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        a{color:inherit;text-decoration:none}
        img{display:block} button,input{font-family:inherit;cursor:none}
        ::selection{background:#111;color:#fff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes drift{0%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(1deg)}100%{transform:translateY(0) rotate(-2deg)}}
        @keyframes scribble-in{from{stroke-dashoffset:400}to{stroke-dashoffset:0}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

        .sub-btn{background:#111;color:#fff;border:none;padding:14px 24px;
          font-size:10px;letter-spacing:.2em;text-transform:uppercase;cursor:none;transition:opacity .2s}
        .sub-btn:hover{opacity:.7}
      `}</style>

      {/* NAV */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:200,
        padding:"18px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",
        background: scrollY>60 ? "rgba(255,255,255,.95)" : "transparent",
        borderBottom: scrollY>60 ? "1px solid rgba(17,17,17,.07)" : "none",
        backdropFilter: scrollY>60 ? "blur(8px)" : "none",
        transition:"background .4s,border .4s",
      }}>
        <span style={{fontSize:"12px",letterSpacing:".18em",textTransform:"uppercase"}}>Bea Sophia</span>
        <div style={{display:"flex",gap:"28px"}}>
          {[["Poems","#poems"],["Shop","#shop"],["About","#about"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:"10px",letterSpacing:".2em",textTransform:"uppercase",opacity:.35,transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=1}
              onMouseLeave={e=>e.currentTarget.style.opacity=.35}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <CorridorCanvas />
        <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
          {FLOATING_WORDS.slice(0,14).map((word,i) => (
            <FloatingWord key={i} word={word}
              x={8+(i*17.3)%82} y={10+(i*23.7)%78}
              size={10+(i%4)*2} opacity={0.1+(i%3)*0.04} delay={0.3+i*0.12}/>
          ))}
        </div>
        <div style={{position:"absolute",top:"15%",left:"8%",animation:"drift 6s ease-in-out infinite"}}>
          <Scribble path={SCRIBBLES[0]} size={100} opacity={0.09} delay={0.5}/>
        </div>
        <div style={{position:"absolute",bottom:"22%",right:"10%",animation:"drift 7.5s ease-in-out infinite",animationDelay:"1s"}}>
          <Scribble path={SCRIBBLES[3]} size={80} opacity={0.07} delay={0.8}/>
        </div>
        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 32px",animation:"fadeUp 1.2s ease .4s both",pointerEvents:"none"}}>
          <h1 style={{fontSize:"clamp(32px,6vw,80px)",fontWeight:400,fontStyle:"italic",lineHeight:1.05,letterSpacing:"-.02em",marginBottom:20}}>
            Bea Sophia
          </h1>
          <p style={{fontSize:"clamp(13px,1.6vw,18px)",opacity:.5,lineHeight:1.8,fontStyle:"italic",marginBottom:28}}>
            Poet. The Page Gallery Journal.<br/>New York.
          </p>
          <p style={{fontSize:11,opacity:.22,letterSpacing:".08em"}}>↓</p>
        </div>
        <div style={{position:"absolute",bottom:32,display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center",animation:"fadeIn 1.5s ease 1.4s both",zIndex:2,padding:"0 20px"}}>
          <a href="#poems" style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",opacity:.4,borderBottom:"1px solid rgba(17,17,17,.3)",paddingBottom:3}}>Read free poems</a>
          <a href="#shop" style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",opacity:.25,borderBottom:"1px solid rgba(17,17,17,.15)",paddingBottom:3}}>Shop — from £12</a>
        </div>
      </section>

      {/* PHOTO */}
      <div style={{background:"#fff",borderTop:"1px solid rgba(17,17,17,.06)"}}>
        <div style={{position:"relative",width:"100%",height:"clamp(500px,85vh,900px)",overflow:"hidden"}}>
          <img src={PHOTO_BEA} alt="Bea Sophia" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 15%"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 70%,rgba(255,255,255,.5))",pointerEvents:"none"}}/>
        </div>
        <div style={{padding:"36px 32px 56px",borderBottom:"1px solid rgba(17,17,17,.06)"}}>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-start",gap:24,maxWidth:900}}>
            <div>
              <p style={{fontSize:"clamp(22px,3.5vw,38px)",fontStyle:"italic",fontWeight:400,lineHeight:1.3,marginBottom:10}}>
                Bea Sophia — poet, founder of<br/>The Page Gallery Journal.
              </p>
              <p style={{fontSize:15,lineHeight:1.9,opacity:.42,maxWidth:480}}>
                I write poems about the things people feel but don't say. When I got sick I started writing them down. This is where they live.
              </p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14,paddingTop:4}}>
              {[["Read free poems","#poems",.6],["Shop — from £12","#shop",.35],["Instagram ↗","https://instagram.com/bsophialovesgnochi",.2]].map(([label,href,op])=>(
                <a key={label} href={href} target={href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
                  style={{fontSize:11,letterSpacing:".18em",textTransform:"uppercase",borderBottom:"1px solid rgba(17,17,17,.15)",paddingBottom:3,opacity:op,whiteSpace:"nowrap",transition:"opacity .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=1}
                  onMouseLeave={e=>e.currentTarget.style.opacity=op}>{label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POEMS */}
      <div id="poems">
        {POEMS.map((poem) => (
          <PoemBlock key={poem.id} poem={poem} open={openPoem===poem.id} onToggle={()=>setOpenPoem(openPoem===poem.id?null:poem.id)}/>
        ))}
      </div>

      {/* SHOP */}
      <section id="shop" style={{borderTop:"1px solid rgba(17,17,17,.06)",padding:"80px 32px",background:"#fafaf8",position:"relative",overflow:"hidden"}}>
        <FadeIn>
          <p style={{fontSize:10,letterSpacing:".28em",textTransform:"uppercase",opacity:.3,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            <span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"#111"}}/>
            Shop
          </p>
          <h2 style={{fontSize:"clamp(28px,5vw,60px)",fontStyle:"italic",fontWeight:400,lineHeight:1.1,marginBottom:56,maxWidth:500}}>
            Two ways in.
          </h2>
        </FadeIn>

        <div style={{display:"flex",flexWrap:"wrap",gap:24,alignItems:"stretch"}}>

          {/* Collection card */}
          <ShopCard
            title="The Only Life"
            price="12"
            description="Twenty poems. New York. The body after the ward. A collection about what survives."
            tag="PDF Collection"
            link="https://www.paypal.com/paypalme/beasophiapoet/12">
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
              {["20 poems","PDF","Immediate download"].map(d=>(
                <span key={d} style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",border:"1px solid rgba(17,17,17,.15)",padding:"4px 10px",opacity:.5}}>{d}</span>
              ))}
            </div>
          </ShopCard>

          {/* Writer's Block Pack card — dark */}
          <div style={{flex:"1 1 320px",background:"#100E0C",border:"1px solid rgba(255,255,255,.06)",padding:"48px 40px",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {/* subtle grid lines */}
            <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0px,rgba(255,255,255,.02) 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0px,rgba(255,255,255,.02) 1px,transparent 1px,transparent 40px)",pointerEvents:"none"}}/>

            <span style={{fontSize:9,letterSpacing:".25em",textTransform:"uppercase",background:"#C24B1A",color:"#fff",padding:"4px 10px",marginBottom:20,display:"inline-block",width:"fit-content"}}>
              Interactive Workbook
            </span>
            <h3 style={{fontSize:"clamp(22px,3vw,32px)",fontStyle:"italic",fontWeight:400,color:"#EEE8DC",marginBottom:12,lineHeight:1.2}}>
              The Writer's Block Pack
            </h3>
            <p style={{fontSize:15,lineHeight:1.85,color:"#9A9286",marginBottom:28}}>
              100 Mad-Libs. 200 Ad-Libs. 1,000 prompts. A writing room that doesn't need to know your name. Fill in a blank. Something will surprise you.
            </p>

            {/* live interactive demo */}
            <div style={{borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:24,marginBottom:28,flex:1}}>
              <p style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#9A9286",marginBottom:16,opacity:.6}}>Try it →</p>
              <DemoBlank prompt="The thing I keep almost saying is" placeholder="your word"/>
              <DemoBlank prompt="I write best when I feel" placeholder="your word"/>
            </div>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
              <span style={{fontSize:"clamp(20px,3vw,28px)",fontStyle:"italic",color:"#EEE8DC",opacity:.7}}>£12</span>
              <a href="https://www.paypal.com/paypalme/beasophiapoet/12" target="_blank" rel="noopener noreferrer"
                style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",border:"1px solid rgba(194,75,26,.6)",color:"#C24B1A",padding:"12px 32px",transition:"background .25s,color .25s",display:"inline-block"}}
                onMouseEnter={e=>{e.currentTarget.style.background="#C24B1A";e.currentTarget.style.color="#100E0C";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#C24B1A";}}>
                Buy now
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{borderTop:"1px solid rgba(17,17,17,.06)",padding:"80px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:30,right:"5%",opacity:.04,pointerEvents:"none"}}>
          <Scribble path={SCRIBBLES[7]} size={260} animate={false}/>
        </div>
        <FadeIn style={{maxWidth:600,position:"relative",zIndex:1}}>
          <p style={{fontSize:10,letterSpacing:".28em",textTransform:"uppercase",opacity:.3,marginBottom:20,display:"flex",alignItems:"center",gap:8}}>
            <span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"#111"}}/>
            About
          </p>
          <p style={{fontSize:"clamp(20px,3vw,30px)",fontStyle:"italic",lineHeight:1.55,marginBottom:20}}>
            When I got sick I realised: when people die, all their thoughts die with them.
          </p>
          <p style={{fontSize:16,lineHeight:2,opacity:.4,marginBottom:16}}>
            So I started writing them down — the fragments, the overheard things, the conversations that happened in the wrong order. That became The Page Gallery Journal.
          </p>
          <p style={{fontSize:16,lineHeight:2,opacity:.4,marginBottom:44}}>
            These poems are the second attempt at the same problem.
          </p>
          <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
            <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
              style={{fontSize:11,letterSpacing:".18em",textTransform:"uppercase",opacity:.35,borderBottom:"1px solid rgba(17,17,17,.15)",paddingBottom:3,transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=.8}
              onMouseLeave={e=>e.currentTarget.style.opacity=.35}>Instagram ↗</a>
          </div>
        </FadeIn>
      </section>

      {/* NEWSLETTER */}
      <section style={{borderTop:"1px solid rgba(17,17,17,.06)",padding:"80px 32px",background:"#111",color:"#fff"}}>
        <FadeIn style={{maxWidth:520}}>
          <p style={{fontSize:"clamp(22px,4vw,42px)",fontStyle:"italic",fontWeight:400,lineHeight:1.3,marginBottom:12}}>
            New poems, when they exist.
          </p>
          <p style={{fontSize:15,opacity:.4,lineHeight:1.8,marginBottom:36}}>
            No frequency promises. No newsletter voice. Just the next thing.
          </p>
          {subscribed ? (
            <p style={{fontSize:13,opacity:.5,fontStyle:"italic"}}>You're in.</p>
          ) : (
            <form onSubmit={e=>{e.preventDefault();if(email)setSubscribed(true);}}
              style={{display:"flex",gap:0,flexWrap:"wrap"}}>
              <input
                type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="your@email.com" required
                style={{flex:1,minWidth:200,padding:"14px 16px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",
                  borderRight:"none",color:"#fff",fontSize:14,outline:"none"}}/>
              <button type="submit" className="sub-btn">Subscribe</button>
            </form>
          )}
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,.06)",background:"#111",color:"rgba(255,255,255,.18)",padding:"24px 32px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <span style={{fontSize:11,letterSpacing:".12em"}}>© Bea Sophia {new Date().getFullYear()}</span>
        <span style={{fontSize:11,letterSpacing:".12em"}}>The Page Gallery Journal</span>
      </footer>
    </div>
  );
}
