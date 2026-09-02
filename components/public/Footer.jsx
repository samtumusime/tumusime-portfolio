import Link from 'next/link';

export default function Footer({ profile }) {
  const name = profile?.full_name || 'Tumusime Sam';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40 mt-20">
      <div className="section-inner py-12">
        <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-start">
          {/* Left side - Brand info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold tracking-wider text-lg text-text">
                {name.toUpperCase()}
              </h3>
              <p className="text-sm text-muted/70 mt-2">
                Designing and building intelligent systems | AI · ICT · Cloud · IoT
              </p>
            </div>
            <p className="text-xs text-muted/50 pt-2">
              © {currentYear} All rights reserved. Crafted with attention to detail.
            </p>
          </div>

          {/* Right side - Links and social */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Social Links */}
            <div className="flex items-center gap-5">
              {profile?.email && (
                <a 
                  href={`mailto:${profile.email}`} 
                  aria-label="Email" 
                  className="w-9 h-9 rounded-lg border border-border hover:border-gold/40 flex items-center justify-center text-muted hover:text-gold transition-all duration-300 hover:bg-gold/5"
                  title={profile.email}
                >
                  <span className="text-sm">✉</span>
                </a>
              )}
              {profile?.linkedin_url && (
                <a 
                  href={profile.linkedin_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="LinkedIn" 
                  className="w-9 h-9 rounded-lg border border-border hover:border-gold/40 flex items-center justify-center text-muted hover:text-gold transition-all duration-300 hover:bg-gold/5 text-xs font-bold"
                >
                  in
                </a>
              )}
              {profile?.github_url && (
                <a 
                  href={profile.github_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="GitHub" 
                  className="w-9 h-9 rounded-lg border border-border hover:border-gold/40 flex items-center justify-center text-muted hover:text-gold transition-all duration-300 hover:bg-gold/5"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Admin link */}
            <Link 
              href="/login" 
              className="text-xs font-medium text-muted/50 hover:text-gold transition-colors px-3 py-1.5 rounded-md border border-border/40 hover:border-gold/40"
            >
              Admin ↗
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      </div>
    </footer>
  );
}
