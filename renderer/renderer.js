const smm = window.api;
let totalFiles = 0;
let merging = false;
let lastStatus = { hasBasePak: false, mods: [] };

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
 const ready = lastStatus.mods.length > 0 && !merging;
 el("mergeBtn").disabled = !ready;
}

async function refreshStatus() {
 const st = await smm.getStatus();
 lastStatus = st;
 el("libsPath").textContent = st.libsDir;
 el("modsPath").textContent = st.modsDir;
 const libsBadge = el("libsBadge");
 if (st.hasBasePak) {
 libsBadge.textContent = "data0.pak найден";
 libsBadge.className = "badge ok";
 } else {
 libsBadge.textContent = "нет data0.pak";
 libsBadge.className = "badge bad";
 }
 el("modsBadge").textContent = String(st.mods.length);
 const list = el("modList");
 list.innerHTML = "";
 if (st.mods.length === 0) {
 const li = document.createElement("li");
 li.className = "empty";
 li.textContent = "Папка пуста — добавьте моды (.pak, .zip, .7z, .rar)";
 list.appendChild(li);
 } else {
 for (const m of st.mods) {
 const li = document.createElement("li");
 li.textContent = m;
 list.appendChild(li);
 }
 }
 updateMergeButton();
}

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
 (evt.mods || []).forEach((m, i) => appendLog("muted", " " + (i + 1) + ". " + m));
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
 (evt.fixes || []).forEach((f) => appendLog("muted", " " + f.from + " → " + f.to));
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
 case "packaging": appendLog("info", "Упаковка результата в data2.pak..."); break;
 case "assetResolved": appendLog("info", "ссет: " + evt.path + " → " + evt.chosen); break;
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
 <h3>онфликт кода</h3>
 <p class="file">Файл: ${escapeHtml(r.file)} (база, строка ${r.baseLine} / мод, строка ${r.incomingLine})</p>
 <div class="diff">
 <div class="side"><h4>База: ${escapeHtml(r.baseModName)}</h4><pre>${escapeHtml(r.baseText)}</pre></div>
 <div class="side"><h4>Мод: ${escapeHtml(r.incomingModName)}</h4><pre>${escapeHtml(r.incomingText)}</pre></div>
 </div>
 <div class="modal-actions">
 <button class="btn" data-choice="1">Оставить базу</button>
 <button class="btn primary" data-choice="2">Взять мод</button>
 <button class="btn" data-choice="3">Везде база</button>
 <button class="btn" data-choice="4">Везде мод</button>
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
 btn.classList.add("busy");
 btn.textContent = "Слияние...";
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
 btn.textContent = "Слить моды";
 updateMergeButton();
 }
}

function wire() {
 el("openLibs").addEventListener("click", () => smm.openPath("libs"));
 el("openMods").addEventListener("click", () => smm.openPath("mods"));
 el("openOutput").addEventListener("click", () => smm.openPath("output"));
 el("refresh").addEventListener("click", refreshStatus);
 el("clearLog").addEventListener("click", () => { el("log").innerHTML = ""; });
 el("importPak").addEventListener("click", async () => {
 const name = await smm.importBasePak();
 if (name) appendLog("success", "Импортирован базовый пак: " + name);
 await refreshStatus();
 });
 el("mergeBtn").addEventListener("click", runMerge);
 smm.onEvent(handleEvent);
 smm.onConflict((req) => {
 if (req.kind === "code") showCodeConflict(req.id, req.request);
 else showAssetConflict(req.id, req.request);
 });
}

wire();
refreshStatus().then(() => console.log("RENDERER_READY")).catch((e) => appendLog("error", "Не удалось получить статус: " + String(e)));
