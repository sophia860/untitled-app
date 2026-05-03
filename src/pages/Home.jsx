import { useState, useEffect, useRef } from "react";

const PHOTO_BEA    = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/4415d70a3_whatsapp_image_1987811375197218.jpg";
const DRAWING_WOLF = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";

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

// ─── CUSTOM CURSOR ────────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x:0, y:0 });
  const ring = useRef({ x:0, y:0 });
  const label = useRef("");
  const labelRef = useRef(null);

  useEffect(() => {
    const move = e => { pos.current = { x:e.clientX, y:e.clientY }; };
    window.addEventListener("mousemove", move);
    let raf;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${pos.current.x}px,${pos.current.y}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}  style={{position:"fixed",top:0,left:0,zIndex:9999,pointerEvents:"none",width:5,height:5,background:"#111",borderRadius:"50%",marginLeft:-2.5,marginTop:-2.5,mixBlendMode:"multiply"}}/>
      <div ref={ringRef} style={{position:"fixed",top:0,left:0,zIndex:9998,pointerEvents:"none",width:36,height:36,border:"1px solid rgba(17,17,17,.25)",borderRadius:"50%",marginLeft:-18,marginTop:-18,transition:"width .3s,height .3s"}}/>
    </>
  );
}

// ─── SCRIBBLE SVG ─────────────────────────────────────────────────
function Scribble({ path, size=120, color="#111", opacity=0.12, delay=0, animate=true }) {
  const id = useRef(`sc-${Math.random().toString(36).slice(2)}`).current;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow:"visible",opacity}}>
      {animate && <style>{`#${id}{stroke-dasharray:300;stroke-dashoffset:300;animation:draw-${id} 1.8s ease ${delay}s forwards}@keyframes draw-${id}{to{stroke-dashoffset:0}}`}</style>}
      <path id={id} d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={animate?{}:{strokeDasharray:"none"}}/>
    </svg>
  );
}

// ─── CORRIDOR CANVAS ──────────────────────────────────────────────
function CorridorCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x:0.5, y:0.5 });
  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas.getContext("2d"); let W,H;
    const resize = () => { W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; };
    resize(); window.addEventListener("resize",resize);
    const onMove = e => { const r=canvas.getBoundingClientRect(); mouseRef.current={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}; };
    canvas.addEventListener("mousemove",onMove);
    let t=0,raf;
    const draw = () => {
      ctx.clearRect(0,0,W,H); ctx.fillStyle="#fff"; ctx.fillRect(0,0,W,H);
      const cx=W/2+(mouseRef.current.x-.5)*30, cy=H/2+(mouseRef.current.y-.5)*20;
      for(let l=0;l<8;l++){const p=l/7,s=.08+p*.42;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(W*(.5-s),0);ctx.moveTo(cx,cy);ctx.lineTo(W*(.5-s),H);ctx.moveTo(cx,cy);ctx.lineTo(W*(.5+s),0);ctx.moveTo(cx,cy);ctx.lineTo(W*(.5+s),H);ctx.strokeStyle=`rgba(17,17,17,${.04+p*.06})`;ctx.lineWidth=.5+p*.5;ctx.stroke();}
      const hy=cy+Math.sin(t*.4)*3; ctx.beginPath();
      for(let x=0;x<W;x+=4){const y=hy+Math.sin(x*.03+t*.5)*2.5;if(!x)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
      ctx.strokeStyle="rgba(17,17,17,.08)";ctx.lineWidth=1;ctx.stroke();
      t+=.012; raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>;
}

// ─── FLOATING WORD ────────────────────────────────────────────────
function FloatingWord({word,x,y,size,opacity,delay}) {
  const ref=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect();}},{threshold:.1});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  return <div ref={ref} style={{position:"absolute",left:`${x}%`,top:`${y}%`,fontSize:`${size}px`,fontStyle:"italic",color:"#111",opacity:v?opacity:0,transform:v?`translateY(0) rotate(${Math.sin(x*.3)*8-4}deg)`:"translateY(10px)",transition:`opacity 1s ease ${delay}s,transform 1s ease ${delay}s`,fontFamily:"'Times New Roman',serif",whiteSpace:"nowrap",pointerEvents:"none",userSelect:"none"}}>{word}</div>;
}

