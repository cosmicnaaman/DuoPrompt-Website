import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clapperboard,
  Download,
  Expand,
  FileText,
  FlipHorizontal2,
  Focus,
  Menu,
  Mic,
  MonitorPlay,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  Video,
  X,
} from "lucide-react";

const SAMPLE = `You have something worth sharing.\n\nAn idea. A story. A different way of seeing things.\n\nAnd the best way to share it? As yourself.\n\nWith DuoPrompt, your words are right where you need them. So you can take a breath, look up, and let your personality do the talking.\n\nLess second-guessing. More connection.\n\nBecause a great take doesn't have to be a perfect take. It just has to sound like you.`;
const STORAGE_KEY = "duoprompt-script-v1";

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <span className="brand-symbol" aria-hidden="true">
        <i />
        <Play size={13} fill="currentColor" />
        <i />
      </span>
      <span>
        duo<span className="brand-medium">prompt</span>
        <span className="brand-dot">.</span>
      </span>
    </span>
  );
}

function ProductPreview({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="product-scene">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="scene-label">
        <span /> A LITTLE PREPARATION. A LOT MORE YOU.
      </div>
      <div className="product-window">
        <div className="window-toolbar">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <span>My next great take</span>
          <div className="saved-label">
            <span /> Saved
          </div>
        </div>
        <div className="window-workspace">
          <div className="window-sidebar">
            <span className="sidebar-selected">
              <FileText size={17} />
            </span>
            <Settings2 size={17} />
            <Focus size={17} />
            <span className="sidebar-help">
              <CircleHelp size={17} />
            </span>
          </div>
          <div className="prompt-preview">
            <div className="prompt-top">
              <span>
                <span className="live-dot" /> YOUR PERSONAL PROMPTING STUDIO
              </span>
              <Expand size={13} />
            </div>
            <div className="preview-copy">
              <p className="faded-line">Take a breath. You’ve got this.</p>
              <p>
                <span className="reading-pointer">›</span> You have something
                <br />
                worth sharing.
              </p>
              <p className="next-line">
                Let’s make sure the world
                <br />
                hears it.
              </p>
            </div>
            <div className="preview-controls">
              <button
                className="preview-play"
                onClick={onOpen}
                aria-label="Play the interactive demo"
              >
                <Play size={17} fill="currentColor" />
              </button>
              <span className="preview-time">
                00:00 <span>/ 00:30</span>
              </span>
              <div className="preview-progress">
                <span />
              </div>
              <span className="preview-speed">
                120 <small>wpm</small>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flow-card">
        <span className="flow-icon">
          <AudioLines size={22} />
        </span>
        <div>
          <strong>Find your natural flow</strong>
          <span>Your pace. Your voice. Your moment.</span>
        </div>
        <span className="flow-check">
          <Check size={13} />
        </span>
      </div>
      <div className="scene-caption">
        <span className="tiny-star">✳</span> Big ideas deserve an easy delivery.
      </div>
    </div>
  );
}

