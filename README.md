# Super Mod Merger 2.0

Десктопное приложение (Electron) для умного слияния модов Dying Light.
Логика AST-слияния (.scr, .xml, .json/.gui) перенесена на TypeScript, добавлен графический интерфейс.

## Как пользоваться
1. Запустите приложение.
3. Убедитесь, что data0.pak найден и моды видны в списке.
4. Выберите настройки и нажмите кнопку слияния.
5. Готовый файл появится в папке output (data2.pak).

## Запуск из исходников (Node.js 18+)

 npm install
 npm run dev

## Сборка portable .exe

 npm run dist

Результат появится в папке release/.

## Структура
- electron/ - процессы main и preload
- src/core/ - ядро движка
- src/archive/ - архивы (.pak/.zip/.7z/.rar)
- src/merger/ - мерджеры SCR / XML / JSON
- src/antlr/ - парсеры ANTLR4 на TypeScript
- grammar/ - исходные грамматики
- renderer/ - интерфейс
