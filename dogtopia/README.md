# Dogtopia

> A Dragon City-style dog habitat, collection, and breeding web game built with React 18, Vite, and Tailwind CSS v3.

## Setup

```bash
npm install
npm run dev
```

## Top-Level Folder Reference

| Folder / File | Description |
|---|---|
| `public/` | Static assets served at the root (favicon, etc.) |
| `src/assets/` | Raw media: images, sprites, sounds, habitat & dog art, UI icons |
| `src/components/` | Reusable UI components grouped by domain (common, habitat, dogs, breeding, store, quests, social, layout) |
| `src/pages/` | Full-screen page components – one file per route/view |
| `src/data/` | Static game data: dog definitions, habitats, tasks, store items, rarity tables, breeding combos, quests |
| `src/context/` | React Context + useReducer providers for global game state |
| `src/hooks/` | Custom React hooks (timers, offline progress, tasks, breeding) |
| `src/services/` | API, auth, and save/load service helpers |
| `src/utils/` | Pure utility functions (XP math, evolution, breeding logic, rarity rolls, time formatting) |
| `src/styles/` | Global CSS – Tailwind directives live here |
| `src/App.jsx` | Root component – wraps providers and handles page navigation |
| `src/main.jsx` | Vite entry point – mounts React app into `#root` |
| `vite.config.js` | Vite build configuration |
| `tailwind.config.js` | Tailwind CSS configuration with custom color palette |
| `postcss.config.js` | PostCSS configuration (Tailwind + Autoprefixer) |
| `.env.example` | Template for environment variables |