function Studio({ onClose }: { onClose: () => void }) {
  const [script, setScript] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? SAMPLE;
    } catch {
      return SAMPLE;
    }
  });
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(120);
  const [fontSize, setFontSize] = useState(38);
  const [mirrored, setMirrored] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [notice, setNotice] = useState("");
  const [storageAvailable, setStorageAvailable] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const words = script.trim() ? script.trim().split(/\s+/).length : 0;
  const duration = Math.ceil((words / speed) * 60);
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  const reset = () => {
    setPlaying(false);
    setProgress(0);
    setElapsed(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };
  const toggle = () => {
    if (!words) {
      setNotice("Add a few words to your script to get started.");
      return;
    }
    if (progress >= 99.8) {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setElapsed(0);
      setProgress(0);
    }
    setPlaying((value) => !value);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, script);
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [script]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.fullscreenElement) onClose();
      const isInput = (event.target as HTMLElement).matches(
        "textarea, input, button, select, a",
      );
      if (event.code === "Space" && !isInput) {
        event.preventDefault();
        toggle();
      }
      if (event.key === "Tab") {
        const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([hidden]), textarea, [tabindex="0"]',
        );
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  useEffect(() => {
    if (!playing) return;
    let frame: number;
    let last = performance.now();
    let accumulated = 0;
    let position = scrollRef.current?.scrollTop ?? 0;
    const tick = (now: number) => {
      const element = scrollRef.current;
      if (!element) return;
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      accumulated += delta;
      const textWidth = Math.max(100, element.clientWidth - 112);
      const wordsPerLine = Math.max(1, textWidth / (fontSize * 0.52 * 6));
      position += delta * (speed / 60 / wordsPerLine) * fontSize * 1.65;
      element.scrollTop = position;
      const maxScroll = element.scrollHeight - element.clientHeight;
      setProgress(
        maxScroll > 0 ? Math.min(100, (position / maxScroll) * 100) : 100,
      );
      if (accumulated >= 0.25) {
        const elapsedDelta = accumulated;
        setElapsed((value) => value + elapsedDelta);
        accumulated = 0;
      }
      if (position >= maxScroll) {
        setPlaying(false);
        setProgress(100);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, fontSize]);

  const importScript = async (file?: File) => {
    if (!file) return;
    if (!/\.txt$/i.test(file.name)) {
      setNotice("Please choose a plain text (.txt) file.");
      return;
    }
    if (file.size > 100_000) {
      setNotice("Choose a text file smaller than 100 KB.");
      return;
    }
    try {
      setScript(await file.text());
      reset();
      setNotice("Your script is ready. Make it your own.");
    } catch {
      setNotice(
        "We couldn’t read that file. Try copying your text into the editor.",
      );
    }
    if (fileRef.current) fileRef.current.value = "";
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([script], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "duoprompt-script.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await dialogRef.current?.requestFullscreen();
    } catch {
      setNotice(
        "Fullscreen isn’t available in this browser. You can still use the studio here.",
      );
    }
  };

  return (
    <div className="studio-overlay">
      <div
        className="studio"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-title"
      >
        <header className="studio-header">
          <Brand />
          <span className="studio-title" id="studio-title">
            Your prompting studio
          </span>
          <button
            ref={closeRef}
            className="icon-button"
            onClick={onClose}
            aria-label="Close studio"
          >
            <X size={22} />
          </button>
        </header>
        <div className="studio-body">
          <aside className="script-panel">
            <div className="script-panel-title">
              <div>
                <span className="eyebrow">MAKE IT YOURS</span>
                <h2>Start with your words.</h2>
              </div>
              <FileText size={22} />
            </div>
            <label htmlFor="script-input" className="script-label">
              Your script{" "}
              <span>
                {words} words · about {formatTime(duration)}
              </span>
            </label>
            <textarea
              id="script-input"
              value={script}
              maxLength={100000}
              onChange={(event) => {
                setScript(event.target.value);
                reset();
              }}
              placeholder="An idea. A story. Something worth sharing…"
              spellCheck
            />
            <div className="script-actions">
              <button onClick={() => fileRef.current?.click()}>
                <Upload size={15} /> Import .txt
              </button>
              <button onClick={download} disabled={!words}>
                <Download size={15} /> Export
              </button>
              <input
                hidden
                type="file"
                accept=".txt,text/plain"
                ref={fileRef}
                onChange={(event) => void importScript(event.target.files?.[0])}
              />
            </div>
            <p className="autosave">
              <ShieldCheck size={14} />
              {storageAvailable
                ? "Saved only in this browser. Always yours."
                : "Browser saving unavailable. Export to keep your script."}
            </p>
            <div className="studio-settings">
              <label htmlFor="speed">
                Reading speed{" "}
                <strong>
                  {speed} <span>WPM</span>
                </strong>
              </label>
              <input
                id="speed"
                type="range"
                min="40"
                max="240"
                step="5"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              />
              <div className="range-labels">
                <span>Take it easy</span>
                <span>Pick up the pace</span>
              </div>
              <label htmlFor="text-size">
                Text size{" "}
                <strong>
                  {fontSize}
                  <span> px</span>
                </strong>
              </label>
              <input
                id="text-size"
                type="range"
                min="24"
                max="64"
                step="2"
                value={fontSize}
                onChange={(event) => {
                  setFontSize(Number(event.target.value));
                  setPlaying(false);
                }}
              />
              <button
                className={`mirror-button ${mirrored ? "selected" : ""}`}
                onClick={() => setMirrored((value) => !value)}
                aria-pressed={mirrored}
              >
                <FlipHorizontal2 size={17} />
                <span>Mirror text</span>
                <span className="toggle-track">
                  <span />
                </span>
              </button>
            </div>
            <div className="studio-tip">
              <Sparkles size={17} />
              <p>
                A little tip: position this window near your camera for a more
                natural connection.
              </p>
            </div>
          </aside>
          <div className="reader-panel">
            <div className="reader-top">
              <span>
                <span className={`live-dot ${playing ? "is-playing" : ""}`} />
                {playing
                  ? "IN YOUR FLOW"
                  : progress >= 99.8
                    ? "THAT’S A WRAP"
                    : "READY WHEN YOU ARE"}
              </span>
              <button
                className="icon-button"
                onClick={() => void fullscreen()}
                aria-label="Toggle fullscreen"
              >
                <Expand size={18} />
              </button>
            </div>
            <div className="reader-stage">
              <div className="reading-guide" aria-hidden="true">
                <ChevronRight size={24} />
              </div>
              <div
                className="reader-scroll"
                ref={scrollRef}
                tabIndex={0}
                aria-label="Teleprompter script"
                onWheel={() => setPlaying(false)}
                onTouchStart={() => setPlaying(false)}
                onScroll={(event) => {
                  const element = event.currentTarget;
                  const distance = element.scrollHeight - element.clientHeight;
                  setProgress(
                    distance > 0 ? (element.scrollTop / distance) * 100 : 0,
                  );
                }}
              >
                <div
                  className={`reader-text ${mirrored ? "mirrored" : ""}`}
                  style={{ fontSize }}
                >
                  {script || "Your next great take starts with a few words."}
                </div>
              </div>
            </div>
            <div className="reader-bottom">
              <div
                className="reader-progress"
                role="progressbar"
                aria-label="Script progress"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="reader-controls">
                <span className="reader-time">{formatTime(elapsed)}</span>
                <div>
                  <button
                    className="icon-button"
                    onClick={reset}
                    aria-label="Restart script"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    className="reader-play"
                    onClick={toggle}
                    aria-label={
                      playing ? "Pause teleprompter" : "Play teleprompter"
                    }
                  >
                    {playing ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" />
                    )}
                    <span>
                      {playing
                        ? "Pause"
                        : progress >= 99.8
                          ? "Read again"
                          : "Let’s do this"}
                    </span>
                  </button>
                  <span className="control-spacer" />
                </div>
                <span className="keyboard-hint">
                  <kbd>space</kbd> to play / pause
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="studio-notice" role="status">
          {notice || "A little preparation. A lot more you."}
        </div>
      </div>
    </div>
  );
}

