import { useState, useEffect, useRef } from "react";

const DRAWING_WOLF    = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";
const DRAWING_FOREST  = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/3d55b220c_whatsapp_image_1375833884351215.jpg";
const DRAWING_FIGURES = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/24cdd3ae8_whatsapp_image_855974756792686.jpg";
const DRAWING_GALLERY = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/a2b7907fc_whatsapp_image_1446971447177747.jpg";

const CREAM  = "#f5f0e4";
const NAVY   = "#1a2a6c";
const INK    = "#111827";

const POEMS = [
  {
    id: 1, num: "01",
    title: "Inbound",
    note: "Newark airport, gate C42",
    drawing: DRAWING_WOLF,
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
    id: 2, num: "02",
    title: "Cockroach",
    note: "3am, Brooklyn, first week",
    drawing: DRAWING_FIGURES,
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
    id: 3, num: "03",
    title: "Still Here",
    note: "kitchen, Flatbush, Tuesday",
    drawing: DRAWING_FOREST,
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

function useInView(threshold = 0.12) {
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
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
      ...style,
    }}>{children}</div>
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

  return (
    <div style={{
      background: CREAM,
      color: INK,
      fontFamily: "'Times New Roman', Times, Georgia, serif",
      overflowX: "hidden",
      minHeight: "100vh",
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }
        img { display: block; }
        button, input { font-family: inherit; }
        ::selection { background: ${NAVY}; color: ${CREAM}; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nav-link {
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; opacity: 0.4;
          transition: opacity 0.2s; color: ${NAVY};
        }
        .nav-link:hover { opacity: 1; }

        .bullet-label {
          display: flex; align-items: center; gap: 10px;
          font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: ${NAVY};
          margin-bottom: 16px;
        }
        .bullet-label::before {
          content: ''; display: block;
          width: 6px; height: 6px; border-radius: 50%;
          background: ${NAVY};
        }

        .hanging-line {
          position: absolute;
          top: 0; width: 1px;
          background: ${NAVY};
          opacity: 0.25;
          transform-origin: top center;
        }

        .buy-btn {
          display: inline-block;
          border: 1.5px solid ${NAVY};
          color: ${NAVY}; padding: 16px 44px;
          font-size: 11px; letter-spacing: 0.22em;
          text-transform: uppercase;
          transition: background 0.25s, color 0.25s;
        }
        .buy-btn:hover { background: ${NAVY}; color: ${CREAM}; }

        .sub-btn {
          background: ${NAVY}; color: ${CREAM};
          border: none; padding: 15px 28px;
          font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; cursor: pointer;
          transition: opacity 0.2s;
        }
        .sub-btn:hover { opacity: 0.75; }

        .poem-title:hover { color: ${NAVY}; }
        .poem-title { transition: color 0.2s; cursor: pointer; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 36px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 60 ? `rgba(245,240,228,0.97)` : "transparent",
        borderBottom: scrollY > 60 ? `1px solid rgba(26,42,108,0.1)` : "none",
        transition: "background 0.4s, border 0.4s",
        backdropFilter: scrollY > 60 ? "blur(8px)" : "none",
      }}>
        <span style={{ fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: NAVY }}>
          Bea Sophia
        </span>
        <div style={{ display: "flex", gap: "28px" }}>
          {[["Poems","#poems"],["Collection","#collection"],["About","#about"]].map(([l,h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        textAlign: "center",
        padding: "120px 40px 100px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* hanging lines from top */}
        {[20, 50, 80].map((left, i) => (
          <div key={i} className="hanging-line" style={{
            left: `${left}%`, height: `${90 + i * 20}px`,
            animation: `dropIn ${0.8 + i * 0.2}s ease ${0.3 + i * 0.15}s both`,
          }} />
        ))}

        {/* hanging drawing — top right */}
        <div style={{
          position: "absolute", top: 0, right: "6vw",
          display: "flex", flexDirection: "column", alignItems: "center",
          animation: "dropIn 1s ease 0.4s both",
          zIndex: 1,
        }}>
          <div style={{ width: 1, height: 80, background: NAVY, opacity: 0.2 }} />
          <div style={{
            width: "clamp(80px,12vw,140px)", height: "clamp(80px,12vw,140px)",
            borderRadius: "50%", overflow: "hidden",
            border: `2px solid rgba(26,42,108,0.3)`,
          }}>
            <img src={DRAWING_GALLERY} alt="" style={{
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.7, mixBlendMode: "multiply",
            }} />
          </div>
        </div>

        {/* hanging drawing — top left */}
        <div style={{
          position: "absolute", top: 0, left: "8vw",
          display: "flex", flexDirection: "column", alignItems: "center",
          animation: "dropIn 1s ease 0.6s both",
          zIndex: 1,
        }}>
          <div style={{ width: 1, height: 120, background: NAVY, opacity: 0.2 }} />
          <div style={{
            width: "clamp(60px,9vw,110px)", height: "clamp(60px,9vw,110px)",
            borderRadius: "50%", overflow: "hidden",
            border: `2px solid rgba(26,42,108,0.25)`,
          }}>
            <img src={DRAWING_FIGURES} alt="" style={{
              width: "100%", height: "100%",
              objectFit: "cover", opacity: 0.6, mixBlendMode: "multiply",
            }} />
          </div>
        </div>

        <div style={{
          position: "relative", zIndex: 2,
          animation: "slideUp 1.2s ease 0.2s both",
        }}>
          <p style={{
            fontSize: "10px", letterSpacing: "0.32em",
            textTransform: "uppercase", color: NAVY, opacity: 0.5,
            marginBottom: "44px",
          }}>The Page Gallery — 2025</p>

          <h1 style={{
            fontSize: "clamp(40px, 7.5vw, 108px)",
            fontWeight: 400, fontStyle: "italic",
            lineHeight: 1.08, letterSpacing: "-0.01em",
            maxWidth: "860px", margin: "0 auto 48px",
            color: NAVY,
          }}>
            What happens to a thought<br />
            when the person<br />
            who had it dies?
          </h1>

          <p style={{
            fontSize: "clamp(14px, 1.3vw, 17px)",
            lineHeight: 1.9, opacity: 0.55,
            maxWidth: "360px", margin: "0 auto 52px",
          }}>
            Walk around inside someone else's mind.<br />
            The poems are what we found.
          </p>

          <div style={{ display: "flex", gap: "28px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#poems" style={{
              fontSize: "10px", letterSpacing: "0.2em",
              textTransform: "uppercase", color: NAVY,
              borderBottom: `1px solid ${NAVY}`, paddingBottom: "4px",
            }}>Read free poems</a>
            <a href="#collection" style={{
              fontSize: "10px", letterSpacing: "0.2em",
              textTransform: "uppercase", opacity: 0.4,
              borderBottom: "1px solid rgba(26,42,108,0.3)", paddingBottom: "4px",
            }}>Buy the collection — £12</a>
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: "32px",
          fontSize: "10px", letterSpacing: "0.2em",
          textTransform: "uppercase", opacity: 0.2, color: NAVY,
          animation: "fadeIn 2s ease 2s both",
        }}>↓</div>
      </section>

      {/* ── POEMS ── */}
      <section id="poems" style={{ padding: "120px 40px", borderTop: `1px solid rgba(26,42,108,0.1)` }}>
        <FadeIn>
          <div className="bullet-label" style={{ marginBottom: "80px" }}>
            Free poems
          </div>
        </FadeIn>

        {POEMS.map((poem, i) => (
          <FadeIn key={poem.id} delay={0.08} style={{ marginBottom: "100px" }}>
            <div style={{
              maxWidth: "680px",
              marginLeft: i % 2 === 0 ? "0" : "auto",
              marginRight: i % 2 === 0 ? "auto" : "0",
              borderTop: `1px solid rgba(26,42,108,0.12)`,
              paddingTop: "40px",
            }}>
              {/* hanging drawing */}
              <div style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
                marginBottom: "32px",
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 1, height: 48, background: NAVY, opacity: 0.2 }} />
                  <div style={{
                    width: "clamp(70px,10vw,120px)", height: "clamp(70px,10vw,120px)",
                    borderRadius: "50%", overflow: "hidden",
                    border: `1.5px solid rgba(26,42,108,0.25)`,
                  }}>
                    <img src={poem.drawing} alt="" style={{
                      width: "100%", height: "100%",
                      objectFit: "cover", opacity: 0.65, mixBlendMode: "multiply",
                    }} />
                  </div>
                </div>
              </div>

              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "baseline", marginBottom: "20px",
              }}>
                <span style={{
                  fontSize: "11px", color: NAVY,
                  opacity: 0.4, letterSpacing: "0.2em",
                }}>{poem.num}</span>
                <span style={{ fontSize: "11px", fontStyle: "italic", opacity: 0.35 }}>
                  {poem.note}
                </span>
              </div>

              <h2 className="poem-title"
                onClick={() => setOpenPoem(openPoem === poem.id ? null : poem.id)}
                style={{
                  fontSize: "clamp(32px, 5.5vw, 70px)",
                  fontWeight: 400, fontStyle: "italic",
                  lineHeight: 1.06, marginBottom: "32px",
                  letterSpacing: "-0.01em", color: NAVY,
                }}>
                {poem.title}
              </h2>

              {openPoem === poem.id ? (
                <div style={{ animation: "fadeIn 0.5s ease" }}>
                  <div style={{
                    borderLeft: `2px solid rgba(26,42,108,0.15)`,
                    paddingLeft: "24px", marginBottom: "28px",
                  }}>
                    {poem.lines.map((line, j) => (
                      <p key={j} style={{
                        fontSize: "17px", lineHeight: 2.1,
                        minHeight: line === "" ? "1em" : "auto",
                      }}>{line || "\u00A0"}</p>
                    ))}
                  </div>
                  <button onClick={() => setOpenPoem(null)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "10px", letterSpacing: "0.2em",
                    textTransform: "uppercase", opacity: 0.3, padding: 0, color: NAVY,
                  }}>Close</button>
                </div>
              ) : (
                <div onClick={() => setOpenPoem(poem.id)} style={{ cursor: "pointer" }}>
                  <p style={{ fontSize: "16px", fontStyle: "italic", opacity: 0.35, lineHeight: 1.9 }}>
                    {poem.lines[0]}
                  </p>
                  <p style={{
                    fontSize: "10px", letterSpacing: "0.18em",
                    textTransform: "uppercase", color: NAVY,
                    opacity: 0.3, marginTop: "14px",
                  }}>Read</p>
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </section>

      {/* ── COLLECTION ── */}
      <section id="collection" style={{
        background: NAVY, color: CREAM,
        padding: "140px 40px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* hanging drawings in collection */}
        <div style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", gap: "60px",
        }}>
          {[DRAWING_FOREST, DRAWING_GALLERY].map((src, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 1, height: `${60 + i * 30}px`, background: CREAM, opacity: 0.15 }} />
              <div style={{
                width: `${70 + i * 20}px`, height: `${70 + i * 20}px`,
                borderRadius: "50%", overflow: "hidden",
                border: `1.5px solid rgba(245,240,228,0.2)`,
              }}>
                <img src={src} alt="" style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", opacity: 0.2, mixBlendMode: "screen",
                }} />
              </div>
            </div>
          ))}
        </div>

        <FadeIn style={{ position: "relative", zIndex: 2 }}>
          <div className="bullet-label" style={{ justifyContent: "center", color: CREAM, opacity: 0.4, marginBottom: "44px" }}>
            Collection 001
          </div>

          <h2 style={{
            fontSize: "clamp(48px, 9vw, 120px)",
            fontWeight: 400, fontStyle: "italic",
            lineHeight: 1.0, letterSpacing: "-0.02em",
            marginBottom: "56px", color: CREAM,
          }}>The Only Life</h2>

          <p style={{ fontSize: "17px", lineHeight: 2, opacity: 0.45, maxWidth: "420px", margin: "0 auto 14px" }}>
            Twenty poems. New York. The body after the ward.
          </p>
          <p style={{ fontSize: "17px", lineHeight: 2, opacity: 0.45, maxWidth: "420px", margin: "0 auto 56px" }}>
            Scotland in the bones. The city not yet earned.<br />
            Things that survived and didn't know it yet.
          </p>

          <div style={{ marginBottom: "40px" }}>
            <span style={{
              fontSize: "clamp(44px, 6vw, 72px)",
              fontWeight: 300, letterSpacing: "-0.02em", color: CREAM,
            }}>£12</span>
            <p style={{ fontSize: "11px", opacity: 0.25, letterSpacing: "0.12em", marginTop: "8px" }}>
              Digital PDF · Yours immediately
            </p>
          </div>

          <a href="https://paypal.me/Sophiasharkey330"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-block",
              border: `1.5px solid rgba(245,240,228,0.4)`,
              color: CREAM, padding: "16px 44px",
              fontSize: "11px", letterSpacing: "0.22em",
              textTransform: "uppercase",
              transition: "background 0.25s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(245,240,228,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Buy the collection
          </a>
        </FadeIn>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "140px 40px", textAlign: "center" }}>
        <FadeIn>
          <div className="bullet-label" style={{ justifyContent: "center", marginBottom: "56px" }}>
            About
          </div>

          <p style={{
            fontSize: "clamp(22px, 3.5vw, 38px)",
            fontStyle: "italic", fontWeight: 400,
            lineHeight: 1.55, maxWidth: "680px",
            margin: "0 auto 40px", color: NAVY,
          }}>
            When I got sick, I realised that when people die,<br />
            all their thoughts die with them.
          </p>

          <p style={{
            fontSize: "17px", lineHeight: 1.95, opacity: 0.5,
            maxWidth: "460px", margin: "0 auto 20px",
          }}>
            I started collecting fragments. Conversations overheard. Things said in the wrong order. Thoughts that lived in one mind and died there.
          </p>
          <p style={{
            fontSize: "17px", lineHeight: 1.95, opacity: 0.5,
            maxWidth: "460px", margin: "0 auto 56px",
          }}>
            That became The Page Gallery Journal. These poems are the second attempt at the same problem.
          </p>

          {/* hanging drawing in about */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "48px" }}>
            <div style={{ width: 1, height: 60, background: NAVY, opacity: 0.2 }} />
            <div style={{
              width: "clamp(100px,16vw,180px)", height: "clamp(100px,16vw,180px)",
              borderRadius: "50%", overflow: "hidden",
              border: `2px solid rgba(26,42,108,0.2)`,
            }}>
              <img src={DRAWING_FIGURES} alt="" style={{
                width: "100%", height: "100%",
                objectFit: "cover", opacity: 0.65, mixBlendMode: "multiply",
              }} />
            </div>
          </div>

          <a href="https://instagram.com/bsophialovesgnochi"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: "11px", letterSpacing: "0.2em",
              textTransform: "uppercase", color: NAVY, opacity: 0.4,
              borderBottom: `1px solid rgba(26,42,108,0.2)`, paddingBottom: "4px",
            }}>
            @bsophialovesgnochi
          </a>
        </FadeIn>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={{
        borderTop: `1px solid rgba(26,42,108,0.1)`,
        padding: "120px 40px", textAlign: "center",
      }}>
        <FadeIn>
          <div className="bullet-label" style={{ justifyContent: "center", marginBottom: "28px" }}>
            Letters
          </div>

          <p style={{
            fontSize: "clamp(26px, 4vw, 50px)",
            fontStyle: "italic", fontWeight: 400,
            lineHeight: 1.2, color: NAVY, marginBottom: "20px",
          }}>New fragments,<br />when they exist.</p>

          <p style={{ fontSize: "15px", opacity: 0.4, lineHeight: 1.8, marginBottom: "44px" }}>
            No schedule. No newsletter voice.<br />The thing itself when it's ready.
          </p>

          {subscribed ? (
            <p style={{ fontSize: "16px", fontStyle: "italic", opacity: 0.4 }}>You're in.</p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              style={{ display: "flex", maxWidth: "420px", margin: "0 auto" }}>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: "15px 18px",
                  border: `1px solid rgba(26,42,108,0.2)`, borderRight: "none",
                  background: CREAM, fontSize: "14px",
                  outline: "none", color: INK, borderRadius: 0,
                }} />
              <button type="submit" className="sub-btn">Subscribe</button>
            </form>
          )}
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "24px 40px",
        borderTop: `1px solid rgba(26,42,108,0.08)`,
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "12px",
      }}>
        <span style={{ fontSize: "11px", opacity: 0.22, color: NAVY }}>© Bea Sophia 2025</span>
        <a href="https://instagram.com/bsophialovesgnochi"
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.22, color: NAVY }}>
          Instagram
        </a>
      </footer>
    </div>
  );
}
