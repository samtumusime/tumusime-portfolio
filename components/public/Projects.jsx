import { EmptyState } from './Skills';

export default function Projects({ projects }) {
  return (
    <section className="section" id="projects" data-section="projects">
      <div className="section-inner">
        <div className="mb-12" data-reveal>
          <span className="section-tag">04</span>
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-line" />
        </div>

        {projects.length === 0 ? (
          <EmptyState label="No projects published yet — add some from the admin dashboard." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, idx) => (
              <article
                key={p.id}
                className="group glass-panel rounded-xl overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                data-reveal
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image container */}
                <div className="relative aspect-video bg-surface-2 overflow-hidden">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted/50 text-xs font-mono">
                      NO PREVIEW
                    </div>
                  )}
                  
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-text text-lg group-hover:text-gold transition-colors duration-300">
                      {p.title}
                    </h3>
                    {p.category && (
                      <span className="text-[10px] uppercase tracking-widest text-gold/70 whitespace-nowrap px-2 py-1 rounded-full bg-gold/10">
                        {p.category}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted/90 leading-relaxed mb-4 line-clamp-2">
                    {p.description}
                  </p>

                  {/* Technologies */}
                  {p.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {p.technologies.slice(0, 4).map((t) => (
                        <span 
                          key={t} 
                          className="text-[11px] px-2.5 py-1 rounded-md bg-surface hover:bg-surface-2 text-text/70 hover:text-gold/80 border border-border/50 hover:border-gold/30 transition-all duration-200"
                        >
                          {t}
                        </span>
                      ))}
                      {p.technologies.length > 4 && (
                        <span className="text-[11px] px-2.5 py-1 text-text/50">
                          +{p.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-4 pt-4 border-t border-border/50">
                    {p.github_url && (
                      <a 
                        href={p.github_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sm text-text/70 hover:text-gold transition-colors duration-200 font-medium flex items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                    {p.live_url && (
                      <a 
                        href={p.live_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sm text-text/70 hover:text-gold transition-colors duration-200 font-medium flex items-center gap-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M8 1v14M1 8h14M8 1c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