const faqs = [
  [
    "What is DuoPrompt?",
    "DuoPrompt is a browser-based teleprompter that keeps your script in view as you speak. Paste your words, set a comfortable pace, and press play. It’s a simple way to prepare for videos, presentations, podcasts, or any moment you want to get your message across.",
  ],
  [
    "Do I need to download an app or create an account?",
    "No. The prompting studio runs right here in your browser, with no installation or account required. Open the studio and start with the sample script, paste your own, or import a plain text file.",
  ],
  [
    "Will it work on my phone or tablet?",
    "Yes. The website and studio adapt to phones, tablets, and computers. For comfortable reading, use a larger screen when you can. Fullscreen availability depends on your browser and device.",
  ],
  [
    "Can I use it with my camera or video call?",
    "You can use DuoPrompt alongside your camera, recording software, or video call. Place the browser near your camera to keep your eye line natural. This version displays your script; it doesn’t record video or connect to your camera.",
  ],
  [
    "Where are my scripts saved?",
    "Your script is stored locally in this browser, when browser storage is available. We don’t upload it to a server. Export a copy as a text file to keep a backup or use it on another device. Clearing browser data removes locally saved scripts.",
  ],
  [
    "Is the studio free to use?",
    "Yes, the browser studio on this website is available without a subscription or payment details. You can edit, import, export, and read scripts with adjustable speed, text size, and mirror mode.",
  ],
];

