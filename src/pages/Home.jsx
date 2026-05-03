import { useState, useEffect, useRef } from "react";

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
  "M 50 50 C 55 45, 62 44, 65 50 C 68 56, 63 65, 55 67 C 44 70, 35 62, 33 52 C 31 40, 40 30, 52 28 C 66 26, 76 36, 78 50",
  "M 50 10 C 52 28, 60 35, 80 35 C 65 42, 68 52, 78 68 C 62 55, 50 60, 38 70 C 44 52, 40 42, 22 38 C 42 36, 46 26, 50 10",
];

// ─── CUSTOM CURSOR ────────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos  = useRef({ x:0, y:0 });
  const ring = useRef({ x:0, y:0 });
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
      <div ref={dotRef}  style={{position:"fixed",top:0,left:0,zIndex:9999,pointerEvents:"none",width:5,height:5,background:"#1a1a18",borderRadius:"50%",marginLeft:-2.5,marginTop:-2.5,mixBlendMode:"multiply"}}/>
      <div ref={ringRef} style={{position:"fixed",top:0,left:0,zIndex:9998,pointerEvents:"none",width:36,height:36,border:"1px solid rgba(26,26,24,.2)",borderRadius:"50%",marginLeft:-18,marginTop:-18}}/>
    </>
  );
}

// ─── SCRIBBLE ─────────────────────────────────────────────────────
function Scribble({ path, size=120, color="#1a1a18", opacity=0.10, animate=false }) {
  const id = useRef(`sc-${Math.random().toString(36).slice(2)}`).current;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow:"visible",opacity}}>
      {animate && <style>{`#${id}{stroke-dasharray:300;stroke-dashoffset:300;animation:draw-${id} 2s ease .5s forwards}@keyframes draw-${id}{to{stroke-dashoffset:0}}`}</style>}
      <path id={id} d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={animate?{}:{strokeDasharray:"none"}}/>
    </svg>
  );
}

// ─── FADE IN ──────────────────────────────────────────────────────
function FadeIn({children,delay=0,style={}}) {
  const ref=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect();}},{threshold:.08});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(22px)",transition:`opacity .9s ease ${delay}s,transform .9s ease ${delay}s`,...style}}>{children}</div>;
}

