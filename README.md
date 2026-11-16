# Customize137 Systems Limited — Corporate Web Platform

Official corporate website and interactive systems showcase for **Customize137 Systems Limited**, a multidisciplinary engineering company operating across cloud software, embedded hardware, and visual product design.

Built with a high-contrast architectural aesthetic inspired by Vercel (Agentic Infrastructure) and Render (The Cloud for Builders), the platform highlights our full-lifecycle engineering capabilities from silicon to cloud.

## Core Engineering Divisions

* **Software Engineering:** Custom enterprise web platforms, multi-tier approval workflows, inventory engines, RESTful APIs, PostgreSQL architectures, and Dockerized cloud deployments.
* **Embedded Systems & IoT:** Microcontroller firmware (ESP32, ARM Cortex, Arduino), long-range LoRaWAN/MQTT sensor telemetry, PCB schematic design, and 3D-printed industrial enclosures.
* **Graphics & Product Design:** High-conversion UI/UX design systems, interactive Figma prototypes, corporate brand architecture, vector schematics, and 3D hardware concept rendering.

## UI & Architectural Highlights

* **Exposed Structural Grid:** Precision 1px architectural borders with crosshair intersection markers and ambient radial lighting.
* **Brand Color System:** Engineered around the Customize137 emblem[cite: 1]—Electric Blue for Software, Forge Amber/Orange for Embedded Hardware, and Cyber Teal for Systems & UI/UX.
* **Interactive Telemetry Pipeline:** Live-styled 3-node architecture diagram demonstrating how hardware sensors, cloud APIs, and user interfaces connect.
* **Filterable Systems Portfolio:** State-managed project showcase filtering deployments across Software, Embedded & IoT, and Graphics & UI/UX.
* **Project Deployment Console:** Interactive client consultation form with multi-select division toggles and client-side validation.
* **Resilient Brand Identity:** Automatic favicon wiring and a fallback vector emblem component if static logo assets are not yet loaded.

## Tech Stack

* **Framework:** React 18+ with TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Icons & Graphics:** Lucide React & Custom Inline SVGs
* **Deployment Target:** Static export compatible with GitHub Pages, Vercel, Render, and Netlify

## Project Structure

```text
customize137-web/
├── public/
│   └── logo.png                  # Company logo & browser tab favicon
├── src/
│   ├── components/
│   │   ├── ArchitecturePipeline.tsx  # Interactive 3-node silicon-to-cloud diagram
│   │   ├── BrandLogo.tsx             # Logo wrapper with SVG fallback
│   │   ├── Contact.tsx               # Project inquiry console & form validation
│   │   ├── Footer.tsx                # Enterprise footer & system status badge
│   │   ├── Hero.tsx                  # Main landing section & CTAs
│   │   ├── Methodology.tsx           # 4-stage engineering lifecycle pipeline
│   │   ├── Navbar.tsx                # Glassmorphic sticky header & mobile drawer
│   │   ├── PillarsBento.tsx          # 3-division Bento grid matrix
│   │   ├── Portfolio.tsx             # Filterable case studies grid
│   │   └── WhyUs.tsx                 # Cross-disciplinary advantage section
│   ├── data/
│   │   └── siteData.ts           # Centralized content, projects & contact config
│   ├── App.tsx                   # Root layout assembling all page sections
│   ├── index.css                 # Tailwind CSS imports & custom grid utilities
│   └── main.tsx                  # React DOM entry point
├── index.html                    # HTML shell & favicon links
├── package.json                  # Dependencies & build scripts
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite bundler configuration
