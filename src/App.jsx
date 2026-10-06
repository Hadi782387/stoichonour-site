import { useEffect, useMemo, useRef, useState } from "react";
import Poster from "./Poster";
import { seed, makeCaption } from "./data";

const KEY = "stoichonour-posts";
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const mins = (t) => Math.max(1, Math.round(t.split(/\s+/).length / 200));

function useRoute() {
  const [h, setH] = useState(location.hash);
  useEffect(() => {
    const f = () => { setH(location.hash); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return h.replace(/^#\/?/, "").split("/");
}

function downloadPoster(svg, name) {
  const xml = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  img.onload = () => {
    const c = document.createElement("canvas");
    c.width = 1080; c.height = 1920;
    c.getContext("2d").drawImage(img, 0, 0, 1080, 1920);
    c.toBlob((b) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b); a.download = `${name}.png`; a.click();
    });
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
const copy = async (t) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };

function Home({ posts }) {
  const hero = posts[0];
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Stoic & mindset</p>
          <h1>Quiet strength for a noisy world.</h1>
          <p className="lead">A gallery of Stoic posters and short reflections from @stoichonour. Read them, save them, share them.</p>
          <div className="row"><a className="btn gold" href="#/gallery">Open the gallery</a><a className="btn" href="#/blog">Read the blog</a></div>
        </div>
        {hero && <a className="herop" href={`#/blog/${hero.id}`}><Poster p={hero} uid="h" /></a>}
      </section>
      <section className="sec">
        <p className="eyebrow">Latest reflections</p>
        <div className="list">{posts.slice(0, 3).map((p) => <PostRow key={p.id} p={p} />)}</div>
      </section>
    </>
  );
}

function PostRow({ p }) {
  return (
    <a className="row-card" href={`#/blog/${p.id}`}>
      <div className="thumb"><Poster p={p} uid={`t${p.id}`} /></div>
      <div><p className="meta">{fmt(p.date)} · {mins(p.body)} min read</p><h3>{p.title}</h3><p className="muted">{p.body.slice(0, 120)}...</p></div>
    </a>
  );
}

function Gallery({ posts }) {
  const [tag, setTag] = useState("all");
  const [open, setOpen] = useState(null);
  const tags = useMemo(() => ["all", ...new Set(posts.flatMap((p) => p.tags))], [posts]);
  const list = posts.filter((p) => tag === "all" || p.tags.includes(tag));
  const ref = useRef(null);
  useEffect(() => {
    if (open === null) return;
    const k = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i + 1) % list.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, list.length]);
  const cur = open !== null ? list[open] : null;
  return (
    <section className="sec">
      <p className="eyebrow">Gallery</p><h2>Posters</h2>
      <div className="chips">{tags.map((t) => <button key={t} className={`chip ${tag === t ? "on" : ""}`} onClick={() => setTag(t)}>{t}</button>)}</div>
      <div className="grid">{list.map((p, i) => <button key={p.id} className="tile" onClick={() => setOpen(i)} aria-label={p.title}><Poster p={p} uid={`g${p.id}`} /></button>)}</div>
      {cur && (
        <div className="lb" onClick={() => setOpen(null)}>
          <div className="lbin" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <Poster p={cur} uid="lb" svgRef={ref} />
            <div className="lbbar">
              <button className="btn" onClick={() => setOpen((open - 1 + list.length) % list.length)}>←</button>
              <button className="btn gold" onClick={() => downloadPoster(ref.current, cur.id)}>Download PNG</button>
              <a className="btn" href={`#/blog/${cur.id}`} onClick={() => setOpen(null)}>Read</a>
              <button className="btn" onClick={() => setOpen((open + 1) % list.length)}>→</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Blog({ posts }) {
  return (
    <section className="sec">
      <p className="eyebrow">Blog</p><h2>Reflections</h2>
      <div className="list">{posts.map((p) => <PostRow key={p.id} p={p} />)}</div>
    </section>
  );
}

function Post({ p, onDelete }) {
  const ref = useRef(null);
  const [ok, setOk] = useState(false);
  if (!p) return <section className="sec"><h2>Post not found</h2><a className="btn" href="#/blog">Back to blog</a></section>;
  return (
    <section className="sec post">
      <a className="back" href="#/blog">← All reflections</a>
      <div className="postgrid">
        <div><Poster p={p} uid="po" svgRef={ref} /><button className="btn gold full" onClick={() => downloadPoster(ref.current, p.id)}>Download poster</button></div>
        <article>
          <p className="meta">{fmt(p.date)} · {mins(p.body)} min read</p>
          <h2>{p.title}</h2>
          <p className="body">{p.body}</p>
          <div className="chips">{p.tags.map((t) => <span key={t} className="chip">#{t}</span>)}</div>
          <h4>Instagram caption</h4>
          <pre className="cap">{makeCaption(p)}</pre>
          <div className="row">
            <button className="btn" onClick={async () => { setOk(await copy(makeCaption(p))); setTimeout(() => setOk(false), 1800); }}>{ok ? "Copied ✓" : "Copy caption"}</button>
            {p.mine && <button className="btn danger" onClick={() => onDelete(p.id)}>Delete post</button>}
          </div>
        </article>
      </div>
    </section>
  );
}

function Publish({ onSave }) {
  const [f, setF] = useState({ title: "", quote: "", body: "", tags: "stoicism", variant: "bust" });
  const [errs, setErrs] = useState({});
  const [ok, setOk] = useState(false);
  const ref = useRef(null);
  const tags = f.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  const draft = { ...f, tags, id: "draft", date: new Date().toISOString() };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const x = {};
    if (!f.title.trim()) x.title = "Add a title.";
    if (f.quote.trim().length < 10 || f.quote.length > 140) x.quote = "Quote must be 10 to 140 characters.";
    if (f.body.trim().length < 30) x.body = "Write at least 30 characters.";
    setErrs(x);
    if (Object.keys(x).length) return;
    onSave({ ...draft, id: f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36), mine: true });
  };
  return (
    <section className="sec">
      <p className="eyebrow">Publish</p><h2>New post</h2>
      <p className="muted">Posts are saved in this browser. Copy the caption and download the poster for Instagram.</p>
      <div className="postgrid">
        <form onSubmit={submit} noValidate>
          {[["title", "Title"], ["quote", "Quote on the poster (top third)"]].map(([k, l]) => (
            <div className="field" key={k}><label htmlFor={k}>{l}</label><input id={k} value={f[k]} onChange={set(k)} />{errs[k] && <p className="err" role="alert">{errs[k]}</p>}</div>
          ))}
          <div className="field"><label htmlFor="body">Reflective paragraph</label><textarea id="body" rows="6" value={f.body} onChange={set("body")} />{errs.body && <p className="err" role="alert">{errs.body}</p>}</div>
          <div className="field"><label htmlFor="tags">Tags (comma separated)</label><input id="tags" value={f.tags} onChange={set("tags")} /></div>
          <div className="field"><label htmlFor="variant">Figure</label><select id="variant" value={f.variant} onChange={set("variant")}><option value="bust">Bust</option><option value="column">Column</option></select></div>
          <div className="row">
            <button className="btn gold" type="submit">Publish to site</button>
            <button type="button" className="btn" onClick={async () => { setOk(await copy(makeCaption(draft))); setTimeout(() => setOk(false), 1800); }}>{ok ? "Copied ✓" : "Copy caption"}</button>
            <button type="button" className="btn" onClick={() => downloadPoster(ref.current, "poster")}>Download PNG</button>
          </div>
        </form>
        <div><Poster p={draft} uid="pv" svgRef={ref} /></div>
      </div>
    </section>
  );
}

export default function App() {
  const route = useRoute();
  const [mine, setMine] = useState(load);
  const posts = useMemo(() => [...mine, ...seed].sort((a, b) => b.date.localeCompare(a.date)), [mine]);
  const save = (arr) => { setMine(arr); try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch {} };
  const [page, id] = route;
  const nav = [["", "Home"], ["gallery", "Gallery"], ["blog", "Blog"], ["publish", "Publish"]];
  return (
    <>
      <header className="nav">
        <a className="brand" href="#/">STOIC <span>HONOUR</span></a>
        <nav>{nav.map(([k, l]) => <a key={k} href={`#/${k}`} className={page === k || (k === "blog" && page === "blog") ? "on" : ""}>{l}</a>)}</nav>
      </header>
      <main>
        {page === "" && <Home posts={posts} />}
        {page === "gallery" && <Gallery posts={posts} />}
        {page === "blog" && (id ? <Post p={posts.find((p) => p.id === id)} onDelete={(pid) => { save(mine.filter((p) => p.id !== pid)); location.hash = "#/blog"; }} /> : <Blog posts={posts} />)}
        {page === "publish" && <Publish onSave={(p) => { save([p, ...mine]); location.hash = `#/blog/${p.id}`; }} />}
      </main>
      <footer><p>@stoichonour · Stoic and mindset content</p><p>Built by Yaseen Siddiqui</p></footer>
    </>
  );
}
