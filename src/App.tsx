import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Copy,
  Cpu,
  Database,
  GitBranch,
  Globe2,
  Menu,
  Network,
  X,
  Zap,
} from 'lucide-react'
import {
  divisions,
  portfolio,
  processSteps,
  type Division,
  type PortfolioProject,
} from './data/siteData'
import BrandLogo from './components/BrandLogo'
import CaseStudyModal from './components/CaseStudyModal'

/** Primary top-bar navigation anchors */
const navItems = ['Solutions', 'Architecture', 'Work', 'Process', 'Why 137'] as const

/** Available portfolio filter tabs in Section 03 (#work) */
const portfolioFilters = [
  'All Deployments',
  'Software Engineering',
  'Embedded & IoT',
  'Graphics & UI/UX',
] as const

/** Selectable service pills in Section 06 (#contact) */
const inquiryServiceOptions = [
  'Software Engineering',
  'Embedded & IoT',
  'Graphics & Design',
] as const

/**
 * Optional backend endpoint for direct form submissions (e.g., Formspree, Resend,
 * or a custom FastAPI/Node webhook). Configure `VITE_CONTACT_API_URL` in `.env`.
 */
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL as string | undefined

/**
 * Main Application Component (`src/App.tsx`)
 * ----------------------------------------------------------------------------
 * Orchestrates the Customize137 single-page systems platform:
 * - Sticky responsive navigation header
 * - Hero section with interactive 3-layer `ArchitecturePipeline`
 * - Section 01: Core Capabilities (`PillarCard` grid linked to portfolio filters)
 * - Section 02: Unified C137 Core Architecture diagram
 * - Section 03: Filterable Portfolio Grid + interactive `CaseStudyModal`
 * - Section 04: 4-Stage Engineering Loop
 * - Section 05: The 137 Synergy value proposition
 * - Section 06: Hybrid API + Email/Clipboard Project Brief Inquiry Form
 */