export default function App() {
  const [studioOpen, setStudioOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const openStudio = () => {
    setMenuOpen(false);
    setStudioOpen(true);
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-container">
          <a href="#" aria-label="DuoPrompt home">
            <Brand />
          </a>
          <nav
            aria-label="Main navigation"
            className={menuOpen ? "nav-open" : ""}
          >
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Why DuoPrompt
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>
              FAQs
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="button button-dark button-small"
              onClick={openStudio}
            >
              Open the studio <ArrowUpRight size={16} />
            </button>
            <button
              className="mobile-menu icon-button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero section-container">
          <div className="hero-copy">
            <span className="pill">
              <span className="pill-star">✳</span> A LITTLE LESS SCRIPT. A LOT
              MORE YOU.
            </span>
            <h1>
              Your words.
              <br />
              Your presence.
              <br />
              <em>Perfectly in sync.</em>
            </h1>
            <p className="hero-description">
              Stay on message. Stay in the moment. A beautifully simple
              teleprompter that helps you sound like the best version of
              yourself.
            </p>
            <div className="hero-actions">
              <button className="button button-blue" onClick={openStudio}>
                Find your flow <ArrowUpRight size={18} />
              </button>
              <a className="text-link" href="#how-it-works">
                <span className="circle-play">
                  <Play size={12} fill="currentColor" />
                </span>{" "}
                See how it works
              </a>
            </div>
            <div className="hero-reassurance">
              <span>
                <Check size={13} /> Free to get started
              </span>
              <span>
                <Check size={13} /> No download. Just you.
              </span>
            </div>
          </div>
          <ProductPreview onOpen={openStudio} />
        </section>
        <section
          className="use-cases section-container"
          aria-label="Who DuoPrompt is for"
        >
          <p>
            FOR EVERY WAY
            <br />
            <strong>YOU SHOW UP.</strong>
          </p>
          <div>
            <Video size={21} />
            <span>Content creators</span>
          </div>
          <div>
            <Mic size={21} />
            <span>Storytellers</span>
          </div>
          <div>
            <MonitorPlay size={21} />
            <span>Presenters</span>
          </div>
          <div>
            <Clapperboard size={21} />
            <span>Big-idea people</span>
          </div>
        </section>
        <section className="features-section" id="features">
          <div className="section-container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">LESS FRICTION. MORE CONNECTION.</span>
                <h2>
                  Be prepared.
                  <br />
                  <em>Be completely yourself.</em>
                </h2>
              </div>
              <p>
                Your best work happens when you stop thinking about the next
                line and start connecting with the person on the other side.
              </p>
            </div>
            <div className="feature-grid">
              <article className="feature-card feature-pace">
                <div className="feature-visual pace-visual">
                  <div className="pace-label">
                    <AudioLines size={19} />
                    <span>A pace that feels like you</span>
                    <span className="pace-value">
                      120 <small>wpm</small>
                    </span>
                  </div>
                  <div className="pace-track">
                    <span />
                    <i />
                  </div>
                  <div className="pace-scale">
                    <span>Slow it down</span>
                    <span>Find your flow</span>
                  </div>
                  <div className="waveform" aria-hidden="true">
                    {Array.from({ length: 41 }, (_, i) => (
                      <i
                        key={i}
                        style={{
                          height: `${10 + Math.abs(Math.sin(i * 1.8) * Math.cos(i * 0.24)) * 43}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <span className="feature-number">01 / YOUR RHYTHM</span>
                <h3>Keep up with your ideas.</h3>
                <p>
                  Set the scrolling speed to match your natural rhythm. Pause,
                  breathe, and pick up right where you left off.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-visual focus-visual">
                  <div className="focus-corner tl" />
                  <div className="focus-corner tr" />
                  <div className="focus-corner bl" />
                  <div className="focus-corner br" />
                  <span className="focus-label">
                    <Focus size={14} /> ALL EYES ON YOUR MESSAGE
                  </span>
                  <p>
                    More presence.
                    <br />
                    <em>Less pressure.</em>
                  </p>
                  <span className="focus-marker" />
                </div>
                <span className="feature-number">02 / YOUR FOCUS</span>
                <h3>Look up. Connect more.</h3>
                <p>
                  Clear, comfortable text keeps your words close to your camera.
                  Spend less time searching and more time showing up.
                </p>
              </article>
              <article className="feature-card">
                <div className="feature-visual anywhere-visual">
                  <div className="device-desktop">
                    <div className="device-dot" />
                    <div className="device-lines">
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <span>
                      <Play size={10} fill="currentColor" />
                    </span>
                  </div>
                  <div className="device-base" />
                  <div className="device-mobile">
                    <div />
                    <i />
                    <i />
                    <i />
                    <span>
                      <Play size={8} fill="currentColor" />
                    </span>
                  </div>
                  <span className="device-spark">✳</span>
                </div>
                <span className="feature-number">03 / YOUR SPACE</span>
                <h3>Your studio. Anywhere.</h3>
                <p>
                  Open a tab and you’re ready. From your desk to your next big
                  moment, your browser is all you need.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="how-section section-container" id="how-it-works">
          <div className="how-intro">
            <span className="eyebrow">FROM FIRST WORD TO FIRST TAKE</span>
            <h2>
              Less setup.
              <br />
              <em>More showtime.</em>
            </h2>
            <p>
              No complicated tools. No learning curve.
              <br />
              Just a little space to make your ideas shine.
            </p>
            <button className="text-link blue-link" onClick={openStudio}>
              Give it a try <ArrowUpRight size={18} />
            </button>
            <div className="handwritten-note">
              You’ve already got this.<span>↗</span>
            </div>
          </div>
          <div className="steps">
            {[
              {
                number: "01",
                icon: FileText,
                title: "Bring your words.",
                text: "Paste your script, import a text file, or start with a blank page. There’s no right way to begin.",
              },
              {
                number: "02",
                icon: Settings2,
                title: "Make yourself comfortable.",
                text: "Choose your text size and reading speed. Find the settings that feel natural to you.",
              },
              {
                number: "03",
                icon: Play,
                title: "Take a breath. Press play.",
                text: "Your words flow. You do your thing. Pause whenever you need to — this is your moment.",
              },
            ].map((step) => (
              <article className="step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <step.icon size={21} />
              </article>
            ))}
          </div>
        </section>
        <section className="manifesto">
          <div className="manifesto-inner">
            <span className="manifesto-star">✳</span>
            <span className="eyebrow">A NOTE FROM DUOPROMPT</span>
            <h2>
              The world doesn’t need
              <br />
              another perfect performance.
              <br />
              <em>It needs your perspective.</em>
            </h2>
            <p>
              We believe the best tools get out of your way.
              <br />
              So your ideas, your personality, and your voice can come through.
            </p>
            <span className="manifesto-signature">
              A little support. All you.
            </span>
          </div>
          <span className="manifesto-watermark" aria-hidden="true">
            dp.
          </span>
        </section>
        <section className="faq-section section-container" id="faq">
          <div>
            <span className="eyebrow">A FEW THINGS, CLEARED UP</span>
            <h2>
              Good questions.
              <br />
              <em>Simple answers.</em>
            </h2>
            <p>Everything you need to find your flow.</p>
            <span className="faq-symbol" aria-hidden="true">
              ?
            </span>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <div
                className={`faq-item ${openFaq === index ? "faq-open" : ""}`}
                key={question}
              >
                <h3>
                  <button
                    id={`faq-question-${index}`}
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {question}
                    <ChevronDown size={19} />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  hidden={openFaq !== index}
                >
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="final-cta section-container">
          <div className="cta-doodle" aria-hidden="true">
            ✳
          </div>
          <div>
            <span className="eyebrow">YOUR NEXT GREAT TAKE STARTS HERE</span>
            <h2>
              You bring the ideas.
              <br />
              <em>We’ll keep the words flowing.</em>
            </h2>
            <button className="button button-white" onClick={openStudio}>
              Let’s find your flow <ArrowUpRight size={18} />
            </button>
            <p>No account. No download. No overthinking.</p>
          </div>
          <span className="cta-arrow" aria-hidden="true">
            ↗
          </span>
        </section>
      </main>
      <footer className="footer section-container">
        <div className="footer-top">
          <div>
            <a href="#" aria-label="DuoPrompt home">
              <Brand />
            </a>
            <p>Your words. Your presence.</p>
          </div>
          <div className="footer-links">
            <a href="#features">Why DuoPrompt</a>
            <a href="#how-it-works">How it works</a>
            <a href="#faq">FAQs</a>
            <button onClick={openStudio}>
              Open the studio <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} DuoPrompt. Made for your moment.
          </span>
          <span>
            Thoughtfully simple. Naturally you.
            <span className="footer-spark">✳</span>
          </span>
          <a href="#" aria-label="Back to top">
            <ArrowDown size={16} className="up-arrow" />
          </a>
        </div>
      </footer>
      {studioOpen && <Studio onClose={() => setStudioOpen(false)} />}
    </>
  );
}
