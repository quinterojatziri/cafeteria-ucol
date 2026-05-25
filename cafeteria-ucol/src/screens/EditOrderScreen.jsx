import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Minus, Plus, ShoppingBag, CheckCircle } from 'lucide-react';
import { useStore } from '../store';
import { PRODUCTS, SLOTS, CATEGORIES } from '../data/catalog';
import { Button, StatusPill, BottomSheet } from '../components/ui';
import { ProductIllustration } from '../components/ProductCard';
import { CUSTOMIZATIONS } from '../data/customizations';
import { announce } from '../components/A11yPanel';

export function EditOrderScreen() {
  const { cart, changeQty, selectedSlot, setSlot, navigate, showToast, addToCart, confirmOrder } = useStore();
  const [addingProduct, setAddingProduct] = useState(false);
  const [customModal, setCustomModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const items = Object.values(cart);
  const subtotal = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  const slotXP   = selectedSlot !== null ? (SLOTS[selectedSlot]?.xp || 0) : 0;
  const totalXP  = items.reduce((a, i) => a + i.product.xp * i.qty, 0) + slotXP;

  const handleConfirmChanges = async () => {
    if (!items.length) { showToast('Agrega al menos un producto'); return; }
    if (selectedSlot === null) { showToast('Selecciona un horario de recogida'); return; }
    setSaving(true);
    try {
      await confirmOrder();
      setSaved(true);
      const orderSummary = items.map(i => {
        const customText = i.customization ? `, con ${i.customization}` : '';
        return `${i.qty} ${i.product.name}${customText}`;
      }).join('. ');
      const slotTime = selectedSlot !== null ? SLOTS[selectedSlot]?.time : '';
      announce(`Pedido modificado exitosamente. Resumen: ${orderSummary}. Recogida a las ${slotTime}.`);
    } catch (e) {
      showToast('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  /* ── Pantalla de éxito ──────────────────────────────────── */
  if (saved) {
    return (
      <div className="flex-1 flex flex-col bg-cream-DEFAULT" role="main">
        <div className="bg-brown px-5 pt-[18px] pb-[18px] sticky top-0 z-50 shadow-[0_2px_12px_rgba(44,21,8,.18)]">
          <h1 className="text-[19px] font-extrabold text-cream-DEFAULT tracking-tight">Modificar pedido</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <CheckCircle size={72} strokeWidth={1.4} className="text-matcha mx-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-[22px] font-extrabold text-brown mb-2">¡Pedido modificado!</h2>
            <p className="text-[14px] text-brown/60 font-medium leading-relaxed">
              Los cambios se guardaron correctamente.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full"
          >
            <Button onClick={() => { setSaved(false); navigate('home'); }}>
              Volver al inicio
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      {/* Header */}
      <div className="bg-brown px-5 pt-[18px] pb-[18px] sticky top-0 z-50 shadow-[0_2px_12px_rgba(44,21,8,.18)]">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('cart')}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0"
            aria-label="Volver al carrito"
          >
            <ChevronLeft size={20} strokeWidth={2} className="text-cream-DEFAULT" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[19px] font-extrabold text-cream-DEFAULT tracking-tight">Editar pedido</h1>
            <p className="text-[12px] text-beige font-medium mt-0.5">
              {items.length > 0 ? `${items.reduce((a,i)=>a+i.qty,0)} producto(s)` : 'Sin productos'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6">

        {/* ── Productos del pedido ─────────────────────────── */}
        <p className="text-[13px] font-extrabold text-brown mb-3">Productos</p>

        {items.length === 0 ? (
          <div className="bg-white rounded-[16px] p-5 text-center mb-4 shadow-card">
            <p className="text-[13px] text-brown/45 font-medium">Sin productos. Agrega desde el menú.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map(item => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[16px] p-3.5 flex items-center gap-3 mb-2.5 shadow-card"
              >
                <div className="w-11 h-11 rounded-[10px] bg-cream-dark overflow-hidden shrink-0">
                  <ProductIllustration id={item.product.id} src={item.product.image} height={44} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-brown truncate">{item.product.name}</div>
                  <div className="text-[11px] font-medium mt-0.5 text-brown/70">
                    ${item.product.price} · <span className="text-accent font-bold">+{item.product.xp} XP</span>
                  </div>
                  {item.customization && (
                    <div className="text-[10px] mt-0.5 truncate text-brown/60">
                      {item.customization}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.82 }}
                    onClick={() => {
                      if (item.qty === 1) {
                        announce(`${item.product.name} eliminado del pedido`);
                      } else {
                        announce(`${item.product.name}: ${item.qty - 1}`);
                      }
                      changeQty(item.productId, -1);
                    }}
                    className="w-[26px] h-[26px] rounded-full border border-cream-border bg-cream-dark flex items-center justify-center"
                    aria-label="Reducir cantidad"
                  >
                    <Minus size={11} strokeWidth={2.5} className="text-brown" />
                  </motion.button>
                  <span className="text-[14px] font-extrabold text-brown min-w-[16px] text-center">{item.qty}</span>
                  <motion.button
                    whileTap={{ scale: 0.82 }}
                    onClick={() => { changeQty(item.productId, 1); announce(`${item.product.name}: ${item.qty + 1}`); }}
                    className="w-[26px] h-[26px] rounded-full border border-cream-border bg-cream-dark flex items-center justify-center"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={11} strokeWidth={2.5} className="text-brown" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Botón agregar más productos */}
        <motion.button
          whileTap={{ scale: 0.975 }}
          onClick={() => setAddingProduct(true)}
          className="w-full py-3 rounded-[14px] border-[1.5px] border-dashed border-accent/40
            bg-accent/5 text-accent text-[13px] font-bold font-nunito
            flex items-center justify-center gap-2 mb-5 transition-colors active:bg-accent/10"
          aria-label="Agregar productos del menú"
        >
          <ShoppingBag size={15} strokeWidth={2} />
          Agregar del menú
        </motion.button>

        {/* ── Horario ──────────────────────────────────────── */}
        <p className="text-[13px] font-extrabold text-brown mb-3">Horario de recogida</p>
        <div role="radiogroup" aria-label="Selecciona horario">
          {SLOTS.map((slot, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.975 }}
              onClick={() => {
                setSlot(i);
                const msg = slot.level === 'hi'
                  ? 'Horario saturado. Elige otro para ganar XP.'
                  : `${slot.time} seleccionado${slot.xp > 0 ? `, +${slot.xp} XP` : ''}`;
                showToast(msg);
                announce(msg);
              }}
              className={`flex items-center justify-between bg-white rounded-[16px] p-3.5 mb-2 cursor-pointer
                border-[1.5px] transition-colors shadow-card
                ${selectedSlot === i ? 'border-accent' : 'border-transparent'}`}
              role="radio"
              aria-checked={selectedSlot === i}
            >
              <div>
                <div className="text-[14px] font-bold text-brown">{slot.time}</div>
                <div className="text-[11px] font-medium mt-0.5 text-brown/70">{slot.msg}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusPill level={slot.level} />
                <span className="text-[11px] font-bold text-accent">{slot.xp > 0 ? `+${slot.xp} XP` : '—'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Resumen ──────────────────────────────────────── */}
        <div className="bg-white rounded-[16px] p-4 mt-2 mb-4 shadow-card">
          <div className="flex justify-between mb-2">
            <span className="text-[13px] font-medium text-brown/70">Subtotal</span>
            <span className="text-[13px] font-bold text-brown">${subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[13px] font-medium text-brown/70">XP a ganar</span>
            <span className="text-[13px] font-bold text-accent">+{totalXP} XP</span>
          </div>
          <div className="border-t border-cream-border mt-3 pt-3 flex justify-between">
            <span className="text-[15px] font-extrabold text-brown">Total</span>
            <span className="text-[15px] font-extrabold text-brown">${subtotal}</span>
          </div>
        </div>

        <Button onClick={handleConfirmChanges} disabled={saving}>
          {saving ? 'Guardando...' : 'Confirmar cambios'}
        </Button>
      </div>

      {/* ── Modal picker de productos ───────────────────────── */}
      <BottomSheet open={addingProduct} onClose={() => setAddingProduct(false)}>
        <ProductPicker
          onSelect={(product) => {
            const opts = CUSTOMIZATIONS[product.id];
            if (opts && opts.length > 0) {
              announce(`${product.name} seleccionado. Precio: $${product.price}. Ahora elige tus opciones de personalización.`);
              setCustomModal(product);
              setAddingProduct(false);
            } else {
              addToCart(product);
              sounds.play('add');
              showToast(`${product.name} agregado al pedido`);
              announce(`Agregado al pedido: ${product.name}. Precio: $${product.price}. Sin personalizaciones.`);
              setAddingProduct(false);
            }
          }}
        />
      </BottomSheet>

      {/* Modal de personalización al agregar */}
      <BottomSheet open={!!customModal} onClose={() => setCustomModal(null)}>
        {customModal && (
          <QuickCustomModal
            product={customModal}
            onAdd={(customization) => {
              addToCart(customModal, customization);
              sounds.play('add');
              showToast(`${customModal.name} agregado al pedido`);
              const customText = customization ? `. Con personalizaciones: ${customization}` : '. Sin personalizaciones';
              announce(`Agregado al pedido: ${customModal.name}${customText}. Precio: $${customModal.price}.`);
              setCustomModal(null);
            }}
            onCancel={() => setCustomModal(null)}
          />
        )}
      </BottomSheet>
    </div>
  );
}

/* ─── Product picker mini ────────────────────────────────────── */
function ProductPicker({ onSelect }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('todos');
  const filtered = PRODUCTS.filter(p => {
    const catOk = cat === 'todos' || p.cat === cat;
    const q = search.toLowerCase().trim();
    return catOk && (!q || p.name.toLowerCase().includes(q));
  });

  return (
    <div>
      <h3 className="text-[16px] font-extrabold text-brown mb-3">Agregar producto</h3>
      <input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Buscar..."
        className="w-full bg-cream-dark border border-cream-border rounded-[10px] px-3.5 py-2.5
          text-[13px] font-medium text-brown placeholder-brown/30 outline-none
          focus:border-accent/40 font-nunito mb-3"
      />
      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scroll pb-2 mb-2">
        {[{ id:'todos', label:'Todos' }, ...CATEGORIES.slice(1)].map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border-[1.5px] transition-all font-nunito
              ${cat === c.id ? 'bg-brown text-cream-DEFAULT border-brown' : 'bg-white text-brown/60 border-cream-border'}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {/* Product list */}
      <div className="max-h-[320px] overflow-y-auto no-scroll">
        {filtered.length === 0 && (
          <p className="text-center text-[13px] text-brown/40 py-6">Sin resultados</p>
        )}
        {filtered.map(p => (
          <motion.div
            key={p.id}
            whileTap={{ scale: 0.975 }}
            onClick={() => { announce(`${p.name}, $${p.price}`); onSelect(p); }}
            className="flex items-center gap-3 py-3 border-b border-cream-border last:border-0 cursor-pointer active:bg-cream-dark rounded-lg px-1 transition-colors"
            role="button"
            aria-label={`${p.name}, $${p.price}, más ${p.xp} XP`}
          >
            <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-cream-dark shrink-0">
              <ProductIllustration id={p.id} src={p.image} height={40} />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-brown">{p.name}</div>
              <div className="text-[11px] font-medium text-brown/70">${p.price} · +{p.xp} XP</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
              <Plus size={13} strokeWidth={2.5} className="text-white" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Quick customization modal ──────────────────────────────── */
function QuickCustomModal({ product, onAdd, onCancel }) {
  const groups = CUSTOMIZATIONS[product.id] || [];
  const [selected, setSelected] = useState([]);
  const [note, setNote] = useState('');

  const toggle = (opt) => {
    setSelected(prev => {
      const adding = !prev.includes(opt);
      const newSel = adding ? [...prev, opt] : prev.filter(o => o !== opt);
      const customsText = newSel.length > 0 ? `Personalizaciones: ${newSel.join(', ')}` : 'Sin personalizaciones';
      announce(adding ? `${opt} agregado. ${customsText}` : `${opt} quitado. ${customsText}`);
      return newSel;
    });
  };

  const handleAdd = () => {
    const parts = [...selected];
    if (note.trim()) parts.push(note.trim());
    onAdd(parts.join(', ') || '');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-[12px] overflow-hidden bg-cream-dark shrink-0">
          <ProductIllustration id={product.id} src={product.image} height={56} />
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-brown">{product.name}</h3>
          <div className="text-[12px] font-medium text-brown/70">${product.price}</div>
        </div>
      </div>

      <div className="max-h-[280px] overflow-y-auto no-scroll mb-4">
        {groups.map((g, gi) => (
          g.options.length > 0 && (
            <div key={gi} className="mb-4">
              <p className="text-[11px] font-extrabold uppercase tracking-widest mb-2 text-brown/60">
                {g.group}
              </p>
              <div className="flex flex-wrap gap-2">
                {g.options.map(opt => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => toggle(opt)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border-[1.5px] transition-all font-nunito
                      ${selected.includes(opt)
                        ? 'bg-brown text-white border-brown'
                        : 'bg-cream-dark text-brown/80 border-cream-border'}`}
                    aria-pressed={selected.includes(opt)}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Nota adicional */}
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest mb-2 text-brown/60">
            Nota adicional
          </p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ej: extra picante, sin sal..."
            rows={2}
            className="w-full bg-cream-dark border border-cream-border rounded-[10px] px-3 py-2.5
              text-[13px] font-medium text-brown placeholder-brown/30 outline-none
              focus:border-accent/40 resize-none font-nunito"
            aria-label="Nota adicional"
          />
        </div>
      </div>

      <div className="flex gap-2.5">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>Cancelar</Button>
        <Button className="flex-[2]" onClick={handleAdd}>
          Agregar al pedido
        </Button>
      </div>
    </div>
  );
}
