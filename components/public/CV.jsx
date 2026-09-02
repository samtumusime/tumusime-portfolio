import { EmptyState } from './Skills';

export default function CV({ cv }) {
  return (
    <section className="section" id="cv" data-section="cv">
      <div className="section-inner">
        <div className="mb-12" data-reveal>
          <span className="section-tag">07</span>
          <h2 className="section-title">Curriculum Vitae</h2>
          <div className="section-line" />
        </div>

        {!cv?.file_url ? (
          <EmptyState label="No CV uploaded yet — add one from the admin dashboard." />
        ) : (
          <div
            className="glass-panel rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center gap-8"
            data-reveal
          >
            {/* Document glyph */}
            <div className="shrink-0 w-20 h-24 rounded-lg cert-document flex items-center justify-center">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#BAA36A" strokeWidth="1.4">
                <path d="M6 2h9l5 5v15H6z" strokeLinejoin="round" />
                <path d="M15 2v5h5" strokeLinejoin="round" />
                <path d="M9 13h6M9 16.5h6M9 9.5h2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-gold/70 font-semibold mb-2">
                {cv.label || 'Master CV'}
              </p>
              <h3 className="text-xl font-semibold text-text mb-2">
                {cv.file_name || 'Curriculum Vitae'}
              </h3>
              <p className="text-sm text-muted leading-relaxed max-w-lg">
                A complete record of my ICT, networking, AI and cloud experience — kept current
                and available to view or download at any time.
              </p>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={cv.file_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none text-center px-6 py-3 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold transition-all duration-300 text-sm font-semibold"
              >
                View CV
              </a>
              <a
                href={cv.file_url}
                download={cv.file_name || true}
                className="flex-1 sm:flex-none text-center px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover border border-accent text-text transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg"
              >
                Download CV
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
