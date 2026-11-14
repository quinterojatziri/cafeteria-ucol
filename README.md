# Cafetería ucol
 
Aplicación web progresiva (PWA) para pedir comida en la cafetería de la Universidad de Colima y recogerla sin filas.
 
**Prototipo funcional:** https://quinterojatziri.github.io/cafeteria-ucol/
 
## Descripción general
 
CaféUCol es una aplicación web progresiva para la cafetería de la Universidad de Colima. Permite a los estudiantes revisar el menú, hacer su pedido con personalizaciones, elegir el horario en que lo van a recoger y acumular puntos XP con cada compra. La idea es que el estudiante llegue a la cafetería y su comida ya esté lista, sin esperar en fila.
 
## Materia, profesor e integrantes
 
**Materia:** Desarrollo y Evaluación de Interfaces de Usuario
 
**Profesor:** Pedro César Santana Mancilla
 
**Integrantes:**
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
 
Clona el repositorio, entra a la carpeta de la aplicación e instala las dependencias:
 
```bash
git clone https://github.com/quinterojatziri/cafeteria-ucol.git
cd cafeteria-ucol/cafeteria-ucol
npm install
npm run dev
```
 
Para el build de producción:
 
```bash
npm run build
```
 
Para ver una vista previa del build:
 
```bash
npm run preview
```
 
El deploy a GitHub Pages se hace automáticamente al hacer push a `main` gracias al workflow incluido en `.github/workflows/deploy.yml`.
 
## Instalar como app (PWA)
 
- **Android:** abre la URL en Chrome, toca el menú de tres puntos y selecciona "Agregar a pantalla de inicio".
- **iPhone:** ábrela en Safari, toca el botón de compartir y elige "Agregar a pantalla de inicio".
 
## Cuentas de prueba
 
| Correo | Contraseña | Descripción |
|---|---|---|
| `nuevo@ucol.mx` | `123456` | Usuario recién registrado, sin XP ni historial |
| `jatziri@ucol.mx` | `131989` | Usuario avanzado con nivel alto, racha, insignias e historial de pedidos |
 
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
- PWA instalable con manifest y service worker (funciona sin conexión)
 
## Accesibilidad
 
CaféUCol incluye un panel de accesibilidad para adaptar la interfaz a distintas necesidades. Las preferencias se guardan localmente en el dispositivo y se restauran cada vez que se abre la app.
 
**Cómo abrirlo:** con el botón flotante de accesibilidad en la esquina inferior derecha, o con el atajo de teclado **Alt + A** desde cualquier pantalla. Incluye un botón **Restablecer todo** para volver a la configuración original.
 
### Opciones del panel
 
| Categoría | Opción | Qué hace |
|---|---|---|
| Visual | Texto grande | Aumenta 20% el tamaño de fuente base en toda la app |
| Visual | Alto contraste | Usa colores de máximo contraste (relación 7:1 o superior) |
| Visual | Modo oscuro | Fondo oscuro y texto claro para reducir el brillo |
| Visual | Sin animaciones | Elimina transiciones y efectos de movimiento |
| Cognitivo | Fuente dislexia | Tipografía con mayor espaciado entre letras |
| Cognitivo | Más espacio | Aumenta la separación entre elementos para reducir la densidad visual |
| Motor | Botones grandes | Aumenta el área táctil de los controles (hasta 52x52 px) |
| Auditivo y lector | Lector de pantalla | Lee el contenido en voz alta, en español (es-MX) |
| Auditivo y lector | Sonidos UI | Tonos de confirmación al agregar productos, confirmar pedidos y guardar favoritos |
| Auditivo y lector | Vibración háptica | Hace vibrar el dispositivo al confirmar acciones importantes |
 
### Lector de pantalla (TTS)
 
Usa la Web Speech API del navegador (`window.speechSynthesis`) y selecciona automáticamente una voz en español si el dispositivo la tiene. Al activarlo aparecen los controles **Probar voz** y **Detener**.
 
El lector anuncia:
 
- La apertura del panel de accesibilidad y el estado (activado/desactivado) de cada opción que se cambia.
- Al abrir un producto: nombre, descripción, precio y XP.
- Al seleccionar o quitar una personalización: la opción que cambió y la lista completa de personalizaciones activas.
- Al agregar al carrito: nombre del producto, todas las personalizaciones (incluida la nota escrita) y precio.
- Al cambiar la cantidad de un producto: el nombre y la nueva cantidad, o aviso de que fue eliminado del carrito.
- En la pantalla de revisión: todos los productos con sus personalizaciones, el total y el horario de recogida.
- Al confirmar el pedido: "Pedido confirmado" seguido de la lista de productos y el total.
- Al modificar un pedido ya realizado: el resumen completo del pedido actualizado con su horario.
 
### ARIA y semántica
 
- Región `aria-live="polite"` invisible, para que lectores externos como VoiceOver o TalkBack también detecten los anuncios.
- `role="main"` en las pantallas principales.
- Selector de horario con `role="radiogroup"` y `role="radio"` con `aria-checked`.
- Toggles del panel con `role="switch"` y `aria-checked`.
- Campos de formulario con `aria-required` y mensajes de error con `role="alert"`.
- Chips de personalización con `aria-pressed`.
 
### Navegación por teclado
 
- Todos los controles son alcanzables con Tab.
- El foco visible se marca con un anillo naranja.
- Alt + A abre y cierra el panel; también se cierra al hacer clic fuera de él.
 
### Áreas táctiles y contraste
 
- Tamaño mínimo de botones de 44x44 px (Apple HIG y WCAG 2.5.5).
- Paleta base conforme a WCAG 2.1 nivel AA.
 
Más detalle en [`docs/documentacion-accesibilidad.md`](cafeteria-ucol/docs/documentacion-accesibilidad.md).
 
## Documentación
 
- [Documentación de accesibilidad](cafeteria-ucol/docs/documentacion-accesibilidad.md)
- [Documentación del código](cafeteria-ucol/docs/documentacion-codigo.md)
 
## Declaración de uso de inteligencia artificial
 
Se utilizó inteligencia artificial (Claude) únicamente como apoyo para generar una base inicial de la aplicación. Para ello, previamente se proporcionó un stack tecnológico definido, incluyendo dependencias, librerías, arquitectura del proyecto, requerimientos técnicos y aspectos de accesibilidad que se deseaban implementar. Posteriormente, el equipo realizó múltiples modificaciones, agregó nuevas funcionalidades y corrigió diversos errores para adaptar y completar el desarrollo final de la aplicación.
