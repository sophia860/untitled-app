import { useState, useEffect, useRef } from "react";

// ── POEM DATA ─────────────────────────────────────────────────────────────────
const POEMS = [
  {
    id: 1, num: "01", title: "INBOUND",
    excerpt: ["I have one bag checked and one theory about myself", "I'm not ready to test yet."],
    rotation: -2.3, left: "4%", top: "5%", width: "270px",
  },
  {
    id: 2, num: "03", title: "FIRST MORNING, BROOKLYN",
    excerpt: ["The rat has no interest in my history.", "", "I feel, for the first time in two years,", "genuinely less alone."],
    rotation: 1.6, left: "48%", top: "2%", width: "290px",
  },
  {
    id: 3, num: "09", title: "COCKROACH",
    excerpt: ["something had passed through it in the night", "and not apologised", "and I was glad."],
    rotation: -1.4, left: "24%", top: "40%", width: "255px",
  },
  {
    id: 4, num: "10", title: "BODEGA FLOWERS",
    excerpt: ["Wrong colours. Wrong proportions.", "Alive.", "That's the whole requirement."],
    rotation: 3.2, left: "60%", top: "46%", width: "248px",
  },
  {
    id: 5, num: "16", title: "WHAT THE BODY KEEPS",
    excerpt: ["Not to feel something.", "To confirm the record is still there."],
    rotation: -2.1, left: "6%", top: "72%", width: "260px",
  },
  {
    id: 6, num: "20", title: "STILL HERE",
    excerpt: ["I am not monitoring.", "I am not waiting.", "", "The tap drips.", "I let it."],
    rotation: 1.1, left: "66%", top: "74%", width: "242px",
  },
];

const SHOP_ITEMS = [
  {
    id: "collection",
    type: "COLLECTION",
    title: "The Only Life",
    desc: "Twenty poems. Four movements: Arrival, Grotesque, Beautiful, The Only Life. Nature in New York City — the rat, the cockroach, the fig tree growing from the wall. Scotland and Yorkshire in the body. The body after the ward.",
    price: "£12",
    format: "Digital PDF · Instant delivery",
    paypal: "https://paypal.me/Sophiasharkey330",
  },
  {
    id: "prompts",
    type: "PROMPT PACK",
    title: "Write What Survives",
    desc: "Prompts built around the same logic as The Only Life — object first, feeling never. For poets who want to write the thing without explaining it.",
    price: "£8",
    format: "Digital PDF · Instant delivery",
    paypal: "https://paypal.me/Sophiasharkey330",
  },
  {
    id: "intensive",
    type: "MINI INTENSIVE",
    title: "The Object Is the Meaning",
    desc: "A condensed version of Bea's popular writing intensive. Video + exercises + feedback. You bring the object. We find what's inside it.",
    price: "£45",
    format: "Digital · Lifetime access",
    paypal: "https://paypal.me/Sophiasharkey330",
  },
];

// ── STYLES ────────────────────────────────────────────────────────────────────
const CREAM = "#f7f5f1";
const INK = "#1a1a18";
const GREY = "#6b6b62";
const LIGHT_GREY = "#9b9b90";
const WHITE = "#ffffff";

const mono = { fontFamily: "'Georgia', 'Times New Roman', serif" };

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function Nav({ scrollY }) {
  const solid = scrollY > 80;
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "26px 52px",
      background: solid ? "rgba(247,245,241,0.97)" : "transparent",
      backdropFilter: solid ? "blur(16px)" : "none",
      borderBottom: solid ? `1px solid rgba(26,26,24,0.07)` : "none",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      ...mono,
    }}>
      <a href="#" style={{ fontSize: "12px", letterSpacing: "0.24em", textTransform: "uppercase", color: INK, textDecoration: "none" }}>
        Bea Sophia
      </a>
      <div style={{ display: "flex", gap: "44px" }}>
        {[["Poems", "#poems"], ["Shop", "#shop"], ["About", "#about"], ["Journal", "#journal"]].map(([label, href]) => (
          <a key={label} href={href} style={{
            fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
            color: LIGHT_GREY, textDecoration: "none", transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = INK}
            onMouseLeave={e => e.target.style.color = LIGHT_GREY}
          >{label}</a>
        ))}
      </div>
    </nav>
  );
}

