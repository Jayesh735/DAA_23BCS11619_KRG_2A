/**
 * LRU (Least Recently Used) Cache Implementation
 * Uses Doubly Linked List + HashMap for O(1) operations
 * Caches autocomplete results for frequently used prefixes
 */

class LRUNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class LRUCache {
  constructor(capacity = 50) {
    this.capacity = capacity;
    this.cache = new Map(); // HashMap for O(1) access
    this.head = new LRUNode(null, null); // Dummy head
    this.tail = new LRUNode(null, null); // Dummy tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key (prefix)
   * @returns {any|null} - Cached value or null
   */
  get(key) {
    const node = this.cache.get(key);
    if (!node) {
      return null;
    }

    // Move to front (most recently used)
    this.moveToFront(node);
    return node.value;
  }

  /**
   * Put value into cache
   * @param {string} key - Cache key (prefix)
   * @param {any} value - Value to cache
   */
  put(key, value) {
    let node = this.cache.get(key);

    if (node) {
      // Update existing node
      node.value = value;
      this.moveToFront(node);
    } else {
      // Create new node
      if (this.cache.size >= this.capacity) {
        // Remove least recently used (tail)
        this.removeLRU();
      }

      node = new LRUNode(key, value);
      this.cache.set(key, node);
      this.addToFront(node);
    }
  }

  /**
   * Move node to front (most recently used)
   */
  moveToFront(node) {
    this.removeNode(node);
    this.addToFront(node);
  }

  /**
   * Add node to front
   */
  addToFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  /**
   * Remove node from list
   */
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  /**
   * Remove least recently used item
   */
  removeLRU() {
    const lru = this.tail.prev;
    if (lru !== this.head) {
      this.removeNode(lru);
      this.cache.delete(lru.key);
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }
}

