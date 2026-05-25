# Documentación de Accesibilidad — CaféUCol

## Introducción

CaféUCol incluye un panel de accesibilidad que permite adaptar la interfaz a distintas necesidades. Las preferencias se guardan localmente y se restauran cada vez que el usuario abre la app. El panel se abre con el botón flotante de accesibilidad en la esquina inferior derecha, o con el atajo de teclado Alt + A.

## Opciones del panel

### Visuales

Texto grande aumenta el tamaño de fuente base un 20% en toda la app.

Alto contraste reemplaza los colores con variantes de máximo contraste para mejorar la legibilidad.

Modo oscuro aplica fondo oscuro y texto claro para reducir el brillo de la pantalla.

Sin animaciones desactiva todas las transiciones y efectos de movimiento.

### Cognitivas

Fuente dislexia cambia la tipografía a una con mayor espaciado entre letras para facilitar la lectura.

Más espacio aumenta la separación entre elementos de la interfaz para reducir la densidad visual.

### Motoras

Botones grandes incrementa el área táctil de los controles para facilitar la interacción.

### Auditivas y lector de pantalla

Lector de pantalla activa el motor TTS que usa la Web Speech API del navegador para leer el contenido en español (es-MX).

Sonidos UI reproduce tonos de confirmación al agregar productos, confirmar pedidos y guardar favoritos.

Vibración háptica hace vibrar el dispositivo al confirmar acciones importantes.

## Lector de pantalla

El motor TTS usa `window.speechSynthesis`, disponible en Chrome, Safari, Edge y Firefox modernos. Cuando hay voces en español disponibles en el dispositivo, las usa de forma automática.

### Qué anuncia el lector

Cuando el usuario abre el menú de accesibilidad dice "Panel de accesibilidad".

Cuando activa o desactiva una opción dice el nombre de la opción y si quedó activada o desactivada.

Cuando abre un producto desde el menú lee el nombre, descripción, precio y XP.

Cuando selecciona o deselecciona una personalización dice qué opción cambió y la lista completa de personalizaciones activas en ese momento.

Cuando agrega un producto al carrito lee el nombre completo, todas las personalizaciones incluyendo la nota escrita, y el precio.

Cuando entra a la pantalla de revisión del pedido lee todos los productos con sus personalizaciones, el total y el horario de recogida seleccionado.

Cuando confirma el pedido dice "Pedido confirmado" seguido de la lista completa de productos y el total.

Cuando modifica un pedido y confirma los cambios lee el resumen completo del pedido actualizado con horario.

Cuando cambia la cantidad de un producto dice el nombre y la nueva cantidad, o avisa que fue eliminado del carrito.

## ARIA y semántica

Se incluye una región live invisible con `aria-live="polite"` que actualiza su contenido cada vez que se llama `announce()`, para que lectores de pantalla externos como VoiceOver o TalkBack también lo detecten.

Las pantallas principales tienen `role="main"`. El selector de horario usa `role="radiogroup"` con `role="radio"` y `aria-checked` en cada opción. Los toggles del panel usan `role="switch"` con `aria-checked`. Los campos de formulario tienen `aria-required`. Los mensajes de error usan `role="alert"` para anunciarse inmediatamente. Los chips de personalización tienen `aria-pressed` para comunicar su estado.

## Navegación por teclado

Todos los controles son alcanzables con Tab. El foco visible está marcado con un anillo naranja usando `focus-visible:ring-2`. El panel de accesibilidad se cierra al hacer clic fuera de él. El atajo Alt + A abre y cierra el panel desde cualquier pantalla.

## Áreas táctiles

El tamaño mínimo de los botones es de 44x44 px, siguiendo las recomendaciones de Apple HIG y WCAG 2.5.5. Con la opción de botones grandes activa los controles críticos aumentan a 52x52 px.

## Contraste

La paleta de colores base cumple con WCAG 2.1 nivel AA. Con la opción de alto contraste activa los fondos se vuelven negros o blancos y el texto alcanza una relación de contraste de 7:1 o superior.
