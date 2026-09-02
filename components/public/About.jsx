export default function About({ profile }) {
  const bio = profile?.bio;
  const focusAreas =
    profile?.focus_areas?.length > 0
      ? profile.focus_areas
      : ['ICT & Networking', 'AI / ML', 'Cloud', 'IoT', 'Cybersecurity'];

  return (
    <section className="section" id="about" data-section="about">
      <div className="section-inner">
        <div className="mb-12" data-reveal>
          <span className="section-tag">01</span>
          <h2 className="section-title">About Me</h2>
          <div className="section-line" />
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          {/* Bio Content */}
          <div data-reveal className="space-y-6">
            {bio ? (
              bio
                .split('\n\n')
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-muted leading-relaxed text-base">
                    {para}
                  </p>
                ))
            ) : (
              <p className="text-muted leading-relaxed">
                Add your bio from the admin dashboard (Profile / About) — this paragraph will update here
                automatically once you save it.
              </p>
            )}

            {/* Focus areas */}
            <div className="pt-4">
              <p className="text-sm font-semibold text-gold mb-4 tracking-wide">KEY FOCUS AREAS</p>
              <div className="flex flex-wrap gap-3">
                {focusAreas.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-4 py-2 rounded-lg border border-gold/25 hover:border-gold/50 text-text/90 hover:text-gold transition-all duration-300 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="glass-panel rounded-xl p-8" data-reveal>
            <div className="space-y-6">
              {/* Location */}
              <div className="pb-6 border-b border-gold/20">
                <p className="text-xs uppercase tracking-widest text-gold/70 mb-2 font-semibold">Location</p>
                <p className="text-base font-medium text-text">
                  {profile?.location || 'Add in dashboard'}
                </p>
              </div>

              {/* Email */}
              <div className="pb-6 border-b border-gold/20">
                <p className="text-xs uppercase tracking-widest text-gold/70 mb-2 font-semibold">Email</p>
                <a 
                  href={`mailto:${profile?.email}`}
                  className="text-base font-medium text-gold hover:text-gold/80 transition-colors truncate"
                >
                  {profile?.email || 'Add in dashboard'}
                </a>
              </div>

              {/* GitHub */}
              <div>
                <p className="text-xs uppercase tracking-widest text-gold/70 mb-2 font-semibold">GitHub</p>
                {profile?.github_url ? (
                  <a 
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-medium text-gold hover:text-gold/80 transition-colors truncate flex items-center gap-2"
                  >
                    @{profile.github_url.replace('https://github.com/', '')}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M7.5 1a.75.75 0 01.75.75v4.69l3.22-3.22a.75.75 0 111.06 1.06L9.31 7.5l3.22 3.22a.75.75 0 11-1.06 1.06L8.25 8.56v4.69a.75.75 0 11-1.5 0V8.56L3.22 11.78a.75.75 0 01-1.06-1.06L6.69 7.5 3.47 4.28a.75.75 0 011.06-1.06l3.22 3.22V1.75A.75.75 0 017.5 1z" />
                    </svg>
                  </a>
                ) : (
                  <p className="text-base font-medium text-text/50">Add in dashboard</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
