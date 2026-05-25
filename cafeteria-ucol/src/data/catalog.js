export const CATEGORIES = [
  { id: 'todos',                label: 'Todos' },
  { id: 'desayuno',             label: 'Desayuno' },
  { id: 'comida',               label: 'Comida' },
  { id: 'antojitos',            label: 'Antojitos' },
  { id: 'bebidas',              label: 'Bebidas' },
  { id: 'postres_snacks',       label: 'Postres y Snacks' },
  { id: 'tortas_sandwiches',    label: 'Tortas y sandwiches' },
];

export const PRODUCTS = [
  // Desayuno
  { id: 'desayuno_huevo',       name: 'Desayuno (huevo, frijoles, café)',    price: 45, cat: 'desayuno', xp: 12, tag: 'popular', desc: 'Huevo, frijoles y café. Desayuno completo.', image: '/images/products/products/desayuno.jpg', customizations: ['Sin cebolla', 'Sin chile', 'Extra salsa'] },
  { id: 'hotcakes',             name: 'Orden de hotcakes',                   price: 38, cat: 'desayuno', xp: 10, tag: null,      desc: 'Hotcakes esponjosos con topping a elección.', image: '/images/products/products/hotcakes.avif', customizations: ['Con miel', 'Con mermelada', 'Con fruta fresca'] },
  { id: 'molletes',             name: 'Molletes con mantequilla',            price: 32, cat: 'desayuno', xp: 8,  tag: null,      desc: 'Pan tostado con mantequilla derretida.', image: '/images/products/products/molletes.avif', customizations: ['Con queso', 'Con frijoles', 'Extra mantequilla'] },
  { id: 'chilaquiles',          name: 'Chilaquiles',                          price: 40, cat: 'desayuno', xp: 11, tag: null,      desc: 'Tortillas fritas con salsa y queso fresco.', image: '/images/products/products/chilaquiles.jpg', customizations: ['Salsa roja', 'Salsa verde', 'Con crema'] },
  { id: 'orden_huevos',         name: 'Orden de huevos',                      price: 28, cat: 'desayuno', xp: 7,  tag: null,      desc: 'Huevos al gusto con pan tostado.', image: '/images/products/products/orden-de-huevos.jpg', customizations: ['Revueltos', 'Estrellados', 'A la mexicana'] },
  { id: 'sincronizada',         name: 'Sincronizada',                         price: 35, cat: 'desayuno', xp: 9,  tag: null,      desc: 'Tortilla con queso y jamón, a la plancha.', image: '/images/products/products/sincronizada.webp', customizations: ['Extra queso', 'Sin jamón', 'Con tomate'] },
  { id: 'pachuco_sencillo',     name: 'Medio pachuco sencillo',               price: 30, cat: 'desayuno', xp: 8,  tag: null,      desc: 'Torta de huevo con frijoles.', image: '/images/products/products/pachuco_sencillo.jpeg', customizations: ['Sin cebolla', 'Sin chile', 'Extra salsa'] },
  { id: 'pachuco_carne',        name: 'Medio pachuco con carne',              price: 38, cat: 'desayuno', xp: 10, tag: null,      desc: 'Torta de huevo y carne asada.', image: '/images/products/products/mollete_con_carne.png', customizations: ['Sin cebolla', 'Sin chile', 'Extra salsa'] },

  // Comida
  { id: 'guiso_agua',           name: 'Guiso del día con agua',               price: 55, cat: 'comida', xp: 15, tag: null,      desc: 'Platillo del día con agua fresca.', image: '/images/products/products/guiso_con_agua.jpeg', customizations: ['Sin picante', 'Extra caldo', 'Sin verdura'] },
  { id: 'guiso_sin_agua',       name: 'Guiso del día sin agua',               price: 50, cat: 'comida', xp: 14, tag: null,      desc: 'Platillo del día sin bebida.', image: '/images/products/products/guiso_sin_agua.jpg', customizations: ['Sin picante', 'Extra caldo', 'Sin verdura'] },
  { id: 'hamburguesa_papa',     name: 'Hamburguesa con papa',                 price: 48, cat: 'comida', xp: 12, tag: null,      desc: 'Hamburguesa con papas a la francesa.', image: '/images/products/products/hamburguesa_con_papas.jpg', customizations: ['Sin cebolla', 'Sin mayonesa', 'Extra queso'] },
  { id: 'hamburguesa_sencilla', name: 'Hamburguesa sencilla',                 price: 42, cat: 'comida', xp: 11, tag: null,      desc: 'Hamburguesa clásica.', image: '/images/products/products/hamburguesa_sencilla.webp', customizations: ['Sin cebolla', 'Sin salsa', 'Extra ketchup'] },
  { id: 'hot_dog',              name: 'Hot dog',                               price: 28, cat: 'comida', xp: 7,  tag: null,      desc: 'Hot dog sencillo.', image: '/images/products/products/hot dog.jpg', customizations: ['Sin cebolla', 'Con mostaza', 'Extra papa'] },
  { id: 'enfrijoladas',         name: 'Enfrijoladas',                          price: 44, cat: 'comida', xp: 12, tag: null,      desc: 'Tortillas sumergidas en salsa de frijol.', image: '/images/products/products/enfrijoladas.jpg', customizations: ['Con crema', 'Extra queso', 'Sin cebolla'] },
  { id: 'ensalada_pollo',       name: 'Ensalada de pollo',                    price: 50, cat: 'comida', xp: 13, tag: null,      desc: 'Ensalada fresca con pollo asado.', image: '/images/products/products/ensalada_de_pollo.webp', customizations: ['Sin cebolla', 'Aderezo aparte', 'Extra pollo'] },

  // Antojitos
  { id: 'enchiladas_suizas',    name: 'Enchiladas suizas',                    price: 48, cat: 'antojitos', xp: 12, tag: 'popular', desc: 'Enchiladas con salsa verde y queso.', image: '/images/products/products/enchiladas_suizas.jpg', customizations: ['Sin cebolla', 'Sin crema', 'Extra queso'] },
  { id: 'flautas_pollo',        name: 'Flautas de pollo',                     price: 42, cat: 'antojitos', xp: 11, tag: null,      desc: 'Flautas crujientes de pollo.', image: '/images/products/products/flautas_de_pollo.webp', customizations: ['Con guacamole', 'Con crema', 'Con salsa roja'] },
  { id: 'sopitos',              name: 'Sopitos',                               price: 38, cat: 'antojitos', xp: 10, tag: null,      desc: 'Tortillas fritas con toppings variados.', image: '/images/products/products/sopitos.jpg', customizations: ['Con carne', 'Con pollo', 'Con frijoles'] },
  { id: 'burritos',             name: 'Burritos',                              price: 45, cat: 'antojitos', xp: 12, tag: null,      desc: 'Burrito relleno a tu elección.', image: '/images/products/products/burritos.avif', customizations: ['Sin cebolla', 'Sin salsa', 'Extra guacamole'] },
  { id: 'taquitos_adobada',     name: 'Taquitos de adobada',                  price: 40, cat: 'antojitos', xp: 10, tag: null,      desc: 'Taquitos de carne adobada.', image: '/images/products/products/taquitos_de_adobada.webp', customizations: ['Sin cebolla', 'Con guacamole', 'Extra salsa'] },
  { id: 'tacos_tuxpeños',       name: 'Tacos tuxpeños',                        price: 42, cat: 'antojitos', xp: 11, tag: null,      desc: 'Tacos tradicionales tuxpeños.', image: '/images/products/products/tacos_tuxpenos.jpeg', customizations: ['Sin cebolla', 'Extra limón', 'Sin salsa'] },

  // Bebidas
  { id: 'agua_sabor',           name: 'Agua de sabor',                        price: 18, cat: 'bebidas', xp: 4,  tag: null,      desc: 'Agua de sabor casera, fresca.', image: '/images/products/products/agua_de_sabor.jpg' },
  { id: 'jugo_naranja',         name: 'Jugo natural de naranja',              price: 22, cat: 'bebidas', xp: 5,  tag: null,      desc: 'Naranja natural recién exprimida.', image: '/images/products/products/jugo_de_naranja.jpg' },
  { id: 'jugo_verde',           name: 'Jugo verde',                            price: 25, cat: 'bebidas', xp: 6,  tag: 'nuevo',   desc: 'Jugo detox con verduras frescas.', image: '/images/products/products/jugo_verde.jpg' },
  { id: 'licuado_frutas',       name: 'Licuado de frutas',                    price: 26, cat: 'bebidas', xp: 6,  tag: null,      desc: 'Licuado de frutas frescas de temporada.', image: '/images/products/products/licuado_de_frutas.jpg' },
  { id: 'chocomilk',            name: 'Chocomilk',                             price: 24, cat: 'bebidas', xp: 5,  tag: null,      desc: 'Leche con chocolate cremosa.', image: '/images/products/products/chocomilk.jpg' },
  { id: 'vaso_leche',           name: 'Vaso de leche',                        price: 15, cat: 'bebidas', xp: 3,  tag: null,      desc: 'Vaso de leche fría.', image: '/images/products/products/vaso_de_leche.jpg' },
  { id: 'cafe',                 name: 'Café',                                  price: 20, cat: 'bebidas', xp: 5,  tag: null,      desc: 'Café de grano tostado localmente.', image: '/images/products/products/cafe.jpeg' },
  { id: 'te',                   name: 'Té',                                    price: 18, cat: 'bebidas', xp: 4,  tag: null,      desc: 'Té caliente variado.', image: '/images/products/products/te.jpeg' },

  // Postres y Snacks
  { id: 'crepas',               name: 'Crepas',                                price: 35, cat: 'postres_snacks', xp: 9,  tag: null,      desc: 'Crepas con relleno a tu gusto.', image: '/images/products/products/crepas.jpg' },
  { id: 'gelatina',             name: 'Gelatina',                              price: 16, cat: 'postres_snacks', xp: 3,  tag: null,      desc: 'Gelatina en varios sabores.', image: '/images/products/products/gelatina.jpeg' },
  { id: 'fruta',                name: 'Fruta',                                 price: 20, cat: 'postres_snacks', xp: 4,  tag: null,      desc: 'Frutas frescas de temporada.', image: '/images/products/products/fruta.jpg' },
  { id: 'papas_francesa',       name: 'Papas a la francesa',                   price: 25, cat: 'postres_snacks', xp: 5,  tag: null,      desc: 'Papas fritas crujientes.', image: '/images/products/products/papas_a_la_francesa.jpg' },

  // Tortas y sandwiches
  { id: 'torta_lomo',           name: 'Torta de lomo',                        price: 52, cat: 'tortas_sandwiches', xp: 14, tag: 'popular', desc: 'Torta de lomo jugoso.', image: '/images/products/products/torta_de_lomo.jpg', customizations: ['Sin cebolla', 'Sin mayo', 'Extra jalapeño'] },
  { id: 'torta_hawaiiana',      name: 'Torta hawaiiana',                      price: 50, cat: 'tortas_sandwiches', xp: 13, tag: null,      desc: 'Torta con piña y jamón.', image: '/images/products/products/torta-hawaiana.jpg', customizations: ['Sin cebolla', 'Sin mayo', 'Extra piña'] },
  { id: 'torta_cubana',         name: 'Torta cubana',                         price: 55, cat: 'tortas_sandwiches', xp: 14, tag: null,      desc: 'Torta cubana con múltiples ingredientes.', image: '/images/products/products/torta-cubana.webp', customizations: ['Sin cebolla', 'Sin mayo', 'Extra queso'] },
  { id: 'torta_panela',         name: 'Torta de panela',                      price: 48, cat: 'tortas_sandwiches', xp: 12, tag: null,      desc: 'Torta de queso panela.', image: '/images/products/products/torta_de_panela.jpeg', customizations: ['Sin cebolla', 'Con tomate', 'Con jalapeño'] },
  { id: 'torta_jamon',          name: 'Torta de jamón',                       price: 48, cat: 'tortas_sandwiches', xp: 12, tag: null,      desc: 'Torta de jamón fresco.', image: '/images/products/products/torta-de-jamon.jpg', customizations: ['Sin cebolla', 'Sin mayo', 'Extra queso'] },
  { id: 'sandwich_lomo',        name: 'Sandwich de lomo',                     price: 45, cat: 'tortas_sandwiches', xp: 11, tag: null,      desc: 'Sandwich de lomo asado.', image: '/images/products/products/sandwich_de_lomo.avif' },
  { id: 'sandwich_pollo',       name: 'Sandwich de pollo',                    price: 40, cat: 'tortas_sandwiches', xp: 10, tag: null,      desc: 'Sandwich de pollo a la plancha.', image: '/images/products/products/sandwich-de-pollo.jpg', customizations: ['Sin cebolla', 'Sin mayo', 'Extra salsa'] },
  { id: 'sandwich_panela',      name: 'Sandwich de panela',                   price: 38, cat: 'tortas_sandwiches', xp: 9,  tag: null,      desc: 'Sandwich de queso panela.', image: '/images/products/products/sandwich_de_panela.jpg', customizations: ['Sin cebolla', 'Con tomate', 'Con jalapeño'] },
  { id: 'sandwich_jamon',       name: 'Sandwich de jamón',                    price: 42, cat: 'tortas_sandwiches', xp: 10, tag: null,      desc: 'Sandwich de jamón y queso.', image: '/images/products/products/sandwich_de_jamon.jpg', customizations: ['Sin cebolla', 'Sin mayo', 'Con mostaza'] },
];

