import { EmptyState } from './Skills';

export default function Experience({ experience }) {
  return (
    <section className="section" id="experience" data-section="experience">
      <div className="section-inner">
        <div className="mb-12" data-reveal>
          <span className="section-tag">03</span>
          <h2 className="section-title">Professional Experience</h2>
          <div className="section-line" />
        </div>

        {experience.length === 0 ? (
          <EmptyState label="No experience entries published yet — add some from the admin dashboard." />
        ) : (
          <div className="relative space-y-8">
            {/* Timeline line */}
            <div className="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-accent/20" />

            {experience.map((e, idx) => (
              <div 
                key={e.id} 
                className="relative pl-24" 
                data-reveal
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-12 h-12 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-accent ring-4 ring-bg hover:ring-gold/20 transition-all duration-300" />
                </div>

                {/* Content card */}
                <div className="glass-panel rounded-xl p-7 hover:shadow-card-hover transition-all duration-300 group">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-text group-hover:text-gold transition-colors duration-300">
                      {e.position}
                    </h3>
                    <span className="text-xs font-mono text-gold/70 group-hover:text-gold whitespace-nowrap transition-colors duration-300">
                      {e.date_range}
                    </span>
                  </div>

                  {/* Organization */}
                  <p className="text-sm font-medium text-gold mb-3 tracking-wide">
                    {e.organization}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-muted/90 leading-relaxed max-w-3xl">
                    {e.description}
                  </p>

                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
