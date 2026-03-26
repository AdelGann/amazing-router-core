# 🚀 Amazing Router Core

A lightweight, zero-dependency, **File-System Based Router** engine for modern web frameworks. Inspired by Next.js and Nuxt, built for flexibility.

[![npm version](https://img.shields.io/npm/v/@amazing-router/core.svg)](https://www.npmjs.com/package/@amazing-router/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Why Amazing Router?

Managing static routes manually in React or Vue can become a nightmare as your project grows. **Amazing Router** automates this by turning your directory structure into a powerful, nested route tree.

- 📁 **Convention over Configuration**: Your folders define your routes.
- 🧩 **Framework Agnostic**: Core logic separated from UI adapters.
- ⚡ **Zero Dependencies**: Built using native Node.js APIs.
- 🛠️ **Developer Tooling**: Includes a powerful CLI and plugins for Vite & Webpack.

## 📦 Installation

Install the package via your preferred node package manager:

```bash
npm install @amazing-router/core
# or
yarn add @amazing-router/core
# or
pnpm add @amazing-router/core
```

## ⚙️ How It Works (The Core Engine)

Amazing Router works by scanning your project's directory structure (usually your `app` or `src/pages` folder) and automatically generating a nested route tree behind the scenes.

1. **Routing Conventions**: The router searches for specific file names such as `page.tsx` (your route component) and `layout.tsx` (the layout applying to that node and its children).
2. **Path Resolution**: The nesting level determines the URL structure. For example, a file located at `/app/dashboard/settings/page.tsx` will map directly to the `/dashboard/settings` URL.
3. **Hierarchical Tree**: Parent-child relationships are built automatically based on URL segment depths. If the `/dashboard` folder has a `layout.tsx`, all its child folders (like `/dashboard/settings`) will know they are visually nested under it.
4. **Compiled JSON**: The engine compiles the directory map into a structured JSON file (by default placed in `.amazing-router/routes.json`). This JSON is extremely fast to parse and can be consumed by your UI adapter or framework to hydrate your actual components.

## 🛠️ Integrations

The package comes with build plugins that watch your routing directories during development and trigger an automatic reconstruction of your route tree whenever you add or delete a `page.tsx` or `layout.tsx`.

### Vite

In your `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import { amazingRouterPlugin } from "@amazing-router/core";

export default defineConfig({
  plugins: [
    amazingRouterPlugin({
      // Your BuilderConfigInterface options
    }),
  ],
});
```

### Webpack

In your `webpack.config.js`:

```javascript
const { AmazingRouterPlugin } = require("@amazing-router/core");

module.exports = {
  // ...
  plugins: [
    new AmazingRouterPlugin({
      // Your BuilderConfigInterface options
    })
  ]
};
```

## 💻 CLI Tools

Amazing Router includes the `amazing` CLI to improve your Developer Experience (DX). You can run these commands via `npx amazing <command>` or by setting up package.json scripts.

### Available Commands

- **`init`**: Bootstraps your project configuration and creates the internal setup.
  ```bash
  npx amazing init
  ```
- **`new <type>`**: Scaffolds a new routing file (`page`, `layout`, or `middleware`).
  ```bash
  npx amazing new page --at /dashboard/analytics
  ```
- **`list`**: Scans the file system and outputs a visual representation of your route tree directly in the terminal so you can verify your routes easily.
  ```bash
  npx amazing list
  ```
- **`export`**: Serializes your route tree into a JSON structure physically on the disk.
  ```bash
  npx amazing export --out routes.json --pretty
  ```

## 📄 License

MIT © AdelGann