export const SLOTS = [
  { time: '8:00 AM',  level: 'low', xp: 20, msg: 'Baja afluencia · Atención rápida' },
  { time: '9:30 AM',  level: 'low', xp: 15, msg: 'Tranquilo · Recomendado' },
  { time: '11:00 AM', level: 'mid', xp: 8,  msg: 'Afluencia moderada' },
  { time: '12:00 PM', level: 'hi',  xp: 0,  msg: 'Horario saturado' },
  { time: '1:00 PM',  level: 'hi',  xp: 0,  msg: 'Pico del mediodía' },
  { time: '2:20 PM',  level: 'mid', xp: 8,  msg: 'Carga bajando gradualmente' },
  { time: '4:00 PM',  level: 'low', xp: 12, msg: 'Merienda tranquila' },
];

export const LEVELS = [
  { min: 0,    max: 200,  name: 'Novato del Café' },
  { min: 200,  max: 500,  name: 'Aprendiz Cafetero' },
  { min: 500,  max: 900,  name: 'Cafetero Casual' },
  { min: 900,  max: 1400, name: 'Cafetero Amateur' },
  { min: 1400, max: 2000, name: 'Cafetero Experto' },
  { min: 2000, max: 2800, name: 'Barista Aficionado' },
  { min: 2800, max: 3800, name: 'Maestro del Café' },
  { min: 3800, max: 9999, name: 'Leyenda del Café' },
];