function Hero({ scrollY }) {
  const [in_, setIn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setIn(true), 120); return () => clearTimeout(t); }, []);

  const fade = Math.max(0, 1 - scrollY / 480);
  const lift = scrollY * 0.22;

  return (
    <section style={{
      height: "100vh", minHeight: "680px",
      display: "flex", flexDirection: "column",
      justifyContent: "flex-end",
      padding: "0 52px 88px",
      position: "relative", overflow: "hidden",
      opacity: fade, transform: `translateY(${lift}px)`,
      ...mono,
    }}>
      {/* Rule */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0,
        height: "1px", background: `rgba(26,26,24,0.05)`,
        transform: "translateY(-50%)",
      }} />

      {/* Content */}
      <div style={{
        opacity: in_ ? 1 : 0,
        transform: in_ ? "translateY(0)" : "translateY(32px)",
        transition: "all 1.6s cubic-bezier(0.16,1,0.3,1)",
        maxWidth: "680px",
      }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.32em", textTransform: "uppercase", color: LIGHT_GREY, margin: "0 0 22px" }}>
          A poetry collection
        </p>
        <h1 style={{
          fontSize: "clamp(58px, 10vw, 118px)", fontWeight: "400",
          lineHeight: "0.92", letterSpacing: "-0.035em",
          color: INK, margin: "0 0 38px",
        }}>
          The<br />Only<br />Life.
        </h1>
        <p style={{
          fontSize: "clamp(14px, 1.5vw, 17px)", color: GREY,
          lineHeight: "1.9", maxWidth: "400px", margin: "0 0 52px",
        }}>
          Twenty poems. Nature in New York.
          The body after the ward. What keeps going
          when the reason is unclear.
        </p>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <a href="#shop" style={{
            background: INK, color: CREAM,
            padding: "15px 42px", textDecoration: "none",
            fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
            transition: "opacity 0.22s",
          }}
            onMouseEnter={e => e.target.style.opacity = "0.78"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >Buy — £12</a>
          <a href="#poems" style={{
            fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
            color: GREY, textDecoration: "none",
            borderBottom: `1px solid rgba(107,107,98,0.35)`, paddingBottom: "3px",
            transition: "color 0.2s, border-color 0.2s",
          }}
            onMouseEnter={e => { e.target.style.color = INK; e.target.style.borderColor = INK; }}
            onMouseLeave={e => { e.target.style.color = GREY; e.target.style.borderColor = "rgba(107,107,98,0.35)"; }}
          >Read first</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "44px", right: "52px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
        opacity: scrollY > 50 ? 0 : 0.35, transition: "opacity 0.4s",
      }}>
        <span style={{ fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: LIGHT_GREY, writingMode: "vertical-rl" }}>Scroll</span>
        <div style={{ width: "1px", height: "52px", background: INK, animation: "pulse 2.2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

function ManuscriptsSection() {
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="poems" ref={ref} style={{
      padding: "130px 52px 160px",
      borderTop: `1px solid rgba(26,26,24,0.07)`,
      ...mono,
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
        marginBottom: "90px",
      }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: LIGHT_GREY, margin: "0 0 14px" }}>
          From the collection
        </p>
        <h2 style={{ fontSize: "clamp(22px, 3.2vw, 40px)", fontWeight: "400", color: INK, margin: 0, letterSpacing: "-0.015em" }}>
          Twenty poems, scattered.
        </h2>
      </div>

      {/* The floor */}
      <div style={{ position: "relative", height: "820px" }}>
        {POEMS.map((poem, i) => {
          const isHovered = hovered === poem.id;
          return (
            <div
              key={poem.id}
              onMouseEnter={() => setHovered(poem.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute",
                left: poem.left, top: poem.top,
                width: poem.width,
                background: WHITE,
                padding: "26px 26px 30px",
                transform: `rotate(${poem.rotation}deg) translateY(${isHovered ? -14 : 0}px) scale(${isHovered ? 1.02 : 1})`,
                boxShadow: isHovered
                  ? "0 28px 70px rgba(26,26,24,0.18)"
                  : "0 2px 18px rgba(26,26,24,0.06)",
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease",
                zIndex: isHovered ? 30 : i + 1,
                borderTop: `2px solid ${INK}`,
                cursor: "default",
                opacity: visible ? 1 : 0,
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: "#c8c5bc" }}>{poem.num}</span>
                <span style={{ fontSize: "8px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c8c5bc" }}>The Only Life</span>
              </div>
              <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: INK, margin: "0 0 14px", fontWeight: "600", lineHeight: "1.5" }}>
                {poem.title}
              </p>
              <div style={{ borderTop: `1px solid rgba(26,26,24,0.07)`, paddingTop: "14px" }}>
                {poem.excerpt.map((line, j) => (
                  <p key={j} style={{
                    fontSize: "13px", color: "#484840", lineHeight: "1.9",
                    margin: 0, fontStyle: "italic",
                    minHeight: line === "" ? "0.85em" : "auto",
                  }}>{line}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <a href="#shop" style={{
          fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
          color: GREY, textDecoration: "none",
          borderBottom: `1px solid rgba(107,107,98,0.3)`, paddingBottom: "3px",
          transition: "color 0.2s, border-color 0.2s",
        }}
          onMouseEnter={e => { e.target.style.color = INK; e.target.style.borderColor = INK; }}
          onMouseLeave={e => { e.target.style.color = GREY; e.target.style.borderColor = "rgba(107,107,98,0.3)"; }}
        >
          Get the full collection →
        </a>
      </div>
    </section>
  );
}

function ShopSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="shop" ref={ref} style={{
      padding: "130px 52px",
      borderTop: `1px solid rgba(26,26,24,0.07)`,
      background: WHITE,
      ...mono,
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
        marginBottom: "80px",
      }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: LIGHT_GREY, margin: "0 0 14px" }}>Shop</p>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 40px)", fontWeight: "400", color: INK, margin: 0, letterSpacing: "-0.015em" }}>
          Things worth buying.
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2px",
      }}>
        {SHOP_ITEMS.map((item, i) => (
          <div key={item.id} style={{
            padding: "52px 44px",
            background: i === 0 ? INK : CREAM,
            color: i === 0 ? CREAM : INK,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
          }}>
            <p style={{
              fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase",
              color: i === 0 ? "rgba(247,245,241,0.45)" : LIGHT_GREY,
              margin: "0 0 24px",
            }}>{item.type}</p>
            <h3 style={{ fontSize: "clamp(18px, 2vw, 26px)", fontWeight: "400", margin: "0 0 20px", letterSpacing: "-0.01em" }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: "14px", lineHeight: "1.85",
              color: i === 0 ? "rgba(247,245,241,0.7)" : GREY,
              margin: "0 0 40px",
            }}>{item.desc}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "22px", fontWeight: "400", margin: "0 0 6px" }}>{item.price}</p>
                <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: i === 0 ? "rgba(247,245,241,0.4)" : LIGHT_GREY, margin: 0 }}>{item.format}</p>
              </div>
              <a href={item.paypal} style={{
                display: "inline-block",
                background: i === 0 ? CREAM : INK,
                color: i === 0 ? INK : CREAM,
                padding: "13px 32px", textDecoration: "none",
                fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
                transition: "opacity 0.22s",
              }}
                onMouseEnter={e => e.target.style.opacity = "0.78"}
                onMouseLeave={e => e.target.style.opacity = "1"}
              >Buy</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function JournalBanner() {
  return (
    <section id="journal" style={{
      background: INK, color: CREAM,
      padding: "110px 52px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "80px",
      alignItems: "center",
      ...mono,
    }}>
      <div>
        <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(247,245,241,0.35)", margin: "0 0 20px" }}>
          Also
        </p>
        <h3 style={{ fontSize: "clamp(24px, 3.5vw, 48px)", fontWeight: "400", margin: "0 0 22px", lineHeight: "1.05", letterSpacing: "-0.02em" }}>
          The Page<br />Gallery Journal
        </h3>
        <p style={{ fontSize: "15px", color: "rgba(247,245,241,0.55)", lineHeight: "1.85", margin: "0 0 44px", maxWidth: "380px" }}>
          A literary journal. Founded by Bea Sophia.
          Serious work. Carefully chosen.
        </p>
        <a href="#" style={{
          display: "inline-block",
          color: CREAM, textDecoration: "none",
          fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
          border: "1px solid rgba(247,245,241,0.2)",
          padding: "14px 36px",
          transition: "border-color 0.25s",
        }}
          onMouseEnter={e => e.target.style.borderColor = "rgba(247,245,241,0.65)"}
          onMouseLeave={e => e.target.style.borderColor = "rgba(247,245,241,0.2)"}
        >Visit the Journal</a>
      </div>

      {/* Stacked manuscript visual */}
      <div style={{ position: "relative", height: "340px" }}>
        {[3, 2, 1, 0].map(offset => (
          <div key={offset} style={{
            position: "absolute",
            top: `${offset * 9}px`, left: `${offset * 7}px`,
            right: `${-offset * 7}px`, bottom: 0,
            background: offset === 0 ? "rgba(247,245,241,0.06)" : `rgba(247,245,241,0.02)`,
            border: "1px solid rgba(247,245,241,0.08)",
            borderTop: offset === 0 ? "2px solid rgba(247,245,241,0.3)" : "1px solid rgba(247,245,241,0.05)",
            transform: `rotate(${(offset - 1.5) * 1.1}deg)`,
            padding: offset === 0 ? "36px" : 0,
          }}>
            {offset === 0 && (
              <>
                <p style={{ fontSize: "8px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(247,245,241,0.25)", margin: "0 0 24px" }}>
                  The Page Gallery Journal
                </p>
                <p style={{ fontSize: "15px", fontWeight: "400", color: "rgba(247,245,241,0.7)", margin: "0 0 18px", lineHeight: "1.4", letterSpacing: "-0.01em" }}>
                  New issue.<br />Now open.
                </p>
                <div style={{ width: "32px", height: "1px", background: "rgba(247,245,241,0.2)", margin: "0 0 20px" }} />
                <p style={{ fontSize: "12px", color: "rgba(247,245,241,0.35)", lineHeight: "1.8", fontStyle: "italic", margin: 0 }}>
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

function AboutSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} style={{
      padding: "130px 52px",
      borderTop: `1px solid rgba(26,26,24,0.07)`,
      maxWidth: "720px",
      ...mono,
    }}>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: LIGHT_GREY, margin: "0 0 20px" }}>About</p>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 38px)", fontWeight: "400", color: INK, margin: "0 0 36px", letterSpacing: "-0.015em", lineHeight: "1.12" }}>
          Bea Sophia is a poet<br />based in New York City.
        </h2>
        <p style={{ fontSize: "16px", color: GREY, lineHeight: "1.9", margin: "0 0 20px" }}>
          She is the founder of The Page Gallery Journal. She runs writing intensives,
          and makes prompt packs and workbooks for poets who are serious about the work.
        </p>
        <p style={{ fontSize: "16px", color: GREY, lineHeight: "1.9", margin: "0 0 44px" }}>
          Her work is interested in survival — not as metaphor, but as fact.
          The thing that kept going. The body that kept going.
          What grows in the crack. What the crack costs.
        </p>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer" style={{
          fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
          color: GREY, textDecoration: "none",
          borderBottom: `1px solid rgba(107,107,98,0.35)`, paddingBottom: "3px",
          transition: "color 0.2s, border-color 0.2s",
        }}
          onMouseEnter={e => { e.target.style.color = INK; e.target.style.borderColor = INK; }}
          onMouseLeave={e => { e.target.style.color = GREY; e.target.style.borderColor = "rgba(107,107,98,0.35)"; }}
        >@bsophialovesgnochi</a>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section style={{
      padding: "110px 52px",
      borderTop: `1px solid rgba(26,26,24,0.07)`,
      background: CREAM,
      ...mono,
    }}>
      <div style={{ maxWidth: "520px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: LIGHT_GREY, margin: "0 0 20px" }}>Letters</p>
        <h3 style={{ fontSize: "clamp(20px, 2.8vw, 36px)", fontWeight: "400", color: INK, margin: "0 0 18px", letterSpacing: "-0.015em" }}>
          New work, when it exists.
        </h3>
        <p style={{ fontSize: "15px", color: GREY, lineHeight: "1.85", margin: "0 0 44px" }}>
          No frequency promised. No updates, no musings.
          Something worth reading when it arrives.
        </p>
        {submitted ? (
          <p style={{ fontSize: "14px", color: GREY, fontStyle: "italic" }}>You're in.</p>
        ) : (
          <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }}
            style={{ display: "flex", maxWidth: "420px" }}>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email"
              style={{
                flex: 1, padding: "15px 18px",
                border: `1px solid rgba(26,26,24,0.16)`,
                borderRight: "none", fontSize: "14px",
                fontFamily: "Georgia, serif", background: WHITE,
                outline: "none", color: INK,
              }}
            />
            <button type="submit" style={{
              background: INK, color: CREAM,
              border: "none", padding: "15px 26px",
              fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
              cursor: "pointer", fontFamily: "Georgia, serif",
              whiteSpace: "nowrap", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.target.style.opacity = "0.78"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: "36px 52px",
      borderTop: `1px solid rgba(26,26,24,0.07)`,
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: "16px",
      ...mono,
    }}>
      <span style={{ fontSize: "11px", color: LIGHT_GREY, letterSpacing: "0.1em" }}>© Bea Sophia</span>
      <div style={{ display: "flex", gap: "36px" }}>
        {[
          ["Instagram", "https://instagram.com/bsophialovesgnochi"],
          ["The Page Gallery Journal", "#"],
        ].map(([label, href]) => (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: LIGHT_GREY, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = INK}
            onMouseLeave={e => e.target.style.color = LIGHT_GREY}
          >{label}</a>
        ))}
      </div>
    </footer>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: CREAM, color: INK, overflowX: "hidden", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <Nav scrollY={scrollY} />
      <Hero scrollY={scrollY} />
      <ManuscriptsSection />
      <ShopSection />
      <JournalBanner />
      <AboutSection />
      <NewsletterSection />
      <Footer />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        ::selection { background: rgba(26,26,24,0.1); }
        input::placeholder { color: #b8b5ac; }
        @keyframes pulse {
          0%, 100% { transform: scaleY(1); opacity: 0.4; }
          50% { transform: scaleY(1.2); opacity: 0.7; }
        }
        @media (max-width: 768px) {
          nav { padding: 22px 24px !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          h1 { font-size: 52px !important; }
          .manuscripts-floor { height: 1200px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </div>
  );
}
