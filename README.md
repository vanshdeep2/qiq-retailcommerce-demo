# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Google SSO

On Vercel, every page, bundle and data file is behind Google sign-in through the shared QiQ login hub (https://qiq-demo-login.vercel.app, repo `vanshdeep2/qiq-demo-login`).

- `middleware.js` checks this demo's session cookie. Without one, pages redirect to the hub and other requests get a 401.
- The hub handles Google and the approved-email list (Vercel Storage → `qiq-demo-access`), then sends the visitor to `api/auth/callback.js` with a 60-second token. The callback sets a 24h session cookie here.
- `api/auth/me.js` and `api/auth/logout.js` back the **Sign out** button in the nav.
- The only env var is `SSO_JWT_SECRET`, which must match the hub's (see `.env.example`).
- `npm run dev` skips SSO, because Vite doesn't run Vercel middleware.
