// ===============================
// 🚌 EventBus basado en closures
// ===============================
const EventBus = (function () {
  const listeners = new Map();

  function validar(evento, callback) {
    if (typeof evento !== "string" || !evento.trim()) {
      throw new Error("El evento debe ser un string no vacío");
    }
    if (callback && typeof callback !== "function") {
      throw new Error("El callback debe ser función");
    }
  }

  return {
    on(evento, callback) {
      validar(evento, callback);
      if (!listeners.has(evento)) listeners.set(evento, new Set());
      listeners.get(evento).add(callback);

      return () => listeners.get(evento)?.delete(callback);
    },

    emit(evento, ...data) {
      validar(evento);
      if (!listeners.has(evento)) return;
      listeners.get(evento).forEach(cb => {
        try {
          cb(...data);
        } catch (err) {
          console.error(`Error en listener '${evento}':`, err);
        }
      });
    },

    debug() {
      const info = {};
      listeners.forEach((cbs, evt) => (info[evt] = cbs.size));
      return info;
    },

    clear() {
      listeners.clear();
    }
  };
})();


// ======================================
// 🧠 Cache con TTL + LRU o FIFO (closures)
// ======================================
const CacheFactory = (function (eventBus) {
  return function createCache({ capacity = 5, ttl = 5000, strategy = "LRU" }) {
    const store = new Map(); // key → { value, expiresAt }
    let hits = 0;
    let misses = 0;

    function isExpired(entry) {
      return Date.now() > entry.expiresAt;
    }

    function evict() {
      let keyToRemove;

      if (strategy === "FIFO") {
        keyToRemove = store.keys().next().value;
      } else if (strategy === "LRU") {
        keyToRemove = store.keys().next().value; // en Map, la clave más vieja
      }

      if (keyToRemove) {
        store.delete(keyToRemove);
        eventBus.emit("cache:evict", keyToRemove);
      }
    }

    function set(key, value) {
      if (store.size >= capacity && !store.has(key)) {
        evict();
      }

      store.set(key, {
        value,
        expiresAt: Date.now() + ttl
      });
    }

    function get(key) {
      const entry = store.get(key);

      if (!entry) {
        misses++;
        eventBus.emit("cache:miss", key);
        return null;
      }

      if (isExpired(entry)) {
        store.delete(key);
        misses++;
        eventBus.emit("cache:miss", key);
        return null;
      }

      hits++;

      // Estrategia LRU → mover al final
      if (strategy === "LRU") {
        const val = store.get(key);
        store.delete(key);
        store.set(key, val);
      }

      eventBus.emit("cache:hit", key, entry.value);
      return entry.value;
    }

    function stats() {
      return {
        size: store.size,
        hits,
        misses,
        keys: Array.from(store.keys())
      };
    }

    return { set, get, stats };
  };
})(EventBus);


// ================================
// 🔄 Demostración del sistema completo
// ================================
console.log("\n🎯 DEMOSTRACIÓN: CACHE + EVENTBUS + CLOSURES\n");

// Listeners de eventos del cache
EventBus.on("cache:hit", (key, value) => {
  console.log(`🟩 HIT → ${key}:`, value);
});

EventBus.on("cache:miss", (key) => {
  console.log(`🟥 MISS → ${key}`);
});

EventBus.on("cache:evict", (key) => {
  console.log(`⚠ EVICT → se removió '${key}' por estrategia`);
});

// Crear cache con configuración
const cache = CacheFactory({
  capacity: 3,
  ttl: 3000,
  strategy: "LRU" // FIFO / LRU
});

// Uso del cache
cache.set("a", 100);
cache.set("b", 200);
cache.set("c", 300);

setTimeout(() => {
  cache.get("a"); // HIT
  cache.get("x"); // MISS

  cache.set("d", 400); // Evict → LRU (clave más antigua)
  cache.get("b"); // podría ser MISS si fue expulsada

  console.log("\n📊 Estadísticas actuales:");
  console.log(cache.stats());
}, 1500);

setTimeout(() => {
  console.log("\n⏳ Probando TTL...");
  cache.get("a"); // podría expirar
  cache.get("c");
}, 3500);

setTimeout(() => {
  console.log("\n📊 Estadísticas finales:");
  console.log(cache.stats());
}, 5000);