export function getLevelInfo(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) idx = i;
  }
  return { level: idx + 1, ...LEVELS[idx] };
}

export const BADGES = [
  { id: 'b_frequent',  name: 'Cliente Frecuente',  desc: '10 pedidos realizados',          xp: 50,  cond: u => u.totalOrders >= 10 },
  { id: 'b_early',     name: 'Madrugador',          desc: 'Pide antes de las 10 AM',        xp: 60,  cond: () => false },
  { id: 'b_explorer',  name: 'Explorador del Menú', desc: 'Prueba 8 productos distintos',   xp: 40,  cond: u => (u.distinctProductIds || []).length >= 8 },
  { id: 'b_streak10',  name: 'Racha 10 días',       desc: '10 días consecutivos',           xp: 80,  cond: u => u.streak >= 10 },
  { id: 'b_vip',       name: 'Cliente VIP',         desc: '50 pedidos realizados',          xp: 200, cond: u => u.totalOrders >= 50 },
  { id: 'b_matcha',    name: 'Fan del Matcha',      desc: 'Pide Matcha 5 veces',            xp: 30,  cond: u => u.matchaCount >= 5 },
  { id: 'b_streak30',  name: 'Racha 30 días',       desc: '30 días consecutivos',           xp: 150, cond: u => u.streak >= 30 },
  { id: 'b_legend',    name: 'Leyenda del Café',    desc: 'Alcanza el Nivel 8',             xp: 500, cond: u => getLevelInfo(u.xp).level >= 8 },
];

export const CHALLENGES = [
  { id: 'c1', title: 'Madrugador Cafetero', desc: 'Pide antes de las 10 AM · 0/5 días', xp: 50 },
  { id: 'c2', title: 'Explorador del Menú', desc: 'Prueba 3 bebidas distintas esta semana', xp: 30 },
  { id: 'c3', title: 'Evita el Rush',       desc: 'Pide fuera del horario 12–2 PM',     xp: 20 },
];

// Calcula el progreso real según los datos del usuario
export function getChallengeProgress(user) {
  return {
    c1: Math.min(100, ((user.earlyOrders || 0) / 5) * 100),
    c2: Math.min(100, ((user.distinctProductIds?.length || 0) / 3) * 100),
    c3: Math.min(100, ((user.offPeakOrders || 0) / 3) * 100),
  };
}
