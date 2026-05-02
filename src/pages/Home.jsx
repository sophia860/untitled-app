import { useState, useEffect, useRef } from "react";

const poems = [
  {
    id: 1,
    title: "INBOUND",
    excerpt: "I have one bag checked and one theory about myself\nI'm not ready to test yet.",
    rotation: -2.1,
    x: 8,
    y: 12,
  },
  {
    id: 2,
    title: "INVENTORY, BROOKLYN, WEEK ONE",
    excerpt: "a roach trap behind the fridge\nthat has been there long enough to become infrastructure.",
    rotation: 1.4,
    x: 55,
    y: 28,
  },
  {
    id: 3,
    title: "RANNOCH MOOR",
    excerpt: "The ground is mostly not ground.\nYou walk on the skin of something\nthat has not decided to be land yet.",
    rotation: -3.2,
    x: 22,
    y: 60,
  },
  {
    id: 4,
    title: "COCKROACH",
    excerpt: "something had passed through it in the night\nand not apologised\nand I was glad.",
    rotation: 2.8,
    x: 62,
    y: 70,
  },
  {
    id: 5,
    title: "STILL HERE",
    excerpt: "I am not monitoring.\nI am not waiting.\n\nThe tap drips.\nI let it.",
    rotation: -1.1,
    x: 35,
    y: 85,
  },
];