function App() {
  // Mobile navigation drawer state
  const [menuOpen, setMenuOpen] = useState(false)

  // Active category filter in the Selected Deployments (#work) section
  const [filter, setFilter] = useState<string>('All Deployments')

  // Highlighted node index (0..2) in the Hero interactive system map
  const [activeNode, setActiveNode] = useState(1)

  // Currently active project for the Case Study detail modal (`null` when closed)
  const [activeCaseStudy, setActiveCaseStudy] = useState<PortfolioProject | null>(null)

  // Contact form submission & feedback states
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deliveredViaApi, setDeliveredViaApi] = useState(false)
  const [copiedBrief, setCopiedBrief] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>(['Software Engineering'])
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    timeline: '',
    scope: '',
    brief: '',
  })

  // Filter portfolio items based on the active category pill
  const filteredProjects =
    filter === 'All Deployments'
      ? portfolio
      : portfolio.filter((project) => project.division === filter)

  /**
   * Toggles a discipline pill in the inquiry form.
   * Ensures at least one discipline remains selected or allows multi-select.
   */
  const toggleService = (service: string) => {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    )
  }

  /**
   * Clicking a capability pillar card in Section 01 (#solutions) filters
   * Section 03 (#work) to that division's deployments and scrolls smoothly.
   */
  const handleSelectDivisionWork = (division: Division) => {
    setFilter(division.portfolioCategory)
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  /**
   * Triggered from inside `CaseStudyModal` when the user clicks
   * "Deploy a Similar System". Closes the modal, pre-selects the relevant
   * engineering discipline, pre-fills a reference note if the brief is blank,
   * and scrolls to the inquiry form (#contact).
   */
  const handleStartSimilarProject = (project: PortfolioProject) => {
    const serviceMap: Record<PortfolioProject['division'], string> = {
      'Software Engineering': 'Software Engineering',
      'Embedded & IoT': 'Embedded & IoT',
      'Graphics & UI/UX': 'Graphics & Design',
    }
    const mappedService = serviceMap[project.division]

    setSelectedServices((current) =>
      current.includes(mappedService) ? current : [...current, mappedService],
    )
    setFormData((prev) => ({
      ...prev,
      brief:
        prev.brief.trim().length > 0
          ? prev.brief
          : `Reference deployment: ${project.id} (${project.title}). We are looking to architect a similar system for `,
    }))
    setActiveCaseStudy(null)
    setSubmitted(false)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  /**
   * Formats the plain-text technical brief used for both clipboard copy
   * and the fallback `mailto:` email body.
   */
  const formatBriefSummaryText = () =>
    [
      `Client Name: ${formData.name}`,
      `Organization: ${formData.organization || 'N/A'}`,
      `Work Email: ${formData.email}`,
      `Phone: ${formData.phone || 'N/A'}`,
      `Disciplines: ${selectedServices.join(', ') || 'General Systems Engineering'}`,
      `Timeline: ${formData.timeline || 'Not specified'}`,
      `Estimated Scope: ${formData.scope || 'Not specified'}`,
      '',
      'Technical Brief:',
      formData.brief,
    ].join('\n')

  /**
   * Builds a `mailto:` URI pre-populated with subject and formatted brief body.
   */
  const buildMailtoHref = () => {
    const subject = encodeURIComponent(
      `[C137 Brief] ${formData.organization || formData.name || 'New System Inquiry'} (${
        selectedServices.join(', ') || 'General'
      })`,
    )
    const body = encodeURIComponent(formatBriefSummaryText())
    return `mailto:hello@customize137.com?subject=${subject}&body=${body}`
  }

  /**
   * Copies the formatted brief to the user's clipboard for quick sharing.
   */
  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(formatBriefSummaryText())
      setCopiedBrief(true)
      window.setTimeout(() => setCopiedBrief(false), 2500)
    } catch {
      // Clipboard API may be restricted in non-HTTPS contexts; ignore silently
    }
  }

  /**
   * Handles form submission:
   * 1. Persists a backup copy of the inquiry in `localStorage` so drafts are never lost.
   * 2. If `VITE_CONTACT_API_URL` is configured, POSTs JSON to the backend/webhook.
   * 3. Transitions to the confirmation screen with direct Email & Clipboard actions.
   */
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setDeliveredViaApi(false)

    const payload = {
      ...formData,
      disciplines: selectedServices,
      submittedAt: new Date().toISOString(),
    }

    // Save locally as a safeguard
    try {
      const existing = JSON.parse(localStorage.getItem('c137_inquiries') || '[]')
      localStorage.setItem('c137_inquiries', JSON.stringify([payload, ...existing].slice(0, 20)))
    } catch {
      // Ignore storage quota or private-browsing restrictions
    }

    // If a backend endpoint (e.g. Formspree / Resend webhook) is configured, POST it
    if (CONTACT_API_URL) {
      try {
        const response = await fetch(CONTACT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          setDeliveredViaApi(true)
        }
      } catch {
        // Fall back gracefully to email/clipboard dispatch on network error
      }
    }

    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="site-shell">
      {/* =====================================================================
          STICKY TOP NAVIGATION BAR
          ===================================================================== */}
      <header className="navbar">
        <a className="brand-lockup" href="#top" aria-label="Customize137 home">
          <BrandLogo />
          <span className="brand-name">
            Customize<span>137</span>
          </span>
          <span className="brand-badge">SYSTEMS LTD</span>
        </a>

        <nav className={`desktop-nav ${menuOpen ? 'mobile-open' : ''}`} aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          {/* Visible only inside the mobile slide-down menu (< 900px) */}
          <a className="mobile-deploy" href="#contact" onClick={() => setMenuOpen(false)}>
            Deploy a Project <ArrowUpRight size={14} />
          </a>
        </nav>

        <div className="nav-actions">
          <span className="status">
            <i /> All Systems Operational
          </span>
          <a className="button button-light nav-cta" href="#contact">
            Deploy a Project <ArrowUpRight size={15} />
          </a>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="top">
        {/* ===================================================================
            HERO SECTION & INTERACTIVE SYSTEM PIPELINE
            =================================================================== */}
        <section className="hero section-grid">
          <div className="crosshair crosshair-tl">+</div>
          <div className="crosshair crosshair-tr">+</div>

          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot" /> SYSTEM ARCHITECTURE <b>//</b> SOFTWARE · EMBEDDED ·
              DESIGN
            </div>
            <h1>
              Infrastructure for <em>intelligent</em> systems.
            </h1>
            <p className="hero-lede">
              Customize137 engineers production-grade web platforms, precision IoT and embedded
              firmware, and cohesive brand systems&mdash;built from silicon to cloud.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Start Building <ArrowUpRight size={17} />
              </a>
              <a className="button button-ghost mono" href="#architecture">
                Explore Architecture <ChevronDown size={15} />
              </a>
            </div>
            <div className="hero-proof">
              <span>
                <CircleCheck size={15} /> Production-ready by design
              </span>
              <span>
                <CircleCheck size={15} /> Kampala · East Africa
              </span>
            </div>
          </div>

          <ArchitecturePipeline activeNode={activeNode} setActiveNode={setActiveNode} />
        </section>

        {/* ===================================================================
            KEY TELEMETRY & RELIABILITY METRICS STRIP
            =================================================================== */}
        <section className="metrics-strip" aria-label="Key system metrics">
          <div>
            <strong>03</strong>
            <span>integrated disciplines</span>
          </div>
          <div>
            <strong>137</strong>
            <span>the systems mindset</span>
          </div>
          <div>
            <strong>
              99.8<span>%</span>
            </strong>
            <span>field link reliability</span>
          </div>
          <div>
            <strong>
              24<span>/7</span>
            </strong>
            <span>observability built in</span>
          </div>
        </section>

        {/* ===================================================================
            SECTION 01: CORE CAPABILITIES (SOLUTIONS)
            =================================================================== */}
        <section className="section" id="solutions">
          <SectionHeader
            index="01"
            label="Core capabilities"
            title={
              <>
                Three disciplines. <em>One system.</em>
              </>
            }
            description="The best products happen at the intersection of disciplines. We keep the whole architecture in view, from the first schematic to the final interface."
          />
          <div className="pillar-grid">
            {divisions.map((division) => (
              <PillarCard
                key={division.id}
                division={division}
                onSelect={() => handleSelectDivisionWork(division)}
              />
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 02: UNIFIED ARCHITECTURE DIAGRAM
            =================================================================== */}
        <section className="section architecture-section" id="architecture">
          <SectionHeader
            index="02"
            label="How we connect it"
            title={
              <>
                Architecture that <em>holds together.</em>
              </>
            }
            description="A single technical partner across the stack means fewer handoffs, faster decisions, and systems that work as one."
          />
          <div className="architecture-diagram">
            <div className="diagram-side">
              <span className="mono">INPUTS</span>
              <b>Ideas</b>
              <b>Constraints</b>
              <b>Ambition</b>
            </div>
            <div className="diagram-core">
              <div className="core-ring">
                <span>137</span>
              </div>
              <div className="core-label">
                <span className="mono">C137 // CORE</span>
                <b>
                  Unified
                  <br />
                  delivery system
                </b>
              </div>
            </div>
            <div className="diagram-side right">
              <span className="mono">OUTPUTS</span>
              <b>Reliable software</b>
              <b>Connected hardware</b>
              <b>Clear products</b>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 03: SELECTED DEPLOYMENTS (PORTFOLIO & CASE STUDIES)
            =================================================================== */}
        <section className="section work-section" id="work">
          <SectionHeader
            index="03"
            label="Selected deployments"
            title={
              <>
                Proof over <em>promises.</em>
              </>
            }
            description="A sample of the systems we have designed, shipped, and made observable. Select any deployment to inspect its architecture and outcomes."
          />
          <div className="filter-row" role="tablist" aria-label="Filter deployments by discipline">
            {portfolioFilters.map((item) => (
              <button
                type="button"
                key={item}
                role="tab"
                aria-selected={filter === item}
                className={filter === item ? 'active' : ''}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="portfolio-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={() => setActiveCaseStudy(project)}
              />
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 04: THE ENGINEERING LOOP (PROCESS)
            =================================================================== */}
        <section className="section process-section" id="process">
          <SectionHeader
            index="04"
            label="The engineering loop"
            title={
              <>
                From first sketch to <em>field signal.</em>
              </>
            }
            description="A rigorous, transparent process that keeps momentum high and surprises low."
          />
          <div className="process-grid">
            {processSteps.map((step, index) => (
              <div className="process-card" key={step.id}>
                <span className="step-number">0{index + 1}</span>
                <div className="step-line" />
                <span className="mono">{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 05: WHY 137 (INTEGRATION SYNERGY)
            =================================================================== */}
        <section className="why-section" id="why-137">
          <div className="why-glow" />
          <div className="section-header compact">
            <span className="section-index">05</span>
            <span className="eyebrow">The 137 synergy</span>
          </div>
          <div className="why-content">
            <h2>
              Complexity is inevitable.
              <br />
              <em>Integration is a choice.</em>
            </h2>
            <p>
              When hardware, software, and product design live under one roof, the seams disappear.
              Decisions get faster, quality gets higher, and your team gets a partner who sees the
              whole system.
            </p>
            <a className="text-link" href="#contact">
              Talk to an engineer <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="why-signals">
            <div>
              <Zap size={18} />
              <b>Faster iteration</b>
              <span>One team, fewer handoffs.</span>
            </div>
            <div>
              <Network size={18} />
              <b>Native integration</b>
              <span>Interfaces designed together.</span>
            </div>
            <div>
              <Globe2 size={18} />
              <b>Built for reality</b>
              <span>Field-tested, not theoretical.</span>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 06: START A CONVERSATION (TECHNICAL BRIEF INQUIRY FORM)
            =================================================================== */}
        <section className="section contact-section" id="contact">
          <SectionHeader
            index="06"
            label="Start a conversation"
            title={
              <>
                What are you <em>building?</em>
              </>
            }
            description="Give us the shape of the problem. We will bring the architecture review."
          />
          <div className="contact-grid">
            <div className="contact-aside">
              <div className="availability">
                <i /> Accepting new projects <span>Q4 2026</span>
              </div>
              <h3>
                Let&apos;s make the
                <br />
                <em>next system</em> real.
              </h3>
              <p>Tell us where you are, where you want to go, and what is in the way.</p>
              <div className="contact-details">
                <a href="mailto:hello@customize137.com">
                  hello@customize137.com <ArrowUpRight size={14} />
                </a>
                <span>Kampala, Uganda · EAT (UTC+3)</span>
                <span className="mono">RESPONSE_SLA: &lt; 2 BUSINESS DAYS</span>
              </div>
            </div>

            <form className="inquiry-form" onSubmit={handleFormSubmit}>
              {submitted ? (
                <div className="success-state">
                  <CircleCheck size={42} />
                  <span className="mono">
                    {deliveredViaApi ? 'TRANSMISSION_RECEIVED' : 'TRANSMISSION_READY'}
                  </span>
                  <h3>
                    {deliveredViaApi ? "We'll be in touch." : 'Brief prepared for dispatch.'}
                  </h3>
                  <p>
                    {deliveredViaApi ? (
                      <>
                        Thank you{formData.name ? `, ${formData.name}` : ''}. Your brief for{' '}
                        <strong>{selectedServices.join(', ') || 'System Engineering'}</strong> has
                        been logged. An engineer will respond within two business days.
                      </>
                    ) : (
                      <>
                        Thank you{formData.name ? `, ${formData.name}` : ''}. Your configuration
                        for <strong>{selectedServices.join(', ') || 'System Engineering'}</strong>{' '}
                        is saved locally and ready to send via your email client or clipboard.
                      </>
                    )}
                  </p>
                  <div className="success-actions">
                    <a className="button button-primary" href={buildMailtoHref()}>
                      Dispatch via Email <ArrowUpRight size={15} />
                    </a>
                    <button
                      className="button button-ghost"
                      type="button"
                      onClick={handleCopyBrief}
                    >
                      {copiedBrief ? <Check size={15} /> : <Copy size={15} />}
                      {copiedBrief ? 'Brief Copied' : 'Copy Technical Brief'}
                    </button>
                    <button
                      className="button button-ghost"
                      type="button"
                      onClick={() => setSubmitted(false)}
                    >
                      Edit or send another brief
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-heading">
                    <span className="mono">PROJECT_CONFIG // NEW</span>
                    <span>READY</span>
                  </div>
                  <div className="form-row">
                    <label>
                      Client name
                      <input
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Organization
                      <input
                        placeholder="Company / organization"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, organization: e.target.value }))
                        }
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Work email
                      <input
                        required
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Phone <span className="optional">(optional)</span>
                      <input
                        placeholder="+256 ..."
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </label>
                  </div>
                  <fieldset>
                    <legend>What should we build?</legend>
                    <div className="service-toggles">
                      {inquiryServiceOptions.map((service) => (
                        <button
                          type="button"
                          key={service}
                          className={selectedServices.includes(service) ? 'selected' : ''}
                          onClick={() => toggleService(service)}
                        >
                          {selectedServices.includes(service) && <Check size={14} />}
                          {service}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="form-row">
                    <label>
                      Timeline
                      <select
                        value={formData.timeline}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, timeline: e.target.value }))
                        }
                      >
                        <option value="" disabled>
                          Select a timeline
                        </option>
                        <option value="1–3 months">1–3 months</option>
                        <option value="3–6 months">3–6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </label>
                    <label>
                      Estimated scope
                      <select
                        value={formData.scope}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, scope: e.target.value }))
                        }
                      >
                        <option value="" disabled>
                          Select a scope
                        </option>
                        <option value="Focused build">Focused build</option>
                        <option value="Multi-phase system">Multi-phase system</option>
                        <option value="Exploration / advisory">Exploration / advisory</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Technical brief
                    <textarea
                      required
                      placeholder="What are you trying to make possible?"
                      rows={4}
                      value={formData.brief}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, brief: e.target.value }))
                      }
                    />
                  </label>
                  <button
                    className="button button-primary submit-button"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Transmitting...' : 'Transmit project brief'}{' '}
                    <ArrowUpRight size={16} />
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* =====================================================================
          CASE STUDY DETAIL MODAL (OPENED BY SELECTING ANY PROJECT CARD)
          ===================================================================== */}
      <CaseStudyModal
        project={activeCaseStudy}
        onClose={() => setActiveCaseStudy(null)}
        onStartSimilarProject={handleStartSimilarProject}
      />

      {/* =====================================================================
          SITE FOOTER
          ===================================================================== */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <BrandLogo />
            <p>
              Systems for the physical
              <br />
              and digital world.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <span className="mono">EXPLORE</span>
              <a href="#solutions">Solutions</a>
              <a href="#work">Work</a>
              <a href="#process">Process</a>
            </div>
            <div>
              <span className="mono">CONNECT</span>
              <a href="mailto:hello@customize137.com">Email us</a>
              <a href="#contact">Start a project</a>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub <GitBranch size={13} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Customize137 Systems Limited. All rights reserved.</span>
          <span className="status">
            <i /> All systems operational
          </span>
          <span className="mono">SYS_V137.1.0</span>
        </div>
      </footer>
    </div>
  )
}

