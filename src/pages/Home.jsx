import { useState, useEffect } from "react";

// Bea's drawings
const DRAWING_WOLF    = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/5ee1557e0_whatsapp_image_1773625874009166.jpg";
const DRAWING_FOREST  = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/3d55b220c_whatsapp_image_1375833884351215.jpg";
const DRAWING_FIGURES = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/24cdd3ae8_whatsapp_image_855974756792686.jpg";
const DRAWING_GALLERY = "https://media.base44.com/images/public/whatsapp/69f5fbb6b1f4d064d9cbd657/your_agent/69f5fbb6b1f4d064d9cbd658/a2b7907fc_whatsapp_image_1446971447177747.jpg";
const DRAWING_GEN_1   = "https://media.base44.com/images/public/69f5fbb6b1f4d064d9cbd657/e4dd507d5_generated_image.png";
const DRAWING_GEN_2   = "https://media.base44.com/images/public/69f5fbb6b1f4d064d9cbd657/7035061b9_generated_image.png";

const POEMS = [
  {
    id: 1,
    title: "Inbound",
    note: "Newark airport, gate C42",
    drawing: DRAWING_GEN_1,
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
    id: 3,
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

const S = {
  body: {
    background: "#f2ede5",
    minHeight: "100vh",
    fontFamily: "'Times New Roman', Times, Georgia, serif",
    color: "#1a1a18",
    overflowX: "hidden",
  },
};

export default function Home() {
  const [openPoem, setOpenPoem] = useState(null);
  const [email, setEmail]       = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [scrollY, setScrollY]   = useState(0);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={S.body}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(26,26,24,0.1); }
        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }
        button { font-family: inherit; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 36px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 80 ? "rgba(242,237,229,0.96)" : "transparent",
        borderBottom: scrollY > 80 ? "1px solid rgba(26,26,24,0.07)" : "none",
        transition: "background 0.5s, border 0.5s",
        backdropFilter: scrollY > 80 ? "blur(6px)" : "none",
      }}>
        <span style={{ fontSize: "11px", letterSpacing: "0.24em", textTransform: "uppercase" }}>
          Bea Sophia
        </span>
        <div style={{ display: "flex", gap: "28px" }}>
          {[["Poems","#poems"],["Collection","#collection"],["About","#about"]].map(([l,h]) => (
            <a key={l} href={h} style={{
              fontSize: "10px", letterSpacing: "0.2em",
              textTransform: "uppercase", opacity: 0.4,
            }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", height: "100vh",
        display: "flex", alignItems: "flex-end",
        overflow: "hidden",
      }}>
        <img src={DRAWING_WOLF} alt="" style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 20%",
          opacity: 0.8, mixBlendMode: "multiply",
          transform: `translateY(${scrollY * 0.12}px)`,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
          background: "linear-gradient(to bottom, transparent, #f2ede5)",
        }} />
        <div style={{
          position: "relative", zIndex: 2,
          padding: "0 40px 72px",
          animation: "fadeUp 1.4s ease both",
        }}>
          <p style={{
            fontSize: "10px", letterSpacing: "0.32em",
            textTransform: "uppercase", opacity: 0.35, marginBottom: "18px",
          }}>The Page Gallery</p>
          <h1 style={{
            fontSize: "clamp(26px, 4.5vw, 54px)",
            fontWeight: 400, fontStyle: "italic",
            lineHeight: 1.22, maxWidth: "620px", marginBottom: "24px",
          }}>
            What happens to a thought<br />
            when the person who had it dies?
          </h1>
          <p style={{
            fontSize: "15px", lineHeight: 1.9,
            opacity: 0.55, maxWidth: "340px", marginBottom: "40px",
          }}>
            Walk around inside someone else's mind.<br />
            The poems are what we found.
          </p>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <a href="#poems" style={{
              fontSize: "10px", letterSpacing: "0.22em",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(26,26,24,0.55)", paddingBottom: "3px",
            }}>Read free poems</a>
            <a href="#collection" style={{
              fontSize: "10px", letterSpacing: "0.22em",
              textTransform: "uppercase", opacity: 0.38,
              borderBottom: "1px solid rgba(26,26,24,0.2)", paddingBottom: "3px",
            }}>Buy the collection — £12</a>
          </div>
        </div>
      </section>

      {/* ── POEMS ── */}
      <section id="poems" style={{ padding: "120px 0 80px" }}>
        <p style={{
          padding: "0 40px",
          fontSize: "10px", letterSpacing: "0.3em",
          textTransform: "uppercase", opacity: 0.28, marginBottom: "80px",
        }}>Free poems</p>

        {POEMS.map((poem, i) => (
          <div key={poem.id} style={{ marginBottom: "120px" }}>
            {/* Drawing */}
            <div style={{
              width: i % 2 === 0 ? "52%" : "44%",
              marginLeft: i % 2 === 0 ? "0" : "auto",
              marginBottom: "44px",
            }}>
              <img src={poem.drawing} alt="" style={{
                width: "100%", opacity: 0.5, mixBlendMode: "multiply",
              }} />
            </div>

            {/* Text */}
            <div style={{
              padding: "0 40px",
              maxWidth: "520px",
              marginLeft: i % 2 === 0 ? "40px" : "auto",
              marginRight: i % 2 === 0 ? "auto" : "40px",
            }}>
              <span style={{
                fontSize: "10px", letterSpacing: "0.24em",
                textTransform: "uppercase", opacity: 0.22,
                display: "block", marginBottom: "8px",
              }}>{String(i+1).padStart(3,"0")}</span>

              <h2 onClick={() => setOpenPoem(openPoem === poem.id ? null : poem.id)}
                style={{
                  fontSize: "clamp(22px, 3.5vw, 36px)",
                  fontWeight: 400, fontStyle: "italic",
                  marginBottom: "8px", cursor: "pointer",
                  transition: "opacity 0.2s",
                }}>
                {poem.title}
              </h2>
              <p style={{ fontSize: "12px", opacity: 0.28, fontStyle: "italic", marginBottom: "24px" }}>
                {poem.note}
              </p>

              {openPoem === poem.id ? (
                <div style={{ animation: "fadeIn 0.4s ease" }}>
                  <div style={{
                    borderLeft: "1px solid rgba(26,26,24,0.1)",
                    paddingLeft: "22px", marginBottom: "24px",
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
                    textTransform: "uppercase", opacity: 0.3, padding: 0,
                  }}>Close</button>
                </div>
              ) : (
                <div onClick={() => setOpenPoem(poem.id)} style={{ cursor: "pointer" }}>
                  <p style={{
                    fontSize: "15px", fontStyle: "italic",
                    opacity: 0.35, lineHeight: 1.85, marginBottom: "10px",
                  }}>{poem.lines[0]}</p>
                  <span style={{
                    fontSize: "10px", letterSpacing: "0.18em",
                    textTransform: "uppercase", opacity: 0.22,
                  }}>Tap to read</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── GALLERY DIVIDER ── */}
      <div style={{
        borderTop: "1px solid rgba(26,26,24,0.06)",
        borderBottom: "1px solid rgba(26,26,24,0.06)",
        overflow: "hidden",
      }}>
        <img src={DRAWING_GALLERY} alt="" style={{
          width: "100%", maxHeight: "480px",
          objectFit: "cover", objectPosition: "center top",
          opacity: 0.32, mixBlendMode: "multiply",
        }} />
      </div>

      {/* ── COLLECTION ── */}
      <section id="collection" style={{
        background: "#1a1a18", color: "#f2ede5",
        padding: "120px 40px",
      }}>
        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
          <p style={{
            fontSize: "10px", letterSpacing: "0.3em",
            textTransform: "uppercase", opacity: 0.28, marginBottom: "36px",
          }}>Collection 001</p>
          <h2 style={{
            fontSize: "clamp(30px, 5vw, 54px)",
            fontWeight: 400, fontStyle: "italic",
            lineHeight: 1.18, marginBottom: "36px",
          }}>The Only Life</h2>
          <img src={DRAWING_GEN_2} alt="" style={{
            width: "55%", opacity: 0.22,
            mixBlendMode: "screen", marginBottom: "40px",
          }} />
          <p style={{ fontSize: "16px", lineHeight: 1.95, opacity: 0.5, marginBottom: "14px" }}>
            Twenty poems. New York. The body after the ward.
          </p>
          <p style={{ fontSize: "16px", lineHeight: 1.95, opacity: 0.5, marginBottom: "52px" }}>
            Scotland in the bones. The city not yet earned.<br />
            Things that survived and didn't know it yet.
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "18px", marginBottom: "32px" }}>
            <span style={{ fontSize: "38px", fontWeight: 300 }}>£12</span>
            <span style={{ fontSize: "11px", opacity: 0.28, letterSpacing: "0.12em" }}>
              Digital PDF · Yours immediately
            </span>
          </div>
          <a href="https://paypal.me/Sophiasharkey330" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-block",
              border: "1px solid rgba(242,237,229,0.2)",
              color: "#f2ede5", padding: "16px 40px",
              fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase",
            }}>
            Buy the collection
          </a>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: "120px 40px", maxWidth: "560px", margin: "0 auto" }}>
        <p style={{
          fontSize: "10px", letterSpacing: "0.3em",
          textTransform: "uppercase", opacity: 0.28, marginBottom: "40px",
        }}>About</p>
        <p style={{ fontSize: "18px", lineHeight: 2, marginBottom: "22px" }}>
          When I got sick, I realised that when people die, all their thoughts die with them.
        </p>
        <p style={{ fontSize: "17px", lineHeight: 2, opacity: 0.58, marginBottom: "22px" }}>
          I started collecting fragments. Conversations overheard. Things said in the wrong order. Thoughts that lived in one mind and died there.
        </p>
        <p style={{ fontSize: "17px", lineHeight: 2, opacity: 0.58, marginBottom: "52px" }}>
          That became The Page Gallery Journal. These poems are the second attempt at the same problem.
        </p>
        <img src={DRAWING_FIGURES} alt="" style={{
          width: "65%", opacity: 0.28,
          mixBlendMode: "multiply", marginBottom: "48px",
        }} />
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{
            fontSize: "11px", letterSpacing: "0.18em",
            textTransform: "uppercase", opacity: 0.35,
            borderBottom: "1px solid rgba(26,26,24,0.18)", paddingBottom: "4px",
          }}>
          @bsophialovesgnochi
        </a>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={{
        background: "#e8e2d8", padding: "100px 40px",
        borderTop: "1px solid rgba(26,26,24,0.06)",
      }}>
        <div style={{ maxWidth: "420px", margin: "0 auto" }}>
          <p style={{
            fontSize: "10px", letterSpacing: "0.3em",
            textTransform: "uppercase", opacity: 0.28, marginBottom: "28px",
          }}>Letters</p>
          <p style={{
            fontSize: "22px", fontStyle: "italic",
            fontWeight: 400, lineHeight: 1.5, marginBottom: "14px",
          }}>New fragments, when they exist.</p>
          <p style={{ fontSize: "14px", opacity: 0.45, lineHeight: 1.75, marginBottom: "36px" }}>
            No schedule. No newsletter voice. The thing itself when it's ready.
          </p>
          {subscribed ? (
            <p style={{ fontSize: "15px", fontStyle: "italic", opacity: 0.45 }}>You're in.</p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}
              style={{ display: "flex" }}>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: "15px 18px",
                  border: "1px solid rgba(26,26,24,0.15)", borderRight: "none",
                  background: "#f2ede5", fontSize: "14px",
                  fontFamily: "inherit", outline: "none", color: "#1a1a18", borderRadius: 0,
                }} />
              <button type="submit" style={{
                background: "#1a1a18", color: "#f2ede5",
                border: "none", padding: "15px 24px",
                fontSize: "10px", letterSpacing: "0.2em",
                textTransform: "uppercase", cursor: "pointer",
                fontFamily: "inherit", whiteSpace: "nowrap", borderRadius: 0,
              }}>Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "28px 40px",
        borderTop: "1px solid rgba(26,26,24,0.06)",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "12px",
      }}>
        <span style={{ fontSize: "11px", opacity: 0.22 }}>© Bea Sophia</span>
        <a href="https://instagram.com/bsophialovesgnochi" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.22 }}>
          Instagram
        </a>
      </footer>
    </div>
  );
}
