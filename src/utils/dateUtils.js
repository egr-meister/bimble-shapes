// Small date helpers. Never crash on invalid or missing dates.

export function getNowIso() {
  try {
    return new Date().toISOString();
  } catch (e) {
    return '';
  }
}

export function formatDateTime(isoString) {
  if (!isoString || typeof isoString !== 'string') {
    return '';
  }
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) {
      return '';
    }
    const pad = (n) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (e) {
    return '';
  }
}
