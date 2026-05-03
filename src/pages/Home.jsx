import { useState, useEffect, useRef } from "react";
import { SiteNote } from "@/api/entities";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  paper:   "#f0ebe1",
  ink:     "#1a1a18",
  inkFade: "rgba(26,26,24,0.5)",
  inkGhost:"rgba(26,26,24,0.08)",
  red:     "#c94a3a",
  cream:   "#f7f4ee",
  grey:    "#6b6560",
  lightGrey:"#a09a93",
  white:   "#faf8f4",
};

const serif = { fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif" };

// ── DATA ──────────────────────────────────────────────────────────────────────
const FREE_POEMS = [
  {
    id: 1,
    num: "001",
    title: "INBOUND",
    annotation: "overheard at Newark, gate C42",
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
    rotation: -1.8, left: "3%", top: "8%", width: "280px",
  },
  {
    id: 2,
    num: "009",
    title: "COCKROACH",
    annotation: "3am, Brooklyn, first week",
    lines: [
      "I watched one cross my kitchen floor",
      "with such absolute certainty of direction —",
      "not scurrying, not panicking,",
      "just moving from one exact point to another",
      "like it had somewhere specific to be",
      "and the appointment had been in the diary for months —",
      "",
      "and I put the glass back in the cupboard.",
      "Left it to finish whatever it was doing.",
      "Went to bed.",
      "",
      "In the morning it was gone.",
      "But something had passed through it in the night",
      "and not apologised",
      "and I was glad.",
    ],
    rotation: 2.1, left: "46%", top: "4%", width: "268px",
  },
  {
    id: 3,
    num: "020",
    title: "STILL HERE",
    annotation: "kitchen, Flatbush, Tuesday",
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
      "I am not monitoring.",
      "I am not waiting.",
      "",
      "The tap drips.",
      "I let it.",
    ],
    rotation: -0.9, left: "22%", top: "52%", width: "258px",
  },
  {
    id: 4,
    num: "010",
    title: "BODEGA FLOWERS",
    annotation: "Atlantic Ave, every Saturday",
    lines: [
      "Wrapped in plastic,",
      "slightly crushed,",
      "available at all hours,",
      "no questions asked.",
      "",
      "My mother would have carried these on the tube,",
      "one arm out to keep the petals off her coat —",
      "the woman who told a consultant",
      "to shove his positive outlook up his arse",
      "and meant it",
      "and was right.",
      "",
      "Wrong colours. Wrong proportions.",
      "Alive.",
      "That's the whole requirement.",
    ],
    rotation: 1.4, left: "60%", top: "48%", width: "264px",
  },
];

const SHOP_ITEMS = [
  {
    id: "collection",
    label: "ARCHIVE — 001",
    title: "The Only Life",
    fragment: "\"The body logged the ward. The body logged the Cairngorm plateau in February. The ward is over. The body continues logging.\"",
    desc: "Twenty poems written from the fragments. New York. The body after the ward. Scotland in the bones. What keeps going when the reason is unclear. You will find yourself inside them.",
    price: "£12",
    format: "Digital PDF · Yours immediately",
    paypal: "https://paypal.me/Sophiasharkey330",
    featured: true,
  },
  {
    id: "prompts",
    label: "TOOLS — 001",
    title: "Write What Survives",
    fragment: "\"Object first. Feeling never. The thing that happened is in the thing, not in the explanation of the thing.\"",
    desc: "Prompts built around the same logic as the collection — object first, feeling never. For poets who want to write the thing without explaining it.",
    price: "£8",
    format: "Digital PDF · Yours immediately",
    paypal: "https://paypal.me/Sophiasharkey330",
    featured: false,
  },
  {
    id: "intensive",
    label: "INTENSIVE — 001",
    title: "The Object Is the Meaning",
    fragment: "\"You bring the object. We find what's inside it. That's the whole method.\"",
    desc: "A condensed version of the intensive. Video, exercises, feedback. The same method that produced the collection, handed over.",
    price: "£45",
    format: "Digital · Lifetime access",
    paypal: "https://paypal.me/Sophiasharkey330",
    featured: false,
  },
];

