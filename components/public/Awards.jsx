import { EmptyState } from './Skills';

export default function Awards({ awards }) {
  return (
    <section className="section" id="awards" data-section="awards">
      <div className="section-inner">
        <div className="mb-12" data-reveal>
          <span className="section-tag">06</span>
          <h2 className="section-title">Achievements & Awards</h2>
          <div className="section-line" />
        </div>

        {awards.length === 0 ? (
          <EmptyState label="No awards published yet — add some from the admin dashboard." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((a, idx) => (
              <div
                key={a.id}
                className="glass-panel rounded-xl p-7 flex flex-col gap-4 hover:shadow-card-hover hover:-translate-y-1 group transition-all duration-300"
                data-reveal
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Icon */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/25 to-accent/15 border border-gold/25 flex items-center justify-center shrink-0 group-hover:from-gold/35 group-hover:to-accent/25 group-hover:border-gold/40 transition-all duration-300">
                    <span className="text-lg">★</span>
                  </div>
                  <span className="text-xs font-mono text-gold/70 group-hover:text-gold whitespace-nowrap transition-colors duration-300">
                    {a.award_date}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-text text-base group-hover:text-gold transition-colors duration-300 mb-1.5">
                    {a.title}
                  </h3>
                  <p className="text-sm font-medium text-gold/80 mb-3 tracking-wide">
                    {a.organization}
                  </p>
                  <p className="text-sm text-muted/90 leading-relaxed">
                    {a.description}
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
