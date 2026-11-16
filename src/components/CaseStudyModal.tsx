import { useEffect } from 'react'
import { ArrowUpRight, Check, CircleCheck, Layers, ShieldCheck, X } from 'lucide-react'
import type { PortfolioProject } from '../data/siteData'

interface CaseStudyModalProps {
  /** Currently selected project deployment, or `null` when closed */
  project: PortfolioProject | null
  /** Callback to close the modal */
  onClose: () => void
  /** Callback to pre-fill the inquiry form with this project's context and scroll to #contact */
  onStartSimilarProject: (project: PortfolioProject) => void
}

/**
 * CaseStudyModal (`src/components/CaseStudyModal.tsx`)
 * ----------------------------------------------------------------------------
 * Displays an in-depth engineering case study when a user selects any project
 * card in the "Selected Deployments" (#work) section.
 *
 * Accessibility & UX features:
 * - Closes automatically when pressing the `Escape` key.
 * - Locks background page scrolling while open.
 * - Closes when clicking the dimmed backdrop overlay.
 * - Provides a direct "Deploy a Similar System" handoff to the inquiry form.
 */
export default function CaseStudyModal({
  project,
  onClose,
  onStartSimilarProject,
}: CaseStudyModalProps) {
  // Bind Escape key listener and lock body scroll while the modal is open
  useEffect(() => {
    if (!project) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  const { caseStudy } = project

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={onClose}
    >
      {/* Stop click propagation inside the modal panel so clicking content doesn't close it */}
      <div
        className={`modal-panel ${project.color}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Top telemetry bar */}
        <div className="modal-header">
          <div className="modal-meta">
            <span className="mono">{project.id} // CASE_STUDY</span>
            <span className={`division-dot ${project.color}`}>{project.division}</span>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close case study modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Headline & key metadata */}
        <h3 id="case-study-title" className="modal-title">
          {project.title}
        </h3>
        <p className="modal-summary">{project.summary}</p>

        <div className="modal-kpi-strip">
          <div>
            <span className="mono">PRIMARY IMPACT</span>
            <strong>{project.metric}</strong>
          </div>
          <div>
            <span className="mono">CLIENT SECTOR</span>
            <strong>{caseStudy.clientSector}</strong>
          </div>
          <div>
            <span className="mono">DELIVERY WINDOW</span>
            <strong>{caseStudy.deploymentDuration}</strong>
          </div>
        </div>

        {/* Challenge & System Architecture */}
        <div className="modal-body-grid">
          <div className="modal-block">
            <span className="mono">01 // THE OPERATIONAL CHALLENGE</span>
            <p>{caseStudy.challenge}</p>
          </div>
          <div className="modal-block">
            <span className="mono">02 // C137 SYSTEM ARCHITECTURE</span>
            <p>{caseStudy.architecture}</p>
          </div>
        </div>

        {/* Verified Outcomes & Shipped Deliverables */}
        <div className="modal-lists-grid">
          <div className="modal-list-box">
            <div className="modal-list-heading">
              <ShieldCheck size={15} />
              <span className="mono">VERIFIED OUTCOMES</span>
            </div>
            <ul>
              {caseStudy.outcomes.map((outcome) => (
                <li key={outcome}>
                  <CircleCheck size={14} />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-list-box">
            <div className="modal-list-heading">
              <Layers size={15} />
              <span className="mono">SHIPPED DELIVERABLES</span>
            </div>
            <ul>
              {caseStudy.deliverables.map((item) => (
                <li key={item}>
                  <Check size={14} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer stack tags & conversion CTA */}
        <div className="modal-footer">
          <div className="tag-list">
            {project.stack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="button button-ghost" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="button button-primary"
              onClick={() => onStartSimilarProject(project)}
            >
              Deploy a Similar System <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
