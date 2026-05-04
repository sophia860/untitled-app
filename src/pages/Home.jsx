import { useState, useEffect, useRef } from "react";

const POEMS = [
  {
    id: 1, num: "01", title: "INBOUND",
    lines: [
      "Newark airport smells like carpet cleaner",
      "and the specific anxiety of people who are almost somewhere.",
      "",
      "I have one bag checked and one theory about myself",
      "I'm not ready to test yet.",
      "",
      "The woman at passport control asks the purpose of my visit.",
      "I say: to live here.",
      "She stamps the page.",
      "Doesn't look up.",
      "",
      "The stamp dries while I'm still standing there.",
    ],
  },
  {
    id: 2, num: "02", title: "INVENTORY, BROOKLYN, WEEK ONE",
    lines: [
      "Things present:",
      "one mattress, one window facing a wall,",
      "a previous tenant's fork in the drawer,",
      "a roach trap behind the fridge",
      "that has been there long enough to become infrastructure.",
      "",
      "Things absent:",
      "the ward.",
      "The consultant's voice saying we'll monitor and see.",
      "The fluorescent light that meant bad news",
      "was on its way through the door in a paper folder.",
      "",
      "I eat off the previous tenant's fork for a week",
      "before I buy my own.",
      "Nobody is tracking this.",
      "It seems fine.",
    ],
  },
  {
    id: 3, num: "03", title: "FIRST MORNING, BROOKLYN",
    lines: [
      "There is a rat on the subway grate at 7am",
      "eating something I cannot identify",
      "with the focused dignity",
      "of someone who has survived considerable difficulty.",
      "",
      "A man in a suit steps around it without breaking stride.",
      "A child points. The mother pulls the child away.",
      "The rat finishes what it was eating.",
      "Then it is gone —",
      "into the machinery that runs beneath the part",
      "everyone photographs.",
      "",
      "I feel, for the first time in two years,",
      "genuinely less alone.",
    ],
  },
  {
    id: 4, num: "04", title: "WHAT I BROUGHT",
    lines: [
      "One habit of checking the door twice.",
      "One reflex that fires when a phone rings —",
      "the quick arithmetic: what time is it there,",
      "who is calling,",
      "is this the one.",
      "",
      "I brought the books he dropped.",
      "I know. I'm working on it.",
      "",
      "I left the ward.",
      "I left the consultant saying monitoring",
      "like it was a kindness.",
      "I left the October that was a brand",
      "while I was an itemised bill.",
      "",
      "I brought the part that kept writing anyway.",
      "Bile with punctuation.",
      "The only thing I packed that I actually need.",
    ],
  },
  {
    id: 5, num: "05", title: "RANNOCH MOOR",
    lines: [
      "Eighty-two percent water.",
      "That is not poetry — that is the geological survey.",
      "The ground is mostly not ground.",
      "You walk on the skin of something",
      "that has not decided to be land yet",
      "and may never.",
      "",
      "The sundew grows here —",
      "a carnivorous plant",
      "the size of a ten-pence piece,",
      "its leaves ringed with red hairs",
      "that glisten and grip",
      "and do not let go.",
      "",
      "It doesn't eat large things.",
      "Midges mostly.",
      "Whatever lands and doesn't read the signs.",
      "",
      "I walked three miles out from the road",
      "and sat on a rock that was mostly dry",
      "and ate a cereal bar",
      "and watched a red deer on the far ridge",
      "doing nothing in particular",
      "for a very long time.",
      "",
      "Neither of us was performing.",
      "Neither of us needed to be somewhere else.",
      "",
      "The bog kept its water.",
      "The sundew kept what it caught.",
      "I kept what I came with.",
      "",
      "That was the whole afternoon.",
      "That was enough of a life for one day.",
    ],
  },
  {
    id: 6, num: "06", title: "TAXONOMY OF SURVIVING THINGS",
    lines: [
      "The weed splitting the kerb on Atlantic Avenue:",
      "genus unknown, ambitions clear.",
      "",
      "The ginkgo outside the laundromat on 7th:",
      "survives everything, smells briefly in autumn",
      "like the city is confessing something it shouldn't.",
      "",
      "The sparrow eating a french fry on the A train platform:",
      "no comment necessary.",
      "",
      "The moss on the fire escape railing:",
      "patient, damp, committed to the project.",
      "",
      "The fig tree growing from the crack in the brownstone wall on Dean Street:",
      "I stop every time.",
      "Every time I stop.",
      "There is something here I refuse to name",
      "because the tree is already saying it",
      "and it doesn't need my help.",
    ],
  },
  {
    id: 7, num: "07", title: "THE BUACHAILLE",
    lines: [
      "Buachaille Etive Mòr stands at the entrance to Glencoe",
      "like something that has been asked no questions",
      "and intends to keep it that way.",
      "",
      "Nine hundred and fifty metres.",
      "The quartzite pale in the morning light —",
      "not quite white, not quite grey,",
      "the colour of a thing that has been here",
      "so much longer than anything",
      "that it stopped tracking time",
      "around the Devonian period.",
      "",
      "I stood at the foot of it once in November",
      "with the cloud coming in from the west",
      "and the rain already decided",
      "and a sandwich I hadn't started yet",
      "and thought about nothing for four minutes —",
      "not the ward,",
      "not the consultant,",
      "not the phone call I'd had in the car park",
      "before I drove here.",
      "",
      "Four minutes is longer than it sounds",
      "when your brain normally bills you",
      "for every second of silence.",
      "",
      "The cloud came in.",
      "I ate the sandwich.",
      "The Buachaille didn't move.",
    ],
  },
  {
    id: 8, num: "08", title: "WHAT GROWS IN CONCRETE",
    lines: [
      "Plantain. Dandelion. Mugwort.",
      "Not metaphors. Plants.",
      "Growing from the gap between the kerb and the wall",
      "on Flatbush Avenue",
      "like they read the lease",
      "and found a clause no one else bothered with.",
      "",
      "I crouched down to look.",
      "A man stopped and asked if I was okay.",
      "I said yes.",
      "He walked away unconvinced, which is fair.",
      "",
      "I was trying to understand the mechanism.",
      "How something selects a crack over a garden.",
      "How the decision gets made",
      "at the level of the seed:",
      "not there.",
      "Here.",
      "This specific compromise in the concrete.",
      "This is where everything goes.",
      "",
      "I stayed until I understood",
      "it wasn't a decision.",
      "It was just where the seed landed",
      "and what the seed did next.",
    ],
  },
  {
    id: 9, num: "09", title: "COCKROACH",
    lines: [
      "I watched one cross my kitchen floor",
      "with such absolute certainty of direction —",
      "not scurrying, not panicking,",
      "just moving from one exact point to another",
      "like it had somewhere specific to be",
      "and the appointment had been in the diary for months —",
      "",
      "and I thought about the ward,",
      "about dragging my body from one side of the mattress to the other,",
      "about every morning that required a decision",
      "just to be upright,",
      "",
      "and I put the glass back in the cupboard.",
      "Left it to finish whatever it was doing.",
      "Went to bed.",
      "",
      "In the morning it was gone.",
      "The kitchen was just a kitchen.",
      "But something had passed through it in the night",
      "and not apologised",
      "and I was glad.",
    ],
  },
  {
    id: 10, num: "10", title: "BODEGA FLOWERS",
    lines: [
      "Wrapped in plastic,",
      "slightly crushed,",
      "available at all hours,",
      "no questions asked.",
      "",
      "Carnations dyed improbable colours.",
      "Roses that will open fast and drop in four days.",
      "Sunflowers listing badly to one side.",
      "",
      "My mother would have carried these on the tube,",
      "one arm out to keep the petals off her coat —",
      "the woman who told a consultant",
      "to shove his positive outlook up his arse",
      "and meant it",
      "and was right.",
      "",
      "I buy them every Saturday from the man on my corner.",
      "There at 6am, still there at midnight.",
      "No conversation.",
      "Always one extra stem",
      "added without comment.",
      "",
      "I put them on the table.",
      "Wrong colours. Wrong proportions.",
      "Alive.",
      "That's the whole requirement.",
    ],
  },
  {
    id: 11, num: "11", title: "THE FIG TREE ON DEAN STREET",
    lines: [
      "I've been back eleven times.",
      "I counted.",
      "",
      "It grows from a crack in the brownstone",
      "six feet off the ground —",
      "no soil visible, no apparent reason,",
      "just the wall and the decision.",
      "",
      "A woman who lives in the building",
      "saw me looking and said:",
      "it's been there for years. Nobody planted it.",
      "",
      "Nobody planted it.",
      "",
      "I think about the things that grew in me",
      "that nobody planted.",
      "The refusal. The notes.",
      "The bile with punctuation.",
      "The voice that kept going",
      "because if it stopped",
      "I stopped.",
      "",
      "Nobody planted that either.",
      "It just found the crack",
      "and put everything there.",
    ],
  },
  {
    id: 12, num: "12", title: "HAWORTH, BEFORE",
    lines: [
      "The path went straight up out of the village",
      "past the last house",
      "and onto the moor —",
      "sudden, total, no negotiation.",
      "",
      "The ground changed underfoot within twenty steps.",
      "Tarmac to stone to peat.",
      "",
      "Bilberry low on either side.",
      "Heather not yet in flower — it was June,",
      "still brown and patient,",
      "two months from purple.",
      "",
      "South Dean Beck somewhere below,",
      "running brown with peat,",
      "the sound of it dropping away",
      "as the path climbed.",
      "",
      "I went out most mornings that year.",
      "Not for any reason I could name then.",
      "Just that the moor didn't ask questions",
      "and the hospital did,",
      "and I had got very tired",
      "of being a question",
      "someone was trying to answer.",
    ],
  },
  {
    id: 13, num: "13", title: "GINKGO",
    lines: [
      "Two hundred and seventy million years.",
      "Ice age. Bomb blast. Whatever this is.",
      "",
      "Its fruit in autumn smells like",
      "the city's less polished ambitions.",
      "People step around it.",
      "",
      "The leaves are the shape of a small fan,",
      "of a thought that has known what it is",
      "for a very long time",
      "and is not revising.",
      "",
      "I pressed one in my notebook in October.",
      "Still there.",
      "Still that exact shape.",
      "Unchanged.",
    ],
  },
  {
    id: 14, num: "14", title: "THE CAIRNGORM PLATEAU, FEBRUARY",
    lines: [
      "The plateau in February is not hospitable.",
      "That is not a complaint — it is an accurate description",
      "of a place that has no interest",
      "in being hospitable.",
      "",
      "Quartzite underfoot, the snow compacted to ice",
      "in the places the wind has been working.",
      "The sky the specific white of a sky",
      "that has more weather in it",
      "and is deciding when.",
      "",
      "I ate lunch in the shelter of a boulder",
      "that had been there since the last glaciation —",
      "twelve thousand years, roughly,",
      "since the ice left it",
      "exactly here",
      "and moved on.",
      "",
      "A ptarmigan walked past",
      "in its winter white,",
      "nearly invisible,",
      "barely there,",
      "carrying on.",
      "",
      "I watched it until it disappeared",
      "into the white of the plateau",
      "and the white of the sky",
      "and I could not tell you",
      "where one ended",
      "and the other started.",
    ],
  },
  {
    id: 15, num: "15", title: "CENTRAL PARK, AUGUST",
    lines: [
      "The heat is a system.",
      "You move through it the way you move through bureaucracy —",
      "slowly, without dignity, producing the required forms.",
      "",
      "A heron stands in the pond",
      "at the exact centre of its own indifference.",
      "Six tourists photograph it.",
      "The heron does not perform.",
      "The heron is interested in the fish",
      "and the fish only.",
      "",
      "I am not there yet —",
      "I still check my phone,",
      "I still rehearse the message ten times and delete it eleven,",
      "I still ration the good olives",
      "so the jar doesn't hit the bottom.",
      "",
      "But I stood in that heat for forty minutes",
      "watching something that did not need to justify its existence",
      "and I felt, briefly,",
      "like maybe I don't either.",
    ],
  },
  {
    id: 16, num: "16", title: "WHAT THE BODY KEEPS",
    lines: [
      "The scar from the cannula,",
      "inner left arm —",
      "a slight variation in texture,",
      "two centimetres,",
      "you'd miss it if you weren't specifically looking.",
      "",
      "I press it sometimes on the subway.",
      "Not to feel something.",
      "To confirm the record is still there.",
      "",
      "The body logged the ward.",
      "The body logged the Cairngorm plateau in February,",
      "the Rannoch bog in October,",
      "the Haworth moor in the year before any of this —",
      "all those mornings going up",
      "because up was available",
      "and going up was still an option.",
      "",
      "The ward is over.",
      "The body continues logging.",
    ],
  },
  {
    id: 17, num: "17", title: "OCTOBER",
    lines: [
      "Not a brand.",
      "",
      "The ginkgo drops its leaves on a cab roof",
      "on 6th Avenue",
      "and the cab doesn't notice",
      "and the leaves don't care",
      "and I am standing on the pavement",
      "watching this transaction that involves no one",
      "and means nothing",
      "and I cannot explain",
      "why it makes me feel",
      "like I got away with something.",
    ],
  },
  {
    id: 18, num: "18", title: "NOVEMBER, FLATBUSH",
    lines: [
      "I called my mother.",
      "She asked if I needed anything.",
      "I said no.",
      "She said: are you sure.",
      "I said: yes.",
      "",
      "Outside my window a pigeon",
      "was navigating the fire escape",
      "on a foot that bends the wrong way —",
      "making it work, making it work,",
      "dropping into the air",
      "when it had what it came for.",
      "",
      "I didn't tell her about the pigeon.",
      "She would have found a way to worry about the pigeon.",
      "",
      "I said: I'm good, Mum.",
      "Which was true in the way things are true",
      "when you've stopped comparing them",
      "to how they were.",
    ],
  },
  {
    id: 19, num: "19", title: "RECOVERY CHECKLIST",
    lines: [
      "Fine. I take the meds on time.",
      "I can answer the phone without dissolving.",
      "I can make tea and not forget the mug.",
      "",
      "I still whisper my own name sometimes",
      "like I'm accusing someone.",
      "I still freeze when someone says you look well —",
      "I look for the catch.",
      "",
      "The vending machine in my old ward",
      "had orange crisps nobody chose.",
      "I bought one once to see if I could finish anything.",
      "",
      "I ate the whole bag on the fire escape",
      "at 11pm in October",
      "watching a ginkgo drop its leaves",
      "on a city that had never heard of me",
      "",
      "and I finished it.",
    ],
  },
  {
    id: 20, num: "20", title: "STILL HERE",
    lines: [
      "The tap drips.",
      "I have a reference number.",
      "I believe in process.",
      "",
      "I stood in this kitchen once",
      "imagining one more minute —",
      "knowing I'd waste it,",
      "just listening to the drip,",
      "pretending it wasn't counting —",
      "",
      "and I got the minute.",
      "And the one after.",
      "",
      "The diary is open on the table",
      "still refusing to shut up.",
      "The flowers are wrong and bright.",
      "The roach trap behind the fridge",
      "has been there long enough to become infrastructure.",
      "My mother's number is in my phone.",
      "",
      "I am not monitoring.",
      "I am not waiting.",
      "",
      "The tap drips.",
      "I let it.",
    ],
  },
];

