const smm = window.api;
let totalFiles = 0;
let merging = false;
let lastStatus = { hasBasePak: false, mods: [] };
let lastStats = null;
let busyMods = false;

function el(id) { return document.getElementById(id); }

/** Translate via the i18n engine, falling back to the raw key if it isn't ready. */
function tr(key, params) { return window.i18n ? window.i18n.t(key, params) : key; }

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function appendLog(level, message) {
  const log = el("log");
  const line = document.createElement("div");
  line.className = "line " + (level || "info");
  line.textContent = message;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function setProgress(current, total, file) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  el("progressFill").style.width = pct + "%";
  el("progressText").textContent = pct + "% (" + current + "/" + total + ")";
  el("progressFile").textContent = file || "";
}

function updateMergeButton() {
  const ready = lastStatus.hasBasePak && lastStatus.mods.length >= 2 && !merging;
  el("mergeBtn").disabled = !ready;
}

function renderMods(mods) {
  const list = el("modList");
  const dropzone = el("dropzone");
  if (!mods || mods.length === 0) {
    list.hidden = true;
    list.innerHTML = "";
    dropzone.hidden = false;
    return;
  }
  dropzone.hidden = true;
  list.hidden = false;
  list.innerHTML = "";
  for (const m of mods) {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.className = "mod-name";
    name.textContent = m;
    name.title = m;

    const del = document.createElement("button");
    del.className = "mod-del";
    del.title = tr("mods.deleteMod");
    del.setAttribute("aria-label", tr("mods.deleteModAria", { name: m }));
    del.innerHTML = '<svg viewBox="0 0 16 16" width="13" height="13" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    del.addEventListener("click", async () => {
      del.disabled = true;
      await smm.deleteMod(m);
      await refreshStatus();
    });

    li.appendChild(name);
    li.appendChild(del);
    list.appendChild(li);
  }
}

async function refreshStatus() {
  const st = await smm.getStatus();
  lastStatus = st;
  el("libsPath").textContent = st.libsDir;
  const libsBadge = el("libsBadge");
  if (st.hasBasePak) {
    libsBadge.textContent = tr("libs.badgeFound");
    libsBadge.className = "badge ok";
    el("libsHint").hidden = true;
    el("libsActions").hidden = true;
    el("libsStatus").hidden = false;
  } else {
    libsBadge.textContent = tr("libs.badgeMissing");
    libsBadge.className = "badge bad";
    el("libsHint").hidden = false;
    el("libsActions").hidden = false;
    el("libsStatus").hidden = true;
  }
  el("modsBadge").textContent = String(st.mods.length);
  renderMods(st.mods);

  // Gate mods + settings until a base data0.pak is present.
  const locked = !st.hasBasePak;
  el("modsCard").classList.toggle("locked", locked);
  el("settingsCard").classList.toggle("locked", locked);

  updateMergeButton();
}

/* ----------------------------- Mod intake ------------------------------- */
async function addModsFromPaths(paths) {
  if (busyMods || !paths || paths.length === 0) return;
  if (!lastStatus.hasBasePak) return;
  busyMods = true;
  try {
    const added = await smm.addModFiles(paths);
    if (added && added.length) {
      added.forEach((n) => appendLog("success", tr("msg.modAdded", { name: n })));
    } else {
      appendLog("warning", tr("msg.addFailed"));
    }
    await refreshStatus();
  } finally {
    busyMods = false;
  }
}

async function pickMods() {
  if (busyMods) return;
  if (!lastStatus.hasBasePak) return;
  busyMods = true;
  try {
    const added = await smm.selectMods();
    if (added && added.length) added.forEach((n) => appendLog("success", tr("msg.modAdded", { name: n })));
    await refreshStatus();
  } finally {
    busyMods = false;
  }
}

function wireDropzone() {
  const dz = el("dropzone");
  const card = el("modsCard");

  dz.addEventListener("click", pickMods);
  dz.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickMods(); }
  });

  let depth = 0;
  function onEnter(e) { e.preventDefault(); depth++; card.classList.add("drag"); }
  function onOver(e) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = "copy"; }
  function onLeave(e) { e.preventDefault(); depth = Math.max(0, depth - 1); if (depth === 0) card.classList.remove("drag"); }
  async function onDrop(e) {
    e.preventDefault();
    depth = 0;
    card.classList.remove("drag");
    const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : [];
    const paths = files.map((f) => { try { return smm.getPathForFile(f); } catch (_) { return ""; } }).filter(Boolean);
    await addModsFromPaths(paths);
  }

  // Listen on the whole card so dropping anywhere on it works.
  ["dragenter"].forEach((t) => card.addEventListener(t, onEnter));
  ["dragover"].forEach((t) => card.addEventListener(t, onOver));
  ["dragleave"].forEach((t) => card.addEventListener(t, onLeave));
  ["drop"].forEach((t) => card.addEventListener(t, onDrop));
}

