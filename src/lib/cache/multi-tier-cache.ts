/**
 * Multi-Tier LRU Response & AI Cache
 * Provides high-performance in-memory caching with TTL expiration
 * for vehicle search queries, AI discovery results, and recommendations.
 */

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttlMs: number;
}

export class LRUCache<T> {
  private capacity: number;
  private defaultTtlMs: number;
  private cache: Map<string, CacheEntry<T>>;

  constructor(capacity = 500, defaultTtlMs = 3600 * 1000) { // 1 hour default TTL
    this.capacity = capacity;
    this.defaultTtlMs = defaultTtlMs;
    this.cache = new Map();
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL expiration
    if (Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict oldest entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      key,
      value,
      timestamp: Date.now(),
      ttlMs: ttlMs || this.defaultTtlMs,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global Singleton Cache Instances
export const vehicleSearchCache = new LRUCache<any>(500, 3600 * 1000); // 1hr search cache
export const geminiDiscoveryCache = new LRUCache<any>(200, 86400 * 1000); // 24hr AI cache
export const recommendationCache = new LRUCache<any>(300, 1800 * 1000); // 30min recs cache