const COLLECTION = {
  title: "THE ONLY LIFE",
  tagline: "Twenty poems. Nature in New York. The body after the ward. What keeps going when the reason is unclear.",
  price: "$18",
  paypalLink: "#",
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredPoem, setHoveredPoem] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrollY / 400);
  const heroTranslate = scrollY * 0.3;

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#faf9f7", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 80 ? "rgba(250,249,247,0.95)" : "transparent",
        backdropFilter: scrollY > 80 ? "blur(8px)" : "none",
        borderBottom: scrollY > 80 ? "1px solid #e8e4dc" : "none",
        transition: "all 0.4s ease",
      }}>
        <span style={{ fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1a1a1a", fontFamily: "Georgia, serif" }}>
          Bea Sophia
        </span>
        <div style={{ display: "flex", gap: "40px" }}>
          {["Collections", "About", "Journal", "Contact"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#4a4a4a", textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#1a1a1a"}
              onMouseLeave={e => e.target.style.color = "#4a4a4a"}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO — GASP SCROLL ENTRANCE */}
      <section style={{
        height: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 48px", textAlign: "center", position: "relative",
        opacity: heroOpacity, transform: `translateY(${heroTranslate}px)`,
      }}>
        <div style={{
          opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#9a9a8a", marginBottom: "32px", fontFamily: "Georgia, serif" }}>
            Poetry
          </p>
          <h1 style={{
            fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "400", letterSpacing: "-0.02em",
            color: "#1a1a1a", lineHeight: "1.0", margin: "0 0 24px", fontFamily: "Georgia, serif",
          }}>
            Bea Sophia
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "#6a6a5a", maxWidth: "480px", lineHeight: "1.7", margin: "0 auto 48px", fontFamily: "Georgia, serif" }}>
            Poems. Rooms. Things that should not still be moving.
          </p>
          <button
            onClick={() => document.getElementById('collections').scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: "none", border: "1px solid #1a1a1a", color: "#1a1a1a",
              padding: "14px 36px", fontSize: "11px", letterSpacing: "0.2em",
              textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia, serif",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.target.style.background = "#1a1a1a"; e.target.style.color = "#faf9f7"; }}
            onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "#1a1a1a"; }}
          >
            Enter
          </button>
        </div>

        {/* SCROLL INDICATOR */}
        <div style={{
          position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          opacity: scrollY > 50 ? 0 : 0.5, transition: "opacity 0.3s",
        }}>
          <div style={{
            width: "1px", height: "40px", background: "#1a1a1a",
            animation: "pulse 2s ease-in-out infinite",
          }} />
          <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4a4a", margin: 0 }}>Scroll</p>
        </div>
      </section>

      {/* MANUSCRIPTS ON THE FLOOR */}
      <section style={{ minHeight: "100vh", position: "relative", padding: "80px 0" }}>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#9a9a8a", marginBottom: "16px" }}>
            Now Available
          </p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "400", color: "#1a1a1a", margin: 0, fontFamily: "Georgia, serif" }}>
            {COLLECTION.title}
          </h2>
        </div>

        {/* SCATTERED MANUSCRIPT PAGES */}
        <div style={{ position: "relative", minHeight: "700px", maxWidth: "900px", margin: "0 auto" }}>
          {poems.map((poem, i) => {
            const depth = (scrollY - 400) * 0.05;
            const isHovered = hoveredPoem === poem.id;
            return (
              <div
                key={poem.id}
                onMouseEnter={() => setHoveredPoem(poem.id)}
                onMouseLeave={() => setHoveredPoem(null)}
                style={{
                  position: "absolute",
                  left: `${poem.x}%`,
                  top: `${poem.y}%`,
                  width: "280px",
                  background: "#ffffff",
                  padding: "32px",
                  boxShadow: isHovered
                    ? "0 20px 60px rgba(0,0,0,0.15)"
                    : "0 4px 20px rgba(0,0,0,0.08)",
                  transform: `rotate(${poem.rotation}deg) translateY(${isHovered ? -8 : 0}px)`,
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  zIndex: isHovered ? 10 : i,
                  borderTop: "3px solid #1a1a1a",
                }}
              >
                <p style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#9a9a8a", margin: "0 0 16px" }}>
                  {poem.id < 10 ? `0${poem.id}` : poem.id} — {COLLECTION.title}
                </p>
                <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#1a1a1a", margin: "0 0 16px", fontWeight: "600" }}>
                  {poem.title}
                </p>
                <p style={{ fontSize: "13px", color: "#4a4a4a", lineHeight: "1.8", margin: 0, fontStyle: "italic", whiteSpace: "pre-line" }}>
                  {poem.excerpt}
                </p>
              </div>
            );
          })}
        </div>

        {/* COLLECTION CTA */}
        <div id="collections" style={{ textAlign: "center", padding: "120px 48px 80px", maxWidth: "640px", margin: "0 auto" }}>
          <p style={{ fontSize: "15px", color: "#4a4a4a", lineHeight: "1.9", marginBottom: "40px", fontFamily: "Georgia, serif" }}>
            {COLLECTION.tagline}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={COLLECTION.paypalLink}
              style={{
                background: "#1a1a1a", color: "#faf9f7",
                padding: "16px 48px", fontSize: "11px", letterSpacing: "0.2em",
                textTransform: "uppercase", textDecoration: "none", fontFamily: "Georgia, serif",
                transition: "opacity 0.2s", display: "inline-block",
              }}
              onMouseEnter={e => e.target.style.opacity = "0.85"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              Buy — {COLLECTION.price}
            </a>
            <button style={{
              background: "none", border: "1px solid #c8c4bc", color: "#4a4a4a",
              padding: "16px 48px", fontSize: "11px", letterSpacing: "0.2em",
              textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia, serif",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#1a1a1a"; e.target.style.color = "#1a1a1a"; }}
              onMouseLeave={e => { e.target.style.borderColor = "#c8c4bc"; e.target.style.color = "#4a4a4a"; }}
            >
              Read a poem
            </button>
          </div>
        </div>
      </section>

      {/* THE PAGE GALLERY JOURNAL STRIP */}
      <section style={{
        background: "#1a1a1a", color: "#faf9f7", padding: "80px 48px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#6a6a5a", marginBottom: "24px" }}>
          Also
        </p>
        <h3 style={{ fontSize: "clamp(20px, 3vw, 36px)", fontWeight: "400", margin: "0 0 20px", fontFamily: "Georgia, serif" }}>
          The Page Gallery Journal
        </h3>
        <p style={{ fontSize: "14px", color: "#9a9a8a", maxWidth: "400px", margin: "0 auto 40px", lineHeight: "1.8" }}>
          A literary journal. Founded by Bea Sophia.
        </p>
        <a href="#" style={{
          color: "#faf9f7", fontSize: "11px", letterSpacing: "0.2em",
          textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid #6a6a5a",
          paddingBottom: "4px", transition: "border-color 0.2s",
        }}>
          Visit the Journal →
        </a>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: "100px 48px", textAlign: "center", maxWidth: "520px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#9a9a8a", marginBottom: "24px" }}>
          Letters
        </p>
        <h3 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: "400", color: "#1a1a1a", margin: "0 0 20px", fontFamily: "Georgia, serif" }}>
          New work, when it exists.
        </h3>
        <p style={{ fontSize: "14px", color: "#6a6a5a", lineHeight: "1.8", marginBottom: "40px" }}>
          No frequency promised. Something worth reading when it arrives.
        </p>
        <div style={{ display: "flex", gap: "0", maxWidth: "400px", margin: "0 auto" }}>
          <input
            type="email"
            placeholder="Your email"
            style={{
              flex: 1, padding: "14px 20px", border: "1px solid #c8c4bc",
              borderRight: "none", fontSize: "14px", fontFamily: "Georgia, serif",
              background: "#ffffff", outline: "none", color: "#1a1a1a",
            }}
          />
          <button style={{
            background: "#1a1a1a", color: "#faf9f7", border: "none",
            padding: "14px 24px", fontSize: "11px", letterSpacing: "0.15em",
            textTransform: "uppercase", cursor: "pointer", fontFamily: "Georgia, serif",
            whiteSpace: "nowrap",
          }}>
            Subscribe
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "40px 48px", borderTop: "1px solid #e8e4dc",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "16px",
      }}>
        <span style={{ fontSize: "12px", color: "#9a9a8a", fontFamily: "Georgia, serif" }}>
          © Bea Sophia
        </span>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#6a6a5a", textDecoration: "none" }}>
          Instagram
        </a>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.1); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