/* ----------------------------- Auto-find -------------------------------- */
async function autoFind() {
  const btn = el("autoFind");
  btn.disabled = true;
  btn.classList.add("loading");
  appendLog("info", tr("msg.autoSearching"));
  try {
    const res = await smm.autoFindBasePak();
    if (res && res.found) {
      appendLog("success", tr("msg.autoFound", { source: res.source }));
    } else {
      appendLog("warning", tr("msg.autoNotFound"));
    }
    await refreshStatus();
  } catch (e) {
    appendLog("error", tr("msg.autoError", { error: e && e.message ? e.message : String(e) }));
  } finally {
    btn.disabled = false;
    btn.classList.remove("loading");
  }
}

/* ----------------------------- Results ---------------------------------- */
function showResults(stats) {
  lastStats = stats;
  const grid = el("statsGrid");
  const items = [
    { num: stats.totalProcessed != null ? stats.totalProcessed : 0, lbl: tr("result.statProcessed") },
    { num: stats.merged != null ? stats.merged : 0, lbl: tr("result.statMerged") },
    { num: stats.pathCorrections != null ? stats.pathCorrections : 0, lbl: tr("result.statPathFixed") },
    { num: stats.filesPackaged != null ? stats.filesPackaged : (stats.totalProcessed || 0), lbl: tr("result.statPackaged") },
  ];
  grid.innerHTML = items.map((it) => `<div class="stat"><div class="num">${it.num}</div><div class="lbl">${it.lbl}</div></div>`).join("");
  el("resultPanel").hidden = false;
}

function handleEvent(evt) {
  switch (evt.type) {
    case "log": appendLog(evt.level, evt.message); break;
    case "modsFound":
      appendLog("header", tr("msg.mergeHeader"));
      appendLog("info", tr("msg.modsFound", { count: evt.count }));
      (evt.mods || []).forEach((m, i) => appendLog("muted", "  " + (i + 1) + ". " + m));
      break;
    case "baseIndexed":
      appendLog("success", tr("msg.baseIndexed", { count: evt.count, ms: evt.ms }));
      break;
    case "modExtracted":
      appendLog("success", tr("msg.modExtracted", { files: evt.files, mod: evt.mod }));
      break;
    case "extracted":
      appendLog("info", tr("msg.extracted", { groups: evt.groups }));
      break;
    case "pathFix":
      appendLog("cyan", tr("msg.pathFix", { mod: evt.mod }));
      (evt.fixes || []).forEach((f) => appendLog("muted", "  " + f.from + " → " + f.to));
      break;
    case "mergingFile":
      appendLog("cyan", tr("msg.mergingFile", { file: evt.file, versions: evt.versions }));
      break;
    case "processingStart":
      totalFiles = evt.total;
      appendLog("info", tr("msg.processingStart", { total: evt.total }));
      break;
    case "progress": setProgress(evt.current, evt.total, evt.file); break;
    case "report": appendLog(evt.level === "error" ? "error" : "warning", "[" + evt.source + "] " + evt.message); break;
    case "packaging": appendLog("info", tr("msg.packaging")); break;
    case "assetResolved": appendLog("info", tr("msg.assetResolved", { path: evt.path, chosen: evt.chosen })); break;
    case "codeConflictsResolved": appendLog("success", tr("msg.codeConflictsResolved", { count: evt.count })); break;
    case "stats": showResults(evt); break;
    default: break;
  }
}

function closeModal() {
  el("conflictModal").hidden = true;
  el("conflictBody").innerHTML = "";
}

