/* =========================================================================
   Super Mod Merger 2.0 — UI shell effects
   Window controls + custom motion-glass dropdowns. No app/merge logic here.
   ========================================================================= */
(function () {
  "use strict";

  function byId(id) { return document.getElementById(id); }

  function tr(key, fallback) {
    return (window.i18n && typeof window.i18n.t === "function") ? window.i18n.t(key) : fallback;
  }

  /* --- Custom window controls (frameless window) -------------------------- */
  var isMaximized = false;

  function setMaxButton(max) {
    if (!max) return;
    max.innerHTML = isMaximized
      ? '<svg viewBox="0 0 12 12" width="11" height="11"><rect x="2" y="3.4" width="6.6" height="6.6" rx="1.2" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M4 3.4V2.2a1.2 1.2 0 0 1 1.2-1.2H9.8" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 12 12" width="11" height="11"><rect x="2.3" y="2.3" width="7.4" height="7.4" rx="1.3" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>';
    max.title = isMaximized ? tr("titlebar.restore", "Восстановить") : tr("titlebar.maximize", "Развернуть");
    max.setAttribute("aria-label", max.title);
  }

  function wireWindowControls() {
    var api = window.api;
    if (!api) return;

    var min = byId("winMin");
    var max = byId("winMax");
    var close = byId("winClose");

    if (min && api.winMinimize) min.addEventListener("click", function () { api.winMinimize(); });
    if (max && api.winMaximize) max.addEventListener("click", function () { api.winMaximize(); });
    if (close && api.winClose) close.addEventListener("click", function () { api.winClose(); });

    if (api.onWinState && max) {
      api.onWinState(function (state) {
        isMaximized = !!state.maximized;
        setMaxButton(max);
      });
    }
  }

  /* --- Custom dropdowns (replace native <select>) ------------------------- */
  var openSelect = null;
  var builtSelects = [];

  function closeAll() {
    if (openSelect) {
      openSelect.classList.remove("open");
      var card = openSelect.closest(".card");
      if (card) card.classList.remove("menu-open");
      openSelect = null;
    }
  }

  var CHEVRON = '<svg class="select-chevron" viewBox="0 0 12 8" width="12" height="8" fill="none"><path d="M1 1.5l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function settingKey(native) { return native.id ? "smm:setting:" + native.id : null; }

  function restoreSetting(native) {
    var key = settingKey(native);
    if (!key) return;
    try {
      var saved = localStorage.getItem(key);
      if (saved == null) return;
      var ok = Array.prototype.some.call(native.options, function (o) { return o.value === saved; });
      if (ok) native.value = saved;
    } catch (e) { /* localStorage unavailable */ }
  }

  function persistSetting(native) {
    var key = settingKey(native);
    if (!key) return;
    try { localStorage.setItem(key, native.value); } catch (e) { /* ignore */ }
  }

  function buildSelect(native) {
    var options = Array.prototype.slice.call(native.options);

    // Restore the user's previously chosen value before rendering the label.
    restoreSetting(native);

    var wrap = document.createElement("div");
    wrap.className = "select";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "select-trigger";

    var value = document.createElement("span");
    value.className = "select-value";
    trigger.appendChild(value);
    trigger.insertAdjacentHTML("beforeend", CHEVRON);

    var menu = document.createElement("div");
    menu.className = "select-menu";

    function syncLabel() {
      var opt = native.options[native.selectedIndex] || options[0];
      value.textContent = opt ? opt.textContent : "";
      Array.prototype.forEach.call(menu.children, function (item) {
        item.classList.toggle("sel", item.getAttribute("data-value") === native.value);
      });
    }

    options.forEach(function (opt) {
      var item = document.createElement("div");
      item.className = "select-option";
      item.setAttribute("data-value", opt.value);
      item.textContent = opt.textContent;
      // Use pointerdown so the choice registers before any outside-click close.
      item.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        e.stopPropagation();
        native.value = opt.value;
        native.dispatchEvent(new Event("change", { bubbles: true }));
        persistSetting(native);
        syncLabel();
        closeAll();
      });
      menu.appendChild(item);
    });

    function openMenu() {
      closeAll();
      wrap.classList.add("open");
      var card = wrap.closest(".card");
      if (card) card.classList.add("menu-open");
      openSelect = wrap;
    }

    trigger.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (wrap.classList.contains("open")) closeAll();
      else openMenu();
    });

    wrap.appendChild(trigger);
    wrap.appendChild(menu);

    native.classList.add("select-native-hidden");
    native.setAttribute("tabindex", "-1");
    native.setAttribute("aria-hidden", "true");
    native.parentNode.appendChild(wrap);

    syncLabel();

    // Register so labels can be refreshed when the UI language changes.
    builtSelects.push({ native: native, menu: menu, syncLabel: syncLabel });
  }

  /**
   * After a locale switch, i18n.js has re-translated the hidden native <option>
   * elements. Copy that text onto the visible custom options and re-sync labels.
   */
  function refreshSelectLabels() {
    builtSelects.forEach(function (rec) {
      Array.prototype.forEach.call(rec.menu.children, function (item) {
        var v = item.getAttribute("data-value");
        var opt = Array.prototype.filter.call(rec.native.options, function (o) { return o.value === v; })[0];
        if (opt) item.textContent = opt.textContent;
      });
      rec.syncLabel();
    });
  }

  function enhanceSelects() {
    var selects = document.querySelectorAll(".field select");
    Array.prototype.forEach.call(selects, buildSelect);

    document.addEventListener("pointerdown", closeAll);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
    var layout = document.querySelector(".layout");
    if (layout) layout.addEventListener("scroll", closeAll, { passive: true });

    // Keep custom dropdown labels in sync with the active language.
    document.addEventListener("i18n:applied", refreshSelectLabels);
  }

  function init() {
    wireWindowControls();
    enhanceSelects();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
