/* =========================================================================
   Super Mod Merger 2.0 — Chinese (Simplified) locale
   Registers onto window.SMM_I18N.cn
   ========================================================================= */
(function () {
  "use strict";
  window.SMM_I18N = window.SMM_I18N || {};
  window.SMM_I18N.cn = {
    meta: { lang: "zh", name: "中文", title: "Super Mod Merger" },

    titlebar: {
      minimize: "最小化",
      maximize: "最大化",
      restore: "还原",
      close: "关闭",
    },

    hero: { title: "模组合并：DLB" },

    libs: {
      title: "游戏数据",
      desc: "游戏中的基础 <b>data0.pak</b>",
      badgeChecking: "检查中...",
      badgeFound: "已找到 data0.pak",
      badgeMissing: "无 data0.pak",
      hint: "点击 <b>自动查找</b> 在已安装的游戏中定位文件，或手动导入。",
      ready: "准备就绪",
      autoFind: "自动查找",
      import: "导入",
    },

    mods: {
      title: "待合并的模组",
      desc: "拖放或选择文件",
      dzTitle: "将模组拖到此处",
      dzSub: "或点击选择",
      locked: "请先指定 <b>data0.pak</b>",
      deleteMod: "删除模组",
      deleteModAria: "删除 {name}",
    },

    settings: {
      title: "设置",
      desc: "策略与冲突解决",
      strategyLabel: "合并策略",
      strategyNormal: "常规（推荐）",
      strategyGlobal: "全局修复（实验性）",
      codeLabel: "代码冲突",
      codeIncoming: "自动 — 模组版本",
      codeBase: "自动 — 基础版本",
      codeInteractive: "询问我",
      assetLabel: "资源冲突",
      assetLargest: "最大文件",
      assetSmallest: "最小文件",
      assetFirst: "第一个",
      assetLast: "最后一个",
      assetInteractive: "询问我",
      locked: "请先指定 <b>data0.pak</b>",
    },

    action: { merge: "合并", merging: "合并中..." },

    result: {
      done: "合并完成",
      openOutput: "打开结果文件夹",
      statProcessed: "已处理文件",
      statMerged: "智能合并",
      statPathFixed: "已修复路径",
      statPackaged: "打包文件数",
    },

    log: { title: "日志", clear: "清除", clearTitle: "清除日志" },

    footer: {
      rights: "© 2026 ANICKON & ANKOLS. 保留所有权利。",
      version: "版本 2.0",
    },

    conflict: {
      codeTitle: "代码冲突",
      fileLine: "文件：{file}（基础，第 {baseLine} 行 / 模组，第 {incomingLine} 行）",
      base: "基础：{name}",
      mod: "模组：{name}",
      keepBase: "保留基础",
      takeMod: "采用模组",
      baseEverywhere: "全部用基础",
      modEverywhere: "全部用模组",
      assetTitle: "资源冲突",
      assetHint: "多个模组包含此文件。请选择一个版本：",
    },

    msg: {
      modAdded: "已添加模组：{name}",
      addFailed: "无法添加：支持的格式为 .pak、.zip、.7z、.rar",
      autoSearching: "正在已安装的游戏中查找 data0.pak...",
      autoFound: "已找到：{source}",
      autoNotFound: "未能自动找到 data0.pak。请手动导入文件。",
      autoError: "自动查找出错：{error}",
      mergeDone: "用时 {ms} 毫秒完成。结果：{output}",
      mergeError: "合并出错：{error}",
      baseImported: "已导入基础 pak：{name}",
      statusError: "获取状态失败：{error}",
      mergeHeader: "════════ 模组合并 ════════",
      modsFound: "找到待合并的模组：{count}",
      baseIndexed: "✓ 已从 data0.pak 索引 {count} 个文件，用时 {ms} 毫秒",
      modExtracted: "✓ 已提取文件：{files}（{mod}）",
      extracted: "分组后的唯一文件：{groups}",
      pathFix: "在 {mod} 中修正路径：",
      mergingFile: "⚙ 合并：{file}（版本数：{versions}）",
      processingStart: "正在处理文件：{total}",
      packaging: "正在打包结果...",
      assetResolved: "资源：{path} → {chosen}",
      codeConflictsResolved: "已解决代码冲突：{count}",
    },
  };
})();
