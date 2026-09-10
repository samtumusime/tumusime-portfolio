'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { EmptyState } from './Skills';
import useModalScrollLock from '@/lib/useModalScrollLock';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'networking', label: 'Networking' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'security', label: 'Security' },
  { id: 'iot', label: 'IoT' },
];

const INITIAL_VISIBLE = 5;

function isImageFile(url) {
  if (!url) return false;
  return /\.(png|jpe?g|webp|gif|avif)$/i.test(
    url.split('?')[0]
  );
}

function isPdfFile(url) {
  if (!url) return false;
  return /\.pdf$/i.test(url.split('?')[0]);
}

function PdfThumbnail({ url, title }) {
  const canvasRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let pdf = null;

    async function renderPdf() {
      try {
        setError(false);

        const pdfjs = await import(
          'pdfjs-dist/legacy/build/pdf.mjs'
        );

        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();

        const loadingTask = pdfjs.getDocument({
          url,
        });

        pdf = await loadingTask.promise;

        if (cancelled) return;

        const page = await pdf.getPage(1);

        if (cancelled) return;

        const canvas = canvasRef.current;

        if (!canvas) return;

        const context = canvas.getContext('2d');

        if (!context) {
          setError(true);
          return;
        }

        const container = canvas.parentElement;

        const containerWidth =
          container?.clientWidth || 600;

        const baseViewport = page.getViewport({
          scale: 1,
        });

        const scale =
          containerWidth / baseViewport.width;

        const viewport = page.getViewport({
          scale,
        });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        if (cancelled) return;

        canvas.style.width = '100%';
        canvas.style.height = '100%';
      } catch (err) {
        console.error(
          'PDF thumbnail error:',
          err
        );

        if (!cancelled) {
          setError(true);
        }
      }
    }

    renderPdf();

    return () => {
      cancelled = true;

      if (pdf) {
        pdf.destroy().catch(() => {});
      }
    };
  }, [url]);

  if (error) {
    return (
      <div className="relative aspect-[4/3] cert-document flex flex-col items-center justify-center gap-3 overflow-hidden">
        <div className="w-11 h-11 rounded-full cert-seal flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#BAA36A"
            strokeWidth="1.5"
          >
            <path
              d="M12 2l2.6 5.4 6 .7-4.3 4.1 1 6-5.3-2.9-5.3 2.9 1-6L3.4 8.1l6-.7L12 2z"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="text-[10px] tracking-[0.2em] uppercase text-gold/60 font-mono">
          Certified
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
      <canvas
        ref={canvasRef}
        aria-label={title}
        className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />

      <span className="absolute bottom-3 left-3 text-[10px] tracking-widest uppercase text-white/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        View Certificate
      </span>
    </div>
  );
}

function CertificateFace({ c }) {
  const imagePreview = isImageFile(c.file_url)
    ? c.file_url
    : isImageFile(c.image_url)
      ? c.image_url
      : null;

  if (imagePreview) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagePreview}
          alt={c.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        <span className="absolute bottom-3 left-3 text-[10px] tracking-widest uppercase text-white/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          View Certificate
        </span>
      </div>
    );
  }

  if (isPdfFile(c.file_url)) {
    return (
      <PdfThumbnail
        url={c.file_url}
        title={c.title}
      />
    );
  }

  return (
    <div className="relative aspect-[4/3] cert-document flex flex-col items-center justify-center gap-3 overflow-hidden">
      <div className="w-11 h-11 rounded-full cert-seal flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#BAA36A"
          strokeWidth="1.5"
        >
          <path
            d="M12 2l2.6 5.4 6 .7-4.3 4.1 1 6-5.3-2.9-5.3 2.9 1-6L3.4 8.1l6-.7L12 2z"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <span className="text-[10px] tracking-[0.2em] uppercase text-gold/60 font-mono">
        Certified
      </span>
    </div>
  );
}

