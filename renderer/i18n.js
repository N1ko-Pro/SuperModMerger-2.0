/* =========================================================================
   Super Mod Merger 2.0 — i18n engine
   Loads window.SMM_I18N.{ru,en,cn}, applies translations to the DOM and
   exposes window.i18n.t(key, params) for dynamic strings.

   Locale choice is persisted in localStorage under "smm:locale" so it
   survives app restarts.

   DOM annotations supported on any element:
     data-i18n="path.to.key"        -> sets textContent
     data-i18n-html="path.to.key"   -> sets innerHTML (translations may contain markup)
     data-i18n-title="path.to.key"  -> sets the title attribute
     data-i18n-aria="path.to.key"   -> sets the aria-label attribute
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "smm:locale";
  var DEFAULT_LOCALE = "ru";
  var SUPPORTED = ["ru", "en", "cn"];

  var dicts = window.SMM_I18N || {};
  var current = DEFAULT_LOCALE;

  /* ---- key lookup ------------------------------------------------------- */
  function resolve(dict, path) {
    if (!dict) return undefined;
    var parts = path.split(".");
    var node = dict;
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return undefined;
      node = node[parts[i]];
    }
    return node;
  }

  function interpolate(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, function (m, name) {
      return Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : m;
    });
  }

  /**
   * Translate a key. Falls back to the default locale, then to the raw key,
   * so a missing string is always visible rather than blank.
   */
  function t(key, params) {
    var val = resolve(dicts[current], key);
    if (val == null) val = resolve(dicts[DEFAULT_LOCALE], key);
    if (val == null) return key;
    return interpolate(String(val), params);
  }

  /* ---- DOM application -------------------------------------------------- */
  function applyDom(root) {
    var scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach(function (elx) {
      elx.textContent = t(elx.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-html]").forEach(function (elx) {
      elx.innerHTML = t(elx.getAttribute("data-i18n-html"));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach(function (elx) {
      elx.title = t(elx.getAttribute("data-i18n-title"));
    });
    scope.querySelectorAll("[data-i18n-aria]").forEach(function (elx) {
      elx.setAttribute("aria-label", t(elx.getAttribute("data-i18n-aria")));
    });

    var meta = (dicts[current] && dicts[current].meta) || {};
    if (meta.lang) document.documentElement.setAttribute("lang", meta.lang);
    if (meta.title) document.title = meta.title;
  }

  function markActiveButton() {
    var btns = document.querySelectorAll(".lang-btn[data-locale]");
    Array.prototype.forEach.call(btns, function (b) {
      b.classList.toggle("active", b.getAttribute("data-locale") === current);
      b.setAttribute("aria-pressed", b.getAttribute("data-locale") === current ? "true" : "false");
    });
  }

  /* ---- public: change locale ------------------------------------------- */
  function setLocale(code, opts) {
    if (SUPPORTED.indexOf(code) === -1 || !dicts[code]) return;
    current = code;
    if (!opts || opts.persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* storage unavailable */ }
    }
    applyDom();
    markActiveButton();
    // Let other scripts (renderer.js, ui-fx.js) re-render dynamic content.
    document.dispatchEvent(new CustomEvent("i18n:applied", { detail: { locale: current } }));
  }

  function readSaved() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) { /* ignore */ }
    return DEFAULT_LOCALE;
  }

  function wireButtons() {
    var btns = document.querySelectorAll(".lang-btn[data-locale]");
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () { setLocale(b.getAttribute("data-locale")); });
    });
  }

  function init() {
    current = readSaved();
    wireButtons();
    applyDom();
    markActiveButton();
    document.dispatchEvent(new CustomEvent("i18n:applied", { detail: { locale: current } }));
  }

  window.i18n = {
    t: t,
    setLocale: setLocale,
    get locale() { return current; },
    supported: SUPPORTED.slice(),
    apply: applyDom,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