// ── GRAIN OVERLAY ─────────────────────────────────────────────────────────────
function Grain() {
  return (
    <div aria-hidden="true" style={{
      position: "fixed", inset: 0, zIndex: 1000,
      pointerEvents: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      opacity: 0.032,
      mixBlendMode: "multiply",
    }} />
  );
}

// ── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => { posRef.current = { x: e.clientX, y: e.clientY }; };
    const onEnter = (e) => { if (e.target.closest("[data-poem]")) hovering.current = true; };
    const onLeave = (e) => { if (e.target.closest("[data-poem]")) hovering.current = false; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    const animate = () => {
      const lerp = 0.13;
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * lerp;
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * lerp;
      if (dotRef.current) {
        const size = hovering.current ? 20 : 7;
        dotRef.current.style.transform = `translate(${currentRef.current.x - size/2}px, ${currentRef.current.y - size/2}px)`;
        dotRef.current.style.width = size + "px";
        dotRef.current.style.height = size + "px";
        dotRef.current.style.opacity = hovering.current ? "0.55" : "0.75";
        dotRef.current.style.borderRadius = hovering.current ? "2px" : "50%";
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={dotRef} aria-hidden="true" style={{
      position: "fixed", top: 0, left: 0,
      width: "7px", height: "7px",
      background: C.ink, borderRadius: "50%",
      pointerEvents: "none", zIndex: 9990,
      transition: "width 0.25s, height 0.25s, opacity 0.25s, border-radius 0.25s",
      willChange: "transform",
    }} />
  );
}

// ── SECTION REVEAL HOOK ───────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav({ scrollY }) {
  const solid = scrollY > 100;
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "28px 60px",
      background: solid ? `rgba(240,235,225,0.96)` : "transparent",
      backdropFilter: solid ? "blur(20px)" : "none",
      borderBottom: solid ? `1px solid ${C.inkGhost}` : "none",
      transition: "background 0.6s, border-color 0.6s",
      ...serif,
    }}>
      <a href="#" style={{ fontSize: "13px", letterSpacing: "0.28em", textTransform: "uppercase", color: C.ink, textDecoration: "none" }}>
        Bea Sophia
      </a>
      <div style={{ display: "flex", gap: "48px" }}>
        {[["Read", "#reading-room"], ["Collect", "#archive"], ["Journal", "#gallery-journal"], ["About", "#about"]].map(([label, href]) => (
          <a key={label} href={href} style={{
            fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.lightGrey, textDecoration: "none",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = C.ink}
            onMouseLeave={e => e.target.style.color = C.lightGrey}
          >{label}</a>
        ))}
      </div>
    </nav>
  );
}

