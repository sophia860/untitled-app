// v6-MOBILE-FIRST
import { useState, useEffect } from "react";
import { SiteNote } from "@/api/entities";

const C = {
  paper:    "#f0ebe1",
  ink:      "#1a1a18",
  inkGhost: "rgba(26,26,24,0.08)",
  thread:   "#c94a3a",
  grey:     "#6b6560",
  lightGrey:"#a09a93",
  white:    "#faf8f4",
  linen:    "#ede8dd",
};

const serif  = { fontFamily: "'Times New Roman', Times, Georgia, serif" };
const caveat = { fontFamily: "'Caveat', cursive" };
const kalam  = { fontFamily: "'Kalam', cursive" };
const mono   = { fontFamily: "'Courier New', Courier, monospace" };

const FREE_POEMS = [
  {
    id: 1, num: "001", title: "INBOUND",
    annotation: "overheard at Newark, gate C42",
    postmark: "JFK · 14 SEP",
    to: "anyone who has ever arrived somewhere",
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
    id: 2, num: "009", title: "COCKROACH",
    annotation: "3am, Brooklyn, first week",
    postmark: "BKN · 3 OCT",
    to: "the thing that does not apologise",
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
  },
  {
    id: 3, num: "020", title: "STILL HERE",
    annotation: "kitchen, Flatbush, Tuesday",
    postmark: "NYC · 22 NOV",
    to: "the minute I thought I wouldn't get",
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
  },
  {
    id: 4, num: "010", title: "BODEGA FLOWERS",
    annotation: "Atlantic Ave, every Saturday",
    postmark: "ATL · 8 OCT",
    to: "my mother, wherever this finds her",
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
  },
];

const SHOP_ITEMS = [
  {
    id: "collection", label: "ARCHIVE — 001", title: "The Only Life",
    fragment: "\"The body logged the ward. The body logged the Cairngorm plateau in February. The ward is over. The body continues logging.\"",
    desc: "Twenty poems. New York. The body after the ward. Scotland in the bones. You will find yourself inside them.",
    price: "£12", format: "Digital PDF · Yours immediately",
    paypal: "https://paypal.me/Sophiasharkey330", featured: true,
  },
  {
    id: "prompts", label: "TOOLS — 001", title: "Write What Survives",
    fragment: "\"Object first. Feeling never.\"",
    desc: "Prompts built around the same logic as the collection. For poets who want to write the thing without explaining it.",
    price: "£8", format: "Digital PDF · Yours immediately",
    paypal: "https://paypal.me/Sophiasharkey330", featured: false,
  },
  {
    id: "intensive", label: "INTENSIVE — 001", title: "The Object Is the Meaning",
    fragment: "\"You bring the object. We find what's inside it.\"",
    desc: "A condensed version of the intensive. Video, exercises, feedback.",
    price: "£45", format: "Digital · Lifetime access",
    paypal: "https://paypal.me/Sophiasharkey330", featured: false,
  },
];