function showCodeConflict(id, r) {
  const body = el("conflictBody");
  body.innerHTML = `
    <h3>${escapeHtml(tr("conflict.codeTitle"))}</h3>
    <p class="file">${escapeHtml(tr("conflict.fileLine", { file: r.file, baseLine: r.baseLine, incomingLine: r.incomingLine }))}</p>
    <div class="diff">
      <div class="side"><h4>${escapeHtml(tr("conflict.base", { name: r.baseModName }))}</h4><pre>${escapeHtml(r.baseText)}</pre></div>
      <div class="side"><h4>${escapeHtml(tr("conflict.mod", { name: r.incomingModName }))}</h4><pre>${escapeHtml(r.incomingText)}</pre></div>
    </div>
    <div class="modal-actions">
      <button class="btn" data-choice="1">${escapeHtml(tr("conflict.keepBase"))}</button>
      <button class="btn primary" data-choice="2">${escapeHtml(tr("conflict.takeMod"))}</button>
      <button class="btn" data-choice="3">${escapeHtml(tr("conflict.baseEverywhere"))}</button>
      <button class="btn primary" data-choice="4">${escapeHtml(tr("conflict.modEverywhere"))}</button>
    </div>`;
  body.querySelectorAll("button[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      smm.resolveConflict(id, parseInt(btn.getAttribute("data-choice"), 10));
      closeModal();
    });
  });
  el("conflictModal").hidden = false;
}

function showAssetConflict(id, r) {
  const body = el("conflictBody");
  const opts = (r.options || []).map((o, i) => `<button class="btn" data-choice="${i + 1}">${escapeHtml(o)}</button>`).join("");
  body.innerHTML = `
    <h3>${escapeHtml(tr("conflict.assetTitle"))}</h3>
    <p class="file">${escapeHtml(r.path)}</p>
    <p class="hint">${escapeHtml(tr("conflict.assetHint"))}</p>
    <div class="opt-list">${opts}</div>`;
  body.querySelectorAll("button[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      smm.resolveConflict(id, parseInt(btn.getAttribute("data-choice"), 10));
      closeModal();
    });
  });
  el("conflictModal").hidden = false;
}

async function runMerge() {
  if (merging) return;
  merging = true;
  updateMergeButton();
  const btn = el("mergeBtn");
  const label = el("mergeBtnLabel");
  btn.classList.add("busy");
  label.textContent = tr("action.merging");
  el("resultPanel").hidden = true;
  el("progressWrap").hidden = false;
  setProgress(0, 1, "");
  const options = {
    globalFix: el("strategy").value === "globalfix",
    codeConflict: el("codeConflict").value,
    assetConflict: el("assetConflict").value,
  };
  try {
    const summary = await smm.runMerge(options);
    setProgress(totalFiles || 1, totalFiles || 1, "");
    appendLog("success", tr("msg.mergeDone", { ms: summary.tookMs, output: summary.output }));
    showResults(summary);
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    appendLog("error", tr("msg.mergeError", { error: msg }));
  } finally {
    merging = false;
    btn.classList.remove("busy");
    label.textContent = tr("action.merge");
    updateMergeButton();
  }
}

function wire() {
  el("autoFind").addEventListener("click", autoFind);
  el("openOutput").addEventListener("click", () => smm.openPath("output"));
  el("clearLog").addEventListener("click", () => { el("log").innerHTML = ""; });
  el("importPak").addEventListener("click", async () => {
    const name = await smm.importBasePak();
    if (name) appendLog("success", tr("msg.baseImported", { name }));
    await refreshStatus();
  });
  el("mergeBtn").addEventListener("click", runMerge);
  wireDropzone();
  smm.onEvent(handleEvent);
  smm.onConflict((req) => {
    if (req.kind === "code") showCodeConflict(req.id, req.request);
    else showAssetConflict(req.id, req.request);
  });
  // Re-render runtime-generated text (badges, button label, mod list, stats)
  // whenever the user switches language. Static markup is handled by i18n.js.
  document.addEventListener("i18n:applied", applyDynamic);
}

/** Refresh the strings that renderer.js generates at runtime to the active locale. */
function applyDynamic() {
  const libsBadge = el("libsBadge");
  if (libsBadge) {
    libsBadge.textContent = lastStatus.hasBasePak ? tr("libs.badgeFound") : tr("libs.badgeMissing");
  }
  const label = el("mergeBtnLabel");
  if (label) label.textContent = merging ? tr("action.merging") : tr("action.merge");
  renderMods(lastStatus.mods);
  if (lastStats && !el("resultPanel").hidden) showResults(lastStats);
}

wire();
refreshStatus().then(() => console.log("RENDERER_READY")).catch((e) => appendLog("error", tr("msg.statusError", { error: String(e) })));