export default function Certificates({ certificates }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);

  useModalScrollLock(Boolean(active));

  useEffect(() => {
    if (!active) return undefined;

    const previouslyFocused = document.activeElement;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setActive(null);
        return;
      }

      if (
        [
          ' ',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          'ArrowUp',
          'ArrowDown',
        ].includes(event.key)
      ) {
        event.preventDefault();
      }

      if (
        event.key === 'Tab' &&
        modalRef.current
      ) {
        const focusable =
          modalRef.current.querySelectorAll(
            'button, a[href]'
          );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last =
          focusable[focusable.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown,
      true
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
        true
      );

      previouslyFocused?.focus?.({
        preventScroll: true,
      });
    };
  }, [active]);

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      const matchesFilter =
        filter === 'all' ||
        c.category === filter;

      const q = query.trim().toLowerCase();

      const matchesQuery =
        !q ||
        c.title
          .toLowerCase()
          .includes(q) ||
        (c.issuer || '')
          .toLowerCase()
          .includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [certificates, query, filter]);

  const visibleCertificates = showAll
    ? filtered
    : filtered.slice(0, INITIAL_VISIBLE);

  return (
    <section
      className="section"
      id="certificates"
      data-section="certificates"
    >
      <div className="section-inner">
        <div className="mb-12" data-reveal>
          <span className="section-tag">
            05
          </span>

          <h2 className="section-title">
            Certificates
          </h2>

          <p className="mt-3 text-sm text-muted">
            {certificates.length} Certificates
          </p>

          <div className="section-line" />
        </div>

        {certificates.length === 0 ? (
          <EmptyState
            label="No certificates published yet — add some from the admin dashboard."
          />
        ) : (
          <>
            <div
              className="flex flex-col sm:flex-row gap-4 mb-10"
              data-reveal
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  placeholder="Search certificates..."
                  className="w-full px-5 py-3 rounded-lg bg-surface/50 border border-border hover:border-gold/30 focus:border-gold text-sm text-text placeholder:text-muted/70 focus:outline-none transition-colors duration-200"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() =>
                      setFilter(f.id)
                    }
                    className={`text-xs px-4 py-2.5 rounded-lg border font-medium transition-all duration-200 ${
                      filter === f.id
                        ? 'bg-accent border-accent text-text shadow-card hover:bg-accent-hover'
                        : 'border-border text-muted/80 hover:text-text hover:border-gold/40 hover:bg-gold/5'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                label="No certificates match your search."
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCertificates.map(
                  (c, idx) => (
                    <button
                      key={c.id}
                      onClick={() =>
                        setActive(c)
                      }
                      className={`relative text-left glass-panel rounded-xl overflow-hidden hover:shadow-card-hover hover:-translate-y-1 group transition-all duration-300 text-start ${
                        showAll &&
                        idx >= INITIAL_VISIBLE
                          ? 'certificate-expand'
                          : ''
                      }`}
                      data-reveal={
                        showAll &&
                        idx >= INITIAL_VISIBLE
                          ? undefined
                          : true
                      }
                      style={{
                        animationDelay: `${idx * 50}ms`,
                      }}
                    >
                      <CertificateFace c={c} />

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-text text-base group-hover:text-gold transition-colors duration-300 leading-snug">
                              {c.title}
                            </h3>
                          </div>

                          <span className="text-[10px] font-mono text-gold/70 group-hover:text-gold shrink-0 transition-colors duration-300 whitespace-nowrap">
                            {c.issue_date}
                          </span>
                        </div>

                        <p className="text-xs font-medium text-gold/80 mb-3 tracking-wide">
                          {c.issuer}
                        </p>

                        <p className="text-xs text-muted/80 leading-relaxed line-clamp-3 mb-4">
                          {c.description}
                        </p>

                        {c.category && (
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest bg-gold/10 text-gold/80 group-hover:bg-gold/15 transition-all duration-300">
                              {c.category}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  )
                )}
              </div>
            )}

            {filtered.length >
              INITIAL_VISIBLE && (
              <div
                className="mt-10 flex justify-center"
                data-reveal
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowAll(
                      (current) => !current
                    )
                  }
                  className="group inline-flex items-center gap-2 rounded-lg border border-gold/30 px-5 py-3 text-sm font-semibold text-text transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/5"
                  aria-expanded={showAll}
                >
                  {showAll
                    ? 'Show Less'
                    : `View All Certificates (${filtered.length})`}

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`transition-transform duration-300 ${
                      showAll
                        ? 'rotate-180'
                        : 'group-hover:translate-y-0.5'
                    }`}
                    aria-hidden="true"
                  >
                    <path
                      d="M8 3v10m-4-4 4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          ref={modalRef}
          tabIndex={-1}
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() =>
              setActive(null)
            }
          />

          {/* Smaller certificate modal */}
          <div className="relative z-10 glass-panel rounded-xl max-w-sm w-full max-h-[72vh] overflow-hidden shadow-card-hover animate-scaleIn flex flex-col">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() =>
                setActive(null)
              }
              aria-label="Close certificate viewer"
              className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-md border border-gold/20 bg-bg/90 text-muted shadow-lg hover:border-gold/60 hover:bg-bg hover:text-text transition-all duration-200"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="overflow-y-auto overscroll-contain touch-pan-y">
              <CertificateFace c={active} />

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 pr-8">
                  {active.title}
                </h3>

                <p className="text-sm text-gold mb-5 font-medium">
                  {active.issuer} ·{' '}
                  <span className="text-gold/70">
                    {active.issue_date}
                  </span>
                </p>

                <p className="text-sm text-muted leading-relaxed mb-5">
                  {active.description}
                </p>

                <div className="glass-panel rounded-lg p-4 mb-5 border border-gold/20">
                  {active.credential_id && (
                    <div className="mb-3">
                      <p className="text-xs text-muted mb-1">
                        Credential ID
                      </p>

                      <p className="text-xs font-mono text-text/70 break-all">
                        {active.credential_id}
                      </p>
                    </div>
                  )}

                  {active.category && (
                    <div>
                      <p className="text-xs text-muted mb-2">
                        Category
                      </p>

                      <span className="inline-block px-3 py-1.5 rounded-full text-xs uppercase tracking-widest bg-gold/10 text-gold">
                        {active.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {active.credential_url && (
                    <a
                      href={active.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center px-4 py-2.5 rounded-lg border border-gold/40 text-gold hover:bg-gold/10 transition-all duration-200 text-sm font-medium"
                    >
                      Verify ↗
                    </a>
                  )}

                  {active.file_url && (
                    <a
                      href={active.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-text transition-all duration-200 text-sm font-medium"
                    >
                      View Certificate ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}