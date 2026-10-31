// Kleiner Ersatz für Browser-DOM und -Umgebung, gerade genug für die Lernspiele.
// Läuft im vm-Kontext von tools/pruefe_spiele.js; erwartet dort __seite = { html, search, seed }.
// Keine Darstellung: Grössen sind 0, Animationen laufen nicht, Timer laufen nur über __uhr.weiter(ms).
"use strict";

// ---------- Zufall mit Startwert (Läufe sind wiederholbar) ----------
Math.random = (() => {
  let a = __seite.seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

// ---------- Uhr und Timer ----------
const __uhr = (() => {
  let jetzt = 0;
  let naechsteId = 1;
  const warteschlange = [];
  return {
    jetzt: () => jetzt,
    setze(fn, ms, wiederholen) {
      const id = naechsteId++;
      warteschlange.push({ id, zeit: jetzt + Math.max(0, Number(ms) || 0), fn, wiederholen: wiederholen ? Math.max(1, ms) : 0 });
      return id;
    },
    loesche(id) { const i = warteschlange.findIndex(t => t.id === id); if (i >= 0) warteschlange.splice(i, 1); },
    /** Zeit vorrücken und fällige Timer ausführen (auch solche, die dabei neu entstehen). */
    weiter(ms) {
      const ende = jetzt + ms;
      for (;;) {
        warteschlange.sort((x, y) => x.zeit - y.zeit || x.id - y.id);
        const t = warteschlange[0];
        if (!t || t.zeit > ende) break;
        jetzt = t.zeit;
        if (t.wiederholen) t.zeit += t.wiederholen; else warteschlange.shift();
        __fange(() => t.fn());
      }
      jetzt = ende;
    },
  };
})();

const __fehler = [];
function __fange(fn) {
  try { fn(); } catch (e) { __fehler.push(e && e.stack ? e.stack.split("\n").slice(0, 3).join(" | ") : String(e)); }
}

// ---------- Knoten ----------
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

class Knoten {
  constructor() { this.parentNode = null; this.childNodes = []; this.__hoerer = {}; }
  get parentElement() { return this.parentNode instanceof Element ? this.parentNode : null; }
  get firstChild() { return this.childNodes[0] || null; }
  get lastChild() { return this.childNodes[this.childNodes.length - 1] || null; }
  get nextSibling() { const g = this.parentNode?.childNodes; return g ? g[g.indexOf(this) + 1] || null : null; }
  get previousSibling() { const g = this.parentNode?.childNodes; return g ? g[g.indexOf(this) - 1] || null : null; }
  remove() { if (this.parentNode) { const g = this.parentNode.childNodes; g.splice(g.indexOf(this), 1); this.parentNode = null; } }
  addEventListener(typ, fn) { (this.__hoerer[typ] ||= []).push(fn); }
  removeEventListener(typ, fn) { const l = this.__hoerer[typ]; if (l) { const i = l.indexOf(fn); if (i >= 0) l.splice(i, 1); } }
  dispatchEvent(ev) {
    ev.target ||= this;
    for (let k = this; k && !ev.__gestoppt; k = k.parentNode) {
      ev.currentTarget = k;
      for (const fn of [...(k.__hoerer[ev.type] || [])]) __fange(() => fn.call(k, ev));
      if (typeof k["on" + ev.type] === "function") __fange(() => k["on" + ev.type](ev));
      if (!ev.bubbles) break;
    }
    return !ev.defaultPrevented;
  }
  contains(k) { for (; k; k = k.parentNode) if (k === this) return true; return false; }
}

class Text extends Knoten {
  constructor(t) { super(); this.data = String(t); this.nodeType = 3; }
  get textContent() { return this.data; }
  set textContent(t) { this.data = String(t); }
  get nodeValue() { return this.data; }
  cloneNode() { return new Text(this.data); }
}

function alsKnoten(k) { return k instanceof Knoten ? k : new Text(k); }

class Element extends Knoten {
  constructor(tag, ns) {
    super();
    this.nodeType = 1;
    this.tagName = tag.toUpperCase();
    this.localName = tag.toLowerCase();
    this.namespaceURI = ns || "http://www.w3.org/1999/xhtml";
    this.attributes = {};
    this.style = neuerStil();
    this.dataset = {};
    this.disabled = false;
    this.hidden = false;
    this.value = "";
    this.checked = false;
    this.offsetWidth = 0; this.offsetHeight = 0; this.offsetLeft = 0; this.offsetTop = 0;
    this.clientWidth = 0; this.clientHeight = 0; this.scrollTop = 0; this.scrollLeft = 0;
  }
  get children() { return this.childNodes.filter(k => k instanceof Element); }
  get firstElementChild() { return this.children[0] || null; }
  get lastElementChild() { const c = this.children; return c[c.length - 1] || null; }
  get childElementCount() { return this.children.length; }
  get id() { return this.attributes.id || ""; }
  set id(v) { this.attributes.id = String(v); }
  get className() { return this.attributes.class || ""; }
  set className(v) { this.attributes.class = String(v); }
  get classList() {
    const e = this;
    const liste = () => e.className.split(/\s+/).filter(Boolean);
    const setze = l => { e.className = l.join(" "); };
    return {
      add: (...n) => setze([...new Set([...liste(), ...n])]),
      remove: (...n) => setze(liste().filter(c => !n.includes(c))),
      contains: n => liste().includes(n),
      toggle: (n, an) => { const hat = liste().includes(n); const soll = an === undefined ? !hat : !!an; if (soll && !hat) setze([...liste(), n]); if (!soll && hat) setze(liste().filter(c => c !== n)); return soll; },
      replace: (a, b) => setze(liste().map(c => (c === a ? b : c))),
      get length() { return liste().length; },
      forEach: fn => liste().forEach(fn),
    };
  }
  setAttribute(n, v) {
    v = String(v);
    if (n === "style") { this.style.cssText = v; return; }
    this.attributes[n] = v;
    if (n === "disabled") this.disabled = true;
    if (n === "hidden") this.hidden = true;
    if (n === "value") this.value = v;
    if (n.startsWith("data-")) this.dataset[n.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  getAttribute(n) { return n === "style" ? this.style.cssText : n in this.attributes ? this.attributes[n] : null; }
  hasAttribute(n) { return n in this.attributes; }
  removeAttribute(n) { delete this.attributes[n]; if (n === "disabled") this.disabled = false; if (n === "hidden") this.hidden = false; }
  toggleAttribute(n, an) { const soll = an === undefined ? !this.hasAttribute(n) : !!an; soll ? this.setAttribute(n, "") : this.removeAttribute(n); return soll; }

  __einfuegen(knoten, vor) {
    const liste = [];
    for (const k of knoten.map(alsKnoten)) {
      if (k.localName === "#fragment") { liste.push(...k.childNodes); k.childNodes = []; } else liste.push(k);
    }
    for (const k of liste) {
      k.remove();
      k.parentNode = this;
      const i = vor ? this.childNodes.indexOf(vor) : -1;
      if (i >= 0) this.childNodes.splice(i, 0, k); else this.childNodes.push(k);
    }
  }
  append(...k) { this.__einfuegen(k, null); }
  appendChild(k) { this.__einfuegen([k], null); return k; }
  prepend(...k) { this.__einfuegen(k, this.firstChild); }
  insertBefore(k, vor) { this.__einfuegen([k], vor); return k; }
  removeChild(k) { k.remove(); return k; }
  replaceChildren(...k) { for (const c of [...this.childNodes]) c.remove(); this.append(...k); }
  replaceWith(...k) { const p = this.parentNode; if (!p) return; p.__einfuegen(k, this); this.remove(); }
  before(...k) { this.parentNode?.__einfuegen(k, this); }
  after(...k) { const p = this.parentNode; if (p) p.__einfuegen(k, this.nextSibling); }
  insertAdjacentElement(wo, k) { ({ beforebegin: () => this.before(k), afterbegin: () => this.prepend(k), beforeend: () => this.append(k), afterend: () => this.after(k) })[wo](); return k; }
  insertAdjacentHTML(wo, html) { const f = document.createElement("template"); f.innerHTML = html; for (const k of [...f.childNodes]) this.insertAdjacentElement(wo, k); }

  get textContent() { return this.childNodes.map(k => (k.localName === "style" || k.localName === "script" ? "" : k.textContent)).join(""); }
  set textContent(t) { for (const c of [...this.childNodes]) c.remove(); if (t !== "" && t != null) this.append(new Text(t)); }
  get innerText() { return this.textContent; }
  set innerText(t) { this.textContent = t; }
  get innerHTML() { return this.childNodes.map(serialisiere).join(""); }
  set innerHTML(html) { for (const c of [...this.childNodes]) c.remove(); this.append(...parseHTML(String(html), this.namespaceURI)); }
  get outerHTML() { return serialisiere(this); }

  cloneNode(tief) {
    const e = new Element(this.localName, this.namespaceURI);
    for (const [k, v] of Object.entries(this.attributes)) e.attributes[k] = v;
    e.style.cssText = this.style.cssText;
    if (tief) for (const k of this.childNodes) e.append(k.cloneNode(true));
    return e;
  }
  querySelectorAll(sel) { const treffer = []; const regeln = parseSelektor(sel); sammle(this, e => { if (regeln.some(r => passt(e, r))) treffer.push(e); }); return treffer; }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  getElementsByTagName(t) { return this.querySelectorAll(t); }
  getElementsByClassName(c) { return this.querySelectorAll("." + c.trim().split(/\s+/).join(".")); }
  matches(sel) { return parseSelektor(sel).some(r => passt(this, r)); }
  closest(sel) { for (let e = this; e instanceof Element; e = e.parentNode) if (e.matches(sel)) return e; return null; }

  click() { if (!this.disabled) this.dispatchEvent(neuesEreignis("click", { bubbles: true })); }
  focus() { document.activeElement = this; }
  blur() {}
  select() {}
  scrollIntoView() {}
  getBoundingClientRect() { return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0 }; }
  getClientRects() { return []; }
  animate() { const a = { finished: Promise.resolve(), cancel() {}, finish() {}, onfinish: null }; return a; }
  getBBox() { return { x: 0, y: 0, width: 0, height: 0 }; }
  getTotalLength() { return 0; }
  getPointAtLength() { return { x: 0, y: 0 }; }
  getScreenCTM() { return { inverse: () => ({}) }; }
  createSVGPoint() { return { x: 0, y: 0, matrixTransform() { return { x: 0, y: 0 }; } }; }
  setPointerCapture() {}
  releasePointerCapture() {}
}

function neuerStil() {
  const s = {
    setProperty(k, v) { s[k] = String(v); },
    removeProperty(k) { delete s[k]; },
    getPropertyValue(k) { return s[k] ?? ""; },
  };
  Object.defineProperty(s, "cssText", {
    enumerable: false,
    get() { return Object.entries(s).filter(([, v]) => typeof v !== "function").map(([k, v]) => `${k}:${v}`).join(";"); },
    set(t) { for (const teil of String(t).split(";")) { const i = teil.indexOf(":"); if (i > 0) s[teil.slice(0, i).trim()] = teil.slice(i + 1).trim(); } },
  });
  return s;
}

function neuesEreignis(type, opt = {}) {
  return {
    type, bubbles: !!opt.bubbles, key: opt.key, clientX: 0, clientY: 0, pointerId: 1, button: 0, target: null, currentTarget: null,
    defaultPrevented: false, __gestoppt: false,
    preventDefault() { this.defaultPrevented = true; },
    stopPropagation() { this.__gestoppt = true; },
    stopImmediatePropagation() { this.__gestoppt = true; },
  };
}

function sammle(wurzel, fn) {
  for (const k of wurzel.childNodes) if (k instanceof Element) { fn(k); sammle(k, fn); }
}

function serialisiere(k) {
  if (k instanceof Text) return k.data.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const attr = Object.entries(k.attributes).map(([n, v]) => ` ${n}="${v.replace(/"/g, "&quot;")}"`).join("");
  const stil = k.style.cssText ? ` style="${k.style.cssText}"` : "";
  if (VOID.has(k.localName)) return `<${k.localName}${attr}${stil}>`;
  return `<${k.localName}${attr}${stil}>${k.childNodes.map(serialisiere).join("")}</${k.localName}>`;
}

// ---------- HTML lesen ----------
function entschluessle(t) {
  return t.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, c) => {
    if (c[0] === "#") return String.fromCodePoint(c[1] === "x" || c[1] === "X" ? parseInt(c.slice(2), 16) : parseInt(c.slice(1), 10));
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", thinsp: " " }[c.toLowerCase()] ?? m;
  });
}

function parseHTML(html, ns) {
  const wurzel = new Element("#fragment", ns);
  const stapel = [wurzel];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+|<)/g;
  let m;
  while ((m = re.exec(html))) {
    const oben = stapel[stapel.length - 1];
    if (m[4] !== undefined) { oben.append(new Text(entschluessle(m[4]))); continue; }
    if (!m[2]) continue; // Kommentar
    const tag = m[2].toLowerCase();
    if (m[1]) { // schliessendes Tag
      for (let i = stapel.length - 1; i > 0; i--) if (stapel[i].localName === tag) { stapel.length = i; break; }
      continue;
    }
    const kindNs = tag === "svg" ? "http://www.w3.org/2000/svg" : oben.namespaceURI;
    const e = new Element(tag, kindNs);
    const attrRe = /([^\s=\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let a;
    while ((a = attrRe.exec(m[3]))) e.setAttribute(a[1], entschluessle(a[2] ?? a[3] ?? a[4] ?? ""));
    oben.append(e);
    if (tag === "script" || tag === "style") { // Rohtext bis zum Ende-Tag
      const ende = html.toLowerCase().indexOf(`</${tag}`, re.lastIndex);
      const stop = ende < 0 ? html.length : ende;
      e.append(new Text(html.slice(re.lastIndex, stop)));
      re.lastIndex = stop;
      continue;
    }
    const selbst = /\/\s*$/.test(m[3]);
    if (!VOID.has(tag) && !selbst) stapel.push(e);
  }
  return [...wurzel.childNodes];
}

// ---------- Selektoren (Tag, #id, .klasse, [attr], [attr=wert], :not(...), Nachfahre, >) ----------
function parseEinfach(t) {
  const r = { tag: null, id: null, klassen: [], attr: [], nicht: [] };
  const re = /^([a-zA-Z*][\w-]*)|#([\w-]+)|\.([\w-]+)|\[([\w-]+)(?:([~^$*|]?=)"?([^"\]]*)"?)?\]|:not\(([^)]*)\)|:([\w-]+)/g;
  let m;
  while ((m = re.exec(t))) {
    if (m[0] === "") { re.lastIndex++; continue; }
    if (m[1]) r.tag = m[1] === "*" ? null : m[1].toLowerCase();
    else if (m[2]) r.id = m[2];
    else if (m[3]) r.klassen.push(m[3]);
    else if (m[4]) r.attr.push({ n: m[4], op: m[5], v: m[6] });
    else if (m[7]) r.nicht.push(...parseSelektor(m[7]));
    else if (m[8]) r.pseudo = m[8];
  }
  return r;
}

function parseSelektor(sel) {
  return sel.split(/,(?![^(]*\))/).map(teil => {
    const schritte = [];
    let art = " ";
    for (const tok of teil.trim().replace(/\s*>\s*/g, " > ").split(/\s+(?![^(]*\))/)) {
      if (tok === ">") { art = ">"; continue; }
      schritte.push({ art, e: parseEinfach(tok) });
      art = " ";
    }
    return schritte;
  });
}

function passtEinfach(e, r) {
  if (r.tag && e.localName !== r.tag) return false;
  if (r.id && e.id !== r.id) return false;
  for (const k of r.klassen) if (!e.classList.contains(k)) return false;
  for (const a of r.attr) {
    const v = e.getAttribute(a.n);
    if (v === null) return false;
    if (a.op === "=" && v !== a.v) return false;
  }
  if (r.pseudo === "disabled" && !e.disabled) return false;
  if (r.pseudo === "first-child" && e.parentNode?.children[0] !== e) return false;
  for (const n of r.nicht) if (passt(e, n)) return false;
  return true;
}

function passt(e, schritte, i = schritte.length - 1) {
  if (!passtEinfach(e, schritte[i].e)) return false;
  if (i === 0) return true;
  if (schritte[i].art === ">") return e.parentNode instanceof Element && passt(e.parentNode, schritte, i - 1);
  for (let p = e.parentNode; p instanceof Element; p = p.parentNode) if (passt(p, schritte, i - 1)) return true;
  return false;
}

// ---------- document und window ----------
const document = (() => {
  const html = new Element("html");
  const head = new Element("head");
  const body = new Element("body");
  html.append(head, body);
  body.append(...parseHTML(__seite.html));
  const d = new Element("#document");
  d.append(html);
  Object.assign(d, {
    documentElement: html, head, body, activeElement: body, readyState: "complete",
    createElement: t => new Element(t),
    createElementNS: (ns, t) => new Element(t, ns),
    createTextNode: t => new Text(t),
    createDocumentFragment: () => new Element("#fragment"),
    getElementById: id => html.querySelector("#" + id),
  });
  return d;
})();

const window = globalThis;
const self = globalThis;
const __speicher = new Map();
const localStorage = {
  getItem: k => (__speicher.has(k) ? __speicher.get(k) : null),
  setItem: (k, v) => { __speicher.set(k, String(v)); },
  removeItem: k => { __speicher.delete(k); },
  clear: () => __speicher.clear(),
  key: i => [...__speicher.keys()][i] ?? null,
  get length() { return __speicher.size; },
};
const sessionStorage = localStorage;
const location = { search: __seite.search, href: "http://pruefung/" + __seite.search, pathname: "/", hash: "", reload() {}, assign() {}, replace() {} };
const history = { pushState() {}, replaceState() {}, back() {} };
const navigator = { userAgent: "pruefe_spiele", language: "de-CH", vibrate() {} };
const performance = { now: () => __uhr.jetzt() };
const setTimeout = (fn, ms) => __uhr.setze(fn, ms, false);
const setInterval = (fn, ms) => __uhr.setze(fn, ms, true);
const clearTimeout = id => __uhr.loesche(id);
const clearInterval = clearTimeout;
const requestAnimationFrame = fn => __uhr.setze(() => fn(__uhr.jetzt()), 16, false);
const cancelAnimationFrame = clearTimeout;
const getComputedStyle = e => ({ width: "0px", height: "0px", fontSize: "16px", fontWeight: "400", getPropertyValue: k => e.style[k] ?? "", ...e.style });
const matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {} });
const alert = () => {};
const innerWidth = 1024;
const innerHeight = 768;
const scrollTo = () => {};
const addEventListener = (t, fn) => document.addEventListener(t, fn);
const Node = Knoten;
const HTMLElement = Element;
const SVGElement = Element;
const Event = function (type, opt) { return neuesEreignis(type, opt); };
const KeyboardEvent = Event;
const MouseEvent = Event;
const PointerEvent = Event;
