# CryptoSchool

#Deply in production:
https://cryptoschoolpro.netlify.app/

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)

CryptoSchool is an educational web application for exploring digital assets. It features structured learning paths covering Bitcoin, blockchain technology, wallet security, and decentralized finance (DeFi), alongside an introductory asset directory and a live Meteora liquidity pool explorer.

> **Disclaimer:** All content is for informational purposes only and does not constitute financial advice or an investment recommendation. Digital assets are highly volatile and carry inherent risks.

## Features

- **Academy Overview:** Landing page introducing the platform and its core learning tracks.
- **Course Catalog:** Introductory curricula with dedicated course detail views.
- **Asset Explorer:** Searchable directory with category filters to browse digital assets.
- **Admin Dashboard (Demo):** Preview of the administration panel populated with sample metrics and courses.
- **Authentication:** Sign-in with Firebase Authentication (Email/Password or Google), password recovery, and session persistence ("Remember me").
- **Protected Routes:** Access control restricting `/administrator` to authenticated users.
- **Live Price Ticker:** Real-time market prices for BTC, ETH, SOL, XRP, and ADA powered by Binance's public WebSocket stream.
- **Meteora DLMM Explorer:** Filterable pool tracker with auto-refresh and direct links to Solscan.
- **Responsive UI & Theming:** Mobile-first layout with a light/dark mode toggle.
- **Custom 404 Page:** Fallback view with quick navigation back to the main content.

## Tech Stack

- **Core:** React 19, JavaScript (ES6+), Vite 7
- **Routing & UI:** React Router 6, Bootstrap 5, Lucide React
- **Authentication:** Firebase Authentication (Modular SDK)

## Prerequisites

- **Node.js:** Version compatible with Vite 7 (`20.19+` or `22.12+`)
- **Package Manager:** npm

## Getting Started

Clone the repository and navigate into the project directory:

```bash
git clone [https://github.com/Pablo-German-Jimenez/crypto-school-pro.git](https://github.com/Pablo-German-Jimenez/crypto-school-pro.git)
cd cryptofutureschoolFrontEnd
```

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Vite will serve the app locally (typically at `http://localhost:5173`).

### Additional Scripts

- **Build & Preview Production:**
  ```bash
  npm run build
  npm run preview
  ```
- **Run Linter:**
  ```bash
  npm run lint
  ```

## Firebase Authentication Setup

1. Create a new project in the [Firebase Console](https://console.firebase.google.com/) and register a web app.
2. Navigate to **Authentication → Sign-in method** and enable both **Email/Password** and **Google** providers (make sure to select a project support email for Google).
3. Go to **Authentication → Settings → Authorized domains**, ensure `localhost` is listed for local development, and add your production domain once deployed.
4. Under **Authentication → Users**, manually create the authorized accounts for Email/Password login. Google sign-in automatically provisions user accounts on first login (there is no public sign-up form in the app).
5. Duplicate `.env.example` as `.env.local` and populate it with your Firebase web app credentials:

   ```powershell
   # Windows (PowerShell)
   Copy-Item .env.example .env.local
   ```

   ```bash
   # macOS / Linux
   cp .env.example .env.local
   ```

   > **Note:** Paste only the raw string values from your `firebaseConfig` object—omit property keys (e.g., `apiKey:`), surrounding quotes, and trailing commas. Restart `npm run dev` after saving `.env.local` so Vite loads the new variables.

### Security & Route Guard Notes

- Signing in at `/login` redirects authenticated users to `/administrator`, which requires an active Firebase session. Password resets can also be triggered directly from the login form.
- Google sign-in uses a pop-up flow. If you encounter an `auth/unauthorized-domain` error, verify that your active domain is listed under **Authorized domains** in Firebase.
- Client-side Firebase config values (`apiKey`, `authDomain`, etc.) are public by design and do not replace backend authorization. **Never** expose service account private keys or Admin SDK credentials in `VITE_*` environment variables.
- The current admin dashboard is a UI prototype; route protection only checks for an active session and does not validate user roles. Enforce role-based access control (RBAC) on a backend and configure Firebase Security Rules before connecting real data or privileged actions.

## Deploying to Netlify

The included `netlify.toml` file automatically configures the build command (`npm run build`), sets the publish directory (`dist`), and handles SPA routing fallbacks to `index.html` so direct URLs and page refreshes work seamlessly.

1. Push your code to GitHub, then open Netlify and select **Add new site → Import an existing project**.
2. Choose your repository. Netlify will automatically detect the settings from `netlify.toml`.
3. Navigate to **Site configuration → Environment variables** and add the six `VITE_FIREBASE_*` keys defined in `.env.example` (raw values only, no quotes or trailing commas). Enable them for **Production** (and **Deploy Previews**, if needed).
4. Once deployed, copy your assigned Netlify domain (e.g., `my-academy.netlify.app`) and add it—without `https://` or trailing slashes—to **Firebase Console → Authentication → Settings → Authorized domains**. Repeat this for any custom domains or specific preview URLs you plan to test.
5. Trigger a redeploy whenever you modify environment variables, then verify `/login`, Google OAuth, and direct navigation to `/administrator`.

> **Reminder:** All `VITE_*` variables are bundled into client-side assets and are publicly readable. Never store Admin SDK secrets in Netlify for this frontend app.

## Application Routes

| Route | Description |
| :--- | :--- |
| `/` | CryptoSchool landing page |
| `/login` | Firebase sign-in and password recovery |
| `/courses` | Course catalog |
| `/courses/bitcoin-basics` | Bitcoin and blockchain fundamentals |
| `/courses/crypto-security` | Wallet security and self-custody |
| `/courses/defi-essentials` | Introduction to DeFi |
| `/stocks` | Educational digital asset directory |
| `/meteora-pools` | Trending Meteora DLMM pools |
| `/administrator` | Demo dashboard (authenticated users only) |

## Scope & Limitations

- **Authentication:** Requires a configured `.env.local` file and active providers in Firebase Console. Email accounts must be pre-created in the console, while Google accounts are created on first sign-in.
- **Admin Panel:** Prototype interface displaying mock metrics and courses. No backend APIs, user roles, or CRUD operations are wired up yet.
- **Asset Directory (`/stocks`):** Strictly educational; does not display live prices or provide buy/sell signals.
- **Price Ticker:** Relies on a client-side connection to Binance's public WebSocket API, which may be restricted on certain networks or regions.
- **Meteora Explorer (`/meteora-pools`):** Fetches live data from Meteora's public API. Displayed metrics fluctuate in real time and do not guarantee future performance.

## Project Structure

```text
src/
├── components/shared/     # Reusable navigation and footer components
├── pages/                 # Route views (Home, Login, Courses, Assets, Admin, etc.)
├── App.jsx                # Routing configuration and main layout
├── academy.css            # Custom platform styles
├── CryptoTicker.jsx       # Real-time WebSocket price ticker
└── main.jsx               # Application entry point
```

✨ Author
Created by Pablo Germán Jiménez
Design inspired by 💥 hip-hop vibes from Bboy Linkin

###### [Access to profile GitHub](https://github.com/Pablo-German-Jimenez)💻
###### [Access to profile Linkedin](https://www.linkedin.com/in/pablo-german-jimenez-0b706a200/)📊

#💥 Break-boy for ever🎵 

 ![🔥#Bboys on fire 🎵 ](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG11M2dtOHdnYWUxN3N6NTFoZ2t5Z24xcmV5djJjcjI4ODlyZ3duZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ANFZtmUiXncuUmKMwY/giphy.gif)