// ─── FADE IN ──────────────────────────────────────────────────────
function FadeIn({children,delay=0,style={}}) {
  const ref=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect();}},{threshold:.08});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(28px)",transition:`opacity .9s ease ${delay}s,transform .9s ease ${delay}s`,...style}}>{children}</div>;
}

// ─── POEM BLOCK ───────────────────────────────────────────────────
function PoemBlock({poem,open,onToggle}) {
  const [lines,setLines]=useState([]);const[hov,setHov]=useState(false);const iRef=useRef(null);
  useEffect(()=>{
    if(open){setLines([]);let i=0;iRef.current=setInterval(()=>{i++;setLines(poem.lines.slice(0,i));if(i>=poem.lines.length)clearInterval(iRef.current);},90);return()=>clearInterval(iRef.current);}
    else setLines([]);
  },[open,poem.lines]);
  return (
    <FadeIn style={{borderTop:"1px solid rgba(17,17,17,.06)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:20,right:"4%",opacity:.04,pointerEvents:"none",transform:"rotate(-8deg)"}}>
        <Scribble path={SCRIBBLES[1]} size={220} animate={false}/>
      </div>
      <div style={{padding:"80px 32px",position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:36}}>
          <div style={{width:38,height:38,borderRadius:"50%",border:"1.5px solid rgba(17,17,17,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,letterSpacing:".06em",flexShrink:0}}>{poem.num}</div>
          <h2 onClick={onToggle} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
            style={{fontSize:"clamp(34px,7vw,90px)",fontWeight:400,fontStyle:"italic",lineHeight:.95,letterSpacing:hov?"0.01em":"-.015em",cursor:"pointer",transition:"opacity .2s,letter-spacing .4s",opacity:hov?.55:1}}>
            {poem.title}
          </h2>
        </div>
        {open ? (
          <div style={{paddingLeft:54}}>
            {lines.map((line,j)=>(
              <p key={j} style={{fontSize:"clamp(16px,2vw,22px)",fontStyle:"italic",lineHeight:1.9,minHeight:"1.9em",opacity:lines.length>j?1:0,transform:lines.length>j?"translateY(0)":"translateY(6px)",transition:"opacity .3s,transform .3s"}}>{line||"\u00a0"}</p>
            ))}
            <button onClick={onToggle} style={{marginTop:32,fontSize:10,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer",opacity:.35,background:"none",border:"none",color:"#111",transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.35}>Close</button>
          </div>
        ) : (
          <div style={{paddingLeft:54}}>
            <p style={{fontSize:17,fontStyle:"italic",opacity:.3,lineHeight:1.9,marginBottom:20}}>{poem.lines[0]}</p>
            <button onClick={onToggle} style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",cursor:"pointer",opacity:.35,background:"none",border:"none",color:"#111",transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.35}>Read the poem →</button>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// ─── DEMO BLANK ───────────────────────────────────────────────────
function DemoBlank({prompt,placeholder}) {
  const [val,setVal]=useState("");const[active,setActive]=useState(false);const[flash,setFlash]=useState(false);const inp=useRef(null);
  return (
    <p style={{fontSize:"clamp(14px,1.8vw,18px)",lineHeight:2,fontFamily:"'EB Garamond','Times New Roman',serif",color:"#EEE8DC",marginBottom:8}}>
      {prompt}
      <span onClick={()=>inp.current.focus()} style={{display:"inline-block",minWidth:100,marginLeft:6,borderBottom:active?"1.5px solid #C24B1A":"1.5px solid rgba(194,75,26,.25)",transition:"border-color .25s",background:flash?"rgba(42,110,74,.2)":"transparent",cursor:"text",paddingBottom:1,position:"relative"}}>
        <input ref={inp} value={val} onChange={e=>setVal(e.target.value)} onFocus={()=>setActive(true)} onBlur={()=>{setActive(false);if(val){setFlash(true);setTimeout(()=>setFlash(false),400);}}} placeholder={placeholder}
          style={{background:"transparent",border:"none",outline:"none",fontFamily:"'Courier Prime','Courier New',monospace",fontSize:"clamp(13px,1.6vw,16px)",color:"#C24B1A",width:Math.max((val.length||placeholder.length)*9+20,90)+"px",minWidth:90,caretColor:"#C24B1A",transition:"width .2s"}}/>
      </span>
    </p>
  );
}

// ─── 3D ROOM CANVAS — the two objects ────────────────────────────
// Room 1: the manuscript (collection)
// Room 2: the door in the dark (writer's block pack)
function RoomCanvas({ room }) {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x:0.5, y:0.5 });
  const hovRef    = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x:(e.clientX-r.left)/r.width, y:(e.clientY-r.top)/r.height };
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseenter", ()=>{ hovRef.current=true; });
    canvas.addEventListener("mouseleave", ()=>{ hovRef.current=false; mouseRef.current={x:.5,y:.5}; });

    let t=0, raf;
    const ease = (a,b,k=.06) => a + (b-a)*k;
    let cx=.5,cy=.5;

    const drawRoom1 = () => {
      // warm off-white room — manuscript on the floor
      cx = ease(cx, mouseRef.current.x);
      cy = ease(cy, mouseRef.current.y);

      const bg = "#F5F0E8";
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

      // perspective walls
      const vx = W*(0.38 + (cx-.5)*.06);
      const vy = H*(0.44 + (cy-.5)*.04);

      // floor
      ctx.beginPath();
      ctx.moveTo(0,H); ctx.lineTo(W,H);
      ctx.lineTo(W*(0.5+(cx-.5)*.1+.48),H*(.5+(cy-.5)*.08));
      ctx.lineTo(vx,vy);
      ctx.lineTo(W*(0.5+(cx-.5)*.1-.48),H*(.5+(cy-.5)*.08));
      ctx.lineTo(0,H);
      ctx.fillStyle="#EDE5D5"; ctx.fill();

      // left wall
      ctx.beginPath();
      ctx.moveTo(0,0); ctx.lineTo(0,H);
      ctx.lineTo(W*(0.5+(cx-.5)*.1-.48),H*(.5+(cy-.5)*.08));
      ctx.lineTo(vx,vy); ctx.lineTo(W*.32,0);
      ctx.fillStyle="#EAE3D2"; ctx.fill();

      // right wall
      ctx.beginPath();
      ctx.moveTo(W,0); ctx.lineTo(W,H);
      ctx.lineTo(W*(0.5+(cx-.5)*.1+.48),H*(.5+(cy-.5)*.08));
      ctx.lineTo(vx,vy); ctx.lineTo(W*.68,0);
      ctx.fillStyle="#E5DCC8"; ctx.fill();

      // ceiling
      ctx.beginPath();
      ctx.moveTo(0,0); ctx.lineTo(W,0); ctx.lineTo(W*.68,0); ctx.lineTo(vx,vy); ctx.lineTo(W*.32,0);
      ctx.fillStyle="#F0EAD8"; ctx.fill();

      // horizon line — pencil thin
      ctx.beginPath(); ctx.moveTo(0,vy); ctx.lineTo(W,vy);
      ctx.strokeStyle="rgba(17,17,17,.06)"; ctx.lineWidth=.8; ctx.stroke();

      // manuscript pages on the floor — scattered
      const pages = [
        { x:.35, y:.72, w:.22, h:.28, rot:-8,  alpha:.92 },
        { x:.42, y:.68, w:.20, h:.26, rot: 3,  alpha:.88 },
        { x:.38, y:.75, w:.18, h:.24, rot:-14, alpha:.8  },
        { x:.47, y:.70, w:.21, h:.27, rot: 7,  alpha:.85 },
        { x:.40, y:.66, w:.17, h:.22, rot:-4,  alpha:.78 },
      ];

      pages.forEach(({ x,y,w,h,rot,alpha },i) => {
        const px = W*(x+(cx-.5)*.04*(i+1)*.3);
        const py = H*(y+(cy-.5)*.03*(i+1)*.3);
        const pw = W*w; const ph = H*h;
        ctx.save();
        ctx.translate(px,py);
        ctx.rotate(rot*Math.PI/180 + Math.sin(t*.2+i)*.008);
        ctx.shadowColor="rgba(0,0,0,.18)"; ctx.shadowBlur=12; ctx.shadowOffsetY=4;
        ctx.fillStyle=`rgba(255,252,244,${alpha})`; ctx.fillRect(-pw/2,-ph/2,pw,ph);
        ctx.shadowColor="transparent";
        // faint text lines on page
        ctx.strokeStyle="rgba(17,17,17,.08)"; ctx.lineWidth=.7;
        const lines = Math.floor(ph/12);
        for(let l=0;l<lines-1;l++){
          const lx=-pw/2+8; const ly=-ph/2+14+l*12;
          const lw = pw-16-(l%3)*8;
          ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx+lw,ly); ctx.stroke();
        }
        ctx.restore();
      });

      // faint scribbled circle on floor — watermark
      ctx.save();
      ctx.translate(W*.43+(cx-.5)*6, H*.78+(cy-.5)*4);
      ctx.rotate(t*.003);
      ctx.strokeStyle="rgba(17,17,17,.04)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.ellipse(0,0,W*.07,W*.035,0,0,Math.PI*2); ctx.stroke();
      ctx.restore();

      // ambient grain
      for(let i=0;i<60;i++){
        const gx=Math.random()*W, gy=Math.random()*H;
        ctx.fillStyle="rgba(17,17,17,.015)";
        ctx.fillRect(gx,gy,1,1);
      }
    };

    const drawRoom2 = () => {
      // absolute darkness — a door glowing
      cx = ease(cx, mouseRef.current.x);
      cy = ease(cy, mouseRef.current.y);

      ctx.fillStyle="#0A0907"; ctx.fillRect(0,0,W,H);

      // door frame — receding perspective
      const vx = W*(.5+(cx-.5)*.04);
      const vy = H*(.5+(cy-.5)*.04);
      const dw = W*.22; const dh = H*.48;
      const dx = vx-dw/2; const dy = vy-dh/2;

      // outer glow
      const grad = ctx.createRadialGradient(vx,vy,0,vx,vy,W*.4);
      grad.addColorStop(0,"rgba(194,75,26,.08)");
      grad.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);

      // door surround — perspective lines
      const outerW = dw*1.6; const outerH = dh*1.3;
      const odx = vx-outerW/2; const ody = vy-outerH/2;
      ctx.strokeStyle="rgba(194,75,26,.15)"; ctx.lineWidth=.8;
      ctx.beginPath();
      ctx.moveTo(odx,ody); ctx.lineTo(dx,dy);
      ctx.moveTo(odx+outerW,ody); ctx.lineTo(dx+dw,dy);
      ctx.moveTo(odx,ody+outerH); ctx.lineTo(dx,dy+dh);
      ctx.moveTo(odx+outerW,ody+outerH); ctx.lineTo(dx+dw,dy+dh);
      ctx.stroke();

      // door frame
      ctx.strokeStyle=`rgba(194,75,26,${.3+Math.sin(t*.4)*.05})`; ctx.lineWidth=1.2;
      ctx.strokeRect(dx,dy,dw,dh);

      // door fill — very dark but slightly warm
      ctx.fillStyle="rgba(16,14,12,.96)"; ctx.fillRect(dx,dy,dw,dh);

      // keyhole glow
      const kx=vx, ky=vy+dh*.25;
      const kg=ctx.createRadialGradient(kx,ky,0,kx,ky,30);
      kg.addColorStop(0,`rgba(194,75,26,${.5+Math.sin(t*.6)*.1})`);
      kg.addColorStop(1,"rgba(194,75,26,0)");
      ctx.fillStyle=kg; ctx.beginPath(); ctx.arc(kx,ky,30,0,Math.PI*2); ctx.fill();
      // keyhole mark
      ctx.fillStyle=`rgba(194,75,26,${.7+Math.sin(t*.6)*.15})`;
      ctx.beginPath(); ctx.arc(kx,ky,4,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(kx-3,ky+4); ctx.lineTo(kx+3,ky+4); ctx.lineTo(kx+2,ky+12); ctx.lineTo(kx-2,ky+12); ctx.closePath(); ctx.fill();

      // floating words rising from below the door
      const words=["sorry","wanting","anything","for years","I understood","do nothing"];
      words.forEach((w,i)=>{
        const wx=dx+dw*.2+i*(dw*.12);
        const wy=dy+dh-((t*8+i*30)%dh);
        const a=Math.min(1,(wy-dy)/60)*Math.min(1,(dy+dh-wy)/60)*0.25;
        ctx.fillStyle=`rgba(238,232,220,${a})`;
        ctx.font=`italic ${10+i%2}px 'Times New Roman',serif`;
        ctx.fillText(w,wx+(cx-.5)*4,wy+(cy-.5)*2);
      });

      // copper hair-lines — the grid behind the dark
      ctx.strokeStyle="rgba(194,75,26,.04)"; ctx.lineWidth=.5;
      for(let i=0;i<6;i++){
        const lx=W*(i/5);
        ctx.beginPath(); ctx.moveTo(lx,0); ctx.lineTo(vx,vy); ctx.lineTo(lx,H); ctx.stroke();
      }
      for(let i=0;i<4;i++){
        const ly=H*(i/3);
        ctx.beginPath(); ctx.moveTo(0,ly); ctx.lineTo(vx,vy); ctx.lineTo(W,ly); ctx.stroke();
      }

      // grain
      for(let i=0;i<80;i++){
        const gx=Math.random()*W,gy=Math.random()*H;
        ctx.fillStyle="rgba(255,255,255,.012)"; ctx.fillRect(gx,gy,1,1);
      }
    };

    const loop = () => {
      if(room===1) drawRoom1();
      else drawRoom2();
      t+=.016; raf=requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[room]);

  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>;
}

// ─── OBJECT ROOM — full viewport encounter ────────────────────────
function ObjectRoom({ room, title, subtitle, price, label, link, demoChildren, textColor="#111", accentColor="#111" }) {
  const [entered, setEntered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting){ setEntered(true); setTimeout(()=>setRevealed(true),600); obs.disconnect(); }},{threshold:.3});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);

  return (
    <div ref={ref} style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",alignItems:"flex-end"}}>
      <RoomCanvas room={room}/>

      {/* text overlay — bottom left */}
      <div style={{
        position:"relative",zIndex:10,
        padding:"0 48px 52px",
        width:"100%",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
        transition:"opacity 1s ease .2s, transform 1s ease .2s",
      }}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
          <div>
            <p style={{fontSize:9,letterSpacing:".28em",textTransform:"uppercase",color:textColor,opacity:.4,marginBottom:10}}>{label}</p>
            <h2 style={{fontSize:"clamp(28px,5vw,64px)",fontStyle:"italic",fontWeight:400,color:textColor,lineHeight:1.0,letterSpacing:"-.02em",marginBottom:8}}>
              {title}
            </h2>
            <p style={{fontSize:14,color:textColor,opacity:.45,lineHeight:1.7,maxWidth:380}}>
              {subtitle}
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:16,paddingBottom:4}}>
            <span style={{fontSize:"clamp(24px,4vw,44px)",fontStyle:"italic",color:textColor,opacity:.6}}>£{price}</span>
            <a href={link} target="_blank" rel="noopener noreferrer"
              style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",color:textColor,
                border:`1px solid ${accentColor}`,padding:"12px 36px",
                transition:"background .3s,color .3s",display:"inline-block"}}
              onMouseEnter={e=>{e.currentTarget.style.background=accentColor;e.currentTarget.style.color=room===2?"#100E0C":"#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=textColor;}}>
              Take it
            </a>
          </div>
        </div>

        {/* demo blanks for room 2 */}
        {demoChildren && (
          <div style={{marginTop:28,borderTop:`1px solid rgba(${room===2?"255,255,255":"17,17,17"},.07)`,paddingTop:20}}>
            {demoChildren}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function Home() {
  const [openPoem,setOpenPoem] = useState(null);
  const [email,setEmail]       = useState("");
  const [subscribed,setSubscribed] = useState(false);
  const [scrollY,setScrollY]   = useState(0);

  useEffect(()=>{
    const fn=()=>setScrollY(window.scrollY);
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  return (
    <div style={{fontFamily:"'Times New Roman',Times,Georgia,serif",overflowX:"hidden",background:"#fff",color:"#111",cursor:"none"}}>
      <Cursor/>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        a,button,input{font-family:inherit;cursor:none}
        a{color:inherit;text-decoration:none}
        img{display:block}
        ::selection{background:#111;color:#fff}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes drift{0%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(1deg)}100%{transform:translateY(0) rotate(-2deg)}}
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"18px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",background:scrollY>60?"rgba(255,255,255,.95)":"transparent",borderBottom:scrollY>60?"1px solid rgba(17,17,17,.07)":"none",backdropFilter:scrollY>60?"blur(8px)":"none",transition:"background .4s,border .4s"}}>
        <span style={{fontSize:12,letterSpacing:".18em",textTransform:"uppercase"}}>Bea Sophia</span>
        <div style={{display:"flex",gap:28}}>
          {[["Poems","#poems"],["Works","#works"],["About","#about"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",opacity:.35,transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.35}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <CorridorCanvas/>
        <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
          {FLOATING_WORDS.slice(0,14).map((word,i)=>(
            <FloatingWord key={i} word={word} x={8+(i*17.3)%82} y={10+(i*23.7)%78} size={10+(i%4)*2} opacity={.1+(i%3)*.04} delay={.3+i*.12}/>
          ))}
        </div>
        <div style={{position:"absolute",top:"15%",left:"8%",animation:"drift 6s ease-in-out infinite"}}>
          <Scribble path={SCRIBBLES[0]} size={100} opacity={.09} delay={.5}/>
        </div>
        <div style={{position:"absolute",bottom:"22%",right:"10%",animation:"drift 7.5s ease-in-out infinite",animationDelay:"1s"}}>
          <Scribble path={SCRIBBLES[3]} size={80} opacity={.07} delay={.8}/>
        </div>
        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 32px",animation:"fadeUp 1.2s ease .4s both",pointerEvents:"none"}}>
          <h1 style={{fontSize:"clamp(32px,6vw,80px)",fontWeight:400,fontStyle:"italic",lineHeight:1.05,letterSpacing:"-.02em",marginBottom:20}}>Bea Sophia</h1>
          <p style={{fontSize:"clamp(13px,1.6vw,18px)",opacity:.5,lineHeight:1.8,fontStyle:"italic",marginBottom:28}}>Poet. The Page Gallery Journal.<br/>New York.</p>
          <p style={{fontSize:11,opacity:.22,letterSpacing:".08em"}}>↓</p>
        </div>
        <div style={{position:"absolute",bottom:32,display:"flex",gap:24,flexWrap:"wrap",justifyContent:"center",animation:"fadeIn 1.5s ease 1.4s both",zIndex:2,padding:"0 20px"}}>
          <a href="#poems" style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",opacity:.4,borderBottom:"1px solid rgba(17,17,17,.3)",paddingBottom:3}}>Read free poems</a>
          <a href="#works" style={{fontSize:10,letterSpacing:".2em",textTransform:"uppercase",opacity:.25,borderBottom:"1px solid rgba(17,17,17,.15)",paddingBottom:3}}>Enter the works</a>
        </div>
      </section>

      </div>

      {/* POEMS */}
      <div id="poems">
        {POEMS.map(poem=>(
          <PoemBlock key={poem.id} poem={poem} open={openPoem===poem.id} onToggle={()=>setOpenPoem(openPoem===poem.id?null:poem.id)}/>
        ))}
      </div>

      {/* WORKS — two immersive rooms */}
      <div id="works">

        {/* divider line + label */}
        <FadeIn style={{padding:"60px 32px 20px",borderTop:"1px solid rgba(17,17,17,.06)"}}>
          <p style={{fontSize:9,letterSpacing:".3em",textTransform:"uppercase",opacity:.25,display:"flex",alignItems:"center",gap:10}}>
            <span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:"#111"}}/>
            The Works — enter a room, find something
          </p>
        </FadeIn>

        {/* Room 1 — The Manuscript */}
        <ObjectRoom
          room={1}
          title="The Only Life"
          subtitle="Twenty poems. New York. The body after the ward. A manuscript left on a floor."
          price="12"
          label="A collection · PDF"
          link="https://www.paypal.com/paypalme/beasophiapoet/12"
          textColor="#111"
          accentColor="rgba(17,17,17,.7)"
        />

        {/* transition line */}
        <div style={{height:2,background:"linear-gradient(90deg,#fff,rgba(17,17,17,.08),#100E0C)",margin:0}}/>

        {/* Room 2 — The Door */}
        <ObjectRoom
          room={2}
          title="The Writer's Block Pack"
          subtitle="100 Mad-Libs. 200 Ad-Libs. 1,000 prompts. A room with no name. Fill in a blank. Something will surprise you."
          price="12"
          label="Interactive workbook"
          link="https://www.paypal.com/paypalme/beasophiapoet/12"
          textColor="#EEE8DC"
          accentColor="#C24B1A"
          demoChildren={
            <div>
              <DemoBlank prompt="The thing I keep almost saying is" placeholder="type here"/>
              <DemoBlank prompt="I write best when I feel" placeholder="type here"/>
            </div>
          }
        />
      </div>

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
          <p style={{fontSize:16,lineHeight:2,opacity:.4,marginBottom:16}}>So I started writing them down — the fragments, the overheard things, the conversations that happened in the wrong order. That became The Page Gallery Journal.</p>
          <p style={{fontSize:16,lineHeight:2,opacity:.4,marginBottom:44}}>These poems are the second attempt at the same problem.</p>
          <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
            style={{fontSize:11,letterSpacing:".18em",textTransform:"uppercase",opacity:.35,borderBottom:"1px solid rgba(17,17,17,.15)",paddingBottom:3,transition:"opacity .2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity=.8} onMouseLeave={e=>e.currentTarget.style.opacity=.35}>Instagram ↗</a>
        </FadeIn>
      </section>

      {/* NEWSLETTER */}
      <section style={{borderTop:"1px solid rgba(17,17,17,.06)",padding:"80px 32px",background:"#111",color:"#fff"}}>
        <FadeIn style={{maxWidth:520}}>
          <p style={{fontSize:"clamp(22px,4vw,42px)",fontStyle:"italic",fontWeight:400,lineHeight:1.3,marginBottom:12}}>New poems, when they exist.</p>
          <p style={{fontSize:15,opacity:.4,lineHeight:1.8,marginBottom:36}}>No frequency promises. No newsletter voice. Just the next thing.</p>
          {subscribed ? (
            <p style={{fontSize:13,opacity:.5,fontStyle:"italic"}}>You're in.</p>
          ) : (
            <form onSubmit={e=>{e.preventDefault();if(email)setSubscribed(true);}} style={{display:"flex",gap:0,flexWrap:"wrap"}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required
                style={{flex:1,minWidth:200,padding:"14px 16px",background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",borderRight:"none",color:"#fff",fontSize:14,outline:"none"}}/>
              <button type="submit" style={{background:"#fff",color:"#111",border:"none",padding:"14px 24px",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=.7} onMouseLeave={e=>e.currentTarget.style.opacity=1}>Subscribe</button>
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
