import { useState, useEffect, useRef } from "react";

const DRAWING_WOLF    = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";
const DRAWING_FOREST  = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/3d55b220c_whatsapp_image_1375833884351215.jpg";
const DRAWING_FIGURES = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/24cdd3ae8_whatsapp_image_855974756792686.jpg";
const DRAWING_GALLERY = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/a2b7907fc_whatsapp_image_1446971447177747.jpg";

const POEMS = [
  {
    id: 1,
    title: "Inbound",
    note: "Newark airport, gate C42",
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
    ],
  },
  {
    id: 2,
    title: "Cockroach",
    note: "3am, Brooklyn, first week",
    lines: [
      "I watched one cross my kitchen floor",
      "with such absolute certainty of direction —",
      "not scurrying, not panicking,",
      "just moving from one exact point to another",
      "like it had somewhere specific to be.",
      "",
      "I put the glass back in the cupboard.",
      "Left it to finish whatever it was doing.",
      "Went to bed.",
      "",
      "In the morning it was gone.",
      "But something had passed through",
      "and not apologised",
      "and I was glad.",
    ],
  },
  {
    id: 3,
    title: "Still Here",
    note: "kitchen, Flatbush, Tuesday",
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
      "The tap drips.",
      "I let it.",
    ],
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function Home() {
  const [openPoem, setOpenPoem] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const T = { fontFamily: "'Times New Roman', Times, Georgia, serif" };

  return (
    <div style={{ background: "#fff", color: "#111", ...T, overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }
        img { display: block; }
        button { font-family: inherit; }
        input { font-family: inherit; }
        ::selection { background: #111; color: #fff; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .nav-link {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.35;
          transition: opacity 0.2s;
        }
        .nav-link:hover { opacity: 1; }

        .poem-title {
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .poem-title:hover { opacity: 0.5; }

        .buy-btn {
          display: inline-block;
          background: #111;
          color: #fff;
          padding: 18px 48px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          transition: opacity 0.2s;
        }
        .buy-btn:hover { opacity: 0.7; }

        .sub-btn {
          background: #111;
          color: #fff;
          border: none;
          padding: 16px 28px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .sub-btn:hover { opacity: 0.7; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "22px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 60 ? "rgba(255,255,255,0.96)" : "transparent",
        borderBottom: scrollY > 60 ? "1px solid rgba(0,0,0,0.07)" : "none",
        transition: "background 0.4s, border 0.4s",
        backdropFilter: scrollY > 60 ? "blur(8px)" : "none",
      }}>
        <span style={{ fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Bea Sophia
        </span>
        <div style={{ display: "flex", gap: "32px" }}>
          {[["Poems","#poems"],["Collection","#collection"],["About","#about"]].map(([l,h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO — full screen text ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        textAlign: "center",
        padding: "120px 40px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          animation: "slideUp 1.2s ease both",
        }}>
          <p style={{
            fontSize: "11px", letterSpacing: "0.32em",
            textTransform: "uppercase", opacity: 0.3, marginBottom: "48px",
          }}>The Page Gallery — 2025</p>

          <h1 style={{
            fontSize: "clamp(42px, 8vw, 120px)",
            fontWeight: 400, fontStyle: "italic",
            lineHeight: 1.08, letterSpacing: "-0.01em",
            maxWidth: "900px", margin: "0 auto 52px",
          }}>
            What happens<br />
            to a thought<br />
            when the person<br />
            who had it dies?
          </h1>

          <p style={{
            fontSize: "clamp(14px, 1.4vw, 18px)",
            lineHeight: 1.85, opacity: 0.45,
            maxWidth: "400px", margin: "0 auto 56px",
          }}>
            Walk around inside someone else's mind.<br />
            The poems are what we found.
          </p>

          <div style={{ display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#poems" style={{
              fontSize: "11px", letterSpacing: "0.2em",
              textTransform: "uppercase",
              borderBottom: "1px solid #111", paddingBottom: "4px",
            }}>Read free poems</a>
            <a href="#collection" style={{
              fontSize: "11px", letterSpacing: "0.2em",
              textTransform: "uppercase", opacity: 0.35,
              borderBottom: "1px solid rgba(0,0,0,0.2)", paddingBottom: "4px",
            }}>Buy the collection — £12</a>
          </div>
        </div>

        {/* scroll hint */}
        <div style={{
          position: "absolute", bottom: "36px", left: "50%",
          transform: "translateX(-50%)",
          fontSize: "10px", letterSpacing: "0.2em",
          textTransform: "uppercase", opacity: 0.2,
          animation: "fadeIn 2s ease 1.5s both",
        }}>↓</div>
      </section>

      {/* ── FULL BLEED DRAWING 1 ── */}
      <div style={{ overflow: "hidden", height: "70vh" }}>
        <img src={DRAWING_WOLF} alt="" style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          transform: `translateY(${scrollY * 0.08}px)`,
          opacity: 0.85, mixBlendMode: "multiply",
        }} />
      </div>

      {/* ── POEMS ── */}
      <section id="poems" style={{ padding: "140px 40px" }}>
        <FadeIn>
          <p style={{
            fontSize: "10px", letterSpacing: "0.32em",
            textTransform: "uppercase", opacity: 0.25,
            textAlign: "center", marginBottom: "100px",
          }}>Free poems — read them here</p>
        </FadeIn>

        {POEMS.map((poem, i) => (
          <FadeIn key={poem.id} delay={0.1} style={{ marginBottom: "120px" }}>
            <div style={{
              maxWidth: "640px",
              margin: "0 auto",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              paddingTop: "48px",
            }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "baseline", marginBottom: "32px",
              }}>
                <span style={{ fontSize: "10px", opacity: 0.2, letterSpacing: "0.2em" }}>
                  {String(i+1).padStart(3,"0")}
                </span>
                <span style={{ fontSize: "11px", fontStyle: "italic", opacity: 0.3 }}>
                  {poem.note}
                </span>
              </div>

              <h2 className="poem-title"
                onClick={() => setOpenPoem(openPoem === poem.id ? null : poem.id)}
                style={{
                  fontSize: "clamp(36px, 6vw, 80px)",
                  fontWeight: 400, fontStyle: "italic",
                  lineHeight: 1.05, marginBottom: "40px",
                  letterSpacing: "-0.01em",
                }}>
                {poem.title}
              </h2>

              {openPoem === poem.id ? (
                <div style={{ animation: "fadeIn 0.5s ease" }}>
                  <div style={{ marginBottom: "36px" }}>
                    {poem.lines.map((line, j) => (
                      <p key={j} style={{
                        fontSize: "18px", lineHeight: 2.1,
                        minHeight: line === "" ? "1.2em" : "auto",
                        opacity: line === "" ? 0 : 1,
                      }}>{line || "\u00A0"}</p>
                    ))}
                  </div>
                  <button onClick={() => setOpenPoem(null)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "10px", letterSpacing: "0.2em",
                    textTransform: "uppercase", opacity: 0.25, padding: 0,
                  }}>Close</button>
                </div>
              ) : (
                <div onClick={() => setOpenPoem(poem.id)} style={{ cursor: "pointer" }}>
                  <p style={{ fontSize: "17px", fontStyle: "italic", opacity: 0.3, lineHeight: 1.9 }}>
                    {poem.lines[0]}
                  </p>
                  <p style={{
                    fontSize: "10px", letterSpacing: "0.18em",
                    textTransform: "uppercase", opacity: 0.2, marginTop: "16px",
                  }}>Read</p>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </section>

      {/* ── FULL BLEED DRAWING 2 ── */}
      <div style={{ overflow: "hidden", height: "60vh" }}>
        <img src={DRAWING_FIGURES} alt="" style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top",
          opacity: 0.7, mixBlendMode: "multiply",
        }} />
      </div>

      {/* ── COLLECTION ── */}
      <section id="collection" style={{
        background: "#111", color: "#fff",
        padding: "140px 40px",
        textAlign: "center",
      }}>
        <FadeIn>
          <p style={{
            fontSize: "10px", letterSpacing: "0.32em",
            textTransform: "uppercase", opacity: 0.3, marginBottom: "52px",
          }}>Collection 001</p>

          <h2 style={{
            fontSize: "clamp(48px, 9vw, 130px)",
            fontWeight: 400, fontStyle: "italic",
            lineHeight: 1.0, letterSpacing: "-0.02em",
            marginBottom: "60px",
          }}>The Only Life</h2>

          <div style={{ maxWidth: "480px", margin: "0 auto 56px" }}>
            <img src={DRAWING_FOREST} alt="" style={{
              width: "60%", margin: "0 auto 48px",
              opacity: 0.18, mixBlendMode: "screen",
            }} />
            <p style={{ fontSize: "17px", lineHeight: 2, opacity: 0.45, marginBottom: "16px" }}>
              Twenty poems. New York. The body after the ward.
            </p>
            <p style={{ fontSize: "17px", lineHeight: 2, opacity: 0.45, marginBottom: "56px" }}>
              Scotland in the bones. The city not yet earned.<br />
              Things that survived and didn't know it yet.
            </p>
          </div>

          <div style={{ marginBottom: "40px" }}>
            <span style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              fontWeight: 300, letterSpacing: "-0.02em",
            }}>£12</span>
            <p style={{ fontSize: "11px", opacity: 0.25, letterSpacing: "0.12em", marginTop: "8px" }}>
              Digital PDF · Yours immediately
            </p>
          </div>

          <a href="https://paypal.me/Sophiasharkey330"
            target="_blank" rel="noopener noreferrer"
            className="buy-btn">
            Buy the collection
          </a>
        </FadeIn>
      </section>

      {/* ── FULL BLEED DRAWING 3 ── */}
      <div style={{ overflow: "hidden", height: "55vh" }}>
        <img src={DRAWING_GALLERY} alt="" style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          opacity: 0.65, mixBlendMode: "multiply",
        }} />
      </div>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "140px 40px", textAlign: "center" }}>
        <FadeIn>
          <p style={{
            fontSize: "10px", letterSpacing: "0.32em",
            textTransform: "uppercase", opacity: 0.25, marginBottom: "64px",
          }}>About</p>

          <p style={{
            fontSize: "clamp(22px, 3.5vw, 40px)",
            fontStyle: "italic", fontWeight: 400,
            lineHeight: 1.55, maxWidth: "720px",
            margin: "0 auto 40px",
          }}>
            When I got sick, I realised that when people die,<br />
            all their thoughts die with them.
          </p>

          <p style={{
            fontSize: "17px", lineHeight: 1.95, opacity: 0.45,
            maxWidth: "480px", margin: "0 auto 24px",
          }}>
            I started collecting fragments. Conversations overheard. Things said in the wrong order. Thoughts that lived in one mind and died there.
          </p>

          <p style={{
            fontSize: "17px", lineHeight: 1.95, opacity: 0.45,
            maxWidth: "480px", margin: "0 auto 64px",
          }}>
            That became The Page Gallery Journal. These poems are the second attempt at the same problem.
          </p>

          <a href="https://instagram.com/bsophialovesgnochi"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: "11px", letterSpacing: "0.2em",
              textTransform: "uppercase", opacity: 0.3,
              borderBottom: "1px solid rgba(0,0,0,0.2)", paddingBottom: "4px",
            }}>
            @bsophialovesgnochi
          </a>
        </FadeIn>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={{
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "120px 40px", textAlign: "center",
        background: "#fafafa",
      }}>
        <FadeIn>
          <p style={{
            fontSize: "10px", letterSpacing: "0.32em",
            textTransform: "uppercase", opacity: 0.25, marginBottom: "32px",
          }}>Letters</p>

          <p style={{
            fontSize: "clamp(26px, 4vw, 52px)",
            fontStyle: "italic", fontWeight: 400,
            lineHeight: 1.2, marginBottom: "20px",
          }}>New fragments,<br />when they exist.</p>

          <p style={{ fontSize: "15px", opacity: 0.4, lineHeight: 1.8, marginBottom: "48px" }}>
            No schedule. No newsletter voice.<br />The thing itself when it's ready.
          </p>

          {subscribed ? (
            <p style={{ fontSize: "16px", fontStyle: "italic", opacity: 0.4 }}>You're in.</p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              style={{
                display: "flex", maxWidth: "440px", margin: "0 auto",
              }}>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: "16px 20px",
                  border: "1px solid rgba(0,0,0,0.15)", borderRight: "none",
                  background: "#fff", fontSize: "14px",
                  outline: "none", color: "#111", borderRadius: 0,
                }} />
              <button type="submit" className="sub-btn">Subscribe</button>
            </form>
          )}
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "28px 40px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "12px",
      }}>
        <span style={{ fontSize: "11px", opacity: 0.2 }}>© Bea Sophia 2025</span>
        <a href="https://instagram.com/bsophialovesgnochi"
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.2 }}>
          Instagram
        </a>
      </footer>
    </div>
  );
}
