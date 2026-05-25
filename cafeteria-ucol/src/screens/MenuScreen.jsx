import { useState, useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { PRODUCTS, CATEGORIES } from '../data/catalog';
import { CUSTOMIZATIONS } from '../data/customizations';
import { ProductCard, ProductIllustration } from '../components/ProductCard';
import { Chip, BottomSheet, Button, EmptyState } from '../components/ui';
import { announce, sounds } from '../components/A11yPanel';

export function MenuScreen() {
  const { currentCat, setCat, navigate, favs, addToCart, toggleFav } = useStore();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const openModal = (product) => {
    setModal(product);
    // Announce full product details for screen reader
    announce(`${product.name}. ${product.desc}. Precio: $${product.price}. Gana ${product.xp} puntos XP.`);
  };
  const [selectedCustomization, setSelectedCustomization] = useState('');
  const [customNote, setCustomNote] = useState('');
  const catBarRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const initialXRef = useRef(0);
  const initialScrollRef = useRef(0);

  const handleCategoryPointerDown = event => {
    const el = catBarRef.current;
    if (!el) return;
    isPointerDownRef.current = true;
    initialXRef.current = event.type.includes('touch')
      ? event.touches[0].clientX
      : event.clientX;
    initialScrollRef.current = el.scrollLeft;
  };

  const handleCategoryPointerMove = event => {
    const el = catBarRef.current;
    if (!el || !isPointerDownRef.current) return;
    const clientX = event.type.includes('touch')
      ? event.touches[0].clientX
      : event.clientX;
    const delta = clientX - initialXRef.current;
    if (Math.abs(delta) > 8) {
      isDraggingRef.current = true;
    }
    if (isDraggingRef.current) {
      event.preventDefault();
      el.scrollLeft = initialScrollRef.current - delta;
    }
  };

  const handleCategoryPointerUp = () => {
    isPointerDownRef.current = false;
    isDraggingRef.current = false;
  };

  useEffect(() => {
    setSelectedCustomization('');
    setCustomNote('');
  }, [modal]);

  const filtered = PRODUCTS.filter(p => {
    const catOk = currentCat === 'todos' || p.cat === currentCat;
    const q = search.toLowerCase().trim();
    return catOk && (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  });

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      {/* Header */}
      <div className="bg-brown px-5 pt-[18px] pb-3 sticky top-0 z-50 shadow-[0_2px_12px_rgba(44,21,8,.18)]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[23px] font-extrabold text-white tracking-tight">Menú</h1>
          <button
            onClick={() => { navigate('favorites'); announce('Favoritos'); }}
            className="flex items-center gap-1.5 text-white text-[13px] font-semibold active:opacity-80 transition-opacity"
            aria-label="Ver productos favoritos"
          >
            <Heart size={16} strokeWidth={1.8} />
            Favoritos
          </button>
        </div>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          aria-label="Buscar productos"
          className="w-full bg-white/20 border border-white/30 rounded-[10px] px-3.5 py-2.5
            text-white placeholder-white/50 text-[14px] font-medium
            outline-none focus:border-white/50 focus:bg-white/25 font-nunito transition-colors"
        />
      </div>

      {/* Chips */}
      <div
        ref={catBarRef}
        className="flex gap-2 overflow-x-auto no-scroll px-4 pt-3 pb-0 cursor-grab active:cursor-grabbing"
        role="tablist"
        aria-label="Categorías"
        onMouseDown={handleCategoryPointerDown}
        onMouseMove={handleCategoryPointerMove}
        onMouseUp={handleCategoryPointerUp}
        onMouseLeave={handleCategoryPointerUp}
        onTouchStart={handleCategoryPointerDown}
        onTouchMove={handleCategoryPointerMove}
        onTouchEnd={handleCategoryPointerUp}
      >
        {CATEGORIES.map(c => (
          <Chip key={c.id} label={c.label} active={currentCat === c.id}
            onClick={() => {
              if (isDraggingRef.current) return;
              setCat(c.id);
              announce(c.label);
            }} />
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" className="stroke-current"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
          title="Sin resultados"
          description="Prueba con otra categoría o término."
        />
      ) : (
        <motion.div
          key={`${currentCat}-${search}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}
          className="grid grid-cols-2 gap-3 p-4"
          role="list"
          aria-label="Productos"
        >
          {filtered.map((p, i) => (
            <motion.div key={p.id} role="listitem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.035, duration: 0.22 }}
            >
              <ProductCard product={p} onOpenModal={openModal} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Product modal */}
      <BottomSheet open={!!modal} onClose={() => setModal(null)}>
        {modal && (
          <>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-full h-[110px] rounded-[18px] overflow-hidden mb-4">
                <ProductIllustration id={modal.id} src={modal.image} height={110} />
              </div>
              <h2 className="text-[19px] font-extrabold text-brown tracking-tight">{modal.name}</h2>
              <p className="text-[13px] font-medium mt-2 leading-relaxed text-brown/90">{modal.desc}</p>
            </div>
            <div className="flex justify-between bg-cream-dark rounded-[14px] p-4 mb-4">
              <div>
                <div className="text-[21px] font-extrabold text-brown">${modal.price}</div>
                <div className="text-[11px] text-brown/60 font-medium">precio unitario</div>
              </div>
              <div className="text-right">
                <div className="text-[19px] font-bold text-accent">+{modal.xp} XP</div>
                <div className="text-[11px] text-brown/60 font-medium">por pedido</div>
              </div>
            </div>
            {(() => {
              const groups = CUSTOMIZATIONS[modal.id] || [];
              const selArr = Array.isArray(selectedCustomization) ? selectedCustomization : [];
              const toggleOpt = (opt, groupName) => setSelectedCustomization(prev => {
                const arr = Array.isArray(prev) ? prev : [];
                const adding = !arr.includes(opt);
                const newArr = adding ? [...arr, opt] : arr.filter(o => o !== opt);
                const customsText = newArr.length > 0 ? `Personalizaciones: ${newArr.join(', ')}` : 'Sin personalizaciones';
                announce(adding
                  ? `${opt} agregado. ${customsText}`
                  : `${opt} quitado. ${customsText}`
                );
                return newArr;
              });
              return (
                <div className="mb-4">
                  {groups.map((group, gi) =>
                    group.options.length > 0 && (
                      <div key={gi} className="mb-4">
                        <p className="text-[11px] font-extrabold uppercase tracking-widest mb-2 text-brown/60">
                          {group.group}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {group.options.map(option => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => toggleOpt(option, group.group)}
                              aria-pressed={selArr.includes(option)}
                              aria-label={`${group.group}: ${option}${selArr.includes(option) ? ', seleccionado' : ''}`}
                              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border-[1.5px] transition-all font-nunito
                                ${selArr.includes(option)
                                  ? 'bg-brown text-white border-brown'
                                  : 'bg-cream-dark text-brown/80 border-cream-border'}`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                  <p className="text-[11px] font-extrabold uppercase tracking-widest mb-2 text-brown/60">
                    Nota adicional
                  </p>
                  <textarea
                    value={customNote}
                    onChange={e => setCustomNote(e.target.value)}
                    placeholder="Ej: extra picante, sin sal..."
                    rows={2}
                    className="w-full bg-cream-dark border border-cream-border rounded-[10px] px-3 py-2.5
                      text-[13px] font-medium text-brown placeholder-brown/30 outline-none
                      focus:border-accent/40 resize-none font-nunito"
                  />
                </div>
              );
            })()}
            <div className="flex gap-2.5">
              <Button variant="secondary" className="flex-1"
                onClick={() => {
                  toggleFav(modal.id);
                  sounds.play('favorite');
                  announce(favs.has(modal.id) ? `${modal.name} eliminado de favoritos` : `${modal.name} guardado en favoritos`);
                }}>
                {favs.has(modal.id) ? 'En favoritos' : 'Guardar'}
              </Button>
              <Button className="flex-[2]"
                onClick={() => {
                  const selArr = Array.isArray(selectedCustomization) ? selectedCustomization : [];
                  const customization = [...selArr, ...(customNote.trim() ? [customNote.trim()] : [])].join(', ');
                  addToCart(modal, customization);
                  sounds.play('add');
                  setModal(null);
                  const customText = customization ? `. Con personalizaciones: ${customization}` : '. Sin personalizaciones';
                  announce(`Agregado al carrito: ${modal.name}${customText}. Precio: $${modal.price}.`);
                }}>
                Agregar al carrito
              </Button>
            </div>
          </>
        )}
      </BottomSheet>
    </div>
  );
}
