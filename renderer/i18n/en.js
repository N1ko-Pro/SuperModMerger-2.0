/* =========================================================================
   Super Mod Merger 2.0 — English locale
   Registers onto window.SMM_I18N.en
   ========================================================================= */
(function () {
  "use strict";
  window.SMM_I18N = window.SMM_I18N || {};
  window.SMM_I18N.en = {
    meta: { lang: "en", name: "English", title: "Super Mod Merger" },

    titlebar: {
      minimize: "Minimize",
      maximize: "Maximize",
      restore: "Restore",
      close: "Close",
    },

    hero: { title: "Mod Merging: DLB" },

    libs: {
      title: "Game Data",
      desc: "Base <b>data0.pak</b> from the game",
      badgeChecking: "checking...",
      badgeFound: "data0.pak found",
      badgeMissing: "no data0.pak",
      hint: "Click <b>Auto-find</b> to locate the file in the installed game, or import it manually.",
      ready: "Ready to go",
      autoFind: "Auto-find",
      import: "Import",
    },

    mods: {
      title: "Mods to merge",
      desc: "Drag or select files",
      dzTitle: "Drop a mod here",
      dzSub: "or click to select",
      locked: "First specify <b>data0.pak</b>",
      deleteMod: "Delete mod",
      deleteModAria: "Delete {name}",
    },

    settings: {
      title: "Settings",
      desc: "Strategy and conflict resolution",
      strategyLabel: "Merge strategy",
      strategyNormal: "Normal (recommended)",
      strategyGlobal: "Global fix (experimental)",
      codeLabel: "Code conflicts",
      codeIncoming: "Auto — mod version",
      codeBase: "Auto — base version",
      codeInteractive: "Ask me",
      assetLabel: "Asset conflicts",
      assetLargest: "Largest file",
      assetSmallest: "Smallest file",
      assetFirst: "First",
      assetLast: "Last",
      assetInteractive: "Ask me",
      locked: "First specify <b>data0.pak</b>",
    },

    action: { merge: "Merge", merging: "Merging..." },

    result: {
      done: "Merge complete",
      openOutput: "Open result folder",
      statProcessed: "Files processed",
      statMerged: "Smart-merged",
      statPathFixed: "Paths fixed",
      statPackaged: "Files in pak",
    },

    log: { title: "Log", clear: "Clear", clearTitle: "Clear log" },

    footer: {
      rights: "© 2026 ANICKON & ANKOLS. All rights reserved.",
      version: "Version 2.0",
    },

    conflict: {
      codeTitle: "Code conflict",
      fileLine: "File: {file} (base, line {baseLine} / mod, line {incomingLine})",
      base: "Base: {name}",
      mod: "Mod: {name}",
      keepBase: "Keep base",
      takeMod: "Take mod",
      baseEverywhere: "Base everywhere",
      modEverywhere: "Mod everywhere",
      assetTitle: "Asset conflict",
      assetHint: "Several mods contain this file. Choose a version:",
    },

    msg: {
      modAdded: "Mod added: {name}",
      addFailed: "Could not add: supported formats are .pak, .zip, .7z, .rar",
      autoSearching: "Searching for data0.pak in the installed game...",
      autoFound: "Found: {source}",
      autoNotFound: "data0.pak was not found automatically. Import the file manually.",
      autoError: "Auto-find error: {error}",
      mergeDone: "Done in {ms} ms. Result: {output}",
      mergeError: "Merge error: {error}",
      baseImported: "Base pak imported: {name}",
      statusError: "Failed to get status: {error}",
      mergeHeader: "════════ Mod merging ════════",
      modsFound: "Mods found to merge: {count}",
      baseIndexed: "✓ Indexed {count} files from data0.pak in {ms} ms",
      modExtracted: "✓ Files extracted: {files} ({mod})",
      extracted: "Unique files after grouping: {groups}",
      pathFix: "Path correction in {mod}:",
      mergingFile: "⚙ Merging: {file} (versions: {versions})",
      processingStart: "Processing files: {total}",
      packaging: "Packaging result...",
      assetResolved: "Asset: {path} → {chosen}",
      codeConflictsResolved: "Code conflicts resolved: {count}",
    },
  };
})();
