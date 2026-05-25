// Opciones de personalización por producto
// Cada entry puede tener múltiples grupos de opciones
export const CUSTOMIZATIONS = {
  // ── DESAYUNO ────────────────────────────────────────────────
  desayuno_huevo: [
    { group: 'Modificaciones', options: ['Sin frijoles', 'Sin cebolla', 'Sin chile', 'Sin jamón'] },
    { group: 'Extras', options: ['Extra huevo', 'Extra tocino', 'Extra salsa'] },
    { group: 'Bebida', options: ['Café grande'] },
  ],
  hotcakes: [
    { group: 'Modificaciones', options: ['Sin mantequilla', 'Sin miel'] },
    { group: 'Extras', options: ['Extra miel', 'Extra fruta', 'Extra mantequilla'] },
  ],
  molletes: [
    { group: 'Modificaciones', options: ['Sin frijoles', 'Sin mantequilla'] },
    { group: 'Extras', options: ['Extra queso', 'Extra mantequilla'] },
    { group: 'Pan', options: ['Pan tostado'] },
  ],
  chilaquiles: [
    { group: 'Modificaciones', options: ['Sin cebolla', 'Sin crema', 'Sin pollo'] },
    { group: 'Extras', options: ['Extra crema', 'Extra pollo', 'Extra queso'] },
    { group: 'Salsa', options: ['Salsa roja', 'Salsa verde'] },
  ],
  orden_huevos: [
    { group: 'Estilo', options: ['Revueltos', 'Estrellados', 'A la mexicana', 'Con jamón'] },
    { group: 'Modificaciones', options: ['Sin jamón', 'Sin cebolla'] },
    { group: 'Extras', options: ['Extra queso', 'Extra tocino'] },
    { group: 'Pan', options: ['Pan tostado'] },
  ],
  sincronizada: [
    { group: 'Modificaciones', options: ['Sin jamón', 'Sin cebolla'] },
    { group: 'Extras', options: ['Extra queso', 'Extra jamón'] },
  ],
  pachuco_sencillo: [
    { group: 'Modificaciones', options: ['Sin chile', 'Sin cebolla'] },
    { group: 'Extras', options: ['Extra aguacate', 'Extra salsa'] },
    { group: 'Pan', options: ['Pan tostado'] },
  ],
  pachuco_carne: [
    { group: 'Modificaciones', options: ['Sin chile', 'Sin cebolla'] },
    { group: 'Extras', options: ['Extra carne', 'Extra aguacate'] },
  ],

  // ── COMIDA ──────────────────────────────────────────────────
  guiso_agua: [
    { group: 'Modificaciones', options: ['Sin picante', 'Sin cebolla', 'Sin verdura'] },
    { group: 'Extras', options: ['Extra tortillas', 'Extra arroz'] },
    { group: 'Bebida', options: ['Agua grande'] },
  ],
  guiso_sin_agua: [
    { group: 'Modificaciones', options: ['Sin picante', 'Sin cebolla', 'Sin verdura'] },
    { group: 'Extras', options: ['Extra arroz', 'Extra tortillas'] },
  ],
  hamburguesa_papa: [
    { group: 'Modificaciones', options: ['Sin tomate', 'Sin cebolla', 'Sin mayonesa'] },
    { group: 'Extras', options: ['Extra queso', 'Extra carne'] },
  ],
  papas_queso: [
    { group: 'Extras', options: ['Extra queso', 'Extra catsup'] },
  ],
  hamburguesa_sencilla: [
    { group: 'Modificaciones', options: ['Sin cebolla', 'Sin salsa', 'Sin mayonesa'] },
    { group: 'Extras', options: ['Extra carne', 'Extra queso'] },
  ],
  hot_dog: [
    { group: 'Modificaciones', options: ['Sin mostaza', 'Sin cebolla'] },
    { group: 'Extras', options: ['Extra queso', 'Extra salsa'] },
  ],
  enfrijoladas: [
    { group: 'Modificaciones', options: ['Sin crema', 'Sin cebolla'] },
    { group: 'Extras', options: ['Extra queso', 'Extra pollo'] },
  ],
  ensalada_pollo: [
    { group: 'Modificaciones', options: ['Sin aderezo', 'Sin cebolla'] },
    { group: 'Extras', options: ['Extra pollo'] },
  ],

  // ── ANTOJITOS ───────────────────────────────────────────────
  enchiladas_suizas: [
    { group: 'Modificaciones', options: ['Sin cebolla', 'Sin crema'] },
    { group: 'Extras', options: ['Extra queso', 'Extra crema', 'Extra pollo'] },
  ],
  flautas_pollo: [
    { group: 'Modificaciones', options: ['Sin crema', 'Sin lechuga'] },
    { group: 'Extras', options: ['Extra pollo', 'Extra crema'] },
  ],
  sopitos: [
    { group: 'Modificaciones', options: ['Sin salsa', 'Sin crema'] },
    { group: 'Extras', options: ['Extra carne', 'Extra queso'] },
  ],
  burritos: [
    { group: 'Modificaciones', options: ['Sin frijoles', 'Sin chile'] },
    { group: 'Extras', options: ['Extra queso', 'Extra carne'] },
  ],
  taquitos_adobada: [
    { group: 'Modificaciones', options: ['Sin cebolla'] },
    { group: 'Extras', options: ['Extra salsa', 'Limón extra'] },
  ],
  tacos_tuxpeños: [
    { group: 'Modificaciones', options: ['Sin chile', 'Sin crema'] },
    { group: 'Extras', options: ['Extra carne'] },
  ],

  // ── BEBIDAS ─────────────────────────────────────────────────
  agua_sabor: [
    { group: 'Modificaciones', options: ['Sin azúcar'] },
    { group: 'Extras', options: ['Extra hielo'] },
    { group: 'Tamaño', options: ['Tamaño grande'] },
  ],
  jugo_naranja: [
    { group: 'Modificaciones', options: ['Sin azúcar'] },
    { group: 'Extras', options: ['Extra hielo'] },
    { group: 'Tamaño', options: ['Tamaño grande'] },
  ],
  jugo_verde: [
    { group: 'Modificaciones', options: ['Sin azúcar', 'Poco hielo'] },
    { group: 'Extras', options: ['Extra fruta'] },
  ],
  licuado_frutas: [
    { group: 'Modificaciones', options: ['Sin azúcar', 'Leche deslactosada'] },
    { group: 'Extras', options: ['Extra fruta'] },
  ],
  chocomilk: [
    { group: 'Modificaciones', options: ['Sin azúcar'] },
    { group: 'Extras', options: ['Extra chocolate', 'Extra hielo'] },
  ],
  vaso_leche: [
    { group: 'Variantes', options: ['Leche deslactosada', 'Con chocolate'] },
    { group: 'Extras', options: ['Extra hielo'] },
  ],
  cafe: [
    { group: 'Modificaciones', options: ['Sin azúcar', 'Sin leche'] },
    { group: 'Extras', options: ['Extra azúcar', 'Extra leche'] },
    { group: 'Tamaño', options: ['Tamaño grande'] },
  ],
  te: [
    { group: 'Modificaciones', options: ['Sin azúcar'] },
    { group: 'Extras', options: ['Extra hielo'] },
    { group: 'Tamaño', options: ['Tamaño grande'] },
  ],

  // ── POSTRES Y SNACKS ────────────────────────────────────────
  crepas: [
    { group: 'Modificaciones', options: ['Sin plátano'] },
    { group: 'Extras', options: ['Extra chocolate', 'Extra fruta'] },
  ],
  gelatina: [
    { group: 'Modificaciones', options: [] },
    { group: 'Extras', options: ['Extra crema', 'Con fruta'] },
    { group: 'Tamaño', options: ['Tamaño grande'] },
  ],
  fruta: [
    { group: 'Modificaciones', options: ['Sin chile'] },
    { group: 'Extras', options: ['Extra granola', 'Con yogurt'] },
  ],
  papas_francesa: [
    { group: 'Modificaciones', options: ['Sin sal'] },
    { group: 'Extras', options: ['Extra catsup', 'Con queso'] },
  ],

  // ── TORTAS Y SANDWICHES ─────────────────────────────────────
  torta_lomo: [
    { group: 'Modificaciones', options: ['Sin cebolla', 'Sin mayonesa'] },
    { group: 'Extras', options: ['Extra carne', 'Extra aguacate'] },
  ],
  torta_hawaiiana: [
    { group: 'Modificaciones', options: ['Sin piña', 'Sin mayonesa'] },
    { group: 'Extras', options: ['Extra queso'] },
  ],
  torta_cubana: [
    { group: 'Modificaciones', options: ['Sin jalapeño', 'Sin tomate'] },
    { group: 'Extras', options: ['Extra carne'] },
  ],
  torta_panela: [
    { group: 'Modificaciones', options: ['Sin aguacate'] },
    { group: 'Extras', options: ['Extra queso'] },
    { group: 'Pan', options: ['Pan tostado'] },
  ],
  torta_jamon: [
    { group: 'Modificaciones', options: ['Sin mayonesa', 'Sin tomate'] },
    { group: 'Extras', options: ['Extra jamón'] },
  ],
  sandwich_lomo: [
    { group: 'Modificaciones', options: ['Sin cebolla'] },
    { group: 'Extras', options: ['Extra queso'] },
    { group: 'Pan', options: ['Pan integral'] },
  ],
  sandwich_pollo: [
    { group: 'Modificaciones', options: ['Sin mayonesa'] },
    { group: 'Extras', options: ['Extra pollo'] },
    { group: 'Pan', options: ['Pan tostado', 'Pan integral'] },
  ],
  sandwich_panela: [
    { group: 'Modificaciones', options: ['Sin jitomate'] },
    { group: 'Extras', options: ['Extra queso'] },
    { group: 'Pan', options: ['Pan integral'] },
  ],
  sandwich_jamon: [
    { group: 'Modificaciones', options: ['Sin mostaza'] },
    { group: 'Extras', options: ['Extra jamón'] },
    { group: 'Pan', options: ['Pan tostado'] },
  ],
};
