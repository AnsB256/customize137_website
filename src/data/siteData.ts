/**
 * ============================================================================
 * CUSTOMIZE137 SYSTEMS LIMITED — CENTRAL SITE DATA (`src/data/siteData.ts`)
 * ============================================================================
 * This file centralizes all structured copy, capability divisions, portfolio
 * case studies, and engineering process steps.
 *
 * HOW TO CUSTOMIZE:
 * 1. `divisions`: Edit service pillars, deliverables, and tech stacks.
 * 2. `portfolio`: Add or update project deployments and their modal case study
 *    details (`challenge`, `architecture`, `outcomes`, `deliverables`).
 * 3. `processSteps`: Adjust the 4-stage engineering delivery loop.
 * ============================================================================
 */

export type ThemeAccentColor = 'blue' | 'orange' | 'teal'

export interface Division {
  /** Unique identifier used for preview rendering and filtering ('software' | 'embedded' | 'design') */
  id: 'software' | 'embedded' | 'design'
  /** Display title of the capability division */
  name: string
  /** Corresponding filter label in the Portfolio section */
  portfolioCategory: 'Software Engineering' | 'Embedded & IoT' | 'Graphics & UI/UX'
  /** Corresponding toggle label in the Contact inquiry form */
  inquiryServiceName: 'Software Engineering' | 'Embedded & IoT' | 'Graphics & Design'
  /** Visual accent theme color */
  color: ThemeAccentColor
  /** Monospace eyebrow tag shown at the top of the pillar card */
  tag: string
  /** Concise executive summary of the division */
  summary: string
  /** Bullet list of key client deliverables */
  deliverables: readonly string[]
  /** Technologies, tools, and standards used in this division */
  stack: readonly string[]
}

export interface PortfolioProject {
  /** Unique deployment reference code (e.g., PRJ-137-01) */
  id: string
  /** Division category used by the portfolio filter buttons */
  division: 'Software Engineering' | 'Embedded & IoT' | 'Graphics & UI/UX'
  /** Visual accent theme color */
  color: ThemeAccentColor
  /** Project headline */
  title: string
  /** Short card summary shown in the portfolio grid */
  summary: string
  /** Primary headline metric highlighted at the bottom of the card */
  metric: string
  /** Key technologies displayed as tags on the card */
  stack: readonly string[]
  /** Detailed Case Study data displayed when the user opens the project modal */
  caseStudy: {
    clientSector: string
    deploymentDuration: string
    challenge: string
    architecture: string
    outcomes: readonly string[]
    deliverables: readonly string[]
  }
}

export interface ProcessStep {
  id: string
  label: string
  title: string
  description: string
}

/**
 * SECTION 01: Core Capability Divisions
 */
export const divisions: readonly Division[] = [
  {
    id: 'software',
    name: 'Software Engineering',
    portfolioCategory: 'Software Engineering',
    inquiryServiceName: 'Software Engineering',
    color: 'blue',
    tag: '01 // CLOUD & ENTERPRISE SOFTWARE',
    summary: 'Scalable web platforms, automated workflows, and resilient backend architectures.',
    deliverables: [
      'Enterprise web apps & portals',
      'Fund and inventory automation',
      'REST APIs & authentication',
      'PostgreSQL & Docker deployment',
    ],
    stack: ['React', 'TypeScript', 'Python', 'Node.js', 'PostgreSQL', 'Docker', 'CI/CD'],
  },
  {
    id: 'embedded',
    name: 'Embedded Systems & IoT',
    portfolioCategory: 'Embedded & IoT',
    inquiryServiceName: 'Embedded & IoT',
    color: 'orange',
    tag: '02 // SILICON, FIRMWARE & EDGE IoT',
    summary: 'Custom hardware prototyping, real-time sensor telemetry, and weatherproof industrial enclosures.',
    deliverables: [
      'ESP32, ARM & Arduino firmware',
      'LoRaWAN, MQTT & GSM networks',
      'Schematic & PCB layout design',
      '3D CAD modeling & printing',
    ],
    stack: ['C/C++', 'Embedded C', 'ESP32', 'LoRaWAN', 'Proteus', 'SolidWorks', '3D Printing'],
  },
  {
    id: 'design',
    name: 'Graphics & Product Design',
    portfolioCategory: 'Graphics & UI/UX',
    inquiryServiceName: 'Graphics & Design',
    color: 'teal',
    tag: '03 // PRODUCT UI/UX & BRAND SYSTEMS',
    summary: 'High-conversion interface systems, 3D hardware visualization, and authoritative corporate branding.',
    deliverables: [
      'Web & mobile UI/UX prototypes',
      'Design systems & components',
      'Corporate identity & guidelines',
      '3D product and technical renders',
    ],
    stack: ['Figma', 'Design Systems', 'Vector Graphics', '3D CAD Rendering', 'Brand Strategy'],
  },
] as const

