export default function Skills({ skillGroups }) {
  return (
    <section className="section" id="skills" data-section="skills">
      <div className="section-inner">
        <div className="mb-12" data-reveal>
          <span className="section-tag">02</span>
          <h2 className="section-title">Core Skills</h2>
          <div className="section-line" />
        </div>

        {skillGroups.length === 0 ? (
          <EmptyState label="No skill groups published yet — add some from the admin dashboard." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillGroups.map((g, idx) => (
              <div
                key={g.id}
                className="glass-panel rounded-xl p-7 hover:shadow-card-hover hover:-translate-y-1 group transition-all duration-300"
                data-reveal
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-accent/20 flex items-center justify-center group-hover:from-gold/30 group-hover:to-accent/30 transition-all duration-300">
                    <span className="text-sm font-bold text-gold">✦</span>
                  </div>
                  <h3 className="text-sm font-semibold tracking-wide text-gold group-hover:text-gold/80 transition-colors duration-300">
                    {g.category}
                  </h3>
                </div>

                {/* Skills list with hover effects */}
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item, i) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-2 rounded-md bg-surface/50 hover:bg-surface border border-border/50 hover:border-gold/30 text-text/85 hover:text-gold transition-all duration-200 cursor-default"
                      style={{
                        transitionDelay: `${i * 30}ms`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Subtle decorative line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function EmptyState({ label }) {
  return (
    <div className="glass-panel rounded-xl py-12 text-center text-muted/70 text-sm" data-reveal>
      {label}
    </div>
  );
}
