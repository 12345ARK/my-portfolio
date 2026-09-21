# 🚀 Aryan Kumar — Developer Portfolio

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white&style=for-the-badge)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, high-performance developer portfolio built with **React 19**, **TypeScript**, **Three.js**, and **Tailwind CSS**. Features an interactive 3D Cyber Computer workstation, real-time screen switching, fluid cosmic black hole page transitions, 3D tilt cards, and a showcase of full-stack projects.

---

## 🌟 Key Features

### 🖥️ Interactive 3D Cyber Workstation (Three.js WebGL)
- **360° Drag-to-Rotate Inspection**: Realistic momentum-based inertia rotation and subtle cursor parallax tracking.
- **Dynamic 1280×800 Canvas Texture**: Real-time 60FPS animated screen display rendering high-contrast cyberpunk graphics.
- **4 Switchable Screen Modes**:
  1. **Code Editor**: Syntax-highlighted TypeScript IDE showing `AryanKumar.tsx`, project file explorer, and live Vite build terminal.
  2. **Terminal**: Live cyber bash shell streaming container builds, database connections, and test logs.
  3. **Matrix**: Digital rainfall stream with quantum encryption algorithms and glowing glyphs.
  4. **System**: Real-time performance dashboard with CPU, RAM, GPU, and Network I/O metrics.
- **Hardware Controls**: Toggle display power (ON/OFF), pause/resume orbital rotation, and trigger a 360° spin burst.
- **Detailed Physical Rig**: Beveled obsidian frame, rear gaming LED halo, illuminated mechanical keyboard matrix with underglow, and LED scroll mouse.

### 🌌 Cosmic Visual Effects & Animations
- **Black Hole Warp Transition**: Cinematic particle accretion disk effect when navigating sections.
- **3D Fullscreen Ambient Particles**: Dynamic interactive canvas with subtle glowing dust and wireframe geometry.
- **3D Tilt Cards**: Perspective card hovering physics across project cards and technical skills.
- **Cyberpunk Color Palette**: Eye-safe deep obsidian neutrals (`#08080f`) with high-contrast crimson (`#ff2a2a`) and cyan (`#00e5ff`) accents.

