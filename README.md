🧠 Sistema de Cache con Closures + TTL + LRU/FIFO + EventBus

Este proyecto implementa un sistema de cache en JavaScript usando closures, con soporte para:

✔ TTL (Time To Live)

✔ Invalidación automática

✔ Estrategias de eviction: LRU y FIFO

✔ Estadísticas de hit/miss

✔ Integración completa con un EventBus

✔ Emisión de eventos: cache:hit, cache:miss, cache:evict

Todo el proyecto usa Module Pattern y encapsulación real con closures.

🚀 Características principales
🔄 EventBus

Sistema de Pub/Sub ligero

Listeners auto-removibles

Uso de Map + Set

Mantenido completamente en memoria privada (closures)

🧠 Cache

TTL configurable

Eviction automático según:

LRU (Least Recently Used)

FIFO

Estadísticas:

hits

misses

claves activas

Emisión de eventos al EventBus

⚡ Integración

El Cache notifica al EventBus:

cache:hit

cache:miss

cache:evict

Ideal para sistemas distribuidos, dashboards o debugging avanzado.

📂 Estructura del proyecto
closures-scope/
  ├── event-system.js
  └── README.md

▶ Ejecutar el proyecto

Asegúrate de tener Node.js instalado.

node event-system.js


Verás en la consola:

hits

misses

evictions

expiraciones por TTL

estadísticas finales

📌 Objetivo educativo

Este ejercicio refuerza:

Closures avanzados

Encapsulación con Module Pattern

Memoria privada en funciones

Diseño de sistemas desacoplados

Eventos como mecanismo de comunicación

Patrones de cache usados en backend/infra real

📄 Licencia

Sin restricciones. Úsalo como base para tus prácticas o proyectos personales.

🤝 Contribuciones

Pull requests y mejoras siempre son bienvenidas.

⭐ Si te sirvió, dale una estrella al repo 😉