/**
 * Hero Interactive System Map (`ArchitecturePipeline`)
 * Highlights how Customize137 connects physical edge hardware, cloud backend
 * infrastructure, and human interfaces into a single cohesive loop.
 */
function ArchitecturePipeline({
  activeNode,
  setActiveNode,
}: {
  activeNode: number
  setActiveNode: (value: number) => void
}) {
  const nodes = [
    {
      icon: Cpu,
      number: '01',
      label: 'SILICON & EDGE',
      title: 'The physical layer',
      details: ['ESP32 / ARM Cortex', 'LoRaWAN Link: 99.8%', 'PCB & 3D CAD Enclosure'],
      color: 'orange',
    },
    {
      icon: Database,
      number: '02',
      label: 'CLOUD & CORE',
      title: 'The intelligence layer',
      details: ['Docker / PostgreSQL', 'Multi-Tier Approval Engine', 'REST / GraphQL APIs'],
      color: 'blue',
    },
    {
      icon: Globe2,
      number: '03',
      label: 'INTERFACE & BRAND',
      title: 'The human layer',
      details: ['Figma System Tokens', '3D Product Render', 'WCAG AA UI'],
      color: 'teal',
    },
  ]

  return (
    <div className="pipeline-wrap">
      <div className="pipeline-meta">
        <span className="mono">LIVE SYSTEM MAP</span>
        <span>
          <i /> CONNECTED
        </span>
      </div>
      <div className="pipeline">
        {nodes.map((node, index) => {
          const Icon = node.icon
          return (
            <button
              type="button"
              key={node.number}
              className={`pipeline-node ${node.color} ${activeNode === index ? 'selected' : ''}`}
              onMouseEnter={() => setActiveNode(index)}
              onFocus={() => setActiveNode(index)}
              onClick={() => setActiveNode(index)}
            >
              <div className="node-top">
                <span className="node-number">{node.number}</span>
                <Icon size={17} />
                <span className="mono">{node.label}</span>
              </div>
              <strong>{node.title}</strong>
              <div className="node-details">
                {node.details.map((detail) => (
                  <span key={detail}>
                    <i />
                    {detail}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
      <div className="pipeline-rail">
        <span />
        <span />
        <span />
      </div>
      <div className="pipeline-footer">
        <span className="mono">C137_CORE</span>
        <a href="#architecture">
          One connected system <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  )
}

/**
 * Standardized 3-column section header with index number, eyebrow label,
 * display heading, and lead description.
 */
function SectionHeader({
  index,
  label,
  title,
  description,
}: {
  index: string
  label: string
  title: React.ReactNode
  description: string
}) {
  return (
    <div className="section-header">
      <div>
        <span className="section-index">{index}</span>
        <span className="eyebrow">{label}</span>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

/**
 * Capability Pillar Card (`PillarCard`)
 * Displays one of the 3 core Customize137 divisions with a tailored interactive
 * telemetry preview (terminal logs, MCU schematic stats, or design tokens).
 */
function PillarCard({
  division,
  onSelect,
}: {
  division: Division
  onSelect: () => void
}) {
  return (
    <article
      className={`pillar-card ${division.color}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Explore ${division.name} deployments`}
    >
      <div className="card-glow" />
      <div className="pillar-top">
        <span className="mono">{division.tag}</span>
        <span className="card-arrow">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <h3>{division.name}</h3>
      <p>{division.summary}</p>

      {/* Division-specific visual telemetry preview */}
      <div className="preview">
        {division.id === 'software' ? (
          <>
            <div className="terminal-top">
              <span />
              <span />
              <span />
              <b>deploy.log</b>
            </div>
            <code>
              <i>200</i> OK · container: c137-core-api
              <br />
              <span>→ migrations complete</span>
              <br />
              <span>→ healthcheck passed in 42ms</span>
            </code>
          </>
        ) : division.id === 'embedded' ? (
          <>
            <div className="chip-visual">
              <Cpu size={38} />
              <span>3.3V</span>
              <span>99.8%</span>
            </div>
            <code>
              CHIP_ID: C137-MCU
              <br />
              <span>STATUS: NOMINAL / 24°C</span>
            </code>
          </>
        ) : (
          <>
            <div className="swatches">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="bezier">
              <span>◌</span>
              <span>⌁</span>
              <span>+</span>
              <span>◌</span>
            </div>
            <code>
              TOKEN_SET: C137_DARK_V2
              <br />
              <span>CONTRAST: WCAG AA</span>
            </code>
          </>
        )}
      </div>

      <div className="deliverables">
        {division.deliverables.map((item) => (
          <span key={item}>
            <Check size={13} />
            {item}
          </span>
        ))}
      </div>
      <div className="tag-list">
        {division.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </article>
  )
}

/**
 * Portfolio Deployment Card (`ProjectCard`)
 * Clicking opens the detailed `CaseStudyModal` for this deployment.
 */
function ProjectCard({
  project,
  onSelect,
}: {
  project: PortfolioProject
  onSelect: () => void
}) {
  return (
    <article
      className="project-card"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open case study for ${project.title}`}
    >
      <div className="project-top">
        <span className="mono">{project.id}</span>
        <span className={`division-dot ${project.color}`}>{project.division}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="project-bottom">
        <div className="project-metric-row">
          <strong>{project.metric}</strong>
          <span className="case-study-hint mono">CASE STUDY ↗</span>
        </div>
        <div className="tag-list">
          {project.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <ArrowUpRight className="project-arrow" size={17} />
    </article>
  )
}

export default App
