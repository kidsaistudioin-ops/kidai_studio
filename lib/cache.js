const cache = new Map();

export function setCache(key, value, ttlMinutes = 5) {
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  cache.set(key, { value, expiresAt });
}

export function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
  }
  return cached.value;
}