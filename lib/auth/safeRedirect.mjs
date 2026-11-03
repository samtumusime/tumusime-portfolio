const LOCAL_ORIGIN = 'https://portfolio.invalid';

function parseSafeLocalPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null;
  if (value.includes('\\') || /[\u0000-\u001f\u007f]/.test(value)) return null;

  try {
    const url = new URL(value, LOCAL_ORIGIN);
    if (url.origin !== LOCAL_ORIGIN) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function safeAdminRedirect(value) {
  const path = parseSafeLocalPath(value);
  if (!path) return '/admin';
  const pathname = new URL(path, LOCAL_ORIGIN).pathname;
  return pathname === '/admin' || pathname.startsWith('/admin/') ? path : '/admin';
}

export function safeRecoveryRedirect(value) {
  return value === '/update-password' ? value : '/update-password';
}
