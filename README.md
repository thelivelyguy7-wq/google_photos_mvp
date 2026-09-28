# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## V2 (adaptive retrieval loop)

`src/App.jsx` is V2; the original is kept as `src/App.v1.jsx`.

- **Soft clues** (`src/v2/clues.js`): place, people and time are read from the memory (aliases such as "parents" = Family, "Lonavala" = Maharashtra). Clues only change ranking; none hides a photo. Chips are editable.
- **Ranking + show all** (`src/v2/ranking.js`): every photo is scored; the first 6 show, "Show all" reveals the rest.
- **Filters that split the set**: shown only when they divide the current candidates; the best split is marked.
- **Confirm step**: near-identical photos from another trip are shown with their differences before the user confirms.
- **Ranked recovery**: after "None of these", 2 or 3 next steps, each with a reason.
- **Session logging** (`src/v2/log.js`): open with `/?test=1` to set a participant and task (T1-T6); the log is kept in the browser and can be downloaded as CSV.

Not built: LLM clue reading. `extractClues()` is the single place to swap it in.
