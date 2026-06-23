/* =========================================================================
   Super Mod Merger 2.0 — Russian locale
   Registers onto window.SMM_I18N.ru
   ========================================================================= */
(function () {
  "use strict";
  window.SMM_I18N = window.SMM_I18N || {};
  window.SMM_I18N.ru = {
    meta: { lang: "ru", name: "Русский", title: "Super Mod Merger" },

    titlebar: {
      minimize: "Свернуть",
      maximize: "Развернуть",
      restore: "Восстановить",
      close: "Закрыть",
    },

    hero: { title: "Слияние модов: DLB" },

    libs: {
      title: "Игровые данные",
      desc: "Базовый <b>data0.pak</b> из игры",
      badgeChecking: "проверка...",
      badgeFound: "data0.pak найден",
      badgeMissing: "нет data0.pak",
      hint: "Нажмите <b>Авто-поиск</b>, чтобы найти файл в установленной игре, или импортируйте вручную.",
      ready: "Готово к работе",
      autoFind: "Авто-поиск",
      import: "Импорт",
    },

    mods: {
      title: "Моды для слияния",
      desc: "Перетащите или выберите файлы",
      dzTitle: "Перетащите мод сюда",
      dzSub: "или нажмите, чтобы выбрать",
      locked: "Сначала укажите <b>data0.pak</b>",
      deleteMod: "Удалить мод",
      deleteModAria: "Удалить {name}",
    },

    settings: {
      title: "Настройки",
      desc: "Стратегия и разрешение конфликтов",
      strategyLabel: "Стратегия слияния",
      strategyNormal: "Обычная (рекомендуется)",
      strategyGlobal: "Глобальное исправление (экспериментальная)",
      codeLabel: "Конфликты кода",
      codeIncoming: "Авто — версия мода",
      codeBase: "Авто — версия базы",
      codeInteractive: "Спрашивать меня",
      assetLabel: "Конфликты ассетов",
      assetLargest: "Наибольший файл",
      assetSmallest: "Наименьший файл",
      assetFirst: "Первый",
      assetLast: "Последний",
      assetInteractive: "Спрашивать меня",
      locked: "Сначала укажите <b>data0.pak</b>",
    },

    action: { merge: "Объединить", merging: "Объединение..." },

    result: {
      done: "Слияние завершено",
      openOutput: "Открыть папку с результатом",
      statProcessed: "Обработано файлов",
      statMerged: "Слито умно",
      statPathFixed: "Исправлено путей",
      statPackaged: "Файлов в паке",
    },

    log: { title: "Журнал", clear: "Очистить", clearTitle: "Очистить журнал" },

    footer: {
      rights: "© 2026 ANICKON & ANKOLS. Все права защищены.",
      version: "Версия 2.0",
    },

    conflict: {
      codeTitle: "Конфликт кода",
      fileLine: "Файл: {file} (база, строка {baseLine} / мод, строка {incomingLine})",
      base: "База: {name}",
      mod: "Мод: {name}",
      keepBase: "Оставить базу",
      takeMod: "Взять мод",
      baseEverywhere: "Везде база",
      modEverywhere: "Везде мод",
      assetTitle: "Конфликт ассета",
      assetHint: "Несколько модов содержат этот файл. Выберите версию:",
    },

    msg: {
      modAdded: "Добавлен мод: {name}",
      addFailed: "Не удалось добавить: поддерживаются .pak, .zip, .7z, .rar",
      autoSearching: "Поиск data0.pak в установленной игре...",
      autoFound: "Найдено: {source}",
      autoNotFound: "data0.pak не найден автоматически. Импортируйте файл вручную.",
      autoError: "Ошибка авто-поиска: {error}",
      mergeDone: "Готово за {ms} мс. Результат: {output}",
      mergeError: "Ошибка слияния: {error}",
      baseImported: "Импортирован базовый пак: {name}",
      statusError: "Не удалось получить статус: {error}",
      mergeHeader: "════════ Слияние модов ════════",
      modsFound: "Найдено модов для слияния: {count}",
      baseIndexed: "✓ Проиндексировано {count} файлов из data0.pak за {ms} мс",
      modExtracted: "✓ Извлечено файлов: {files} ({mod})",
      extracted: "Уникальных файлов после группировки: {groups}",
      pathFix: "Исправление путей в {mod}:",
      mergingFile: "⚙ Слияние: {file} (версий: {versions})",
      processingStart: "Обработка файлов: {total}",
      packaging: "Упаковка результата...",
      assetResolved: "Ассет: {path} → {chosen}",
      codeConflictsResolved: "Разрешено конфликтов кода: {count}",
    },
  };
})();
