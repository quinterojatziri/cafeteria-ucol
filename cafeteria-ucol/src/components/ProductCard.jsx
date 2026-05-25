import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store';
import { CATEGORIES } from '../data/catalog';
import { announce, sounds } from './A11yPanel';

export function ProductCard({ product, onOpenModal }) {
  const { favs, addToCart, toggleFav } = useStore();
  const isFav = favs.has(product.id);

  return (
    <motion.div
      className={clsx(
        'relative bg-white rounded-[18px] p-3.5 cursor-pointer',
        'border-[1.5px] transition-colors duration-200',
        'shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]',
        isFav ? 'border-accent' : 'border-transparent'
      )}
      whileTap={{ scale: 0.965 }}
      transition={{ duration: 0.14 }}
      onClick={() => { onOpenModal(product); announce(`${product.name}, $${product.price}`); }}
      role="article"
      aria-label={`${product.name}, $${product.price}, +${product.xp} XP${isFav ? ', en favoritos' : ''}`}
    >
      {product.tag && (
        <span className={clsx(
          'absolute top-2.5 left-2.5 z-10 text-[9px] font-extrabold uppercase tracking-wider px-[7px] py-[2px] rounded-[5px]',
          product.tag === 'nuevo' ? 'bg-matcha text-white' : 'bg-accent text-white'
        )}>
          {product.tag}
        </span>
      )}

      <motion.button
        className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/95 border border-cream-border shadow-sm flex items-center justify-center transition-colors duration-200 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        whileTap={{ scale: 0.75 }}
        onClick={e => { e.stopPropagation(); toggleFav(product.id); sounds.play('favorite'); announce(isFav ? `${product.name} eliminado de favoritos` : `${product.name} guardado en favoritos`); }}
        aria-label={isFav ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
        aria-pressed={isFav}
      >
        <Heart size={14} strokeWidth={2}
          className={isFav ? 'fill-accent stroke-accent' : 'stroke-brown'} />
      </motion.button>

      {/* Thumbnail — ilustración rica por producto */}
      <div className="w-full h-[80px] rounded-[12px] overflow-hidden mb-3">
        <ProductIllustration id={product.id} src={product.image} />
      </div>

      <div className="text-[13px] font-bold text-brown leading-tight mb-[2px]">{product.name}</div>
      <div className="text-[12px] text-brown/90 font-medium leading-snug mb-2">{product.desc}</div>
      <div className="text-[11px] font-semibold text-brown/60 mb-2">
        {product.available === false ? 'Agotado' : 'Disponible'} · {CATEGORIES.find(c => c.id === product.cat)?.label || 'Otros'}
      </div>
      <div className="text-[12px] font-semibold text-brown/80">${product.price}</div>
      <div className="text-[10px] font-bold mt-[2px] text-accent">+{product.xp} XP</div>

      <motion.button
        className="product-add-btn absolute bottom-2.5 right-2.5 w-[28px] h-[28px] rounded-full bg-accent
          flex items-center justify-center shadow-[0_2px_8px_rgba(200,88,32,.35)]"
        whileTap={{ scale: 0.82 }}
        onClick={e => { e.stopPropagation(); addToCart(product); sounds.play('add'); announce(`${product.name} agregado`); }}
        aria-label={`Agregar ${product.name} al carrito`}
      >
        <Plus size={14} strokeWidth={2.5} className="text-white" />
      </motion.button>
    </motion.div>
  );
}

/* ─── Ilustraciones SVG detalladas por producto ──────────────
   Cada una muestra el producto real con colores, sombras y forma
   ──────────────────────────────────────────────────────────── */
export function ProductIllustration({ id, src, height = 80, alt }) {
  if (src) {
    const resolvedSrc = src.startsWith('http') ? src : `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
    return (
      <img src={resolvedSrc} alt={alt || id} style={{ width: '100%', height, objectFit: 'cover', display: 'block' }} />
    );
  }

  const illustrations = {
    // ── Café Latte ──────────────────────────────────────────
    latte: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Platillo */}
        <ellipse cx="60" cy="68" rx="34" ry="6" fill="#D4A870" opacity="0.5"/>
        {/* Taza cuerpo */}
        <path d="M34 38 Q32 62 38 66 Q60 72 82 66 Q88 62 86 38 Z" fill="#FDFAF5"/>
        <path d="M34 38 Q32 62 38 66 Q60 72 82 66 Q88 62 86 38 Z" fill="none" stroke="#C8A070" strokeWidth="1.2"/>
        {/* Asa */}
        <path d="M86 44 Q98 44 98 54 Q98 64 86 62" fill="none" stroke="#C8A070" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Leche latte */}
        <ellipse cx="60" cy="39" rx="24" ry="7" fill="#F0E0C0"/>
        {/* Arte latte — hoja */}
        <ellipse cx="60" cy="39" rx="10" ry="4.5" fill="#C8855A" opacity="0.85"/>
        <path d="M52 39 Q60 34 68 39" fill="none" stroke="#A05A30" strokeWidth="0.8" opacity="0.7"/>
        <path d="M54 41 Q60 36.5 66 41" fill="none" stroke="#A05A30" strokeWidth="0.8" opacity="0.6"/>
        <line x1="60" y1="35.5" x2="60" y2="43" stroke="#A05A30" strokeWidth="0.7" opacity="0.6"/>
        {/* Vapor */}
        <path d="M48 28 Q45 22 48 17" fill="none" stroke="#C8A070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M60 26 Q57 20 60 14" fill="none" stroke="#C8A070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M72 28 Q75 22 72 17" fill="none" stroke="#C8A070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),

    // ── Americano ───────────────────────────────────────────
    americano: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#EDE0CC"/>
        <ellipse cx="60" cy="68" rx="32" ry="5.5" fill="#B8865A" opacity="0.4"/>
        <path d="M36 36 Q34 62 40 66 Q60 71 80 66 Q86 62 84 36 Z" fill="#FAFAF8"/>
        <path d="M36 36 Q34 62 40 66 Q60 71 80 66 Q86 62 84 36 Z" fill="none" stroke="#C09060" strokeWidth="1.2"/>
        <path d="M84 42 Q96 42 96 52 Q96 62 84 60" fill="none" stroke="#C09060" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Café oscuro en la taza */}
        <ellipse cx="60" cy="37" rx="22" ry="6.5" fill="#5C3018"/>
        <ellipse cx="60" cy="37" rx="18" ry="4.5" fill="#7A4525" opacity="0.6"/>
        <ellipse cx="57" cy="36" rx="5" ry="2" fill="#A06040" opacity="0.4"/>
        {/* Vapor */}
        <path d="M50 27 Q47 21 50 16" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M60 25 Q57 19 60 13" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M70 27 Q73 21 70 16" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),

    // ── Cappuccino ──────────────────────────────────────────
    cappuccino: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F0E8D8"/>
        <ellipse cx="60" cy="68" rx="33" ry="5.5" fill="#C4956A" opacity="0.4"/>
        <path d="M35 37 Q33 62 39 66 Q60 72 81 66 Q87 62 85 37 Z" fill="#FDFAF6"/>
        <path d="M35 37 Q33 62 39 66 Q60 72 81 66 Q87 62 85 37 Z" fill="none" stroke="#C89A65" strokeWidth="1.2"/>
        <path d="M85 43 Q97 43 97 53 Q97 63 85 61" fill="none" stroke="#C89A65" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Espuma blanca */}
        <ellipse cx="60" cy="38" rx="23" ry="7" fill="#F8F0E8"/>
        {/* Canela en polvo */}
        <ellipse cx="60" cy="37" rx="12" ry="4" fill="#C87840" opacity="0.35"/>
        <ellipse cx="55" cy="36" rx="5" ry="2.5" fill="#D09050" opacity="0.25"/>
        <ellipse cx="66" cy="39" rx="4" ry="2" fill="#C07030" opacity="0.25"/>
        {/* Vapor */}
        <path d="M50 27 Q47 21 50 16" fill="none" stroke="#C0A070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M60 25 Q57 19 60 13" fill="none" stroke="#C0A070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M70 27 Q73 21 70 16" fill="none" stroke="#C0A070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),

    // ── Matcha Latte ────────────────────────────────────────
    matcha: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#E8F0DC"/>
        <ellipse cx="60" cy="68" rx="33" ry="5.5" fill="#8AAA60" opacity="0.35"/>
        <path d="M35 37 Q33 62 39 66 Q60 72 81 66 Q87 62 85 37 Z" fill="#FDFCFA"/>
        <path d="M35 37 Q33 62 39 66 Q60 72 81 66 Q87 62 85 37 Z" fill="none" stroke="#90B870" strokeWidth="1.2"/>
        <path d="M85 43 Q97 43 97 53 Q97 63 85 61" fill="none" stroke="#90B870" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Matcha verde */}
        <ellipse cx="60" cy="38" rx="23" ry="7" fill="#A8C878"/>
        <ellipse cx="60" cy="37.5" rx="18" ry="5" fill="#90B860" opacity="0.7"/>
        {/* Arte latte en verde */}
        <ellipse cx="60" cy="38" rx="9" ry="3.5" fill="#F8F5EE" opacity="0.8"/>
        <path d="M53 38 Q60 34 67 38" fill="none" stroke="#FAFAF5" strokeWidth="0.9" opacity="0.7"/>
        <path d="M55 40 Q60 36.5 65 40" fill="none" stroke="#FAFAF5" strokeWidth="0.9" opacity="0.6"/>
        <line x1="60" y1="35" x2="60" y2="42" stroke="#FAFAF5" strokeWidth="0.7" opacity="0.6"/>
        {/* Vapor */}
        <path d="M50 27 Q47 21 50 16" fill="none" stroke="#90B860" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M60 25 Q57 19 60 13" fill="none" stroke="#90B860" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M70 27 Q73 21 70 16" fill="none" stroke="#90B860" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),

    // ── Frappé Caramelo ─────────────────────────────────────
    frappe: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#E8F0F8"/>
        {/* Sombra vaso */}
        <ellipse cx="60" cy="70" rx="22" ry="4" fill="#A8C0D8" opacity="0.35"/>
        {/* Vaso */}
        <path d="M42 20 L38 66 Q60 72 82 66 L78 20 Z" fill="#EAF4FC"/>
        <path d="M42 20 L38 66 Q60 72 82 66 L78 20 Z" fill="none" stroke="#A8CCE8" strokeWidth="1.2"/>
        {/* Hielo y café */}
        <path d="M42 45 L38.5 66 Q60 71 81.5 66 L78 45 Z" fill="#B8D8F0" opacity="0.6"/>
        <path d="M42 52 L39 66 Q60 71 81 66 L78 52 Z" fill="#7BB0D8" opacity="0.5"/>
        {/* Crema batida arriba */}
        <path d="M40 22 Q45 14 52 18 Q58 12 66 17 Q73 11 80 20" fill="#F8F4EE" stroke="#E8DCC8" strokeWidth="0.8"/>
        <path d="M42 20 Q48 13 55 17 Q61 11 67 16 Q74 12 78 20" fill="#F5F0E8"/>
        {/* Caramelo */}
        <path d="M46 21 Q52 19 58 22 Q64 19 70 21 Q66 24 60 22 Q54 24 46 21 Z" fill="#D4901C" opacity="0.7"/>
        {/* Popote */}
        <rect x="68" y="8" width="3.5" height="46" rx="1.75" fill="#FF9AA2" opacity="0.85"/>
        {/* Hielos visibles */}
        <rect x="48" y="50" width="8" height="8" rx="2" fill="white" opacity="0.5" transform="rotate(-15 52 54)"/>
        <rect x="62" y="53" width="7" height="7" rx="2" fill="white" opacity="0.45" transform="rotate(10 65 56)"/>
      </svg>
    ),

    // ── Jugo de naranja ─────────────────────────────────────
    jugo: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF4E0"/>
        <ellipse cx="60" cy="70" rx="22" ry="4" fill="#F0A030" opacity="0.3"/>
        {/* Vaso */}
        <path d="M41 22 L38 66 Q60 72 82 66 L79 22 Z" fill="#FFF8EE"/>
        <path d="M41 22 L38 66 Q60 72 82 66 L79 22 Z" fill="none" stroke="#F0B060" strokeWidth="1.2"/>
        {/* Jugo naranja */}
        <path d="M41.5 30 L38.5 66 Q60 71 81.5 66 L78.5 30 Z" fill="#FF9820"/>
        <path d="M41.5 30 L38.5 66 Q60 71 81.5 66 L78.5 30 Z" fill="none" stroke="none"/>
        {/* Brillo */}
        <path d="M44 35 L43 58 Q48 62 52 60 L54 37 Z" fill="white" opacity="0.15"/>
        {/* Pulpa */}
        <ellipse cx="55" cy="48" rx="4" ry="2" fill="#FF7A00" opacity="0.3"/>
        <ellipse cx="67" cy="55" rx="3" ry="1.5" fill="#FF7A00" opacity="0.25"/>
        {/* Rodaja de naranja encima */}
        <circle cx="60" cy="25" r="10" fill="#FF9820" stroke="#F08010" strokeWidth="0.8"/>
        <circle cx="60" cy="25" r="7" fill="#FFB840" opacity="0.7"/>
        <line x1="60" y1="18" x2="60" y2="32" stroke="#FF7A00" strokeWidth="0.8" opacity="0.6"/>
        <line x1="53" y1="25" x2="67" y2="25" stroke="#FF7A00" strokeWidth="0.8" opacity="0.6"/>
        <line x1="55" y1="20" x2="65" y2="30" stroke="#FF7A00" strokeWidth="0.7" opacity="0.5"/>
        <line x1="65" y1="20" x2="55" y2="30" stroke="#FF7A00" strokeWidth="0.7" opacity="0.5"/>
        {/* Popote */}
        <rect x="70" y="10" width="3" height="46" rx="1.5" fill="#90D890" opacity="0.9"/>
      </svg>
    ),

    // ── Matcha Frío ─────────────────────────────────────────
    matchafrio: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#E4F0E0"/>
        <ellipse cx="60" cy="70" rx="21" ry="4" fill="#78A858" opacity="0.3"/>
        <path d="M42 22 L39 66 Q60 72 81 66 L78 22 Z" fill="#F0FAF0"/>
        <path d="M42 22 L39 66 Q60 72 81 66 L78 22 Z" fill="none" stroke="#90C870" strokeWidth="1.2"/>
        {/* Matcha verde sobre hielo */}
        <path d="M42 38 L39.5 66 Q60 71.5 80.5 66 L78 38 Z" fill="#78B848" opacity="0.75"/>
        <path d="M42 50 L40 66 Q60 71 80 66 L78 50 Z" fill="#90CC60" opacity="0.5"/>
        {/* Leche coco */}
        <path d="M42 22 Q60 30 78 22 L78 38 Q60 46 42 38 Z" fill="#F5F8F0" opacity="0.9"/>
        {/* Hielos */}
        <rect x="46" y="42" width="9" height="9" rx="2.5" fill="white" opacity="0.45" transform="rotate(-10 50 46)"/>
        <rect x="63" y="46" width="8" height="8" rx="2" fill="white" opacity="0.4" transform="rotate(8 67 50)"/>
        {/* Popote negro */}
        <rect x="50" y="8" width="3.5" height="48" rx="1.75" fill="#2C2C2C" opacity="0.8"/>
        <ellipse cx="51.75" cy="8" rx="3.5" ry="2" fill="#444" opacity="0.7"/>
      </svg>
    ),

    // ── Croissant ───────────────────────────────────────────
    croissant: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FBF3E4"/>
        {/* Sombra */}
        <ellipse cx="60" cy="64" rx="35" ry="6" fill="#C8A060" opacity="0.2"/>
        {/* Cuerpo croissant */}
        <path d="M20 52 Q28 28 50 30 Q60 28 70 30 Q92 28 100 52 Q88 60 72 54 Q60 58 48 54 Q32 60 20 52 Z"
          fill="#E8A840"/>
        {/* Capas hojaldre oscuras */}
        <path d="M24 50 Q32 32 50 33 Q60 31 70 33 Q88 32 96 50"
          fill="none" stroke="#C07820" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <path d="M28 51 Q36 35 50 36 Q60 34 70 36 Q84 35 92 51"
          fill="none" stroke="#C07820" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M32 52 Q40 38 50 39 Q60 37 70 39 Q80 38 88 52"
          fill="none" stroke="#C07820" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
        {/* Brillo dorado */}
        <path d="M35 40 Q45 32 58 33" fill="none" stroke="#F0C060" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
        {/* Puntas */}
        <path d="M20 52 Q16 44 22 38 Q26 36 30 42 Q32 50 20 52 Z" fill="#D49030"/>
        <path d="M100 52 Q104 44 98 38 Q94 36 90 42 Q88 50 100 52 Z" fill="#D49030"/>
        {/* Tono oscuro base */}
        <path d="M38 54 Q60 58 82 54 Q60 60 38 54 Z" fill="#B87020" opacity="0.4"/>
      </svg>
    ),

    // ── Galleta integral ────────────────────────────────────
    galleta: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Sombra */}
        <ellipse cx="60" cy="64" rx="26" ry="5" fill="#A87840" opacity="0.2"/>
        {/* Galleta base */}
        <circle cx="60" cy="42" r="26" fill="#C8884C"/>
        <circle cx="60" cy="42" r="24" fill="#D49A5C"/>
        {/* Textura avena */}
        <circle cx="60" cy="42" r="22" fill="#C8885A" opacity="0.4"/>
        {/* Chispas de avena */}
        <ellipse cx="50" cy="36" rx="3" ry="1.5" fill="#8B5A2B" opacity="0.6" transform="rotate(-20 50 36)"/>
        <ellipse cx="68" cy="34" rx="2.5" ry="1.2" fill="#8B5A2B" opacity="0.55" transform="rotate(15 68 34)"/>
        <ellipse cx="54" cy="48" rx="3" ry="1.4" fill="#8B5A2B" opacity="0.5" transform="rotate(30 54 48)"/>
        <ellipse cx="70" cy="47" rx="2.8" ry="1.3" fill="#8B5A2B" opacity="0.55" transform="rotate(-10 70 47)"/>
        <ellipse cx="44" cy="44" rx="2.5" ry="1.2" fill="#7A4A20" opacity="0.45" transform="rotate(25 44 44)"/>
        <ellipse cx="64" cy="41" rx="3" ry="1.3" fill="#7A4A20" opacity="0.4" transform="rotate(-5 64 41)"/>
        {/* Pasas */}
        <ellipse cx="56" cy="39" rx="3.5" ry="2.5" fill="#4A2810"/>
        <ellipse cx="67" cy="44" rx="3" ry="2.2" fill="#4A2810"/>
        <ellipse cx="48" cy="49" rx="2.8" ry="2" fill="#3E2008"/>
        <ellipse cx="71" cy="38" rx="2.5" ry="1.8" fill="#4A2810"/>
        {/* Brillo */}
        <path d="M42 32 Q52 26 64 30" fill="none" stroke="#F0B870" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
      </svg>
    ),

    // ── Pan integral ────────────────────────────────────────
    pan: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F0E8D4"/>
        {/* Sombra */}
        <ellipse cx="60" cy="66" rx="34" ry="5" fill="#A87840" opacity="0.2"/>
        {/* Base rebanada */}
        <rect x="22" y="42" width="76" height="20" rx="4" fill="#8B5E2C"/>
        {/* Cuerpo pan */}
        <path d="M22 46 Q22 24 60 22 Q98 24 98 46 L98 58 Q98 62 94 62 L26 62 Q22 62 22 58 Z"
          fill="#C8884C"/>
        {/* Corteza superior oscura */}
        <path d="M26 46 Q26 28 60 26 Q94 28 94 46" fill="none" stroke="#8B4A18" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        {/* Semillas */}
        <ellipse cx="45" cy="42" rx="2" ry="1" fill="#C8A060" transform="rotate(30 45 42)"/>
        <ellipse cx="55" cy="38" rx="2" ry="0.9" fill="#C8A060" transform="rotate(-20 55 38)"/>
        <ellipse cx="65" cy="40" rx="2" ry="1" fill="#C8A060" transform="rotate(15 65 40)"/>
        <ellipse cx="74" cy="44" rx="1.8" ry="0.9" fill="#C8A060" transform="rotate(-10 74 44)"/>
        <ellipse cx="48" cy="47" rx="2" ry="0.9" fill="#A07030" transform="rotate(25 48 47)"/>
        <ellipse cx="70" cy="38" rx="1.8" ry="0.8" fill="#A07030" transform="rotate(-5 70 38)"/>
        {/* Brillo */}
        <path d="M34 36 Q48 28 70 30" fill="none" stroke="#E8B870" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),

    // ── Copa de fruta ────────────────────────────────────────
    fruta: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF0F4"/>
        {/* Copa */}
        <path d="M38 18 L35 56 Q60 65 85 56 L82 18 Z" fill="#F8FCFE" stroke="#C8E0F0" strokeWidth="1"/>
        <path d="M48 68 Q60 72 72 68 L68 58 Q60 62 52 58 Z" fill="#D0E8F8"/>
        <rect x="55" y="66" width="10" height="6" rx="2" fill="#C8E0F8"/>
        <rect x="46" y="71" width="28" height="3" rx="1.5" fill="#C0D8F0"/>
        {/* Fresas */}
        <path d="M48 28 Q46 22 52 20 Q58 18 58 26 Q55 32 48 28 Z" fill="#FF5A5A"/>
        <path d="M48 28 Q46 22 52 20 Q58 18 58 26 Q55 32 48 28 Z" fill="none" stroke="#CC3030" strokeWidth="0.6"/>
        <circle cx="51" cy="24" r="1" fill="#CC2020" opacity="0.5"/>
        <circle cx="54" cy="22" r="0.8" fill="#CC2020" opacity="0.45"/>
        {/* Melón */}
        <path d="M60 30 Q58 22 66 20 Q74 20 74 28 Q72 34 64 34 Q58 34 60 30 Z" fill="#90D870"/>
        <path d="M63 22 Q68 20 72 24" fill="none" stroke="#60A840" strokeWidth="0.8" opacity="0.6"/>
        {/* Mango */}
        <path d="M70 44 Q68 36 76 34 Q84 34 82 44 Q80 50 75 50 Q68 50 70 44 Z" fill="#FFB820"/>
        <path d="M72 37 Q77 34 81 38" fill="none" stroke="#D89010" strokeWidth="0.8" opacity="0.6"/>
        {/* Arándanos */}
        <circle cx="46" cy="40" r="5" fill="#7060D8"/>
        <circle cx="45" cy="39" r="1.5" fill="white" opacity="0.3"/>
        <circle cx="56" cy="44" r="4.5" fill="#8070E0"/>
        <circle cx="55" cy="43" r="1.3" fill="white" opacity="0.3"/>
        {/* Kiwi rebanada */}
        <circle cx="66" cy="50" r="9" fill="#78B840"/>
        <circle cx="66" cy="50" r="7" fill="#90D058"/>
        <circle cx="66" cy="50" r="3" fill="#F0FCE0"/>
        <line x1="66" y1="43" x2="66" y2="57" stroke="#4A8020" strokeWidth="0.7" opacity="0.5"/>
        <line x1="59" y1="50" x2="73" y2="50" stroke="#4A8020" strokeWidth="0.7" opacity="0.5"/>
        <line x1="61" y1="45" x2="71" y2="55" stroke="#4A8020" strokeWidth="0.6" opacity="0.4"/>
        <line x1="71" y1="45" x2="61" y2="55" stroke="#4A8020" strokeWidth="0.6" opacity="0.4"/>
      </svg>
    ),

    // ── Combo Mañanero ──────────────────────────────────────
    combo1: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FBF3E4"/>
        {/* Taza pequeña izquierda */}
        <path d="M10 42 Q9 58 14 62 Q26 66 38 62 Q43 58 42 42 Z" fill="#FDFAF5"/>
        <path d="M10 42 Q9 58 14 62 Q26 66 38 62 Q43 58 42 42 Z" fill="none" stroke="#C8A070" strokeWidth="1"/>
        <path d="M42 46 Q50 46 50 53 Q50 60 42 58" fill="none" stroke="#C8A070" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="26" cy="43" rx="14" ry="4.5" fill="#C8704A"/>
        <ellipse cx="26" cy="42.5" rx="9" ry="2.5" fill="#E8905A" opacity="0.6"/>
        {/* Croissant derecha */}
        <path d="M60 52 Q65 38 74 40 Q78 39 82 40 Q91 38 96 52 Q89 56 82 52 Q78 54 74 52 Q67 56 60 52 Z" fill="#E8A840"/>
        <path d="M63 50 Q68 40 74 41 Q78 40 82 41 Q87 40 93 50" fill="none" stroke="#C07820" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M60 52 Q57 47 61 43 Q64 42 66 47 Z" fill="#D49030"/>
        <path d="M96 52 Q99 47 95 43 Q92 42 90 47 Z" fill="#D49030"/>
        {/* Jugo mini */}
        <path d="M14 16 L12 30 Q22 34 32 30 L30 16 Z" fill="#FFF8EE"/>
        <path d="M14 16 L12 30 Q22 34 32 30 L30 16 Z" fill="none" stroke="#F0B060" strokeWidth="0.8"/>
        <path d="M14.5 20 L12.5 30 Q22 33.5 31.5 30 L29.5 20 Z" fill="#FF9820" opacity="0.85"/>
        <circle cx="22" cy="17" r="5.5" fill="#FF9820" stroke="#F08010" strokeWidth="0.6"/>
        <circle cx="22" cy="17" r="3.5" fill="#FFB840" opacity="0.7"/>
        {/* Etiqueta combo */}
        <rect x="38" y="8" width="44" height="14" rx="7" fill="#C85820"/>
        <text x="60" y="18" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">COMBO</text>
      </svg>
    ),

    // ── Combo Matcha ────────────────────────────────────────
    combo2: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#E8F0DC"/>
        {/* Taza matcha */}
        <path d="M12 42 Q11 58 16 62 Q28 66 40 62 Q45 58 44 42 Z" fill="#FDFCFA"/>
        <path d="M12 42 Q11 58 16 62 Q28 66 40 62 Q45 58 44 42 Z" fill="none" stroke="#90B870" strokeWidth="1"/>
        <path d="M44 46 Q52 46 52 53 Q52 60 44 58" fill="none" stroke="#90B870" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="28" cy="43" rx="14" ry="4.5" fill="#90B848"/>
        <ellipse cx="26" cy="43" rx="8" ry="2.8" fill="#F8F5EE" opacity="0.8"/>
        {/* Pan integral */}
        <path d="M60 46 Q60 30 80 28 Q100 30 100 46 L100 58 Q100 62 96 62 L64 62 Q60 62 60 58 Z" fill="#C8884C"/>
        <path d="M64 46 Q64 33 80 31 Q96 33 96 46" fill="none" stroke="#8B4A18" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
        <ellipse cx="72" cy="46" rx="1.8" ry="0.9" fill="#C8A060" transform="rotate(30 72 46)"/>
        <ellipse cx="80" cy="42" rx="1.8" ry="0.9" fill="#C8A060" transform="rotate(-15 80 42)"/>
        <ellipse cx="88" cy="45" rx="1.8" ry="0.9" fill="#C8A060" transform="rotate(10 88 45)"/>
        {/* Etiqueta */}
        <rect x="38" y="10" width="44" height="14" rx="7" fill="#5A7840"/>
        <text x="60" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">COMBO</text>
      </svg>
    ),

    // ── Desayuno (huevo, frijoles, café) ─────────────────────
    desayuno_huevo: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="65" rx="40" ry="10" fill="#E8D4B8" stroke="#C4A070" strokeWidth="1.5"/>
        {/* Frijoles */}
        <ellipse cx="35" cy="55" rx="16" ry="12" fill="#4A2810"/>
        <ellipse cx="32" cy="52" rx="4" ry="3" fill="#6A4820"/>
        <ellipse cx="40" cy="54" rx="5" ry="3.5" fill="#6A4820"/>
        {/* Huevo frito */}
        <circle cx="65" cy="52" r="14" fill="#FFF8E0"/>
        <circle cx="68" cy="52" r="8" fill="#FFD700"/>
        {/* Pan tostado */}
        <rect x="42" y="62" width="18" height="12" rx="2" fill="#C8884C"/>
        <line x1="44" y1="62" x2="58" y2="74" stroke="#A86820" strokeWidth="0.8" opacity="0.5"/>
        <line x1="58" y1="62" x2="44" y2="74" stroke="#A86820" strokeWidth="0.8" opacity="0.5"/>
        {/* Taza café atrás */}
        <path d="M80 45 Q79 55 82 58 Q88 60 94 58 Q97 55 96 45 Z" fill="#F5DCC0" stroke="#B8905A" strokeWidth="0.8"/>
        <ellipse cx="88" cy="46" rx="10" ry="3" fill="#5C3018"/>
      </svg>
    ),

    // ── Hotcakes ────────────────────────────────────────────
    hotcakes: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FDFAF0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="38" ry="9" fill="#E8D0B8"/>
        {/* Hotcakes apilados */}
        <ellipse cx="60" cy="52" rx="18" ry="14" fill="#D4A04C"/>
        <ellipse cx="60" cy="51" rx="17" ry="13" fill="#E8B860"/>
        <ellipse cx="60" cy="40" rx="17" ry="13" fill="#D49840"/>
        <ellipse cx="60" cy="39" rx="16" ry="12" fill="#E8AC60"/>
        <ellipse cx="60" cy="30" rx="16" ry="12" fill="#D49840"/>
        <ellipse cx="60" cy="29" rx="15" ry="11" fill="#E8B860"/>
        {/* Mantequilla encima */}
        <ellipse cx="60" cy="22" rx="13" ry="8" fill="#F8D890"/>
        {/* Miel chorreando */}
        <path d="M52 25 Q50 35 48 45 Q50 48 52 46 Q54 36 56 26" fill="#C89010" opacity="0.8"/>
        <path d="M68 25 Q70 35 72 45 Q70 48 68 46 Q66 36 64 26" fill="#C89010" opacity="0.8"/>
        {/* Fresas */}
        <circle cx="50" cy="20" r="3" fill="#FF6B6B"/>
        <circle cx="70" cy="22" r="3" fill="#FF6B6B"/>
      </svg>
    ),

    // ── Molletes ────────────────────────────────────────────
    molletes: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="38" ry="9" fill="#E8D4B8"/>
        {/* Mollete izquierdo */}
        <rect x="20" y="40" width="28" height="18" rx="4" fill="#C8884C"/>
        <path d="M24 40 L44 40 Q44 48 32 52 Q20 48 24 40 Z" fill="#FFFFFF" opacity="0.9"/>
        {/* Mantequilla derretida */}
        <ellipse cx="32" cy="50" rx="12" ry="6" fill="#F0C880"/>
        {/* Mollete derecho */}
        <rect x="72" y="40" width="28" height="18" rx="4" fill="#C8884C"/>
        <path d="M76 40 L96 40 Q96 48 84 52 Q72 48 76 40 Z" fill="#FFFFFF" opacity="0.9"/>
        <ellipse cx="84" cy="50" rx="12" ry="6" fill="#F0C880"/>
      </svg>
    ),

    // ── Chilaquiles ─────────────────────────────────────────
    chilaquiles: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF0E0"/>
        {/* Plato hondo */}
        <ellipse cx="60" cy="60" rx="38" ry="12" fill="#E8D4B8"/>
        <path d="M22 60 Q60 40 98 60" fill="none" stroke="#D0B890" strokeWidth="2"/>
        {/* Tortillas fritas */}
        <polygon points="35,48 45,42 55,50" fill="#C88040" stroke="#A86020" strokeWidth="0.8"/>
        <polygon points="48,46 58,38 68,48" fill="#D89050"/>
        <polygon points="62,52 72,44 82,52" fill="#C88040"/>
        <polygon points="42,56 52,52 62,60" fill="#D89050"/>
        {/* Salsa roja */}
        <path d="M30 54 Q60 52 90 54" fill="none" stroke="#D84A3A" strokeWidth="3" opacity="0.7"/>
        {/* Queso fresco */}
        <circle cx="50" cy="52" r="3" fill="#FFFAFA"/>
        <circle cx="70" cy="50" r="3" fill="#FFFAFA"/>
        <circle cx="65" cy="58" r="2.5" fill="#FFFAFA"/>
      </svg>
    ),

    // ── Orden de huevos ──────────────────────────────────────
    orden_huevos: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="65" rx="38" ry="10" fill="#E8D4B8"/>
        {/* Huevo 1 (lado derecho) */}
        <circle cx="45" cy="48" r="14" fill="#FFF8E0"/>
        <circle cx="48" cy="48" r="8" fill="#FFD700"/>
        {/* Huevo 2 (lado izquierdo) */}
        <circle cx="75" cy="48" r="14" fill="#FFF8E0"/>
        <circle cx="72" cy="48" r="8" fill="#FFD700"/>
        {/* Pan tostado */}
        <rect x="32" y="58" width="16" height="10" rx="2" fill="#C8884C"/>
        <rect x="72" y="58" width="16" height="10" rx="2" fill="#C8884C"/>
      </svg>
    ),

    // ── Sincronizada ────────────────────────────────────────
    sincronizada: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF5E0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="38" ry="9" fill="#E8D4B8"/>
        {/* Tortilla superior */}
        <ellipse cx="60" cy="38" rx="26" ry="24" fill="#E8C080"/>
        {/* Relleno (queso + jamón) */}
        <ellipse cx="60" cy="45" rx="24" ry="14" fill="#F0D080"/>
        <ellipse cx="50" cy="45" rx="8" ry="10" fill="#D88040"/>
        <ellipse cx="70" cy="45" rx="8" ry="10" fill="#D88040"/>
        {/* Queso melted */}
        <ellipse cx="60" cy="42" rx="20" ry="10" fill="#FFE0A0" opacity="0.7"/>
        {/* Tortilla inferior */}
        <ellipse cx="60" cy="54" rx="25" ry="18" fill="#E8C080" opacity="0.85"/>
      </svg>
    ),

    // ── Pachuco Sencillo ────────────────────────────────────
    pachuco_sencillo: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="38" ry="9" fill="#E8D4B8"/>
        {/* Pan tostado */}
        <rect x="30" y="36" width="60" height="24" rx="6" fill="#C8884C"/>
        <path d="M34 36 L86 36 Q86 42 60 48 Q34 42 34 36 Z" fill="#E8A840" opacity="0.8"/>
        {/* Huevo */}
        <circle cx="50" cy="50" r="8" fill="#FFF8E0"/>
        <circle cx="52" cy="50" r="5" fill="#FFD700"/>
        {/* Frijoles */}
        <ellipse cx="70" cy="48" rx="9" ry="8" fill="#5A3A2A"/>
      </svg>
    ),

    // ── Pachuco con Carne ────────────────────────────────────
    pachuco_carne: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="38" ry="9" fill="#E8D4B8"/>
        {/* Pan tostado */}
        <rect x="28" y="36" width="64" height="24" rx="6" fill="#C8884C"/>
        <path d="M32 36 L88 36 Q88 42 60 48 Q32 42 32 36 Z" fill="#E8A840" opacity="0.8"/>
        {/* Carne asada */}
        <ellipse cx="42" cy="50" rx="10" ry="8" fill="#8B4513"/>
        <ellipse cx="60" cy="48" rx="9" ry="7" fill="#A0522D"/>
        {/* Cebolla */}
        <circle cx="76" cy="50" r="7" fill="#E8C480"/>
      </svg>
    ),

    // ── Guiso del día con agua ──────────────────────────────
    guiso_agua: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato hondo */}
        <ellipse cx="45" cy="55" rx="30" ry="15" fill="#E8D4B8"/>
        <path d="M15 55 Q45 35 75 55" fill="none" stroke="#D0B890" strokeWidth="1.5"/>
        {/* Caldo (pollo guisado) */}
        <path d="M20 50 Q45 45 70 50 Q45 60 20 55 Z" fill="#D8A060" opacity="0.8"/>
        <ellipse cx="35" cy="52" rx="8" ry="5" fill="#B8703A"/>
        <ellipse cx="55" cy="54" rx="7" ry="4" fill="#B8703A"/>
        {/* Vaso con agua */}
        <path d="M80 35 L78 60 Q88 65 98 60 L96 35 Z" fill="#E8F8FF" stroke="#A8CCE8" strokeWidth="1"/>
        <ellipse cx="88" cy="35" rx="8" ry="3" fill="#A8CCE8" opacity="0.3"/>
      </svg>
    ),

    // ── Hamburguesa con Papa ────────────────────────────────
    hamburguesa_papa: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF5E0"/>
        {/* Papas fritas */}
        <rect x="10" y="40" width="14" height="26" rx="2" fill="#D8A030"/>
        <rect x="28" y="38" width="12" height="28" rx="2" fill="#E8B040"/>
        <rect x="44" y="42" width="13" height="24" rx="2" fill="#D8A030"/>
        {/* Plato */}
        <ellipse cx="85" cy="66" rx="28" ry="8" fill="#E8D4B8"/>
        {/* Pan hamburguesa arriba */}
        <path d="M65 35 Q65 25 85 23 Q105 25 105 35 Z" fill="#D4A050" stroke="#A86820" strokeWidth="0.8"/>
        <path d="M68 33 Q72 27 85 25 Q98 27 102 33" fill="none" stroke="#A86820" strokeWidth="0.6" opacity="0.5"/>
        {/* Lechuga */}
        <ellipse cx="85" cy="40" rx="18" ry="5" fill="#7ABD3E" opacity="0.8"/>
        {/* Tomate */}
        <ellipse cx="85" cy="43" rx="15" ry="5" fill="#E85C4A" opacity="0.7"/>
        {/* Queso */}
        <ellipse cx="85" cy="46" rx="14" ry="5" fill="#FFD700" opacity="0.8"/>
        {/* Carne */}
        <ellipse cx="85" cy="50" rx="13" ry="6" fill="#8B4513"/>
        {/* Pan hamburguesa abajo */}
        <path d="M68 53 Q68 61 85 63 Q102 61 102 53 Z" fill="#C8944C"/>
      </svg>
    ),

    // ── Hot Dog ─────────────────────────────────────────────
    hot_dog: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF5E0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Pan */}
        <ellipse cx="60" cy="42" rx="22" ry="16" fill="#D4A050"/>
        <path d="M38 42 Q38 34 60 32 Q82 34 82 42" fill="none" stroke="#A86820" strokeWidth="1.2" opacity="0.5"/>
        {/* Salchicha */}
        <ellipse cx="60" cy="48" rx="14" ry="9" fill="#C85A3A"/>
        {/* Condimentos */}
        <path d="M42 48 Q48 46 56 48" fill="none" stroke="#FFB81C" strokeWidth="2" opacity="0.7"/>
        <path d="M56 50 Q64 50 72 48" fill="none" stroke="#D1302A" strokeWidth="2" opacity="0.6"/>
      </svg>
    ),

    // ── Enchiladas Suizas ──────────────────────────────────
    enchiladas_suizas: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF0E0"/>
        {/* Plato hondo */}
        <ellipse cx="60" cy="60" rx="36" ry="12" fill="#E8D4B8"/>
        {/* Enchilada 1 */}
        <ellipse cx="42" cy="50" rx="14" ry="18" fill="#E8C880"/>
        <path d="M30 45 Q42 38 54 45" fill="none" stroke="#B8703A" strokeWidth="1" opacity="0.6"/>
        {/* Enchilada 2 */}
        <ellipse cx="78" cy="50" rx="14" ry="18" fill="#E8C880"/>
        <path d="M66 45 Q78 38 90 45" fill="none" stroke="#B8703A" strokeWidth="1" opacity="0.6"/>
        {/* Salsa verde */}
        <path d="M28 50 Q60 48 92 50 Q60 56 28 54 Z" fill="#78C838" opacity="0.7"/>
        {/* Queso derretido */}
        <ellipse cx="42" cy="48" rx="12" ry="8" fill="#FFE0A0" opacity="0.8"/>
        <ellipse cx="78" cy="48" rx="12" ry="8" fill="#FFE0A0" opacity="0.8"/>
      </svg>
    ),

    // ── Flautas de Pollo ────────────────────────────────────
    flautas_pollo: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF5E0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Flauta 1 */}
        <rect x="28" y="42" width="10" height="20" rx="5" fill="#D8A030" transform="rotate(-25 33 52)"/>
        <path d="M30 42 Q35 38 40 42" fill="none" stroke="#A86820" strokeWidth="0.8" opacity="0.6"/>
        {/* Flauta 2 */}
        <rect x="54" y="40" width="10" height="20" rx="5" fill="#E8B040" transform="rotate(5 59 50)"/>
        {/* Flauta 3 */}
        <rect x="78" y="43" width="10" height="20" rx="5" fill="#D8A030" transform="rotate(25 83 53)"/>
        {/* Salsa crema */}
        <ellipse cx="40" cy="58" rx="8" ry="4" fill="#F0E0C0" opacity="0.8"/>
        <ellipse cx="80" cy="58" rx="8" ry="4" fill="#F0E0C0" opacity="0.8"/>
      </svg>
    ),

    // ── Agua de Sabor ────────────────────────────────────────
    agua_sabor: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F0F8E8"/>
        {/* Vaso */}
        <path d="M35 25 L32 62 Q60 70 88 62 L85 25 Z" fill="#F0FAFE" stroke="#A8D8B0" strokeWidth="1.2"/>
        {/* Agua con color (jamaica) */}
        <path d="M36 40 L33 62 Q60 69 87 62 L84 40 Z" fill="#D8334A" opacity="0.7"/>
        {/* Hielos */}
        <rect x="42" y="48" width="8" height="8" rx="1.5" fill="white" opacity="0.4"/>
        <rect x="70" y="50" width="7" height="7" rx="1.5" fill="white" opacity="0.35"/>
        {/* Popote */}
        <rect x="55" y="12" width="3" height="52" rx="1.5" fill="#D8334A" opacity="0.8"/>
        {/* Flor de Jamaica */}
        <circle cx="60" cy="20" r="5" fill="#D8334A" opacity="0.6"/>
      </svg>
    ),

    // ── Jugo Verde ───────────────────────────────────────────
    jugo_verde: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#E8F5E0"/>
        {/* Vaso */}
        <path d="M35 25 L32 62 Q60 70 88 62 L85 25 Z" fill="#F0FAFE" stroke="#78C848" strokeWidth="1.2"/>
        {/* Jugo verde */}
        <path d="M36 38 L33 62 Q60 69 87 62 L84 38 Z" fill="#5AC838" opacity="0.8"/>
        {/* Pulpa */}
        <ellipse cx="50" cy="50" rx="4" ry="2" fill="#3A8A18" opacity="0.4"/>
        <ellipse cx="70" cy="55" rx="3" ry="1.5" fill="#3A8A18" opacity="0.3"/>
        {/* Popote verde */}
        <rect x="55" y="10" width="3.5" height="54" rx="1.75" fill="#5AC838"/>
        {/* Hoja decorativa */}
        <ellipse cx="62" cy="15" rx="5" ry="3" fill="#78C848" transform="rotate(45 62 15)"/>
      </svg>
    ),

    // ── Chocomilk ────────────────────────────────────────────
    chocomilk: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F8ECD8"/>
        {/* Vaso */}
        <path d="M38 28 L35 62 Q60 70 85 62 L82 28 Z" fill="#FFFAFA" stroke="#C4A070" strokeWidth="1.2"/>
        {/* Leche chocolate */}
        <path d="M39 40 L36 62 Q60 68 84 62 L81 40 Z" fill="#A86A3A" opacity="0.85"/>
        {/* Crema encima */}
        <ellipse cx="60" cy="32" rx="20" ry="6" fill="#F8D890"/>
        {/* Polvo de chocolate */}
        <ellipse cx="60" cy="32" rx="18" ry="4" fill="#8B4513" opacity="0.4"/>
        {/* Popote rojo */}
        <rect x="52" y="8" width="3.5" height="56" rx="1.75" fill="#E85C4A"/>
      </svg>
    ),

    // ── Café ─────────────────────────────────────────────────
    cafe: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#EDE0CC"/>
        {/* Taza */}
        <path d="M36 36 Q34 62 40 66 Q60 71 80 66 Q86 62 84 36 Z" fill="#FAFAF8"/>
        <path d="M36 36 Q34 62 40 66 Q60 71 80 66 Q86 62 84 36 Z" fill="none" stroke="#C09060" strokeWidth="1.2"/>
        {/* Asa */}
        <path d="M84 42 Q96 42 96 52 Q96 62 84 60" fill="none" stroke="#C09060" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Café */}
        <ellipse cx="60" cy="37" rx="22" ry="6.5" fill="#4A2810"/>
        <ellipse cx="60" cy="37" rx="18" ry="4.5" fill="#6A3A1A" opacity="0.6"/>
        {/* Vapor */}
        <path d="M50 27 Q47 21 50 16" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M60 25 Q57 19 60 13" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M70 27 Q73 21 70 16" fill="none" stroke="#B08060" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),

    // ── Té ───────────────────────────────────────────────────
    te: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF8E8"/>
        {/* Taza */}
        <path d="M36 36 Q34 62 40 66 Q60 71 80 66 Q86 62 84 36 Z" fill="#FAFAF8"/>
        <path d="M36 36 Q34 62 40 66 Q60 71 80 66 Q86 62 84 36 Z" fill="none" stroke="#D4B080" strokeWidth="1.2"/>
        {/* Asa */}
        <path d="M84 42 Q96 42 96 52 Q96 62 84 60" fill="none" stroke="#D4B080" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Té */}
        <ellipse cx="60" cy="37" rx="22" ry="6.5" fill="#D4A86A"/>
        <ellipse cx="60" cy="37" rx="18" ry="4.5" fill="#E8B87A" opacity="0.6"/>
        {/* Bolsita de té */}
        <rect x="56" y="52" width="8" height="10" fill="#E8B87A" stroke="#B89050" strokeWidth="0.6"/>
        <line x1="60" y1="62" x2="60" y2="70" stroke="#B89050" strokeWidth="1"/>
        {/* Vapor */}
        <path d="M50 27 Q47 21 50 16" fill="none" stroke="#C4A070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M60 25 Q57 19 60 13" fill="none" stroke="#C4A070" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),

    // ── Crepas ──────────────────────────────────────────────
    crepas: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF0F4"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Crepas apiladas */}
        <ellipse cx="60" cy="50" rx="22" ry="18" fill="#E8B88A"/>
        <ellipse cx="60" cy="48" rx="20" ry="16" fill="#F0C090"/>
        {/* Crema batida */}
        <ellipse cx="60" cy="32" rx="20" ry="8" fill="#F8E8D8"/>
        {/* Fresas */}
        <circle cx="48" cy="36" r="4" fill="#FF5A7A"/>
        <circle cx="72" cy="34" r="4" fill="#FF5A7A"/>
        {/* Miel */}
        <path d="M52 48 Q56 56 54 62" fill="none" stroke="#C89010" strokeWidth="2.5" opacity="0.8"/>
      </svg>
    ),

    // ── Gelatina ────────────────────────────────────────────
    gelatina: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F8E0F0"/>
        {/* Vaso */}
        <path d="M38 25 L35 60 Q60 68 85 60 L82 25 Z" fill="#F5FAFE" stroke="#D4B0D0" strokeWidth="1.2"/>
        {/* Gelatina roja */}
        <path d="M39 38 L36.5 60 Q60 67 83.5 60 L81 38 Z" fill="#FF6B9D" opacity="0.8"/>
        {/* Brillo */}
        <ellipse cx="45" cy="45" rx="5" ry="3" fill="white" opacity="0.2"/>
        {/* Cuchara */}
        <path d="M50 62 L52 72 Q56 76 60 74 L58 62 Z" fill="#D4A070" stroke="#A87040" strokeWidth="0.8"/>
      </svg>
    ),

    // ── Papas a la Francesa ─────────────────────────────────
    papas_francesa: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF8E0"/>
        {/* Bolsa/Cono */}
        <path d="M30 20 L25 65 Q60 73 95 65 L90 20 Z" fill="#E8C080" stroke="#C8A070" strokeWidth="1"/>
        {/* Papas fritas */}
        <rect x="38" y="25" width="5" height="30" rx="2.5" fill="#D8A030"/>
        <rect x="48" y="22" width="5" height="32" rx="2.5" fill="#E8B040"/>
        <rect x="58" y="26" width="5" height="28" rx="2.5" fill="#D8A030"/>
        <rect x="68" y="24" width="5" height="30" rx="2.5" fill="#E8B040"/>
        <rect x="78" y="28" width="5" height="26" rx="2.5" fill="#D8A030"/>
        {/* Sal */}
        <circle cx="45" cy="32" r="1" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="65" cy="28" r="0.8" fill="#FFFFFF" opacity="0.5"/>
      </svg>
    ),

    // ── Torta de Lomo ───────────────────────────────────────
    torta_lomo: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Pan de torta */}
        <rect x="20" y="38" width="80" height="22" rx="8" fill="#C8884C"/>
        <path d="M24 38 L96 38 Q96 44 60 50 Q24 44 24 38 Z" fill="#E8A840" opacity="0.8"/>
        {/* Lomo */}
        <ellipse cx="60" cy="50" rx="28" ry="8" fill="#8B4513"/>
        <ellipse cx="55" cy="48" rx="10" ry="4" fill="#A0522D" opacity="0.8"/>
        {/* Cebolla */}
        <circle cx="42" cy="50" r="5" fill="#E8C480" opacity="0.7"/>
        <circle cx="78" cy="50" r="5" fill="#E8C480" opacity="0.7"/>
        {/* Aguacate */}
        <ellipse cx="60" cy="54" rx="8" ry="4" fill="#6AAA3D"/>
      </svg>
    ),

    // ── Torta Hawaiiana ─────────────────────────────────────
    torta_hawaiiana: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF0E0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Pan */}
        <rect x="20" y="38" width="80" height="22" rx="8" fill="#C8884C"/>
        <path d="M24 38 L96 38 Q96 44 60 50 Q24 44 24 38 Z" fill="#E8A840" opacity="0.8"/>
        {/* Jamón */}
        <ellipse cx="45" cy="50" rx="12" ry="7" fill="#D8703A"/>
        {/* Piña */}
        <circle cx="75" cy="48" r="7" fill="#FFD700"/>
        <path d="M72 45 L78 45 M72 48 L78 48 M72 51 L78 51" stroke="#F0A820" strokeWidth="0.8" opacity="0.7"/>
        {/* Queso derretido */}
        <ellipse cx="60" cy="54" rx="20" ry="5" fill="#FFE0A0" opacity="0.7"/>
      </svg>
    ),

    // ── Sandwich de Lomo ────────────────────────────────────
    sandwich_lomo: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="32" ry="8" fill="#E8D4B8"/>
        {/* Pan rebanadas */}
        <rect x="28" y="42" width="20" height="16" rx="4" fill="#C8884C"/>
        <rect x="52" y="42" width="20" height="16" rx="4" fill="#D49860"/>
        {/* Lomo */}
        <ellipse cx="40" cy="52" rx="8" ry="6" fill="#8B4513" transform="rotate(-15 40 52)"/>
        <ellipse cx="60" cy="52" rx="8" ry="6" fill="#8B4513" transform="rotate(15 60 52)"/>
        {/* Lechuga */}
        <ellipse cx="50" cy="52" rx="6" ry="5" fill="#7ABD3E" opacity="0.7"/>
        {/* Tomate */}
        <circle cx="45" cy="56" r="3" fill="#E85C4A" opacity="0.7"/>
      </svg>
    ),

    // ── Burritos ────────────────────────────────────────────
    burritos: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF5E0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Burrito 1 */}
        <ellipse cx="40" cy="50" rx="16" ry="14" fill="#E8C880" transform="rotate(-20 40 50)"/>
        <path d="M28 45 Q40 38 52 46" fill="none" stroke="#B8703A" strokeWidth="1" opacity="0.6"/>
        {/* Burrito 2 */}
        <ellipse cx="80" cy="50" rx="16" ry="14" fill="#D8B870" transform="rotate(20 80 50)"/>
        <path d="M68 46 Q80 38 92 45" fill="none" stroke="#B8703A" strokeWidth="1" opacity="0.6"/>
        {/* Relleno visible */}
        <ellipse cx="40" cy="52" rx="6" ry="8" fill="#D88040" opacity="0.7"/>
        <ellipse cx="80" cy="52" rx="6" ry="8" fill="#D88040" opacity="0.7"/>
      </svg>
    ),

    // ── Sopitos ─────────────────────────────────────────────
    sopitos: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF5E0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Sopito 1 */}
        <polygon points="35,38 45,32 48,50" fill="#D4A050"/>
        {/* Sopito 2 */}
        <polygon points="58,36 68,30 72,52" fill="#D4A050"/>
        {/* Sopito 3 */}
        <polygon points="78,40 88,35 90,52" fill="#D4A050"/>
        {/* Toppings - queso */}
        <circle cx="40" cy="42" r="2.5" fill="#FFFAFA"/>
        <circle cx="65" cy="44" r="2.5" fill="#FFFAFA"/>
        <circle cx="85" cy="46" r="2.5" fill="#FFFAFA"/>
        {/* Salsa roja */}
        <path d="M32 50 Q60 52 92 50" fill="none" stroke="#D84A3A" strokeWidth="2" opacity="0.7"/>
      </svg>
    ),

    // ── Taquitos de Adobada ──────────────────────────────────
    taquitos_adobada: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF8E0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Taquito 1 */}
        <rect x="28" y="42" width="8" height="18" rx="4" fill="#E8C880" transform="rotate(-25 32 51)"/>
        <ellipse cx="30" cy="50" rx="4" ry="6" fill="#8B4513" opacity="0.8"/>
        {/* Taquito 2 */}
        <rect x="52" y="40" width="8" height="18" rx="4" fill="#E8C880" transform="rotate(5 56 49)"/>
        <ellipse cx="56" cy="50" rx="4" ry="6" fill="#8B4513" opacity="0.8"/>
        {/* Taquito 3 */}
        <rect x="78" y="42" width="8" height="18" rx="4" fill="#E8C880" transform="rotate(25 82 51)"/>
        <ellipse cx="84" cy="50" rx="4" ry="6" fill="#8B4513" opacity="0.8"/>
        {/* Salsa */}
        <path d="M28 58 Q60 60 92 58" fill="none" stroke="#D84A3A" strokeWidth="2.5" opacity="0.7"/>
      </svg>
    ),

    // ── Tacos Tuxpeños ───────────────────────────────────────
    tacos_tuxpeños: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFF8E0"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Taco 1 */}
        <path d="M35 55 Q35 40 45 38 Q45 55 35 55 Z" fill="#E8C880"/>
        <ellipse cx="38" cy="48" rx="5" ry="7" fill="#8B4513"/>
        {/* Taco 2 */}
        <path d="M55 55 Q55 40 65 38 Q65 55 55 55 Z" fill="#E8C880"/>
        <ellipse cx="58" cy="48" rx="5" ry="7" fill="#8B4513"/>
        {/* Taco 3 */}
        <path d="M75 55 Q75 40 85 38 Q85 55 75 55 Z" fill="#E8C880"/>
        <ellipse cx="78" cy="48" rx="5" ry="7" fill="#8B4513"/>
        {/* Cebolla */}
        <circle cx="40" cy="52" r="2" fill="#E8C480" opacity="0.6"/>
        <circle cx="60" cy="52" r="2" fill="#E8C480" opacity="0.6"/>
      </svg>
    ),

    // ── Ensalada de Pollo ────────────────────────────────────
    ensalada_pollo: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F0FFF0"/>
        {/* Plato hondo */}
        <ellipse cx="60" cy="58" rx="38" ry="14" fill="#E8D4B8"/>
        <path d="M22 58 Q60 38 98 58" fill="none" stroke="#D0B890" strokeWidth="1.5"/>
        {/* Lechuga base */}
        <ellipse cx="50" cy="50" rx="12" ry="8" fill="#7ABD3E"/>
        <ellipse cx="70" cy="50" rx="12" ry="8" fill="#7ABD3E"/>
        {/* Pollo */}
        <ellipse cx="60" cy="48" rx="8" ry="6" fill="#D88040"/>
        {/* Tomate */}
        <circle cx="45" cy="52" r="4" fill="#E85C4A" opacity="0.8"/>
        <circle cx="75" cy="52" r="4" fill="#E85C4A" opacity="0.8"/>
        {/* Cebolla */}
        <circle cx="60" cy="56" r="3" fill="#E8C480" opacity="0.7"/>
      </svg>
    ),

    // ── Torta Cubana ────────────────────────────────────────
    torta_cubana: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Pan de torta grande */}
        <rect x="18" y="36" width="84" height="26" rx="10" fill="#C8884C"/>
        <path d="M22 36 L98 36 Q98 42 60 52 Q22 42 22 36 Z" fill="#E8A840" opacity="0.8"/>
        {/* Rellenos múltiples */}
        <ellipse cx="40" cy="50" rx="8" ry="6" fill="#D88040"/>
        <ellipse cx="60" cy="50" rx="8" ry="6" fill="#8B4513"/>
        <ellipse cx="80" cy="50" rx="8" ry="6" fill="#FFD700" opacity="0.8"/>
        {/* Aguacate */}
        <path d="M50 54 Q55 52 58 56" fill="none" stroke="#6AAA3D" strokeWidth="2" opacity="0.7"/>
      </svg>
    ),

    // ── Torta de Panela ─────────────────────────────────────
    torta_panela: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Pan */}
        <rect x="20" y="38" width="80" height="22" rx="8" fill="#C8884C"/>
        <path d="M24 38 L96 38 Q96 44 60 50 Q24 44 24 38 Z" fill="#E8A840" opacity="0.8"/>
        {/* Queso Panela */}
        <ellipse cx="60" cy="50" rx="26" ry="8" fill="#FFFAFA"/>
        <ellipse cx="60" cy="50" rx="24" ry="6" fill="#F5F0E8" opacity="0.7"/>
        {/* Tomate */}
        <circle cx="42" cy="50" r="3.5" fill="#E85C4A"/>
        {/* Lechuga */}
        <ellipse cx="78" cy="50" rx="5" ry="3" fill="#7ABD3E"/>
      </svg>
    ),

    // ── Torta de Jamón ───────────────────────────────────────
    torta_jamon: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="36" ry="9" fill="#E8D4B8"/>
        {/* Pan */}
        <rect x="20" y="38" width="80" height="22" rx="8" fill="#C8884C"/>
        <path d="M24 38 L96 38 Q96 44 60 50 Q24 44 24 38 Z" fill="#E8A840" opacity="0.8"/>
        {/* Jamón */}
        <ellipse cx="50" cy="50" rx="12" ry="7" fill="#D8703A"/>
        <ellipse cx="70" cy="50" rx="12" ry="7" fill="#D8703A" opacity="0.8"/>
        {/* Queso */}
        <ellipse cx="60" cy="53" rx="15" ry="4" fill="#FFE0A0" opacity="0.7"/>
      </svg>
    ),

    // ── Sandwich de Pollo ────────────────────────────────────
    sandwich_pollo: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="32" ry="8" fill="#E8D4B8"/>
        {/* Pan rebanadas */}
        <rect x="28" y="42" width="20" height="16" rx="4" fill="#C8884C"/>
        <rect x="52" y="42" width="20" height="16" rx="4" fill="#D49860"/>
        {/* Pollo */}
        <ellipse cx="40" cy="52" rx="8" ry="6" fill="#D88040" transform="rotate(-15 40 52)"/>
        <ellipse cx="60" cy="52" rx="8" ry="6" fill="#D88040" transform="rotate(15 60 52)"/>
        {/* Tomate */}
        <circle cx="50" cy="54" r="2.5" fill="#E85C4A"/>
      </svg>
    ),

    // ── Sandwich de Panela ───────────────────────────────────
    sandwich_panela: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="32" ry="8" fill="#E8D4B8"/>
        {/* Pan rebanadas */}
        <rect x="28" y="42" width="20" height="16" rx="4" fill="#C8884C"/>
        <rect x="52" y="42" width="20" height="16" rx="4" fill="#D49860"/>
        {/* Queso Panela */}
        <ellipse cx="50" cy="52" rx="8" ry="5" fill="#FFFAFA"/>
        {/* Lechuga */}
        <ellipse cx="55" cy="54" rx="5" ry="3" fill="#7ABD3E"/>
        {/* Tomate */}
        <circle cx="65" cy="52" r="3" fill="#E85C4A" opacity="0.7"/>
      </svg>
    ),

    // ── Sandwich de Jamón ────────────────────────────────────
    sandwich_jamon: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F5ECD8"/>
        {/* Plato */}
        <ellipse cx="60" cy="66" rx="32" ry="8" fill="#E8D4B8"/>
        {/* Pan rebanadas */}
        <rect x="28" y="42" width="20" height="16" rx="4" fill="#C8884C"/>
        <rect x="52" y="42" width="20" height="16" rx="4" fill="#D49860"/>
        {/* Jamón */}
        <ellipse cx="40" cy="52" rx="8" ry="5" fill="#D8703A"/>
        <ellipse cx="60" cy="52" rx="8" ry="5" fill="#D8703A" opacity="0.8"/>
        {/* Queso */}
        <ellipse cx="50" cy="55" rx="8" ry="3" fill="#FFE0A0" opacity="0.7"/>
      </svg>
    ),

    // ── Licuado de Frutas ────────────────────────────────────
    licuado_frutas: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FFE8F0"/>
        {/* Vaso */}
        <path d="M35 25 L32 62 Q60 70 88 62 L85 25 Z" fill="#F0FAFE" stroke="#D8B0C8" strokeWidth="1.2"/>
        {/* Licuado rosado */}
        <path d="M36 40 L33 62 Q60 69 87 62 L84 40 Z" fill="#E8A8C8" opacity="0.8"/>
        {/* Fruta visible */}
        <circle cx="50" cy="50" r="4" fill="#FFB8D8" opacity="0.7"/>
        <circle cx="70" cy="52" r="3.5" fill="#FFD8A8" opacity="0.7"/>
        {/* Popote */}
        <rect x="55" y="10" width="3.5" height="54" rx="1.75" fill="#E8A8C8"/>
        {/* Fresa decorativa */}
        <circle cx="60" cy="18" r="3.5" fill="#E8707A"/>
      </svg>
    ),

    // ── Vaso de Leche ────────────────────────────────────────
    vaso_leche: (
      <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#F8F0E0"/>
        {/* Vaso */}
        <path d="M38 25 L35 62 Q60 70 85 62 L82 25 Z" fill="#F0FAFE" stroke="#C8D8E8" strokeWidth="1.2"/>
        {/* Leche */}
        <path d="M39 35 L36.5 62 Q60 68 83.5 62 L81 35 Z" fill="#F5E8D8" opacity="0.9"/>
        {/* Superficie lechosa */}
        <ellipse cx="60" cy="35" rx="20" ry="4" fill="#FFFAF0" opacity="0.5"/>
      </svg>
    ),
  };

  const imageMap = {
    desayuno_huevo: 'desayuno.jpg',
    hotcakes: 'hotcakes.avif',
    molletes: 'molletes.avif',
    chilaquiles: 'chilaquiles.jpg',
    enchiladas_suizas: 'enchiladas_suizas.jpg',
    orden_huevos: 'orden-de-huevos.jpg',
    sincronizada: 'sincronizada.webp',
    pachuco_sencillo: 'pachuco_sencillo.jpeg',
    pachuco_carne: 'mollete_con_carne.png',
    guiso_agua: 'guiso_con_agua.jpeg',
    guiso_sin_agua: 'guiso_sin_agua.jpg',
    hamburguesa_papa: 'hamburguesa_con_papas.jpg',
    hamburguesa_sencilla: 'hamburguesa_sencilla.webp',
    hot_dog: 'hot dog.jpg',
    enfrijoladas: 'enfrijoladas.jpg',
    ensalada_pollo: 'ensalada_de_pollo.webp',
    flautas_pollo: 'flautas_de_pollo.webp',
    burritos: 'burritos.avif',
    taquitos_adobada: 'taquitos_de_adobada.webp',
    tacos_tuxpeños: 'tacos_tuxpenos.jpeg',
    sopitos: 'sopitos.jpg',
    agua_sabor: 'agua_de_sabor.jpg',
    jugo_naranja: 'jugo_de_naranja.jpg',
    jugo_verde: 'jugo_verde.jpg',
    licuado_frutas: 'licuado_de_frutas.jpg',
    chocomilk: 'chocomilk.jpg',
    vaso_leche: 'vaso_de_leche.jpg',
    cafe: 'cafe.jpeg',
    te: 'te.jpeg',
    crepas: 'crepas.jpg',
    gelatina: 'gelatina.jpeg',
    fruta: 'fruta.jpg',
    papas_francesa: 'papas_a_la_francesa.jpg',
    torta_lomo: 'torta_de_lomo.jpg',
    torta_hawaiiana: 'torta-hawaiana.jpg',
    torta_cubana: 'torta-cubana.webp',
    torta_panela: 'torta_de_panela.jpeg',
    torta_jamon: 'torta-de-jamon.jpg',
    sandwich_lomo: 'sandwich_de_lomo.avif',
    sandwich_pollo: 'sandwich-de-pollo.jpg',
    sandwich_panela: 'sandwich_de_panela.jpg',
    sandwich_jamon: 'sandwich_de_jamon.jpg',
  };

  const imageFile = src || imageMap[id];
  const imageUrl = imageFile ? `/images/products/${encodeURIComponent(imageFile)}` : null;

  if (imageUrl) {
    return (
      <div style={{ width: '100%', height }}>
        <img
          src={imageUrl}
          alt={id.replace(/[_-]/g, ' ')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px', display: 'block' }}
        />
      </div>
    );
  }

  const fallback = (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="80" fill="#F5ECD8"/>
      <path d="M36 37 Q34 62 40 66 Q60 72 80 66 Q86 62 84 37 Z" fill="#FDFAF5" stroke="#C8A070" strokeWidth="1.2"/>
      <path d="M84 43 Q96 43 96 53 Q96 63 84 61" fill="none" stroke="#C8A070" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="60" cy="38" rx="22" ry="6.5" fill="#C8704A"/>
    </svg>
  );

  return (
    <div style={{ width: '100%', height: height }}>
      {illustrations[id] || fallback}
    </div>
  );
}

// Export ProductThumb para compatibilidad con otras pantallas
export function ProductThumb({ id, size = 30, src, alt }) {
  if (src) {
    const resolvedSrc = src.startsWith('http') ? src : `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
    return (
      <img src={resolvedSrc} alt={alt || id} width={size} height={size}
        className="w-full h-full rounded-[10px] object-cover" />
    );
  }

  const b = { strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const s = { width: size, height: size };
  if (id?.includes('matcha') && !id.includes('frio')) {
    return <svg viewBox="0 0 24 24" fill="none" className="stroke-matcha" style={{ ...b, ...s }}>
      <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
    </svg>;
  }
  if (id?.includes('frio') || id?.includes('frappe') || id?.includes('jugo')) {
    return <svg viewBox="0 0 24 24" fill="none" style={{ ...b, ...s, stroke: '#A8845A' }}>
      <path d="M8 2h8l-1 7H9L8 2z"/><path d="M9 9s-1 2-1 5a4 4 0 008 0c0-3-1-5-1-5"/>
    </svg>;
  }
  if (id?.includes('combo')) {
    return <svg viewBox="0 0 24 24" fill="none" style={{ ...b, ...s, stroke: '#A8845A' }}>
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" style={{ ...b, ...s, stroke: '#A8845A' }}>
    <path d="M18 8h1a4 4 0 010 8h-1"/>
    <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>;
}