// ── CORRIDOR / HERO ───────────────────────────────────────────────────────────
function Corridor({ scrollY }) {
  const [phase, setPhase] = useState(0); // 0: blank, 1: question, 2: subline, 3: cta
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const fade = Math.max(0, 1 - scrollY / 600);
  const drift = scrollY * 0.18;

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "flex-start",
      padding: "120px 60px 100px",
      position: "relative",
      opacity: fade,
      transform: `translateY(${drift}px)`,
      background: C.paper,
      ...serif,
    }}>
      {/* Vertical rule — left accent */}
      <div style={{
        position: "absolute", left: "60px", top: "20%", bottom: "20%",
        width: "1px", background: C.inkGhost,
      }} />

      {/* Archive label */}
      <div style={{
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
        marginLeft: "32px", marginBottom: "52px",
      }}>
        <span style={{ fontSize: "9px", letterSpacing: "0.36em", textTransform: "uppercase", color: C.lightGrey }}>
          The Page Gallery · A collection of minds
        </span>
      </div>

      {/* Main question */}
      <h1 style={{
        marginLeft: "32px",
        fontSize: "clamp(38px, 6.5vw, 96px)",
        fontWeight: "300",
        fontStyle: "italic",
        lineHeight: "1.05",
        letterSpacing: "-0.02em",
        color: C.ink,
        maxWidth: "820px",
        margin: "0 0 0 32px",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(40px)",
        transition: "all 1.4s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}>
        What happens to a thought<br />
        when the person<br />
        who had it dies?
      </h1>

      {/* Red mark */}
      <div style={{
        marginLeft: "32px", marginTop: "36px", marginBottom: "28px",
        width: phase >= 2 ? "64px" : "0",
        height: "2px",
        background: C.red,
        transition: "width 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
      }} />

      {/* Subline */}
      <p style={{
        marginLeft: "32px",
        fontSize: "clamp(15px, 1.8vw, 22px)",
        fontWeight: "300",
        color: C.grey,
        lineHeight: "1.75",
        maxWidth: "480px",
        margin: "0 0 64px 32px",
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.2s",
      }}>
        Walk around inside someone else's mind.<br />
        The poems are what we found.
      </p>

      {/* CTAs */}
      <div style={{
        marginLeft: "32px",
        display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap",
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <a href="#reading-room" style={{
          background: C.ink, color: C.paper,
          padding: "16px 48px", textDecoration: "none",
          fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          transition: "opacity 0.2s",
        }}
          onMouseEnter={e => e.target.style.opacity = "0.75"}
          onMouseLeave={e => e.target.style.opacity = "1"}
        >Enter free</a>
        <a href="#archive" style={{
          fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
          color: C.grey, textDecoration: "none",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          borderBottom: `1px solid rgba(107,101,96,0.35)`, paddingBottom: "3px",
          transition: "color 0.2s, border-color 0.2s",
        }}
          onMouseEnter={e => { e.target.style.color = C.ink; e.target.style.borderColor = C.ink; }}
          onMouseLeave={e => { e.target.style.color = C.grey; e.target.style.borderColor = "rgba(107,101,96,0.35)"; }}
        >Buy the collection — £12</a>
      </div>

      {/* Scroll nudge */}
      <div style={{
        position: "absolute", bottom: "48px", right: "60px",
        opacity: scrollY > 60 ? 0 : phase >= 3 ? 0.3 : 0,
        transition: "opacity 0.5s",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
        ...serif,
      }}>
        <span style={{ fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase", color: C.lightGrey, writingMode: "vertical-rl" }}>Scroll</span>
        <div style={{ width: "1px", height: "48px", background: C.ink, opacity: 0.25 }} />
      </div>
    </section>
  );
}

// ── READING ROOM ──────────────────────────────────────────────────────────────
function ReadingRoom() {
  const [ref, visible] = useReveal(0.05);
  const [open, setOpen] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <section id="reading-room" ref={ref} style={{
      background: C.cream,
      padding: "120px 60px 160px",
      borderTop: `1px solid ${C.inkGhost}`,
      ...serif,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        marginBottom: "100px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div>
          <p style={{ fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: C.lightGrey, margin: "0 0 14px" }}>
            Reading Room · Free access
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 58px)", fontWeight: "300", fontStyle: "italic", color: C.ink, margin: 0, letterSpacing: "-0.015em", lineHeight: "1.05" }}>
            Pick one up.
          </h2>
        </div>
        <p style={{ fontSize: "13px", color: C.lightGrey, maxWidth: "240px", textAlign: "right", lineHeight: "1.7", margin: 0 }}>
          Four poems from the collection.<br />The rest are inside.
        </p>
      </div>

      {/* The floor — manuscripts scattered */}
      <div style={{ position: "relative", height: open ? "auto" : "760px", minHeight: "560px" }}>
        {FREE_POEMS.map((poem, i) => {
          const isOpen = open === poem.id;
          const isHovered = hovered === poem.id;

          return (
            <div
              key={poem.id}
              data-poem="true"
              onMouseEnter={() => !open && setHovered(poem.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setOpen(isOpen ? null : poem.id)}
              style={{
                position: open ? "relative" : "absolute",
                left: open ? undefined : poem.left,
                top: open ? undefined : poem.top,
                width: open ? (isOpen ? "100%" : "0") : poem.width,
                maxWidth: isOpen ? "620px" : undefined,
                margin: isOpen ? "0 auto 48px" : undefined,
                height: isOpen ? "auto" : undefined,
                overflow: isOpen ? "visible" : (open ? "hidden" : "visible"),
                background: C.white,
                borderTop: `2px solid ${isOpen ? C.red : C.ink}`,
                padding: isOpen ? "44px 52px 52px" : "28px 28px 32px",
                transform: open
                  ? "none"
                  : `rotate(${poem.rotation}deg) translateY(${isHovered ? -18 : 0}px) scale(${isHovered ? 1.03 : 1})`,
                boxShadow: isHovered
                  ? "0 32px 80px rgba(26,26,24,0.16)"
                  : isOpen
                    ? "0 20px 60px rgba(26,26,24,0.12)"
                    : "0 2px 20px rgba(26,26,24,0.07)",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.3s, padding 0.4s",
                zIndex: isOpen ? 50 : isHovered ? 30 : i + 1,
                cursor: "pointer",
                opacity: visible ? 1 : 0,
                transitionDelay: open ? "0s" : `${i * 0.07}s`,
              }}
            >
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isOpen ? "32px" : "18px" }}>
                <span style={{ fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: C.lightGrey }}>{poem.num}</span>
                <span style={{ fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase", color: isOpen ? C.red : C.lightGrey, transition: "color 0.3s" }}>
                  {isOpen ? "Close ×" : "The Only Life"}
                </span>
              </div>

              <p style={{
                fontSize: isOpen ? "11px" : "9px",
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: C.ink, margin: isOpen ? "0 0 28px" : "0 0 16px",
                fontWeight: "500", lineHeight: "1.4",
                transition: "font-size 0.3s",
              }}>{poem.title}</p>

              {/* Annotation */}
              {!isOpen && (
                <p style={{ fontSize: "10px", fontStyle: "italic", color: C.lightGrey, margin: "0 0 14px", lineHeight: "1.5" }}>
                  — {poem.annotation}
                </p>
              )}

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${C.inkGhost}`, paddingTop: "14px" }}>
                {isOpen ? (
                  <>
                    {/* Full poem */}
                    <p style={{ fontSize: "9px", fontStyle: "italic", color: C.lightGrey, margin: "0 0 28px", letterSpacing: "0.08em" }}>
                      — {poem.annotation}
                    </p>
                    {poem.lines.map((line, j) => (
                      <p key={j} style={{
                        fontSize: "clamp(15px, 1.6vw, 18px)",
                        color: C.ink, lineHeight: "1.95",
                        margin: 0, minHeight: line === "" ? "1em" : "auto",
                      }}>{line}</p>
                    ))}
                    {/* Collection CTA inside poem */}
                    <div style={{ marginTop: "52px", paddingTop: "32px", borderTop: `1px solid ${C.inkGhost}` }}>
                      <p style={{ fontSize: "13px", color: C.grey, lineHeight: "1.75", margin: "0 0 20px" }}>
                        There are twenty more. The full collection is £12.
                      </p>
                      <a href="#archive" onClick={() => setOpen(null)} style={{
                        fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
                        color: C.ink, textDecoration: "none",
                        borderBottom: `1px solid ${C.ink}`, paddingBottom: "3px",
                      }}>Get the collection →</a>
                    </div>
                  </>
                ) : (
                  /* Excerpt preview */
                  poem.lines.slice(0, 3).map((line, j) => (
                    <p key={j} style={{
                      fontSize: "13px", color: "#5a5550", lineHeight: "1.85",
                      margin: 0, fontStyle: "italic",
                      minHeight: line === "" ? "0.8em" : "auto",
                    }}>{line}</p>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      {!open && (
        <div style={{
          marginTop: "60px", textAlign: "center",
          opacity: visible ? 1 : 0, transition: "opacity 1s 0.5s",
        }}>
          <a href="#archive" style={{
            fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.grey, textDecoration: "none",
            borderBottom: `1px solid rgba(107,101,96,0.3)`, paddingBottom: "3px",
          }}
            onMouseEnter={e => { e.target.style.color = C.ink; e.target.style.borderColor = C.ink; }}
            onMouseLeave={e => { e.target.style.color = C.grey; e.target.style.borderColor = "rgba(107,101,96,0.3)"; }}
          >Twenty poems in the full collection →</a>
        </div>
      )}
    </section>
  );
}

// ── ARCHIVE (SHOP) ────────────────────────────────────────────────────────────
function Archive() {
  const [ref, visible] = useReveal(0.08);

  return (
    <section id="archive" ref={ref} style={{
      background: C.ink, color: C.paper,
      padding: "120px 60px",
      ...serif,
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
        marginBottom: "80px",
      }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(240,235,225,0.35)", margin: "0 0 16px" }}>
          The Archive
        </p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 58px)", fontWeight: "300", fontStyle: "italic", margin: 0, letterSpacing: "-0.015em", lineHeight: "1.05" }}>
          Things worth keeping.
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {SHOP_ITEMS.map((item, i) => (
          <div key={item.id} style={{
            display: "grid",
            gridTemplateColumns: item.featured ? "1fr 1fr" : "1fr 1fr",
            gap: "0",
            background: item.featured ? C.paper : "rgba(240,235,225,0.04)",
            color: item.featured ? C.ink : C.paper,
            borderTop: item.featured ? `3px solid ${C.red}` : `1px solid rgba(240,235,225,0.1)`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`,
          }}>
            {/* Left — info */}
            <div style={{ padding: item.featured ? "56px 52px" : "44px 52px" }}>
              <p style={{
                fontSize: "8px", letterSpacing: "0.3em", textTransform: "uppercase",
                color: item.featured ? C.lightGrey : "rgba(240,235,225,0.35)",
                margin: "0 0 20px",
              }}>{item.label}</p>
              <h3 style={{
                fontSize: item.featured ? "clamp(22px, 2.8vw, 38px)" : "clamp(18px, 2vw, 26px)",
                fontWeight: "300", fontStyle: "italic",
                margin: "0 0 20px", letterSpacing: "-0.01em", lineHeight: "1.1",
              }}>{item.title}</h3>
              <p style={{
                fontSize: "13px", lineHeight: "1.85",
                color: item.featured ? C.grey : "rgba(240,235,225,0.55)",
                margin: "0 0 36px", maxWidth: "360px",
              }}>{item.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: item.featured ? "28px" : "22px", fontWeight: "300", margin: "0 0 5px" }}>{item.price}</p>
                  <p style={{ fontSize: "9px", letterSpacing: "0.14em", color: item.featured ? C.lightGrey : "rgba(240,235,225,0.3)", margin: 0 }}>{item.format}</p>
                </div>
                <a href={item.paypal} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-block",
                  background: item.featured ? C.ink : "rgba(240,235,225,0.1)",
                  color: C.paper,
                  border: item.featured ? "none" : "1px solid rgba(240,235,225,0.2)",
                  padding: "14px 36px", textDecoration: "none",
                  fontSize: "9px", letterSpacing: "0.24em", textTransform: "uppercase",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => e.target.style.opacity = "0.7"}
                  onMouseLeave={e => e.target.style.opacity = "1"}
                >Buy</a>
              </div>
            </div>

            {/* Right — fragment */}
            <div style={{
              padding: item.featured ? "56px 52px" : "44px 52px",
              display: "flex", alignItems: "center",
              borderLeft: item.featured ? `1px solid ${C.inkGhost}` : "1px solid rgba(240,235,225,0.06)",
            }}>
              <p style={{
                fontSize: item.featured ? "clamp(16px, 1.8vw, 22px)" : "clamp(14px, 1.5vw, 18px)",
                fontStyle: "italic", fontWeight: "300",
                color: item.featured ? C.ink : "rgba(240,235,225,0.45)",
                lineHeight: "1.7", letterSpacing: "0",
                margin: 0,
              }}>{item.fragment}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── GALLERY JOURNAL ───────────────────────────────────────────────────────────
function GalleryJournal() {
  const [ref, visible] = useReveal(0.1);

  return (
    <section id="gallery-journal" ref={ref} style={{
      background: C.paper,
      padding: "120px 60px",
      borderTop: `1px solid ${C.inkGhost}`,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "80px", alignItems: "center",
      ...serif,
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: C.lightGrey, margin: "0 0 20px" }}>
          The Page Gallery Journal
        </p>
        <h3 style={{ fontSize: "clamp(26px, 4vw, 52px)", fontWeight: "300", fontStyle: "italic", margin: "0 0 28px", lineHeight: "1.05", letterSpacing: "-0.02em" }}>
          Nobody gets to walk around<br />inside someone else's mind.
        </h3>
        <div style={{ width: "48px", height: "2px", background: C.red, margin: "0 0 28px" }} />
        <p style={{ fontSize: "15px", color: C.grey, lineHeight: "1.85", margin: "0 0 16px", maxWidth: "400px" }}>
          When I got sick, I realised that when people die, all their thoughts die with them.
        </p>
        <p style={{ fontSize: "15px", color: C.grey, lineHeight: "1.85", margin: "0 0 44px", maxWidth: "400px" }}>
          I started collecting fragments — conversations overheard, things said in the wrong order, thoughts that had nowhere to go. That became The Page Gallery Journal.
        </p>
        <a href="#" style={{
          display: "inline-block",
          border: `1px solid rgba(26,26,24,0.25)`,
          color: C.ink, textDecoration: "none",
          padding: "14px 36px",
          fontSize: "9px", letterSpacing: "0.24em", textTransform: "uppercase",
          transition: "border-color 0.25s",
        }}
          onMouseEnter={e => e.target.style.borderColor = C.ink}
          onMouseLeave={e => e.target.style.borderColor = "rgba(26,26,24,0.25)"}
        >Visit the Journal</a>
      </div>

      {/* Stacked archive folders visual */}
      <div style={{
        position: "relative", height: "380px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.15s",
      }}>
        {[4,3,2,1,0].map(offset => (
          <div key={offset} style={{
            position: "absolute",
            top: `${offset * 10}px`,
            left: `${offset * 8}px`,
            right: `${-offset * 4}px`,
            bottom: 0,
            background: offset === 0 ? C.white : `rgba(26,26,24,0.${offset + 2})`,
            borderTop: offset === 0 ? `3px solid ${C.ink}` : `1px solid rgba(26,26,24,0.${offset + 1})`,
            transform: `rotate(${(offset - 2) * 0.9}deg)`,
            padding: offset === 0 ? "40px" : 0,
          }}>
            {offset === 0 && (
              <>
                <p style={{ fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: C.lightGrey, margin: "0 0 6px" }}>Issue</p>
                <p style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.ink, margin: "0 0 28px" }}>The Page Gallery Journal</p>
                <div style={{ width: "28px", height: "1px", background: C.red, margin: "0 0 24px" }} />
                <p style={{ fontSize: "18px", fontStyle: "italic", fontWeight: "300", color: C.ink, lineHeight: "1.4", margin: "0 0 12px" }}>
                  Collecting thoughts<br />before they disappear.
                </p>
                <p style={{ fontSize: "11px", color: C.lightGrey, lineHeight: "1.7", fontStyle: "italic", margin: 0 }}>
                  Serious work.<br />Carefully chosen.
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  const [ref, visible] = useReveal(0.1);

  return (
    <section id="about" ref={ref} style={{
      background: C.cream,
      padding: "120px 60px",
      borderTop: `1px solid ${C.inkGhost}`,
      ...serif,
    }}>
      <div style={{
        maxWidth: "680px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: C.lightGrey, margin: "0 0 20px" }}>About</p>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 52px)", fontWeight: "300", fontStyle: "italic", color: C.ink, margin: "0 0 36px", letterSpacing: "-0.015em", lineHeight: "1.1" }}>
          Bea Sophia.<br />New York City.
        </h2>
        <p style={{ fontSize: "17px", color: C.grey, lineHeight: "1.9", margin: "0 0 22px" }}>
          I got sick and I started collecting. Fragments of conversation. Things people said and didn't know they'd said. Thoughts that live in one mind and die there.
        </p>
        <p style={{ fontSize: "17px", color: C.grey, lineHeight: "1.9", margin: "0 0 22px" }}>
          The Page Gallery Journal was the first attempt to stop that. These poems are the second.
        </p>
        <p style={{ fontSize: "17px", color: C.grey, lineHeight: "1.9", margin: "0 0 44px" }}>
          I also run writing intensives for poets who are serious about the work, and I make prompt packs and workbooks. I adore spaghetti.
        </p>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: C.grey, textDecoration: "none", borderBottom: `1px solid rgba(107,101,96,0.3)`, paddingBottom: "3px", transition: "color 0.2s, border-color 0.2s" }}
          onMouseEnter={e => { e.target.style.color = C.ink; e.target.style.borderColor = C.ink; }}
          onMouseLeave={e => { e.target.style.color = C.grey; e.target.style.borderColor = "rgba(107,101,96,0.3)"; }}
        >@bsophialovesgnochi</a>
      </div>
    </section>
  );
}

// ── COURSES (LOCKED DOOR) ─────────────────────────────────────────────────────
function LockedDoor() {
  const [ref, visible] = useReveal(0.1);
  return (
    <section ref={ref} style={{
      background: C.ink, color: C.paper,
      padding: "90px 60px",
      borderTop: `1px solid rgba(240,235,225,0.07)`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "40px",
      ...serif,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div>
        <p style={{ fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(240,235,225,0.25)", margin: "0 0 14px" }}>Intensive — coming</p>
        <h3 style={{ fontSize: "clamp(22px, 3vw, 42px)", fontWeight: "300", fontStyle: "italic", margin: 0, lineHeight: "1.1" }}>The door is there.<br />Not yet open.</h3>
      </div>
      <div style={{ border: "1px solid rgba(240,235,225,0.12)", padding: "14px 36px" }}>
        <span style={{ fontSize: "9px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(240,235,225,0.3)" }}>Coming</span>
      </div>
    </section>
  );
}

// ── NEWSLETTER ────────────────────────────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [ref, visible] = useReveal(0.1);

  return (
    <section ref={ref} style={{
      background: C.paper,
      padding: "110px 60px",
      borderTop: `1px solid ${C.inkGhost}`,
      ...serif,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ maxWidth: "500px" }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.32em", textTransform: "uppercase", color: C.lightGrey, margin: "0 0 18px" }}>Letters</p>
        <h3 style={{ fontSize: "clamp(22px, 3.2vw, 44px)", fontWeight: "300", fontStyle: "italic", color: C.ink, margin: "0 0 18px", letterSpacing: "-0.01em" }}>
          New fragments,<br />when they exist.
        </h3>
        <p style={{ fontSize: "15px", color: C.grey, lineHeight: "1.85", margin: "0 0 44px" }}>
          No schedule. No newsletter voice. The thing itself when it's ready.
        </p>
        {done ? (
          <p style={{ fontSize: "14px", color: C.grey, fontStyle: "italic" }}>You're in.</p>
        ) : (
          <form onSubmit={e => { e.preventDefault(); if (email) setDone(true); }} style={{ display: "flex", maxWidth: "400px" }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
              aria-label="Email address"
              style={{ flex: 1, padding: "15px 18px", border: `1px solid rgba(26,26,24,0.18)`, borderRight: "none", fontSize: "14px", fontFamily: "Georgia, serif", background: C.white, outline: "none", color: C.ink }} />
            <button type="submit" style={{ background: C.ink, color: C.paper, border: "none", padding: "15px 28px", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", whiteSpace: "nowrap", transition: "opacity 0.2s" }}
              onMouseEnter={e => e.target.style.opacity = "0.75"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: C.paper,
      padding: "32px 60px",
      borderTop: `1px solid ${C.inkGhost}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: "16px",
      ...serif,
    }}>
      <span style={{ fontSize: "11px", color: C.lightGrey, letterSpacing: "0.1em" }}>© Bea Sophia</span>
      <div style={{ display: "flex", gap: "40px" }}>
        {[["Instagram", "https://instagram.com/bsophialovesgnochi"], ["The Page Gallery Journal", "#"]].map(([label, href]) => (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
            style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: C.lightGrey, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = C.ink}
            onMouseLeave={e => e.target.style.color = C.lightGrey}
          >{label}</a>
        ))}
      </div>
    </footer>
  );
}

// ── FEEDBACK WIDGET ───────────────────────────────────────────────────────────
const SECTIONS = ["Corridor / Hero", "Reading Room", "Archive / Shop", "Journal", "About", "Newsletter", "Other"];

function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("Corridor / Hero");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = async () => {
    if (!note.trim()) return;
    setStatus("saving");
    try {
      await SiteNote.create({ section, note: note.trim(), status: "new", url: window.location.href });
      setStatus("saved");
      setNote("");
      setTimeout(() => { setStatus("idle"); setOpen(false); }, 1800);
    } catch { setStatus("error"); }
  };

  return (
    <>
      <button onClick={() => setOpen(o => !o)} title="Leave a note"
        style={{
          position: "fixed", bottom: "30px", right: "30px", zIndex: 9999,
          width: "46px", height: "46px", borderRadius: "50%",
          background: C.ink, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(26,26,24,0.24)",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.3s",
        }}>
        <span style={{ color: C.paper, fontSize: open ? "20px" : "16px", lineHeight: 1 }}>{open ? "×" : "✎"}</span>
      </button>
      {open && (
        <div style={{
          position: "fixed", bottom: "88px", right: "30px", zIndex: 9998,
          width: "300px", background: C.white,
          boxShadow: "0 12px 52px rgba(26,26,24,0.16)",
          borderTop: `3px solid ${C.ink}`,
          ...serif,
        }}>
          <div style={{ padding: "22px 22px 0" }}>
            <p style={{ fontSize: "13px", color: C.ink, margin: "0 0 18px" }}>Leave a note. I'll action it.</p>
            <select value={section} onChange={e => setSection(e.target.value)}
              style={{ width: "100%", padding: "9px 11px", border: `1px solid ${C.inkGhost}`, background: C.paper, color: C.ink, fontSize: "12px", fontFamily: "Georgia, serif", marginBottom: "12px", outline: "none" }}>
              {SECTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What needs changing…" rows={4}
              style={{ width: "100%", padding: "9px 11px", border: `1px solid ${C.inkGhost}`, background: C.paper, color: C.ink, fontSize: "12px", fontFamily: "Georgia, serif", resize: "vertical", outline: "none", lineHeight: "1.65", boxSizing: "border-box" }} />
          </div>
          <div style={{ padding: "14px 22px 22px", display: "flex", justifyContent: "flex-end" }}>
            {status === "saved"
              ? <span style={{ fontSize: "12px", color: C.grey, fontStyle: "italic" }}>Noted ✓</span>
              : <button onClick={submit} disabled={!note.trim() || status === "saving"}
                  style={{ background: note.trim() ? C.ink : C.lightGrey, color: C.paper, border: "none", padding: "10px 24px", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: note.trim() ? "pointer" : "default", fontFamily: "Georgia, serif" }}>
                  {status === "saving" ? "…" : "Send"}
                </button>
            }
          </div>
        </div>
      )}
    </>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: C.paper, color: C.ink, overflowX: "hidden", cursor: "none" }}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: ${C.paper}; }
        ::selection { background: rgba(201,74,58,0.15); }
        input::placeholder, textarea::placeholder { color: ${C.lightGrey}; }
        a:focus-visible, button:focus-visible {
          outline: 2px solid ${C.red};
          outline-offset: 3px;
        }
        @media (max-width: 768px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
          nav { padding: 22px 24px !important; }
          #gallery-journal { grid-template-columns: 1fr !important; }
          .archive-item { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      <Grain />
      {!reducedMotion && <Cursor />}
      <Nav scrollY={scrollY} />
      <Corridor scrollY={scrollY} />
      <ReadingRoom />
      <Archive />
      <GalleryJournal />
      <About />
      <LockedDoor />
      <Newsletter />
      <Footer />
      <FeedbackWidget />
    </div>
  );
}