/**
 * SECTION 03: Selected Portfolio Deployments & Case Studies
 */
export const portfolio: readonly PortfolioProject[] = [
  {
    id: 'PRJ-137-01',
    division: 'Software Engineering',
    color: 'blue',
    title: 'Enterprise Fund Requisition & Multi-Tier Approval Platform',
    summary: 'Role-based access, audit trails, and automated notifications for accountable operations.',
    metric: '−42% approval cycle time',
    stack: ['React', 'PostgreSQL', 'RBAC'],
    caseStudy: {
      clientSector: 'Enterprise Operations & Finance',
      deploymentDuration: '10 Weeks',
      challenge:
        'Manual paper and spreadsheet-based fund requisitions caused multi-day approval bottlenecks, lacked real-time budget visibility, and made compliance auditing difficult across distributed departments.',
      architecture:
        'Engineered a React + TypeScript web portal backed by a transactional PostgreSQL database and a deterministic state-machine approval engine. Enforced strict Role-Based Access Control (RBAC), cryptographic audit logs, and automated email/SMS escalation triggers.',
      outcomes: [
        '42% reduction in average requisition-to-disbursement cycle time',
        '100% immutable audit trail coverage across all approval tiers',
        'Real-time departmental budget burn-rate visibility for finance leads',
      ],
      deliverables: [
        'Multi-tier approval workflow engine',
        'Role-based executive & finance dashboards',
        'Automated PDF voucher generation & audit export',
        'Containerized Docker deployment with automated backups',
      ],
    },
  },
  {
    id: 'PRJ-137-02',
    division: 'Software Engineering',
    color: 'blue',
    title: 'Containerized Stock & Inventory Control Engine',
    summary: 'Real-time SKU tracking with PostgreSQL analytics and resilient Docker deployment.',
    metric: '12k+ SKUs tracked',
    stack: ['Node.js', 'Docker', 'Analytics'],
    caseStudy: {
      clientSector: 'Supply Chain & Wholesale Distribution',
      deploymentDuration: '12 Weeks',
      challenge:
        'High-volume warehouse operations suffered from stock discrepancies, delayed reorder alerts, and fragmented stock records across multiple storage locations.',
      architecture:
        'Built an event-driven inventory core on Node.js and PostgreSQL packaged in resilient Docker containers. Implemented barcode/SKU ledger reconciliation, low-stock threshold forecasting, and role-scoped warehouse operator terminals.',
      outcomes: [
        '12,000+ active SKUs tracked with sub-second query performance',
        '99.4% inventory ledger accuracy after automated reconciliation',
        'Zero-downtime containerized updates via automated CI/CD pipelines',
      ],
      deliverables: [
        'Real-time multi-warehouse stock ledger API',
        'Low-stock predictive alert & purchase order module',
        'Operator web terminal with barcode scanner support',
        'Docker Compose production stack & health telemetry',
      ],
    },
  },
  {
    id: 'PRJ-137-03',
    division: 'Embedded & IoT',
    color: 'orange',
    title: 'Smart-Silo IoT Telemetry & Spoilage Prevention System',
    summary: 'Temperature, humidity, and gas sensing with LoRaWAN + GSM escalation alerts.',
    metric: '31% less spoilage',
    stack: ['ESP32', 'LoRaWAN', 'MQTT'],
    caseStudy: {
      clientSector: 'Agribusiness & Post-Harvest Storage',
      deploymentDuration: '14 Weeks',
      challenge:
        'Post-harvest grain silos experienced undetected moisture pockets and thermal spikes, leading to mold growth and costly batch spoilage before manual inspections occurred.',
      architecture:
        'Designed multi-depth sensor probes driven by ultra-low-power ESP32 nodes transmitting over long-range LoRaWAN to a solar-powered GSM/MQTT gateway. Cloud telemetry pipelines evaluate micro-climate thresholds and trigger instant SMS/dashboard escalations.',
      outcomes: [
        '31% reduction in post-harvest storage spoilage across monitored silos',
        '99.8% field packet delivery reliability across rural connectivity zones',
        '24/7 automated threshold alerting via dual MQTT cloud + GSM SMS fallback',
      ],
      deliverables: [
        'Custom ESP32 sensor node firmware in Embedded C/C++',
        'LoRaWAN-to-MQTT solar gateway configuration',
        'Real-time thermal & moisture telemetry dashboard',
        'GSM SMS escalation engine for offline field alerts',
      ],
    },
  },
  {
    id: 'PRJ-137-04',
    division: 'Embedded & IoT',
    color: 'orange',
    title: 'Custom Edge Sensor Node & 3D-Printed Industrial Enclosure',
    summary: 'Custom PCB schematic, low-power firmware, and weatherproof CAD enclosure.',
    metric: '18 mo. battery life',
    stack: ['PCB', 'Embedded C', 'SolidWorks'],
    caseStudy: {
      clientSector: 'Industrial Monitoring & Field Equipment',
      deploymentDuration: '8 Weeks',
      challenge:
        'Off-the-shelf development boards were too fragile, power-hungry, and bulky for harsh outdoor industrial deployments exposed to dust, heat, and rain.',
      architecture:
        'Created a custom 2-layer PCB schematic with deep-sleep power gating and regulated 3.3V rails, paired with a custom SolidWorks-engineered enclosure featuring internal mounting bosses, O-ring gasket channels, and UV-stabilized 3D-printed housing.',
      outcomes: [
        '18-month continuous field battery life on a single LiFePO4 cell',
        'IP65-equivalent weatherproof protection in tropical outdoor conditions',
        '60% reduction in per-unit hardware footprint compared to breadboard prototypes',
      ],
      deliverables: [
        'Complete schematic capture, BOM & Gerber manufacturing files',
        'Deep-sleep optimized Embedded C firmware',
        'Parametric SolidWorks 3D CAD assembly & STL production files',
        'Physical enclosure prototyping & thermal stress verification',
      ],
    },
  },
  {
    id: 'PRJ-137-05',
    division: 'Graphics & UI/UX',
    color: 'teal',
    title: 'Enterprise FinTech & Operations Dashboard Design System',
    summary: 'Dark-mode token library and interactive Figma workflows for complex data.',
    metric: '2.4× faster shipping',
    stack: ['Figma', 'Tokens', 'WCAG AA'],
    caseStudy: {
      clientSector: 'FinTech & Enterprise SaaS',
      deploymentDuration: '6 Weeks',
      challenge:
        'Engineering teams were rebuilding inconsistent tables, charts, and modal flows across products, slowing feature delivery and creating accessibility contrast issues.',
      architecture:
        'Architected a semantic design token system in Figma (surface elevations, status signals, typography scales, and spacing primitives) mapped 1:1 to CSS variables and React component props, verified to WCAG AA contrast standards.',
      outcomes: [
        '2.4× faster frontend feature implementation from spec to production',
        '100% WCAG AA contrast compliance across dark and high-contrast surfaces',
        'Unified component library adopted across 4 internal engineering squads',
      ],
      deliverables: [
        'Figma component library with auto-layout variants & interactive states',
        'JSON/CSS semantic design token specification',
        'High-density data table, telemetry chart & approval workflow prototypes',
        'Developer handoff documentation & accessibility guidelines',
      ],
    },
  },
  {
    id: 'PRJ-137-06',
    division: 'Graphics & UI/UX',
    color: 'teal',
    title: 'Hardware-to-Cloud Brand Identity & 3D Product Visuals',
    summary: 'Full visual identity, vector schematics, and photorealistic 3D product renders.',
    metric: '1 unified launch system',
    stack: ['Brand', '3D CAD', 'Vector'],
    caseStudy: {
      clientSector: 'DeepTech & Hardware Startups',
      deploymentDuration: '7 Weeks',
      challenge:
        'A hardware-and-SaaS company needed to pitch enterprise buyers and investors before mass manufacturing, requiring authoritative visual parity between physical devices and cloud software.',
      architecture:
        'Developed a cohesive technical brand system combining precision vector architecture diagrams, silkscreen PCB branding standards, photorealistic 3D CAD enclosure renders, and investor-ready pitch collateral.',
      outcomes: [
        '1 unified visual language spanning PCB silkscreens, enclosures, and web UI',
        'Photorealistic 3D hardware renders delivered 8 weeks ahead of tooling completion',
        'Adopted across product packaging, technical datasheets, and web platform',
      ],
      deliverables: [
        'Brand identity system, logo lockups & technical typography guide',
        'Photorealistic 3D CAD product renders & exploded assembly views',
        'Isometric system architecture & signal-flow vector diagrams',
        'Datasheet templates & enterprise pitch deck system',
      ],
    },
  },
] as const

/**
 * SECTION 04: The Engineering Loop (4-Stage Delivery Process)
 */
export const processSteps: readonly ProcessStep[] = [
  {
    id: 'spec',
    label: 'STEP_01 // ARCHITECTURE & SPEC',
    title: 'Make the invisible visible.',
    description:
      'Requirements, schematic feasibility, and UX wireframing turn ambiguity into a system map.',
  },
  {
    id: 'build',
    label: 'STEP_02 // PARALLEL BUILD',
    title: 'Build in parallel.',
    description:
      'Software sprints, PCB and firmware prototypes, and visual systems move together.',
  },
  {
    id: 'verify',
    label: 'STEP_03 // VERIFICATION & QA',
    title: 'Prove every layer.',
    description:
      'Automated tests, hardware load testing, and security hardening before release.',
  },
  {
    id: 'scale',
    label: 'STEP_04 // DEPLOYMENT & SCALE',
    title: 'Ship, observe, improve.',
    description:
      'Cloud rollout, field commissioning, and lifecycle telemetry keep systems healthy.',
  },
] as const