// ─── POEM BLOCK ───────────────────────────────────────────────────
function PoemBlock({poem,open,onToggle}) {
  const [lines,setLines]=useState([]);const[hov,setHov]=useState(false);const iRef=useRef(null);
  useEffect(()=>{
    if(open){setLines([]);let i=0;iRef.current=setInterval(()=>{i++;setLines(poem.lines.slice(0,i));if(i>=poem.lines.length)clearInterval(iRef.current);},90);return()=>clearInterval(iRef.current);}
    else setLines([]);
  },[open,poem.lines]);
  return (
    <FadeIn style={{borderTop:"1px solid rgba(26,26,24,.07)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:20,right:"4%",opacity:.04,pointerEvents:"none",transform:"rotate(-8deg)"}}>
        <Scribble path={SCRIBBLES[1]} size={220}/>
      </div>
      <div style={{padding:"80px 32px",position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:36}}>
          <div style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(26,26,24,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,letterSpacing:".08em",flexShrink:0,color:"rgba(26,26,24,.5)"}}>{poem.num}</div>
          <h2 onClick={onToggle} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
            style={{fontSize:"clamp(30px,6.5vw,88px)",fontWeight:400,fontStyle:"italic",lineHeight:.95,
              letterSpacing:hov?"0.01em":"-.015em",cursor:"pointer",
              transition:"opacity .25s,letter-spacing .5s",opacity:hov?.5:1,color:"#1a1a18"}}>
            {poem.title}
          </h2>
        </div>
        {open ? (
          <div style={{paddingLeft:52}}>
            {lines.map((line,j)=>(
              <p key={j} style={{fontSize:"clamp(15px,1.9vw,21px)",fontStyle:"italic",lineHeight:1.95,minHeight:"1.95em",
                opacity:lines.length>j?1:0,transform:lines.length>j?"translateY(0)":"translateY(5px)",
                transition:"opacity .28s,transform .28s",color:"#1a1a18"}}>{line||"\u00a0"}</p>
            ))}
            <button onClick={onToggle} style={{marginTop:32,fontSize:9,letterSpacing:".22em",textTransform:"uppercase",
              cursor:"pointer",opacity:.3,background:"none",border:"none",color:"#1a1a18",transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=.8} onMouseLeave={e=>e.currentTarget.style.opacity=.3}>Close</button>
          </div>
        ) : (
          <div style={{paddingLeft:52}}>
            <p style={{fontSize:16,fontStyle:"italic",opacity:.28,lineHeight:1.95,marginBottom:20,color:"#1a1a18"}}>{poem.lines[0]}</p>
            <button onClick={onToggle} style={{fontSize:9,letterSpacing:".22em",textTransform:"uppercase",
              cursor:"pointer",opacity:.3,background:"none",border:"none",color:"#1a1a18",transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=.8} onMouseLeave={e=>e.currentTarget.style.opacity=.3}>Read the poem →</button>
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
    <p style={{fontSize:"clamp(14px,1.7vw,17px)",lineHeight:2.1,fontFamily:"'EB Garamond','Times New Roman',serif",color:"#EEE8DC",marginBottom:6}}>
      {prompt}
      <span onClick={()=>inp.current.focus()} style={{display:"inline-block",minWidth:90,marginLeft:6,
        borderBottom:active?"1.5px solid #C24B1A":"1.5px solid rgba(194,75,26,.22)",
        transition:"border-color .25s",background:flash?"rgba(42,110,74,.18)":"transparent",cursor:"text",paddingBottom:1}}>
        <input ref={inp} value={val} onChange={e=>setVal(e.target.value)}
          onFocus={()=>setActive(true)}
          onBlur={()=>{setActive(false);if(val){setFlash(true);setTimeout(()=>setFlash(false),400);}}}
          placeholder={placeholder}
          style={{background:"transparent",border:"none",outline:"none",
            fontFamily:"'Courier Prime','Courier New',monospace",
            fontSize:"clamp(12px,1.5vw,15px)",color:"#C24B1A",
            width:Math.max((val.length||placeholder.length)*9+20,80)+"px",
            minWidth:80,caretColor:"#C24B1A",transition:"width .18s"}}/>
      </span>
    </p>
  );
}

// ─── CONTINUOUS LINE HERO ─────────────────────────────────────────
// A single organic SVG path that draws itself, with poem words anchored at specific points.
// Mouse shifts the whole composition gently.
function LineHero() {
  const svgRef   = useRef(null);
  const pathRef  = useRef(null);
  const mouseRef = useRef({ x:0, y:0 });
  const [drawn, setDrawn] = useState(false);
  const [wordsVisible, setWordsVisible] = useState(false);

  // Word anchors: position as % of SVG viewBox (0 0 800 600), plus label offset direction
  const ANCHORS = [
    { word:"four times",       cx:182, cy:148, dx:-90, dy:-18,  delay:2.6 },
    { word:"I said sorry",     cx:310, cy:108, dx: 18, dy:-28,  delay:3.0 },
    { word:"for wanting",      cx:490, cy:155, dx: 22, dy:-20,  delay:3.4 },
    { word:"you.",             cx:618, cy:220, dx: 22, dy: 0,   delay:3.8 },
    { word:"you said anything",cx:500, cy:310, dx: 22, dy: 14,  delay:4.2 },
    { word:"eleven twenty-eight", cx:310, cy:368, dx:-12, dy: 28, delay:4.6 },
    { word:"for years",        cx:200, cy:440, dx:-72, dy: 10,  delay:5.0 },
    { word:"and not know",     cx:380, cy:490, dx: 18, dy: 24,  delay:5.4 },
    { word:"the difference.",  cx:550, cy:450, dx: 22, dy: 8,   delay:5.8 },
  ];

  // The single continuous organic path — handcrafted curve
  const PATH = `
    M 150,160
    C 160,120 180,100 210,108
    C 260,118 310,90  370,96
    C 430,102 480,128 520,148
    C 570,172 620,210 638,228
    C 660,250 648,290 610,308
    C 570,328 520,318 490,322
    C 450,328 410,355 370,370
    C 330,385 280,382 250,390
    C 210,400 188,420 192,445
    C 196,468 218,478 250,484
    C 290,492 340,490 388,492
    C 440,496 500,488 545,468
    C 590,448 618,420 630,400
    C 640,382 628,360 610,352
  `;

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray  = len;
    path.style.strokeDashoffset = len;

    // trigger draw after a short pause
    const t1 = setTimeout(() => {
      path.style.transition = `stroke-dashoffset 3.2s cubic-bezier(0.16,1,0.3,1)`;
      path.style.strokeDashoffset = 0;
      setDrawn(true);
    }, 400);

    const t2 = setTimeout(() => setWordsVisible(true), 2200);

    // subtle mouse parallax on the whole SVG
    const move = e => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 14,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      };
      if (svgRef.current) {
        svgRef.current.style.transform = `translate(${mouseRef.current.x}px,${mouseRef.current.y}px)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("mousemove", move); };
  }, []);

  return (
    <section style={{
      position:"relative", height:"100vh", overflow:"hidden",
      background:"#F5F0E8", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
    }}>
      {/* top nav line — thin rule like the reference */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"rgba(26,26,24,.12)"}}/>

      {/* SVG composition */}
      <div style={{position:"relative",width:"min(800px,92vw)",height:"min(600px,70vh)"}}>
        <svg
          ref={svgRef}
          viewBox="0 0 800 600"
          style={{width:"100%",height:"100%",overflow:"visible",transition:"transform .8s cubic-bezier(.16,1,.3,1)"}}
          aria-hidden="true">

          {/* the single continuous line */}
          <path
            ref={pathRef}
            d={PATH}
            fill="none"
            stroke="#8C8880"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* dot at each anchor */}
          {ANCHORS.map((a,i) => (
            <circle key={i} cx={a.cx} cy={a.cy} r="2.2"
              fill="#8C8880"
              opacity={wordsVisible ? 0.6 : 0}
              style={{transition:`opacity .4s ease ${a.delay}s`}}/>
          ))}

          {/* connector ticks — small line from dot to label */}
          {ANCHORS.map((a,i) => (
            <line key={i}
              x1={a.cx} y1={a.cy}
              x2={a.cx + a.dx * 0.4} y2={a.cy + a.dy * 0.4}
              stroke="#8C8880" strokeWidth="0.8"
              opacity={wordsVisible ? 0.4 : 0}
              style={{transition:`opacity .4s ease ${a.delay}s`}}/>
          ))}
        </svg>

        {/* word labels — absolutely positioned over the SVG */}
        {ANCHORS.map((a, i) => {
          // convert viewBox coords to % of container
          const left = (a.cx / 800 * 100) + "%";
          const top  = (a.cy / 600 * 100) + "%";
          return (
            <div key={i} style={{
              position:"absolute",
              left, top,
              transform:`translate(${a.dx}px,${a.dy}px) translateY(-50%)`,
              fontFamily:"'Times New Roman',Times,serif",
              fontStyle:"italic",
              fontSize:"clamp(11px,1.4vw,16px)",
              color:"#1a1a18",
              whiteSpace:"nowrap",
              opacity: wordsVisible ? 1 : 0,
              transition:`opacity .7s ease ${a.delay}s`,
              pointerEvents:"none",
              userSelect:"none",
              letterSpacing:"-.01em",
            }}>{a.word}</div>
          );
        })}
      </div>

      {/* title — bottom left, understated */}
      <div style={{
        position:"absolute", bottom:48, left:40,
        opacity: drawn ? 1 : 0, transition:"opacity 1s ease 2s",
      }}>
        <p style={{fontSize:11,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(26,26,24,.35)",marginBottom:6}}>Bea Sophia</p>
        <p style={{fontSize:10,letterSpacing:".16em",textTransform:"uppercase",color:"rgba(26,26,24,.2)"}}>Poet · The Page Gallery Journal · New York</p>
      </div>

      {/* nav links — bottom right */}
      <div style={{
        position:"absolute", bottom:48, right:40,
        display:"flex", gap:20,
        opacity: drawn ? 1 : 0, transition:"opacity 1s ease 2.4s",
      }}>
        <a href="#poems" style={{fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(26,26,24,.35)",borderBottom:"1px solid rgba(26,26,24,.2)",paddingBottom:2,transition:"color .2s"}}
          onMouseEnter={e=>e.currentTarget.style.color="rgba(26,26,24,.8)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(26,26,24,.35)"}>Poems</a>
        <a href="#works" style={{fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(26,26,24,.35)",borderBottom:"1px solid rgba(26,26,24,.2)",paddingBottom:2,transition:"color .2s"}}
          onMouseEnter={e=>e.currentTarget.style.color="rgba(26,26,24,.8)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(26,26,24,.35)"}>Works</a>
      </div>

      {/* bottom rule */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"rgba(26,26,24,.08)"}}/>
    </section>
  );
}

// ─── 3D ROOM CANVAS ───────────────────────────────────────────────
function RoomCanvas({ room }) {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x:0.5, y:0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const onMove = e => { const r=canvas.getBoundingClientRect(); mouseRef.current={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}; };
    canvas.addEventListener("mousemove", onMove);

    let t=0, raf;
    let cx=.5, cy=.5;
    const ease=(a,b,k=.06)=>a+(b-a)*k;

    const drawRoom1 = () => {
      cx=ease(cx,mouseRef.current.x); cy=ease(cy,mouseRef.current.y);
      ctx.fillStyle="#F0EAD8"; ctx.fillRect(0,0,W,H);
      const vx=W*(.38+(cx-.5)*.06), vy=H*(.44+(cy-.5)*.04);
      // floor
      ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(W,H);
      ctx.lineTo(W*(.98),H*(.55+(cy-.5)*.08)); ctx.lineTo(vx,vy);
      ctx.lineTo(W*(.02),H*(.55+(cy-.5)*.08)); ctx.lineTo(0,H);
      ctx.fillStyle="#EDE5D5"; ctx.fill();
      // left wall
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,H);
      ctx.lineTo(W*.02,H*(.55+(cy-.5)*.08)); ctx.lineTo(vx,vy); ctx.lineTo(W*.30,0);
      ctx.fillStyle="#EAE3D2"; ctx.fill();
      // right wall
      ctx.beginPath(); ctx.moveTo(W,0); ctx.lineTo(W,H);
      ctx.lineTo(W*.98,H*(.55+(cy-.5)*.08)); ctx.lineTo(vx,vy); ctx.lineTo(W*.70,0);
      ctx.fillStyle="#E5DCC8"; ctx.fill();
      // manuscript pages
      const pages=[{x:.34,y:.70,w:.22,h:.26,rot:-8,a:.93},{x:.41,y:.66,w:.20,h:.25,rot:3,a:.88},{x:.37,y:.73,w:.18,h:.23,rot:-14,a:.80},{x:.46,y:.68,w:.21,h:.26,rot:7,a:.85}];
      pages.forEach(({x,y,w,h,rot,a},i)=>{
        const px=W*(x+(cx-.5)*.04*(i+1)*.3), py=H*(y+(cy-.5)*.03*(i+1)*.3);
        ctx.save(); ctx.translate(px,py); ctx.rotate(rot*Math.PI/180+Math.sin(t*.2+i)*.007);
        ctx.shadowColor="rgba(0,0,0,.15)"; ctx.shadowBlur=10; ctx.shadowOffsetY=3;
        ctx.fillStyle=`rgba(255,252,244,${a})`; ctx.fillRect(-W*w/2,-H*h/2,W*w,H*h);
        ctx.shadowColor="transparent";
        ctx.strokeStyle="rgba(26,26,24,.07)"; ctx.lineWidth=.6;
        const lc=Math.floor(H*h/11);
        for(let l=0;l<lc-1;l++){const lx=-W*w/2+8,ly=-H*h/2+12+l*11,lw=W*w-16-(l%3)*8;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+lw,ly);ctx.stroke();}
        ctx.restore();
      });
      for(let i=0;i<40;i++){ctx.fillStyle="rgba(26,26,24,.012)";ctx.fillRect(Math.random()*W,Math.random()*H,1,1);}
    };

    const drawRoom2 = () => {
      cx=ease(cx,mouseRef.current.x); cy=ease(cy,mouseRef.current.y);
      ctx.fillStyle="#0A0907"; ctx.fillRect(0,0,W,H);
      const vx=W*(.5+(cx-.5)*.04), vy=H*(.5+(cy-.5)*.04);
      const dw=W*.22, dh=H*.48, dx=vx-dw/2, dy=vy-dh/2;
      const g=ctx.createRadialGradient(vx,vy,0,vx,vy,W*.38);
      g.addColorStop(0,"rgba(194,75,26,.09)"); g.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      const ow=dw*1.6,oh=dh*1.3,odx=vx-ow/2,ody=vy-oh/2;
      ctx.strokeStyle="rgba(194,75,26,.12)"; ctx.lineWidth=.7;
      ctx.beginPath(); ctx.moveTo(odx,ody); ctx.lineTo(dx,dy); ctx.moveTo(odx+ow,ody); ctx.lineTo(dx+dw,dy);
      ctx.moveTo(odx,ody+oh); ctx.lineTo(dx,dy+dh); ctx.moveTo(odx+ow,ody+oh); ctx.lineTo(dx+dw,dy+dh); ctx.stroke();
      ctx.strokeStyle=`rgba(194,75,26,${.28+Math.sin(t*.4)*.04})`; ctx.lineWidth=1.1;
      ctx.strokeRect(dx,dy,dw,dh);
      ctx.fillStyle="rgba(16,14,12,.96)"; ctx.fillRect(dx,dy,dw,dh);
      const kx=vx, ky=vy+dh*.24;
      const kg=ctx.createRadialGradient(kx,ky,0,kx,ky,28);
      kg.addColorStop(0,`rgba(194,75,26,${.45+Math.sin(t*.6)*.1})`); kg.addColorStop(1,"rgba(194,75,26,0)");
      ctx.fillStyle=kg; ctx.beginPath(); ctx.arc(kx,ky,28,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=`rgba(194,75,26,${.65+Math.sin(t*.6)*.12})`;
      ctx.beginPath(); ctx.arc(kx,ky,3.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(kx-2.5,ky+3.5); ctx.lineTo(kx+2.5,ky+3.5); ctx.lineTo(kx+2,ky+11); ctx.lineTo(kx-2,ky+11); ctx.closePath(); ctx.fill();
      const words=["sorry","wanting","anything","for years","eleven twenty-eight"];
      words.forEach((w,i)=>{
        const wx=dx+dw*.15+i*(dw*.14); const wy=dy+dh-((t*7+i*28)%dh);
        const a=Math.min(1,(wy-dy)/50)*Math.min(1,(dy+dh-wy)/50)*.22;
        ctx.fillStyle=`rgba(238,232,220,${a})`; ctx.font=`italic ${10+i%2}px 'Times New Roman',serif`;
        ctx.fillText(w,wx+(cx-.5)*3,wy+(cy-.5)*2);
      });
      for(let i=0;i<6;i++){ctx.strokeStyle="rgba(194,75,26,.035)";ctx.lineWidth=.4;const lx=W*(i/5);ctx.beginPath();ctx.moveTo(lx,0);ctx.lineTo(vx,vy);ctx.lineTo(lx,H);ctx.stroke();}
      for(let i=0;i<70;i++){ctx.fillStyle="rgba(255,255,255,.01)";ctx.fillRect(Math.random()*W,Math.random()*H,1,1);}
    };

    const loop=()=>{ if(room===1)drawRoom1();else drawRoom2(); t+=.016; raf=requestAnimationFrame(loop); };
    loop();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  },[room]);

  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>;
}

// ─── OBJECT ROOM ──────────────────────────────────────────────────
function ObjectRoom({ room, title, subtitle, price, label, link, demoChildren, textColor="#1a1a18", accentColor="rgba(26,26,24,.6)" }) {
  const [revealed,setRevealed]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setTimeout(()=>setRevealed(true),500);obs.disconnect();}},{threshold:.25});
    if(ref.current)obs.observe(ref.current); return()=>obs.disconnect();
  },[]);
  return (
    <div ref={ref} style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",alignItems:"flex-end"}}>
      <RoomCanvas room={room}/>
      <div style={{position:"relative",zIndex:10,padding:"0 48px 52px",width:"100%",opacity:revealed?1:0,transform:revealed?"translateY(0)":"translateY(18px)",transition:"opacity 1s ease .2s,transform 1s ease .2s"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
          <div>
            <p style={{fontSize:9,letterSpacing:".28em",textTransform:"uppercase",color:textColor,opacity:.35,marginBottom:8}}>{label}</p>
            <h2 style={{fontSize:"clamp(26px,4.5vw,60px)",fontStyle:"italic",fontWeight:400,color:textColor,lineHeight:1.0,letterSpacing:"-.02em",marginBottom:8}}>{title}</h2>
            <p style={{fontSize:14,color:textColor,opacity:.42,lineHeight:1.75,maxWidth:360}}>{subtitle}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:14,paddingBottom:4}}>
            <span style={{fontSize:"clamp(22px,3.5vw,40px)",fontStyle:"italic",color:textColor,opacity:.55}}>£{price}</span>
            <a href={link} target="_blank" rel="noopener noreferrer"
              style={{fontSize:9,letterSpacing:".24em",textTransform:"uppercase",color:textColor,border:`1px solid ${accentColor}`,padding:"11px 34px",transition:"background .3s,color .3s",display:"inline-block"}}
              onMouseEnter={e=>{e.currentTarget.style.background=room===2?"#C24B1A":"#1a1a18";e.currentTarget.style.color=room===2?"#100E0C":"#F5F0E8";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=textColor;}}>
              Take it
            </a>
          </div>
        </div>
        {demoChildren && (
          <div style={{marginTop:24,borderTop:`1px solid rgba(${room===2?"255,255,255":"26,26,24"},.07)`,paddingTop:18}}>{demoChildren}</div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function Home() {
  const [openPoem,setOpenPoem]=useState(null);
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);
  const [scrollY,setScrollY]=useState(0);

  useEffect(()=>{
    const fn=()=>setScrollY(window.scrollY);
    window.addEventListener("scroll",fn,{passive:true});
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  return (
    <div style={{fontFamily:"'Times New Roman',Times,Georgia,serif",overflowX:"hidden",background:"#F5F0E8",color:"#1a1a18",cursor:"none"}}>
      <Cursor/>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        a,button,input{font-family:inherit;cursor:none}
        a{color:inherit;text-decoration:none}
        img{display:block}
        ::selection{background:#1a1a18;color:#F5F0E8}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes drift{0%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-7px) rotate(1deg)}100%{transform:translateY(0) rotate(-2deg)}}
      `}</style>

      {/* NAV — fixed, minimal */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"16px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",
        background:scrollY>80?"rgba(245,240,232,.95)":"transparent",
        borderBottom:scrollY>80?"1px solid rgba(26,26,24,.08)":"none",
        backdropFilter:scrollY>80?"blur(10px)":"none",
        transition:"background .5s,border .5s"}}>
        <span style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(26,26,24,.5)"}}>Bea Sophia</span>
        <div style={{display:"flex",gap:28}}>
          {[["Poems","#poems"],["Works","#works"],["About","#about"]].map(([l,h])=>(
            <a key={l} href={h} style={{fontSize:9,letterSpacing:".22em",textTransform:"uppercase",opacity:.3,transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=.9} onMouseLeave={e=>e.currentTarget.style.opacity=.3}>{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO — continuous line drawing */}
      <LineHero/>

      {/* POEMS */}
      <div id="poems" style={{background:"#F5F0E8"}}>
        {POEMS.map(poem=>(
          <PoemBlock key={poem.id} poem={poem} open={openPoem===poem.id} onToggle={()=>setOpenPoem(openPoem===poem.id?null:poem.id)}/>
        ))}
      </div>

      {/* WORKS */}
      <div id="works">
        <FadeIn style={{padding:"56px 32px 16px",borderTop:"1px solid rgba(26,26,24,.07)",background:"#F5F0E8"}}>
          <p style={{fontSize:9,letterSpacing:".3em",textTransform:"uppercase",opacity:.22,display:"flex",alignItems:"center",gap:10}}>
            <span style={{display:"inline-block",width:4,height:4,borderRadius:"50%",background:"#1a1a18"}}/>
            The Works
          </p>
        </FadeIn>

        {/* Room 1 — manuscript on a floor */}
        <ObjectRoom
          room={1}
          title="The Only Life"
          subtitle="Twenty poems. New York. The body after the ward. A manuscript left on a floor."
          price="12"
          label="A collection · PDF"
          link="https://www.paypal.com/paypalme/beasophiapoet/12"
          textColor="#1a1a18"
          accentColor="rgba(26,26,24,.5)"
        />

        {/* gradient seam */}
        <div style={{height:2,background:"linear-gradient(90deg,#F5F0E8,rgba(26,26,24,.06),#0A0907)"}}/>

        {/* Room 2 — door in the dark */}
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
      <section id="about" style={{borderTop:"1px solid rgba(26,26,24,.07)",padding:"80px 32px",background:"#F5F0E8",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:30,right:"5%",opacity:.04,pointerEvents:"none"}}>
          <Scribble path={SCRIBBLES[3]} size={260}/>
        </div>
        <FadeIn style={{maxWidth:580,position:"relative",zIndex:1}}>
          <p style={{fontSize:9,letterSpacing:".28em",textTransform:"uppercase",opacity:.28,marginBottom:22,display:"flex",alignItems:"center",gap:8}}>
            <span style={{display:"inline-block",width:4,height:4,borderRadius:"50%",background:"#1a1a18"}}/>
            About
          </p>
          <p style={{fontSize:"clamp(19px,2.8vw,28px)",fontStyle:"italic",lineHeight:1.55,marginBottom:18}}>
            When I got sick I realised: when people die, all their thoughts die with them.
          </p>
          <p style={{fontSize:15,lineHeight:2,opacity:.38,marginBottom:14}}>
            So I started writing them down — the fragments, the overheard things, the conversations that happened in the wrong order. That became The Page Gallery Journal.
          </p>
          <p style={{fontSize:15,lineHeight:2,opacity:.38,marginBottom:44}}>
            These poems are the second attempt at the same problem.
          </p>
          <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
            style={{fontSize:9,letterSpacing:".22em",textTransform:"uppercase",opacity:.28,borderBottom:"1px solid rgba(26,26,24,.18)",paddingBottom:2,transition:"opacity .2s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity=.7} onMouseLeave={e=>e.currentTarget.style.opacity=.28}>Instagram ↗</a>
        </FadeIn>
      </section>

      {/* NEWSLETTER */}
      <section style={{borderTop:"1px solid rgba(26,26,24,.07)",padding:"80px 32px",background:"#1a1a18",color:"#F5F0E8"}}>
        <FadeIn style={{maxWidth:500}}>
          <p style={{fontSize:"clamp(20px,3.8vw,40px)",fontStyle:"italic",fontWeight:400,lineHeight:1.3,marginBottom:10}}>New poems, when they exist.</p>
          <p style={{fontSize:14,opacity:.36,lineHeight:1.85,marginBottom:32}}>No frequency promises. No newsletter voice. Just the next thing.</p>
          {subscribed ? (
            <p style={{fontSize:12,opacity:.4,fontStyle:"italic"}}>You're in.</p>
          ) : (
            <form onSubmit={e=>{e.preventDefault();if(email)setSubscribed(true);}} style={{display:"flex",flexWrap:"wrap"}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required
                style={{flex:1,minWidth:190,padding:"13px 14px",background:"rgba(245,240,232,.06)",border:"1px solid rgba(245,240,232,.15)",borderRight:"none",color:"#F5F0E8",fontSize:13,outline:"none"}}/>
              <button type="submit"
                style={{background:"#F5F0E8",color:"#1a1a18",border:"none",padding:"13px 22px",fontSize:9,letterSpacing:".22em",textTransform:"uppercase",transition:"opacity .2s"}}
                onMouseEnter={e=>e.currentTarget.style.opacity=.7} onMouseLeave={e=>e.currentTarget.style.opacity=1}>Subscribe</button>
            </form>
          )}
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid rgba(245,240,232,.06)",background:"#1a1a18",color:"rgba(245,240,232,.16)",padding:"22px 32px",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <span style={{fontSize:10,letterSpacing:".12em"}}>© Bea Sophia {new Date().getFullYear()}</span>
        <span style={{fontSize:10,letterSpacing:".12em"}}>The Page Gallery Journal</span>
      </footer>
    </div>
  );
}
