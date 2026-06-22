# Super Mod Merger 2.0

есктопное приложение (Electron) для умного слияния модов Dying Light.
огика AST-слияния (.scr, .xml, .json/.gui) перенесена на TypeScript, добавлен графический интерфейс. Java не требуется.

## ак пользоваться
1. ядом с программой есть две папки:
 - LIBS - положите сюда data0.pak из игры.
 - Put_Your_Mods - положите сюда моды (.pak, .zip, .7z, .rar).
2. апустите приложение.
3. бедитесь, что data0.pak найден и моды видны в списке.
4. ыберите настройки и нажмите кнопку слияния.
5. отовый файл появится в папке output (data2.pak).

## апуск из исходников (Node.js 18+)

 npm install
 npm run dev

## Сборка portable .exe

 npm run dist

езультат появится в папке release/.

## Структура
- electron/ - процессы main и preload
- src/core/ - ядро движка
- src/archive/ - архивы (.pak/.zip/.7z/.rar)
- src/merger/ - мерджеры SCR / XML / JSON
- src/antlr/ - парсеры ANTLR4 на TypeScript
- grammar/ - исходные грамматики
- renderer/ - интерфейс
