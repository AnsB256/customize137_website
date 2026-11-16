# Customize137 Systems Limited Website

Corporate and technical architecture platform for **Customize137 Systems Limited** — showcasing integrated capabilities across **Software Engineering**, **Embedded Systems & IoT**, and **Graphics & Product Design**.

---

## Running Locally on Windows

### Option 1: One-Click / Any Terminal (`run-local.bat`)
Double-click `run-local.bat` in File Explorer, or run from any PowerShell / Command Prompt window:

```powershell
.\run-local.bat
```

### Option 2: Using `npm`
If Windows PowerShell blocks `npm.ps1` due to system execution policy (`PSSecurityException`), either:
- Use `npm.cmd`:
  ```powershell
  npm.cmd run dev
  ```
- Or open the integrated terminal in VS Code / Antigravity (which is pre-configured via `.vscode/settings.json` with `-ExecutionPolicy Bypass`) and run:
  ```powershell
  npm run dev
  ```
- Or enable `RemoteSigned` scripts once for your Windows user account:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

The development server runs at **`http://localhost:5173/`**.

---

## Available Scripts

- `npm.cmd run dev` — Start the Vite development server with HMR.
- `npm.cmd run build` — Run TypeScript typechecking and build the production bundle into `dist/`.
- `npm.cmd run typecheck` — Validate TypeScript types across `src/` and `vite.config.ts`.
- `npm.cmd run preview` — Preview the production build locally (`http://localhost:4173/`).

---

## Customizing Content & Brand Assets

- **Site Content (`src/data/siteData.ts`)**: Edit service divisions, selected portfolio deployments, and engineering process steps in one central file.
- **Brand Logo (`public/`)**: Place `logo.png` or `logo.jpeg` in `public/`. `src/components/BrandLogo.tsx` automatically detects `logo.jpeg.jpeg`, `logo.png`, `logo.jpeg`, `logo.jpg`, `logo.webp`, or `logo.svg`, and falls back to the inline C137 vector emblem if none is present.
