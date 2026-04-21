# Tinarra Studio

A high-end, brutalist-inspired creative studio platform specializing in 3D printing services, custom design, and cinematic digital experiences. Built with a focus on editorial aesthetics, immersive scrollytelling, and physical-meets-digital WebGL integrations.

## 🎨 Visual Identity & Experience
- **Aesthetic**: Brutalist-Elegant / High-End Editorial / Physical-Digital Fusion.
- **Micro-interactions**: Custom cursors, fluid staggered menus, and kinetic typography.
- **Experience**: Seamless scrollytelling with precision-timed animations and color orchestration driven by scroll progress.
- **3D Integration**: Interactive 3D elements (Nozzles, Filaments, Curl Noise particles) blending physical 3D printing concepts with digital art.

## 🚀 Tech Stack
- **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Animation Engine**: [Framer Motion](https://www.framer.com/motion/) & [GSAP 3](https://gsap.com/)
- **WebGL & 3D**: [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), & [Drei](https://github.com/pmndrs/drei)
- **Shaders**: Custom GLSL Shaders (`glsl-noise`, `glsl-curl-noise2`)
- **Scrolling**: [Lenis Scroll](https://lenis.darkroom.engineering/) for high-performance smooth scrolling
- **Styling**: Vanilla CSS Modules for granular performance control and scoping
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust architecture

## ✨ Core Features
- **Dynamic 3D Backgrounds & Elements**: Real-time GLSL noise, liquid simulations, and specialized 3D printing assets (Nozzle, Filament).
- **Global Color Orchestration**: Context-aware, smooth background and text color shifts between page chapters using structural Scroll Y Progress tracking.
- **Custom UI Components**: 
  - Precision `CustomCursor` that reacts to interactive elements.
  - `LenisProvider` and `CustomScrollbar` for a custom, hijack-free fluid scroll experience.
  - `StaggeredMenu` for elegant, delayed-reveal navigation.
  - `ScrollFog` for depth and atmospheric transitions.
- **Immersive Sections**: 
  - **Hero**: High-impact entry point.
  - **Manifesto**: Typography-driven brand statement.
  - **Featured Gallery**: Sophisticated parallax-driven project showcases.
  - **Services & Tech Specs**: Detailed 3D-integrated offerings highlighting technical capabilities.
  - **Marquee & Footer**: Infinite scrolling text and brutalist footer layout.

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, Global CSS)
├── components/           # Reusable UI & 3D Components
│   ├── canvas/           # R3F Canvas components (CurlNoise3D)
│   ├── common/           # Global elements (CustomCursor, CustomScrollbar, Preloader)
│   ├── layout/           # App layout blocks (Navigation, Footer, ScrollFog, LenisProvider)
│   └── ui/               # Granular UI elements
└── sections/             # Autonomous Page Chapters (landing page segments)
    ├── FeaturedGallery/  # Showcase with parallax scrolling
    ├── Hero/             # Landing view
    ├── Manifesto/        # Typography & mission statement
    ├── Marquee/          # Infinite animated text band
    ├── Services/         # Services list featuring R3F 3D assets (Filament, Nozzle)
    └── TechSpecs/        # Technical specifications data display
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

### Development
Run the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production
```bash
npm run build
npm run start
```

---

*Handcrafted by Tinarra Studio*
