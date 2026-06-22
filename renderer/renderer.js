const smm = window.api;
let totalFiles = 0;
let merging = false;
let lastStatus = { hasBasePak: false, mods: [] };
let busyMods = false;

function el(id) { return document.getElementById(id); }

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
    del.title = "Удалить мод";
    del.setAttribute("aria-label", "Удалить " + m);
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
    libsBadge.textContent = "data0.pak найден";
    libsBadge.className = "badge ok";
    el("libsHint").hidden = true;
    el("libsActions").hidden = true;
    el("libsStatus").hidden = false;
  } else {
    libsBadge.textContent = "нет data0.pak";
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
      added.forEach((n) => appendLog("success", "Добавлен мод: " + n));
    } else {
      appendLog("warning", "Не удалось добавить: поддерживаются .pak, .zip, .7z, .rar");
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
    if (added && added.length) added.forEach((n) => appendLog("success", "Добавлен мод: " + n));
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
  appendLog("info", "Поиск data0.pak в установленной игре...");
  try {
    const res = await smm.autoFindBasePak();
    if (res && res.found) {
      appendLog("success", "Найдено: " + res.source);
    } else {
      appendLog("warning", "data0.pak не найден автоматически. Импортируйте файл вручную.");
    }
    await refreshStatus();
  } catch (e) {
    appendLog("error", "Ошибка авто-поиска: " + (e && e.message ? e.message : String(e)));
  } finally {
    btn.disabled = false;
    btn.classList.remove("loading");
  }
}

/* ----------------------------- Results ---------------------------------- */
function showResults(stats) {
  const grid = el("statsGrid");
  const items = [
    { num: stats.totalProcessed != null ? stats.totalProcessed : 0, lbl: "Обработано файлов" },
    { num: stats.merged != null ? stats.merged : 0, lbl: "Слито умно" },
    { num: stats.pathCorrections != null ? stats.pathCorrections : 0, lbl: "Исправлено путей" },
    { num: stats.filesPackaged != null ? stats.filesPackaged : (stats.totalProcessed || 0), lbl: "Файлов в паке" },
  ];
  grid.innerHTML = items.map((it) => `<div class="stat"><div class="num">${it.num}</div><div class="lbl">${it.lbl}</div></div>`).join("");
  el("resultPanel").hidden = false;
}

function handleEvent(evt) {
  switch (evt.type) {
    case "log": appendLog(evt.level, evt.message); break;
    case "modsFound":
      appendLog("header", "════════ Слияние модов ════════");
      appendLog("info", "Найдено модов для слияния: " + evt.count);
      (evt.mods || []).forEach((m, i) => appendLog("muted", "  " + (i + 1) + ". " + m));
      break;
    case "baseIndexed":
      appendLog("success", "✓ Проиндексировано " + evt.count + " файлов из data0.pak за " + evt.ms + " мс");
      break;
    case "modExtracted":
      appendLog("success", "✓ Извлечено файлов: " + evt.files + " (" + evt.mod + ")");
      break;
    case "extracted":
      appendLog("info", "Уникальных файлов после группировки: " + evt.groups);
      break;
    case "pathFix":
      appendLog("cyan", "Исправление путей в " + evt.mod + ":");
      (evt.fixes || []).forEach((f) => appendLog("muted", "  " + f.from + " → " + f.to));
      break;
    case "mergingFile":
      appendLog("cyan", "⚙ Слияние: " + evt.file + " (версий: " + evt.versions + ")");
      break;
    case "processingStart":
      totalFiles = evt.total;
      appendLog("info", "Обработка файлов: " + evt.total);
      break;
    case "progress": setProgress(evt.current, evt.total, evt.file); break;
    case "report": appendLog(evt.level === "error" ? "error" : "warning", "[" + evt.source + "] " + evt.message); break;
    case "packaging": appendLog("info", "Упаковка результата..."); break;
    case "assetResolved": appendLog("info", "Ассет: " + evt.path + " → " + evt.chosen); break;
    case "codeConflictsResolved": appendLog("success", "Разрешено конфликтов кода: " + evt.count); break;
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
    <h3>Конфликт кода</h3>
    <p class="file">Файл: ${escapeHtml(r.file)} (база, строка ${r.baseLine} / мод, строка ${r.incomingLine})</p>
    <div class="diff">
      <div class="side"><h4>База: ${escapeHtml(r.baseModName)}</h4><pre>${escapeHtml(r.baseText)}</pre></div>
      <div class="side"><h4>Мод: ${escapeHtml(r.incomingModName)}</h4><pre>${escapeHtml(r.incomingText)}</pre></div>
    </div>
    <div class="modal-actions">
      <button class="btn" data-choice="1">Оставить базу</button>
      <button class="btn primary" data-choice="2">Взять мод</button>
      <button class="btn" data-choice="3">Везде база</button>
      <button class="btn primary" data-choice="4">Везде мод</button>
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
    <h3>Конфликт ассета</h3>
    <p class="file">${escapeHtml(r.path)}</p>
    <p class="hint">Несколько модов содержат этот файл. Выберите версию:</p>
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
  label.textContent = "Объединение...";
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
    appendLog("success", "Готово за " + summary.tookMs + " мс. Результат: " + summary.output);
    showResults(summary);
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    appendLog("error", "Ошибка слияния: " + msg);
  } finally {
    merging = false;
    btn.classList.remove("busy");
    label.textContent = "Объединить";
    updateMergeButton();
  }
}

function wire() {
  el("autoFind").addEventListener("click", autoFind);
  el("openOutput").addEventListener("click", () => smm.openPath("output"));
  el("clearLog").addEventListener("click", () => { el("log").innerHTML = ""; });
  el("importPak").addEventListener("click", async () => {
    const name = await smm.importBasePak();
    if (name) appendLog("success", "Импортирован базовый пак: " + name);
    await refreshStatus();
  });
  el("mergeBtn").addEventListener("click", runMerge);
  wireDropzone();
  smm.onEvent(handleEvent);
  smm.onConflict((req) => {
    if (req.kind === "code") showCodeConflict(req.id, req.request);
    else showAssetConflict(req.id, req.request);
  });
}

wire();
refreshStatus().then(() => console.log("RENDERER_READY")).catch((e) => appendLog("error", "Не удалось получить статус: " + String(e)));