// ─── GRAIN ──────────────────────────────────────────────────────────
function Grain() {
  return (
    <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",zIndex:100,pointerEvents:"none"}} aria-hidden="true">
      <filter id="gr">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#gr)" opacity="0.055"/>
    </svg>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────
function Hero() {
  const [visible, setVisible] = useState(false);
  const innerRef = useRef(null);
  const CX = 250, CY = 250;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    let angle = 0, raf;
    const drift = () => {
      angle += 0.018;
      if (innerRef.current) {
        innerRef.current.setAttribute("transform", `rotate(${angle}, ${CX}, ${CY})`);
      }
      raf = requestAnimationFrame(drift);
    };
    const t2 = setTimeout(drift, 900);
    return () => { clearTimeout(t); clearTimeout(t2); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section style={{
      position:"relative", height:"100vh", overflow:"hidden",
      background:"#ECEAE4",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transition:"opacity 1.8s ease",
        width:"min(300px,60vw)", height:"min(300px,60vw)",
      }}>
        <svg viewBox="0 0 500 500" style={{width:"100%",height:"100%",overflow:"visible"}} aria-hidden="true">
          <defs>
            <path id="rp" d="M 250,92 A 158,158 0 1,1 249.99,92"/>
          </defs>
          <circle cx={CX} cy={CY} r="160"
            fill="none" stroke="#1a1a18" strokeWidth="0.7"
            strokeDasharray="5 7" opacity="0.13"/>
          <text fontFamily="'Times New Roman',Times,serif" fontWeight="700"
            fontSize="16.5" fill="#1a1a18" opacity="0.84" letterSpacing="5.5">
            <textPath href="#rp" startOffset="0%">
              FOUR TIMES IN THE SAME MINUTE I SAID SORRY · FOR WANTING YOU ·
            </textPath>
          </text>
          <g ref={innerRef}>
            <text fontFamily="'Times New Roman',Times,serif" fontWeight="700"
              fontSize="13" fill="#1a1a18" opacity="0.48" letterSpacing="3">
              <textPath href="#rp" startOffset="50%">
                AND NOT KNOW THE DIFFERENCE · FOR YEARS ·
              </textPath>
            </text>
          </g>
          <circle cx={CX} cy={CY} r="5" fill="#1a1a18" opacity="0.88"/>
          <line x1={CX-9} y1={CY} x2={CX+9} y2={CY} stroke="#1a1a18" strokeWidth="0.5" opacity="0.18"/>
          <line x1={CX} y1={CY-9} x2={CX} y2={CY+9} stroke="#1a1a18" strokeWidth="0.5" opacity="0.18"/>
        </svg>
      </div>
      <div style={{
        position:"absolute", bottom:28, left:0, right:0, padding:"0 40px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        opacity: visible ? 1 : 0, transition:"opacity 2.2s ease 0.6s",
      }}>
        <span style={{fontSize:"clamp(8px,.85vw,10px)",letterSpacing:".32em",textTransform:"uppercase",color:"rgba(26,26,24,.38)",fontFamily:"'Times New Roman',Times,serif"}}>Bea Sophia</span>
        <a href="#poems" style={{
          fontSize:"clamp(8px,.85vw,10px)",letterSpacing:".2em",textTransform:"uppercase",
          color:"rgba(26,26,24,.28)",display:"flex",alignItems:"center",gap:10,
          transition:"color .2s",fontFamily:"'Times New Roman',Times,serif",
        }}
          onMouseEnter={e=>e.currentTarget.style.color="rgba(26,26,24,.7)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(26,26,24,.28)"}>
          <span style={{display:"inline-block",width:32,height:1,background:"currentColor"}}/>
          read it.
        </a>
        <span style={{fontSize:"clamp(8px,.85vw,10px)",letterSpacing:".32em",textTransform:"uppercase",color:"rgba(26,26,24,.38)",fontFamily:"'Times New Roman',Times,serif"}}>The Page Gallery</span>
      </div>
    </section>
  );
}

// ─── POEM ────────────────────────────────────────────────────────────
function Poem({ poem }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      id={`poem-${poem.id}`}
      style={{
        minHeight:"100vh",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"80px clamp(28px,10vw,160px)",
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : "translateY(20px)",
        transition:"opacity 1.1s ease, transform 1.1s ease",
        borderTop:"1px solid rgba(26,26,24,.065)",
      }}>
      <div style={{maxWidth:520, width:"100%"}}>
        <header style={{marginBottom:44}}>
          <span style={{
            display:"block", fontSize:9, letterSpacing:".3em",
            textTransform:"uppercase", color:"rgba(26,26,24,.28)",
            marginBottom:12, fontFamily:"'Times New Roman',Times,serif",
          }}>{poem.num}</span>
          <h2 style={{
            fontFamily:"'Times New Roman',Times,serif",
            fontStyle:"italic", fontWeight:400,
            fontSize:"clamp(16px,2.2vw,21px)",
            color:"#1a1a18", letterSpacing:"-.01em", lineHeight:1.15,
            margin:0,
          }}>{poem.title}</h2>
        </header>
        <div style={{
          fontFamily:"'Times New Roman',Times,serif",
          fontSize:"clamp(14px,1.65vw,17px)",
          color:"#1a1a18", lineHeight:1.85, letterSpacing:"-.005em",
        }}>
          {poem.lines.map((line, i) =>
            line === "" ? (
              <div key={i} style={{height:"1em"}}/>
            ) : (
              <p key={i} style={{margin:0}}>{line}</p>
            )
          )}
        </div>
      </div>
    </article>
  );
}

// ─── INDEX ───────────────────────────────────────────────────────────
function PoemsIndex({ onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <section style={{
      minHeight:"100vh", padding:"80px clamp(28px,10vw,160px)",
      background:"#ECEAE4",
    }}>
      <p style={{
        fontSize:9, letterSpacing:".3em", textTransform:"uppercase",
        color:"rgba(26,26,24,.28)", marginBottom:52,
        fontFamily:"'Times New Roman',Times,serif",
      }}>THE ONLY LIFE — 20 POEMS</p>
      {POEMS.map(p => (
        <div key={p.id}
          onClick={() => onSelect(p.id)}
          onMouseEnter={() => setHov(p.id)}
          onMouseLeave={() => setHov(null)}
          style={{
            display:"flex", gap:28, alignItems:"baseline",
            padding:"13px 0",
            borderBottom:"1px solid rgba(26,26,24,.065)",
            cursor:"pointer",
            opacity: hov && hov !== p.id ? 0.3 : 1,
            transition:"opacity .2s",
          }}>
          <span style={{
            fontSize:9, letterSpacing:".2em",
            color:"rgba(26,26,24,.28)", minWidth:24,
            fontFamily:"'Times New Roman',Times,serif",
          }}>{p.num}</span>
          <span style={{
            fontFamily:"'Times New Roman',Times,serif",
            fontStyle:"italic",
            fontSize:"clamp(14px,1.9vw,19px)",
            color:"#1a1a18", letterSpacing:"-.01em",
          }}>{p.title}</span>
        </div>
      ))}
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding:"60px clamp(28px,10vw,160px)",
      borderTop:"1px solid rgba(26,26,24,.065)",
      display:"flex", justifyContent:"space-between", alignItems:"center",
      flexWrap:"wrap", gap:20, background:"#ECEAE4",
    }}>
      <div>
        <p style={{fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"rgba(26,26,24,.28)",marginBottom:6,fontFamily:"'Times New Roman',Times,serif"}}>Bea Sophia</p>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(26,26,24,.32)",transition:"color .2s",fontFamily:"'Times New Roman',Times,serif"}}
          onMouseEnter={e=>e.currentTarget.style.color="rgba(26,26,24,.72)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(26,26,24,.32)"}>
          @bsophialovesgnochi
        </a>
      </div>
      <p style={{fontSize:9,letterSpacing:".22em",textTransform:"uppercase",color:"rgba(26,26,24,.22)",fontFamily:"'Times New Roman',Times,serif"}}>
        The Page Gallery © 2025
      </p>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────
export default function Home() {
  const [view, setView] = useState("home");

  const scrollToPoem = (id) => {
    setView("home");
    setTimeout(() => {
      const el = document.getElementById(`poem-${id}`);
      if (el) el.scrollIntoView({ behavior:"smooth" });
    }, 80);
  };

  return (
    <div style={{background:"#ECEAE4", minHeight:"100vh", fontFamily:"'Times New Roman',Times,serif"}}>
      <Grain/>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        padding:"18px 40px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        background:"rgba(236,234,228,0.9)",
        backdropFilter:"blur(10px)",
        borderBottom:"1px solid rgba(26,26,24,.055)",
      }}>
        <button onClick={()=>setView("home")} style={{
          background:"none",border:"none",cursor:"pointer",padding:0,
          fontSize:9,letterSpacing:".32em",textTransform:"uppercase",
          color:"rgba(26,26,24,.5)",fontFamily:"'Times New Roman',Times,serif",
        }}>Bea Sophia</button>
        <button onClick={()=>setView(view==="index"?"home":"index")} style={{
          background:"none",border:"none",cursor:"pointer",padding:0,
          fontSize:9,letterSpacing:".28em",textTransform:"uppercase",
          color:"rgba(26,26,24,.38)",fontFamily:"'Times New Roman',Times,serif",
          transition:"color .2s",
        }}
          onMouseEnter={e=>e.currentTarget.style.color="rgba(26,26,24,.8)"}
          onMouseLeave={e=>e.currentTarget.style.color="rgba(26,26,24,.38)"}>
          {view==="index" ? "← back" : "all poems"}
        </button>
      </nav>

      {view === "index" ? (
        <div style={{paddingTop:60}}>
          <PoemsIndex onSelect={scrollToPoem}/>
        </div>
      ) : (
        <>
          <Hero/>
          <div id="poems">
            {POEMS.map(p => <Poem key={p.id} poem={p}/>)}
          </div>
          <Footer/>
        </>
      )}
    </div>
  );
}
