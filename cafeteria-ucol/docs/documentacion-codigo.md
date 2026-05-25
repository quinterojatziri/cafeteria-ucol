# Documentación del Código — CaféUCol

## Estructura del proyecto

```
cafeteria-ucol/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── apple-touch-icon.png
│   └── images/products/
├── src/
│   ├── components/
│   │   ├── A11yPanel.jsx
│   │   ├── BottomNav.jsx
│   │   ├── ProductCard.jsx
│   │   └── ui.jsx
│   ├── data/
│   │   ├── catalog.js
│   │   └── customizations.js
│   ├── db/
│   │   └── index.js
│   ├── screens/
│   │   ├── CartScreen.jsx
│   │   ├── EditOrderScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── MenuScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   └── SecondaryScreens.jsx
│   ├── store/
│   │   └── index.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Arquitectura

La app es una SPA sin React Router. La navegación se maneja con un campo `screen` en el estado global de Zustand. `App.jsx` lee ese campo y renderiza la pantalla correspondiente. No hay URLs distintas por pantalla, todo vive en la misma raíz.

El flujo de datos es: el usuario interactúa con una pantalla, la pantalla llama una acción del store, el store actualiza el estado y lo persiste en IndexedDB con Dexie.

## store/index.js

Contiene todo el estado global de la app usando Zustand. Los datos principales son el carrito, el usuario, las preferencias de accesibilidad, los favoritos y el historial de pedidos. Las acciones más importantes son `addToCart`, `changeQty`, `confirmOrder`, `toggleFav`, `toggleA11y` y `load`. La función `load` lee IndexedDB al iniciar sesión y llena el store con los datos guardados.

## db/index.js

Configura la base de datos local con Dexie. Las tablas son `user`, `cart`, `orders`, `badges`, `favs`, `a11y` y `notifs`. Todo se guarda en el navegador del usuario, no hay backend ni servidor.

## components/A11yPanel.jsx

Exporta tres motores independientes además del componente visual del panel.

`tts` es una instancia de `TTSEngine` que usa la Web Speech API del navegador para leer texto en español. Se usa la función `announce(msg)` desde cualquier pantalla para que el lector diga algo en voz alta.

`sounds` es una instancia de `SoundEngine` que genera tonos con Web Audio API al agregar productos, confirmar pedidos o guardar favoritos.

`haptic(pattern)` llama a `navigator.vibrate()` para vibrar el dispositivo al confirmar acciones.

## screens/LoginScreen.jsx

Maneja inicio de sesión y registro. Tiene un arreglo `DEMO_USERS` con dos cuentas de prueba. Al iniciar sesión limpia la base de datos y carga los datos del usuario correspondiente, incluyendo su historial de pedidos y sus insignias.

## screens/MenuScreen.jsx

Muestra el catálogo filtrable por categoría y texto. Al tocar un producto abre un BottomSheet con su detalle, las opciones de personalización del producto y un campo de nota adicional. Al agregar al carrito el lector de pantalla anuncia el nombre del producto con todas sus personalizaciones.

## screens/CartScreen.jsx

Tiene dos vistas dentro del mismo componente. La primera es el carrito normal con los productos, controles de cantidad y selector de horario. La segunda es la pantalla de revisión que se muestra antes de confirmar, donde se ve un resumen completo con cada producto, sus personalizaciones, el horario y el total. Al entrar a la revisión el TTS lee todo el pedido en voz alta.

## screens/EditOrderScreen.jsx

Permite modificar un pedido ya realizado. Tiene un picker de productos con buscador y un modal de personalización rápida. Al confirmar los cambios el TTS lee el resumen completo del pedido modificado.

## screens/ProfileScreen.jsx

Muestra el perfil con nivel, barra de XP, racha de días, insignias e historial de pedidos. Desde el historial se puede repetir un pedido anterior.

## PWA

`manifest.json` configura la app para instalación. El campo `display: standalone` hace que abra sin la barra del navegador. `start_url` y `scope` apuntan a `/app-cafeteria-ucol/`.

`sw.js` es el service worker. Las imágenes usan estrategia cache-first. El resto de recursos usan network-first con fallback a caché para funcionar sin conexión.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción en `/dist`
- `npm run preview` — vista previa del build
