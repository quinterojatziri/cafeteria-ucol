# CaféUCol

## Descripción general

CaféUCol es una aplicación web progresiva para la cafetería de la Universidad de Colima. Permite a los estudiantes revisar el menú, hacer su pedido con personalizaciones, elegir el horario en que lo van a recoger y acumular puntos XP con cada compra. La idea es que el estudiante llegue a la cafetería y su comida ya esté lista, sin esperar en fila.

## Materia, profesor e integrantes

Materia: Desarrollo y Evaluación de Interfaces de Usuario

Profesor: Pedro César Santana Mancilla

Integrantes:
- Johnston Navarro Karol Daniela
- Muñoz Rosales Mayte
- Pérez González Nereyda Celestina
- Quintero Silva Jatziri Montserrat
- Sainz Urzua Keiry Yamilet

## Tecnologías y versiones

- React 19.2.6
- Vite 8.0.12
- Tailwind CSS 3.4.19
- Framer Motion 12.40.0
- Zustand 5.0.13
- Dexie (IndexedDB) 4.4.2
- Lucide React 1.16.0
- Node.js 20.x

## Instalación y ejecución

Clona el repositorio e instala las dependencias:


git clone https://github.com/quinterojatziri/cafeteria-ucol.git

cd app-cafeteria-ucol

npm install

npm run dev

Para el build de producción:

npm run build

El deploy a GitHub Pages se hace automáticamente al hacer push a `main` gracias al workflow incluido en `.github/workflows/deploy.yml`.

## Prototipo funcional

https://quinterojatziri.github.io/cafeteria-ucol/

Para agregarlo a la pantalla de inicio en Android, abre la URL en Chrome, toca el menú de tres puntos y selecciona "Agregar a pantalla de inicio". En iPhone, ábrela en Safari, toca el botón de compartir y elige "Agregar a pantalla de inicio".

## Funcionalidades implementadas

- Inicio de sesión y registro de usuarios
- Menú con búsqueda y filtros por categoría
- Personalización de productos con opciones predefinidas y nota escrita
- Carrito con pantalla de revisión antes de confirmar el pedido
- Selección de horario de recogida
- Sistema de puntos XP, niveles e insignias
- Historial de pedidos con opción de repetir
- Modificación de un pedido ya realizado
- Panel de accesibilidad con lector de pantalla, alto contraste, modo oscuro, texto grande, fuente para dislexia y vibración háptica
- PWA instalable con manifest y service worker

## Declaración de uso de inteligencia artificial

Se utilizó inteligencia artificial (Claude) únicamente como apoyo para generar una base inicial de la aplicación. Para ello, previamente se proporcionó un stack tecnológico definido, incluyendo dependencias, librerías, arquitectura del proyecto, requerimientos técnicos y aspectos de accesibilidad que se deseaban implementar. Posteriormente, el equipo realizó múltiples modificaciones, agregó nuevas funcionalidades y corrigió diversos errores para adaptar y completar el desarrollo final de la aplicación.

