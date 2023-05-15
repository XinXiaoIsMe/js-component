const w = Object.prototype.toString;
function h(s) {
  return w.call(s).slice(8, -1).toLowerCase();
}
function p(s) {
  return U(s) ? s : h(s) ? document.querySelector(s) : null;
}
function U(s) {
  return s instanceof HTMLElement;
}
class c {
  constructor() {
    this._events = {}, this._nativeEventOptionMap = /* @__PURE__ */ new Map();
  }
  on(t, e, i = !1, n = !1) {
    this._events[t] = this._events[t] || [], this._events[t].push(e), i && (this.el.addEventListener(t, e, n), (this._nativeEventOptionMap.get(e) || []).push(n));
  }
  emit(t, ...e) {
    (this._events[t] || []).forEach((n) => n(...e));
  }
  off(t, e, i = !1) {
    if (!this._events[t])
      return;
    const n = this._events[t];
    h(e) ? (i && this.el.removeEventListener(
      t,
      n,
      this._nativeEventOptionMap.get(e).shift()
    ), this._events[t] = n.filter((o) => o !== e)) : (i && n.forEach(
      (o) => this.el.removeEventListener(
        t,
        o,
        this._nativeEventOptionMap.get(o).shift()
      )
    ), Reflect.deleteProperty(this._events, t));
  }
}
class C extends c {
  constructor(t = {
    el: "",
    class: "",
    shadow: "always"
  }) {
    if (super(), this.options = t, this.el = p(t.el), !this.el)
      throw new TypeError("please pass a valid element or selector.");
    this._init();
  }
  _init() {
    this._render();
  }
  _render() {
    this.el.className += this.options.class || "", this.el.dataset.component = "card";
    const t = this.options.shadow;
    this.el.className += t === "always" ? " always-shadow" : t === "hover" ? " hover-shadow" : "";
  }
  destroy() {
    this.el && this.el.remove(), this.el = this.options = null;
  }
}
function E(s = {}) {
  const {
    type: t = "GET",
    url: e,
    headers: i,
    data: n = null,
    params: o = {},
    async: a = !0,
    user: r = null,
    password: u = null,
    timeout: d,
    onProgress: f = function() {
    },
    onTimeout: y = function() {
    }
  } = s, v = new Promise((I, O) => {
  }), l = new XMLHttpRequest(), _ = m(e, o);
  return l.open(t, _, a, r, u), L(l, d, y), g(l, i), l.onreadystatechange = function() {
    l.readyState === XMLHttpRequest.DONE && l.status === 200 && resolve(l.response);
  }, l.onerror = reject, l.onprogress = f, l.send(n), v;
}
function m(s, t) {
  const e = [];
  for (const i in t)
    t.hasOwnProperty(i) && queryStr.push(`${i}=${t[i]}`);
  return e.length ? `${s}?${e.join("&")}` : s;
}
function g(s, t) {
  for (const e in t)
    t.hasOwnProperty(e) && s.setRequestHeader(e, t[e]);
}
function L(s, t, e) {
  h(t) && (s.timeout = t, s.ontimeout = e);
}
async function k(s) {
  const t = [];
  try {
    t[1] = await s;
  } catch (e) {
    t[0] = e;
  }
  return t;
}
class q extends c {
  constructor(t = {}) {
    if (super(), this.options = t, this.fileList = [], this.el = p(t.el), !this.el)
      throw new TypeError("please pass a valid element or selector.");
    this._handleUploadClick = this.handleUploadClick.bind(this), this._init();
  }
  _init() {
    this._render(), this._bindEvent();
  }
  _render() {
    this.oUploadInput = document.createElement("input"), this.oUploadInput.type = "file", this.options.accept && (this.oUploadInput.accept = this.options.accept), this.oUploadInput.multiple = !!this.options.multiple, this.oUploadInput.style.display = "none", this.oUploadInput.onclick = (t) => t.stopPropagation(), this.oUploadInput.onchange = this.handleFileUpload.bind(this), this.el.appendChild(this.oUploadInput);
  }
  _bindEvent() {
    this.on("click", this._handleUploadClick, !0);
  }
  handleUploadClick() {
    this.oUploadInput.click();
  }
  handleFileUpload(t) {
    console.log(this, t, t.target.files);
    const { files: e } = t.target.files;
    this.files = e, this.fileList.push(...e), this.emit("on-change", e, this.fileList), this.handleUpload();
  }
  async handleUpload() {
    const {
      httpRequest: t,
      action: e,
      headers: i,
      data: n
    } = this.options;
    if (t) {
      t(this.files);
      return;
    }
    const o = new FormData();
    o.append("file", this.files), o.append("data", JSON.stringify(n));
    const [a, r] = await k(E({
      type: "POST",
      url: e,
      data: o,
      headers: i
    }));
    a ? this.emit("on-error", a, this.files, this.fileList) : this.emit("on-success", r, this.files, this.fileList);
  }
  reset() {
    this.el = null, this.files = null, this.oUploadInput = null, this.options = {}, this.fileList = [];
  }
  destroy() {
    this.off("click", this._handleUploadClick, !0), this.oUploadInput.onclick = null, this.el.remove(), this.reset();
  }
}
export {
  C as Card,
  q as Upload
};