function PoemCard({ poem, colors, saved, onToggleSave }) {
  const [open, setOpen] = useState(false);
  const col = colors || C;
  return (
    <div style={{
      background: col.white,
      border: `1px solid ${col.inkGhost}`,
      borderTopWidth: "2px",
      borderTopColor: open ? col.thread : col.ink,
      marginBottom: "12px",
      transition: "border-color 0.3s, background 0.3s",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "20px 22px", textAlign: "left", display: "flex",
          justifyContent: "space-between", alignItems: "flex-start",
        }}
      >
        <div>
          <p style={{ ...mono, fontSize: "9px", color: col.lightGrey, margin: "0 0 4px", letterSpacing: "0.18em" }}>{poem.num} · {poem.postmark}</p>
          <p style={{ ...serif, fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: "600", color: col.ink, margin: "0 0 4px" }}>{poem.title}</p>
          <p style={{ ...kalam, fontSize: "13px", color: col.lightGrey, margin: 0 }}>— {poem.annotation}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px", flexShrink: 0, marginTop: "2px" }}>
          <button
            onClick={e => { e.stopPropagation(); onToggleSave && onToggleSave(poem.id); }}
            aria-label={saved ? "Remove from saved" : "Save poem"}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", fontSize: "16px", lineHeight: 1, color: saved ? col.thread : col.lightGrey, transition: "color 0.2s, transform 0.15s", transform: saved ? "scale(1.15)" : "scale(1)" }}
          >
            {saved ? "♥" : "♡"}
          </button>
          <span style={{ ...serif, fontSize: "18px", color: col.lightGrey }}>{open ? "−" : "+"}</span>
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 22px 28px" }}>
          <div style={{ borderTop: `1px solid ${col.inkGhost}`, paddingTop: "18px", marginBottom: "20px" }}>
            {poem.lines.map((line, j) => (
              <p key={j} style={{ ...serif, fontSize: "16px", color: col.ink, lineHeight: "1.95", margin: 0, minHeight: line === "" ? "1em" : "auto" }}>{line}</p>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${col.inkGhost}`, paddingTop: "16px" }}>
            <p style={{ ...mono, fontSize: "8px", color: col.lightGrey, margin: "0 0 4px", letterSpacing: "0.16em" }}>TO:</p>
            <p style={{ ...kalam, fontSize: "14px", color: col.ink, margin: "0 0 16px" }}>{poem.to}</p>
            <a href="#archive" style={{ ...serif, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: col.ink, textDecoration: "none", borderBottom: `1px solid ${col.ink}`, paddingBottom: "2px" }}>
              Get the full collection →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noteSent, setNoteSent] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [savedIds, setSavedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bea-saved-poems") || "[]"); } catch { return []; }
  });

  const toggleSave = (id) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("bea-saved-poems", JSON.stringify(next));
      return next;
    });
  };

  const savedPoems = FREE_POEMS.filter(p => savedIds.includes(p.id));

  const D = darkMode ? {
    paper:    "#0f0e0c",
    ink:      "#f0ebe1",
    inkGhost: "rgba(240,235,225,0.1)",
    thread:   "#e05a48",
    grey:     "#a09a93",
    lightGrey:"#6b6560",
    white:    "#1a1916",
    linen:    "#161410",
  } : C;

  useEffect(() => {
    if (!document.getElementById("bea-fonts")) {
      const link = document.createElement("link");
      link.id = "bea-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Kalam:wght@300;400;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const sendNote = async () => {
    if (!note.trim()) return;
    try {
      await SiteNote.create({ section: "General", note: note.trim(), status: "new", url: "mobile" });
      setNoteSent(true);
      setNote("");
      setTimeout(() => setNoteOpen(false), 1500);
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ background: D.paper, color: D.ink, overflowX: "hidden", minHeight: "100vh", transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{margin:0;background:#f0ebe1;-webkit-font-smoothing:antialiased;}
        ::selection{background:rgba(201,74,58,0.13);}
        input::placeholder,textarea::placeholder{color:#a09a93;}
        a:focus-visible,button:focus-visible{outline:2px solid #c94a3a;outline-offset:3px;}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: darkMode ? "rgba(15,14,12,0.97)" : "rgba(240,235,225,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${D.inkGhost}`, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.3s" }}>
        <a href="#" style={{ ...caveat, fontSize: "22px", fontWeight: "700", color: D.ink, textDecoration: "none" }}>Bea Sophia</a>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Dark mode toggle */}
          <button onClick={() => setDarkMode(d => !d)} aria-label="Toggle dark mode"
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
            <span style={{ ...serif, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: D.lightGrey }}>{darkMode ? "Day" : "Eve"}</span>
            <div style={{ width: "36px", height: "20px", borderRadius: "10px", background: darkMode ? D.thread : D.inkGhost, border: `1px solid ${darkMode ? D.thread : "rgba(26,26,24,0.2)"}`, position: "relative", transition: "background 0.3s" }}>
              <div style={{ position: "absolute", top: "3px", left: darkMode ? "17px" : "3px", width: "12px", height: "12px", borderRadius: "50%", background: darkMode ? D.ink : D.grey, transition: "left 0.3s" }} />
            </div>
          </button>
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: "22px", height: "1.5px", background: D.ink, transition: "opacity 0.2s", opacity: menuOpen && i===1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{ background: D.paper, borderBottom: `1px solid ${D.inkGhost}`, padding: "20px 24px 24px", transition: "background 0.3s" }}>
          {[["Read free poems","#reading-room"],...(savedPoems.length > 0 ? [["Saved fragments","#saved-fragments"]] : []),["Buy the collection","#archive"],["The Journal","#gallery-journal"],["About","#about"]].map(([l,h]) => (
            <a key={l} href={h} onClick={() => setMenuOpen(false)} style={{ ...serif, display: "block", fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", color: D.ink, textDecoration: "none", padding: "12px 0", borderBottom: `1px solid ${D.inkGhost}` }}>{l}</a>
          ))}
        </div>
      )}

      {/* HERO */}
      <section style={{ padding: "60px 24px 64px", position: "relative", overflow: "hidden", background: D.paper, transition: "background 0.3s" }}>
        <div style={{ position: "absolute", top: "80px", left: 0, right: 0, height: "1px", background: D.thread, opacity: 0.2 }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "24px", width: "1px", background: D.thread, opacity: 0.12 }} />

        <p style={{ ...serif, fontSize: "9px", letterSpacing: "0.34em", textTransform: "uppercase", color: D.lightGrey, margin: "0 0 20px" }}>
          The Page Gallery · A collection of minds
        </p>
        <h1 style={{ ...caveat, fontSize: "clamp(44px, 12vw, 72px)", fontWeight: "700", lineHeight: "1.05", color: D.ink, margin: "0 0 20px" }}>
          What happens<br />to a thought<br />when the person<br />who had it dies?
        </h1>
        <div style={{ width: "44px", height: "1.5px", background: D.thread, margin: "0 0 20px" }} />
        <p style={{ ...serif, fontSize: "16px", color: D.grey, lineHeight: "1.8", margin: "0 0 36px", maxWidth: "340px" }}>
          Walk around inside someone else's mind. The poems are what we found.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <a href="#reading-room" style={{ ...serif, display: "block", background: D.ink, color: D.white, padding: "16px 28px", textDecoration: "none", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", textAlign: "center" }}>
            Read free poems
          </a>
          <a href="#archive" style={{ ...serif, display: "block", border: `1px solid ${D.inkGhost}`, color: D.ink, padding: "16px 28px", textDecoration: "none", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", textAlign: "center" }}>
            Buy the collection — £12
          </a>
        </div>

        <div aria-hidden="true" style={{ position: "absolute", right: "8px", top: "40px", bottom: "40px", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1.5px solid ${D.inkGhost}` }} />
          ))}
        </div>
      </section>

      {/* READING ROOM */}
      <section id="reading-room" style={{ background: D.linen, padding: "56px 24px 64px", borderTop: `1px solid ${D.inkGhost}`, transition: "background 0.3s" }}>
        <p style={{ ...serif, fontSize: "8px", letterSpacing: "0.34em", textTransform: "uppercase", color: D.lightGrey, margin: "0 0 10px" }}>Reading Room · Free</p>
        <h2 style={{ ...caveat, fontWeight: "700", fontSize: "clamp(36px, 10vw, 60px)", color: D.ink, margin: "0 0 8px", lineHeight: "1.05" }}>Pick one up.</h2>
        <p style={{ ...serif, fontSize: "13px", color: D.lightGrey, margin: "0 0 32px", lineHeight: "1.6" }}>
          Four poems from the collection. The rest are inside.
        </p>
        {FREE_POEMS.map(poem => <PoemCard key={poem.id} poem={poem} colors={D} saved={savedIds.includes(poem.id)} onToggleSave={toggleSave} />)}
        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <a href="#archive" style={{ ...serif, fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: D.grey, textDecoration: "none", borderBottom: `1px solid ${D.inkGhost}`, paddingBottom: "2px" }}>
            Twenty poems in the full collection →
          </a>
        </div>
      </section>

      {/* SAVED FRAGMENTS */}
      {savedPoems.length > 0 && (
        <section id="saved-fragments" style={{ background: D.paper, padding: "56px 24px 64px", borderTop: `2px solid ${D.thread}`, transition: "background 0.3s" }}>
          <p style={{ ...serif, fontSize: "8px", letterSpacing: "0.34em", textTransform: "uppercase", color: D.thread, margin: "0 0 10px" }}>Saved Fragments · {savedPoems.length}</p>
          <h2 style={{ ...caveat, fontWeight: "700", fontSize: "clamp(32px, 9vw, 54px)", color: D.ink, margin: "0 0 8px", lineHeight: "1.05" }}>Your collection.</h2>
          <p style={{ ...serif, fontSize: "13px", color: D.lightGrey, margin: "0 0 28px", lineHeight: "1.6" }}>
            The ones you kept.
          </p>
          {savedPoems.map(poem => (
            <PoemCard key={poem.id} poem={poem} colors={D} saved={true} onToggleSave={toggleSave} />
          ))}
        </section>
      )}

      {/* ARCHIVE */}
      <section id="archive" style={{ background: D.ink, color: D.white, padding: "56px 24px 64px", transition: "background 0.3s" }}>
        <p style={{ ...serif, fontSize: "8px", letterSpacing: "0.34em", textTransform: "uppercase", color: D.lightGrey, margin: "0 0 10px" }}>The Archive</p>
        <h2 style={{ ...caveat, fontWeight: "700", fontSize: "clamp(36px, 10vw, 60px)", color: D.white, margin: "0 0 36px", lineHeight: "1.05" }}>Things worth keeping.</h2>
        {SHOP_ITEMS.map((item) => (
          <div key={item.id} style={{
            background: item.featured ? D.paper : "rgba(240,235,225,0.05)",
            color: item.featured ? D.ink : D.white,
            borderTop: item.featured ? `3px solid ${D.thread}` : `1px solid ${D.inkGhost}`,
            padding: "28px 24px",
            marginBottom: "2px",
            transition: "background 0.3s",
          }}>
            <p style={{ ...serif, fontSize: "8px", letterSpacing: "0.26em", textTransform: "uppercase", color: item.featured ? D.lightGrey : D.lightGrey, margin: "0 0 10px" }}>{item.label}</p>
            <h3 style={{ ...caveat, fontWeight: "700", fontSize: "clamp(26px, 7vw, 42px)", margin: "0 0 12px", lineHeight: "1.05" }}>{item.title}</h3>
            <p style={{ ...kalam, fontSize: "15px", color: item.featured ? D.grey : D.grey, lineHeight: "1.7", margin: "0 0 14px", fontStyle: "italic" }}>{item.fragment}</p>
            <p style={{ ...serif, fontSize: "13px", lineHeight: "1.8", color: item.featured ? D.grey : D.grey, margin: "0 0 20px" }}>{item.desc}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ ...serif, fontSize: "22px", fontWeight: "300", margin: "0 0 2px" }}>{item.price}</p>
                <p style={{ ...serif, fontSize: "9px", color: D.lightGrey, margin: 0 }}>{item.format}</p>
              </div>
              <a href={item.paypal} target="_blank" rel="noopener noreferrer" style={{
                ...serif, display: "inline-block",
                background: item.featured ? D.ink : D.inkGhost,
                color: D.white,
                border: item.featured ? "none" : `1px solid ${D.inkGhost}`,
                padding: "14px 32px", textDecoration: "none", fontSize: "10px",
                letterSpacing: "0.2em", textTransform: "uppercase",
              }}>Buy</a>
            </div>
          </div>
        ))}
      </section>

      {/* JOURNAL */}
      <section id="gallery-journal" style={{ background: D.paper, padding: "56px 24px 64px", borderTop: `1px solid ${D.inkGhost}`, transition: "background 0.3s" }}>
        <p style={{ ...serif, fontSize: "8px", letterSpacing: "0.34em", textTransform: "uppercase", color: D.lightGrey, margin: "0 0 10px" }}>The Page Gallery Journal</p>
        <h3 style={{ ...caveat, fontWeight: "700", fontSize: "clamp(32px, 9vw, 56px)", margin: "0 0 14px", lineHeight: "1.05", color: D.ink }}>
          Nobody gets to walk around inside someone else's mind.
        </h3>
        <div style={{ width: "36px", height: "1.5px", background: D.thread, margin: "0 0 20px" }} />
        <p style={{ ...serif, fontSize: "15px", color: D.grey, lineHeight: "1.9", margin: "0 0 14px" }}>
          When I got sick, I realised that when people die, all their thoughts die with them.
        </p>
        <p style={{ ...serif, fontSize: "15px", color: D.grey, lineHeight: "1.9", margin: "0 0 28px" }}>
          I started collecting fragments — conversations overheard, things said in the wrong order, thoughts that had nowhere to go. That became The Page Gallery Journal.
        </p>
        <div style={{ background: D.white, borderTop: `2px solid ${D.ink}`, padding: "24px", marginBottom: "28px", transition: "background 0.3s" }}>
          <p style={{ ...serif, fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: D.lightGrey, margin: "0 0 12px" }}>Fragment — 047</p>
          <p style={{ ...caveat, fontWeight: "600", fontSize: "22px", color: D.ink, margin: "0 0 10px", lineHeight: "1.35" }}>She said it like she was correcting a mistake.</p>
          <p style={{ ...kalam, fontSize: "13px", color: D.lightGrey, margin: 0 }}>— overheard, Pret a Manger, Soho</p>
        </div>
        <a href="#" style={{ ...serif, display: "inline-block", border: `1px solid ${D.inkGhost}`, color: D.ink, textDecoration: "none", padding: "14px 28px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Visit the Journal
        </a>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: D.linen, padding: "56px 24px 64px", borderTop: `1px solid ${D.inkGhost}`, transition: "background 0.3s" }}>
        <p style={{ ...serif, fontSize: "8px", letterSpacing: "0.34em", textTransform: "uppercase", color: D.lightGrey, margin: "0 0 10px" }}>About</p>
        <h2 style={{ ...caveat, fontWeight: "700", fontSize: "clamp(36px, 10vw, 60px)", color: D.ink, margin: "0 0 20px", lineHeight: "1.05" }}>
          Bea Sophia.<br />New York City.
        </h2>
        <p style={{ ...serif, fontSize: "15px", color: D.grey, lineHeight: "1.95", margin: "0 0 14px" }}>
          I got sick and I started collecting. Fragments of conversation. Things people said and didn't know they'd said. Thoughts that live in one mind and die there.
        </p>
        <p style={{ ...serif, fontSize: "15px", color: D.grey, lineHeight: "1.95", margin: "0 0 14px" }}>
          The Page Gallery Journal was the first attempt to stop that. These poems are the second.
        </p>
        <p style={{ ...serif, fontSize: "15px", color: D.grey, lineHeight: "1.95", margin: "0 0 28px" }}>
          I also run writing intensives for poets who are serious about the work. I adore spaghetti.
        </p>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{ ...serif, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: D.grey, textDecoration: "none", borderBottom: `1px solid ${D.inkGhost}`, paddingBottom: "2px" }}>
          @bsophialovesgnochi
        </a>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: D.paper, padding: "56px 24px 64px", borderTop: `1px solid ${D.inkGhost}`, transition: "background 0.3s" }}>
        <p style={{ ...serif, fontSize: "8px", letterSpacing: "0.34em", textTransform: "uppercase", color: D.lightGrey, margin: "0 0 10px" }}>Letters</p>
        <h3 style={{ ...caveat, fontWeight: "700", fontSize: "clamp(32px, 9vw, 56px)", color: D.ink, margin: "0 0 14px", lineHeight: "1.05" }}>
          New fragments,<br />when they exist.
        </h3>
        <p style={{ ...serif, fontSize: "15px", color: D.grey, lineHeight: "1.85", margin: "0 0 28px" }}>
          No schedule. No newsletter voice. The thing itself when it's ready.
        </p>
        {done ? (
          <p style={{ ...serif, fontSize: "15px", color: D.grey, fontStyle: "italic" }}>You're in.</p>
        ) : (
          <form onSubmit={e => { e.preventDefault(); if (email) setDone(true); }} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "360px" }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" aria-label="Email address"
              style={{ ...serif, padding: "14px 16px", border: `1px solid ${D.inkGhost}`, fontSize: "15px", background: D.white, outline: "none", color: D.ink }} />
            <button type="submit" style={{ ...serif, background: D.ink, color: D.white, border: "none", padding: "15px", fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer" }}>
              Subscribe
            </button>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ background: D.paper, padding: "24px", borderTop: `1px solid ${D.inkGhost}`, display: "flex", flexDirection: "column", gap: "12px", transition: "background 0.3s" }}>
        <span style={{ ...serif, fontSize: "11px", color: D.lightGrey }}>© Bea Sophia</span>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {[["Instagram","https://instagram.com/bsophialovesgnochi"],["The Page Gallery Journal","#"]].map(([l,h]) => (
            <a key={l} href={h} target={h.startsWith("http")?"_blank":undefined} rel="noopener noreferrer"
              style={{ ...serif, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: D.lightGrey, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>

      {/* FEEDBACK BUTTON */}
      <button onClick={() => setNoteOpen(o => !o)}
        style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 999, width: "44px", height: "44px", borderRadius: "50%", background: D.ink, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(26,26,24,0.2)" }}>
        <span style={{ color: D.white, fontSize: noteOpen ? "18px" : "14px" }}>{noteOpen ? "×" : "✎"}</span>
      </button>
      {noteOpen && (
        <div style={{ position: "fixed", bottom: "80px", right: "20px", left: "20px", zIndex: 998, background: D.white, boxShadow: "0 8px 36px rgba(26,26,24,0.14)", borderTop: `2.5px solid ${D.ink}`, padding: "20px", transition: "background 0.3s" }}>
          <p style={{ ...serif, fontSize: "13px", color: D.ink, margin: "0 0 12px" }}>Leave a note. I'll action it.</p>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What needs changing…" rows={3}
            style={{ ...serif, width: "100%", padding: "10px 12px", border: `1px solid ${D.inkGhost}`, background: D.paper, color: D.ink, fontSize: "14px", resize: "none", outline: "none", lineHeight: "1.6", boxSizing: "border-box", marginBottom: "10px" }} />
          {noteSent
            ? <p style={{ ...serif, fontSize: "13px", color: D.grey, fontStyle: "italic" }}>Noted ✓</p>
            : <button onClick={sendNote} disabled={!note.trim()} style={{ ...serif, background: note.trim() ? D.ink : D.lightGrey, color: D.white, border: "none", padding: "11px 24px", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: note.trim() ? "pointer" : "default" }}>Send</button>
          }
        </div>
      )}
    </div>
  );
}