### 💼 Portfolio Showcase Sections
- **Hero Section**: Typewriter role rotator, quick CTAs, live status indicator, and prominent 3D workstation.
- **Featured Projects**: Filterable project gallery (All, Full-Stack, Frontend, Game, Backend) with tech tags, live previews, and GitHub links.
- **Skills Matrix**: Categorized tech stack (Frontend, Backend & DB, Languages, Tools & DevOps).
- **Education Timeline**: Academic history including Polytechnic Diploma in Computer Science & Engineering (CSE) and High School honors.
- **Interactive Contact Hub**: Contact form, instant copy-to-clipboard phone/email, WhatsApp direct chat link, and social profiles.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) |
| **3D & Graphics** | [Three.js](https://threejs.org/) + HTML5 Canvas API |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Motion](https://motion.dev/) (Framer Motion) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Bundler / Dev Server** | [Vite 6](https://vitejs.dev/) |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

Make sure you have **Node.js 18+** and **npm** installed on your computer:
- Download Node.js: [https://nodejs.org](https://nodejs.org)

Check your installed versions:
```bash
node -v
npm -v
```

---

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/12345ARK/my-portfolio.git
   cd aryan-kumar-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:3000` (or the port indicated in your terminal).

---

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server |
| `npm run build` | Compiles production-ready bundle into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 📤 How to Upload this Project to GitHub

### Option A: Using Google AI Studio (Easiest)
1. In the top-right settings menu of Google AI Studio, click **Export**.
2. Select **Export to GitHub** (or **Download ZIP** to save the files to your computer).
3. Connect your GitHub account and create a new repository directly.

---

### Option B: Using Git via Terminal / VS Code

1. **Create a new empty repository on GitHub**:
   - Go to [GitHub.com](https://github.com) → click **New Repository**.
   - Name it `aryan-kumar-portfolio` (or your preferred name).
   - Leave "Initialize with README" **unchecked** (we already have a complete README).
   - Click **Create repository**.

2. **Open the project folder in VS Code or Terminal**:
   ```bash
   cd aryan-kumar-portfolio
   ```

3. **Initialize Git and commit your code**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit with 3D Cyber Computer portfolio"
   ```

4. **Link to your GitHub repository and push**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/12345ARK/my-portfolio.git
   git push -u origin main
   ```

5. Refresh your GitHub repository page, and your project and README will be live!

---

## 🌐 Free Deployment Options

You can deploy this portfolio for free in under 2 minutes:

### 1. Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project** and import `aryan-kumar-portfolio`.
3. Vercel automatically detects Vite and React. Click **Deploy**.

### 2. Netlify
1. Go to [netlify.com](https://netlify.com) and import your repository.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy Site**.

### 3. GitHub Pages (Automated via GitHub Actions)
This repository includes a pre-configured `.github/workflows/deploy.yml` workflow:
1. In your GitHub repo, go to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, make sure **GitHub Actions** is selected.
3. Every time you push changes to the `main` branch, GitHub Actions will automatically run `npm run build` and publish your site to `https://<username>.github.io/<repo-name>/`!

---

## 📁 Project Structure

```text
aryan-kumar-portfolio/
├── public/                     # Static assets (images, icons, etc.)
│   ├── my pic.jpg              # Profile image
│   └── pic2.png                # Featured project asset
├── src/
│   ├── components/             # Modular UI components
│   │   ├── About.tsx           # About me & background details
│   │   ├── BlackHoleTransition.tsx # Cosmic warp navigation effect
│   │   ├── Contact.tsx         # Contact form & communication links
│   │   ├── Cursor3D.tsx        # Custom interactive glowing cursor
│   │   ├── CyberComputer3D.tsx # 3D Three.js Cyber Computer & screen
│   │   ├── Footer.tsx          # Clean footer with navigation links
│   │   ├── FullScreenBackground3D.tsx # Ambient 3D canvas background
│   │   ├── Hero.tsx            # Hero section with 3D workstation
│   │   ├── HolographicCore3D.tsx # Interactive holographic widget
│   │   ├── LoadingScreen.tsx   # Cyber startup loading screen
│   │   ├── Navbar.tsx          # Responsive navbar with quick actions
│   │   ├── Projects.tsx        # Filterable project showcase gallery
│   │   ├── ScrollReveal.tsx    # Smooth viewport entrance animations
│   │   ├── SectionDivider.tsx  # Glowing cyber section separators
│   │   ├── Skills.tsx          # Technical skills grid
│   │   ├── Stats.tsx           # Key metrics & achievements strip
│   │   ├── ThreeDCube.tsx      # Interactive 3D CSS cube
│   │   ├── ThreeDTilt.tsx      # Card 3D perspective tilt wrapper
│   │   ├── Toast.tsx           # Copied/feedback notification toast
│   │   └── Toggle3DButton.tsx  # 3D effects toggle button
│   ├── context/
│   │   └── Animation3DContext.tsx # 3D state & preference provider
│   ├── data.ts                 # Personal information, skills & projects data
│   ├── types.ts                # TypeScript interfaces and types
│   ├── App.tsx                 # Main application layout
│   ├── index.css               # Tailwind CSS setup & global styles
│   ├── main.tsx                # React entry point
│   └── vite-env.d.ts           # Vite client TypeScript definitions
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundler configuration
└── README.md                   # Project documentation
```

---

## 👤 Author

**Aryan Kumar**
- **Role**: Full-Stack Developer & CSE Student
- **Location**: Patna, Bihar , India
- **Phone / WhatsApp**: [+91 8210820316](tel:+918210820316) / [WhatsApp](https://wa.me/918210820316)
- **Email**: [aryankumarsfhh@gmail.com](mailto:aryankumarsfhh@gmail.com)
- **GitHub**: [@dangerboyz3848](https://github.com)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it for inspiration or customize it for your personal developer portfolio!
