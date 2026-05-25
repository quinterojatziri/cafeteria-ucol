import { useState } from 'react';
import { Minus, Plus, Trash2, CheckCircle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { SLOTS } from '../data/catalog';
import { Button, StatusPill, AlertDialog, EmptyState } from '../components/ui';
import { ProductThumb } from '../components/ProductCard';
import { announce, sounds } from '../components/A11yPanel';

export function CartScreen() {
  const { cart, changeQty, clearCart, confirmOrder, selectedSlot, setSlot, navigate, showToast } = useStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const items = Object.values(cart);
  const subtotal = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  const baseXP   = items.reduce((a, i) => a + i.product.xp  * i.qty, 0);
  const slotXP   = selectedSlot !== null ? (SLOTS[selectedSlot]?.xp || 0) : 0;

  const handleGoToReview = () => {
    if (selectedSlot === null) return;
    // TTS: read full order summary
    const orderSummary = items.map(i => {
      const customText = i.customization ? `, con ${i.customization}` : ', sin personalizaciones';
      return `${i.qty} ${i.product.name}${customText}, $${i.product.price * i.qty}`;
    }).join('. ');
    const slotTime = SLOTS[selectedSlot]?.time || '';
    announce(`Resumen de tu pedido: ${orderSummary}. Total: $${subtotal}. Recogida a las ${slotTime}. Confirma o cancela el pedido.`);
    setShowReview(true);
  };

  const handleConfirm = async () => {
    if (ordering) return;
    setOrdering(true);
    try {
      const result = await confirmOrder();
      useStore.setState({ _lastOrder: result });
      sounds.play('confirm');
      const orderSummary = items.map(i => {
        const customText = i.customization ? `, con ${i.customization}` : '';
        return `${i.qty} ${i.product.name}${customText}`;
      }).join('. ');
      announce(`Pedido confirmado. ${orderSummary}. Total: $${subtotal}.`);
      navigate('success');
    } catch(e) {
      showToast('Error al confirmar el pedido');
    } finally {
      setOrdering(false);
    }
  };

  // ── Pantalla de revisión del pedido ──────────────────────
  if (showReview) {
    const slot = selectedSlot !== null ? SLOTS[selectedSlot] : null;
    return (
      <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
        {/* Header */}
        <div className="bg-brown px-5 pt-[18px] pb-[20px] sticky top-0 z-50 shadow-[0_2px_12px_rgba(44,21,8,.18)]">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => { setShowReview(false); announce('Volviste al carrito'); }}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0"
              aria-label="Volver al carrito"
            >
              <ChevronLeft size={20} strokeWidth={2} className="text-white" />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-[19px] font-extrabold text-white tracking-tight">Confirmar pedido</h1>
              <p className="text-[12px] font-medium text-white/70 mt-0.5">Revisa tu pedido antes de confirmar</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-6">
          {/* Items summary */}
          <p className="text-[13px] font-extrabold text-brown mb-3">Productos</p>
          {items.map(item => (
            <div
              key={item.productId}
              className="bg-white rounded-[16px] p-3.5 flex items-start gap-3 mb-2.5 shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]"
              role="listitem"
              aria-label={`${item.product.name}, cantidad ${item.qty}${item.customization ? ', ' + item.customization : ''}`}
            >
              <div className="w-12 h-12 rounded-[12px] bg-cream-dark overflow-hidden flex items-center justify-center shrink-0">
                <ProductThumb id={item.product.id} size={36} src={item.product.image} alt={item.product.name} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[13px] font-bold text-brown">{item.product.name}</div>
                  <div className="text-[13px] font-extrabold text-brown shrink-0">${item.product.price * item.qty}</div>
                </div>
                <div className="text-[11px] text-brown/45 font-medium mt-0.5">
                  {item.qty}x ${item.product.price} · <span className="text-accent font-bold">+{item.product.xp * item.qty} XP</span>
                </div>
                {item.customization ? (
                  <div className="mt-1.5 bg-accent/8 rounded-[8px] px-2.5 py-1.5 border border-accent/15">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-accent/70 mb-0.5">Personalización</div>
                    <div className="text-[11px] font-semibold text-brown/80">{item.customization}</div>
                  </div>
                ) : (
                  <div className="text-[11px] text-brown/35 mt-1 italic">Sin personalizaciones</div>
                )}
              </div>
            </div>
          ))}

          {/* Horario */}
          {slot && (
            <>
              <p className="text-[13px] font-extrabold text-brown mt-4 mb-2">Horario de recogida</p>
              <div className="bg-white rounded-[16px] p-3.5 flex items-center justify-between mb-4 shadow-[0_1px_3px_rgba(44,21,8,.07)]">
                <div>
                  <div className="text-[14px] font-bold text-brown">{slot.time}</div>
                  <div className="text-[11px] text-brown/45 font-medium mt-0.5">{slot.msg}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusPill level={slot.level} />
                  <span className="text-[11px] font-bold text-accent">{slot.xp > 0 ? `+${slot.xp} XP` : '—'}</span>
                </div>
              </div>
            </>
          )}

          {/* Totales */}
          <div className="bg-white rounded-[16px] p-4 mb-5 shadow-[0_1px_3px_rgba(44,21,8,.07)]">
            <SummaryRow label="Subtotal" value={`$${subtotal}`} />
            <SummaryRow label="XP a ganar" value={`+${baseXP + slotXP} XP`} accent />
            <div className="border-t border-cream-border mt-3 pt-3">
              <SummaryRow label="Total" value={`$${subtotal}`} bold />
            </div>
          </div>

          {/* Botones confirmar / cancelar */}
          <div className="flex flex-col gap-2.5">
            <Button onClick={handleConfirm} disabled={ordering}>
              {ordering ? 'Confirmando...' : '✓ Confirmar pedido'}
            </Button>
            <motion.button
              whileTap={{ scale: 0.975 }}
              onClick={() => { setShowReview(false); announce('Pedido cancelado. Puedes editar tu carrito.'); }}
              className="w-full py-[14px] rounded-[14px] border-[1.5px] border-cream-border
                bg-cream-dark text-brown text-[14px] font-bold font-nunito transition-colors hover:bg-cream-border"
            >
              Cancelar
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      {/* Header */}
      <div className="bg-brown px-5 pt-[18px] pb-[20px] sticky top-0 z-50 shadow-[0_2px_12px_rgba(44,21,8,.18)]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[23px] font-extrabold text-white tracking-tight">Tu pedido</h1>
            <p className="text-[13px] font-medium text-white/80 mt-0.5">
              {items.length > 0
                ? `${items.reduce((a, i) => a + i.qty, 0)} producto(s)`
                : 'Carrito vacío'}
            </p>
          </div>
          {items.length > 0 && (
            <motion.button whileTap={{ scale: 0.88 }}
              onClick={() => setConfirmClear(true)}
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
              aria-label="Vaciar carrito">
              <Trash2 size={17} strokeWidth={1.7} className="text-white" />
            </motion.button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <>
          <EmptyState
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.4" strokeLinecap="round" className="stroke-current"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>}
            title="Carrito vacío"
            description="Agrega productos desde el menú."
          />
          <div className="px-4"><Button onClick={() => navigate('menu')}>Ir al menú</Button></div>
        </>
      ) : (
        <div className="px-4 pt-4 pb-6">

          {/* Items */}
          <AnimatePresence initial={false}>
            {items.map(item => (
              <motion.div key={item.productId}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.22 }}
                className="bg-white rounded-[16px] p-3.5 flex items-center gap-3 mb-2.5
                  shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]"
                role="listitem"
                aria-label={`${item.product.name}, cantidad ${item.qty}, $${item.product.price * item.qty}`}
              >
                <div className="w-14 h-14 rounded-[14px] bg-cream-dark overflow-hidden flex items-center justify-center shrink-0">
                  <ProductThumb id={item.product.id} size={40} src={item.product.image} alt={item.product.name} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-brown">{item.product.name}</div>
                  <div className="text-[12px] text-brown/45 font-medium mt-0.5">
                    ${item.product.price} · <span className="text-accent font-bold">+{item.product.xp} XP</span>
                  </div>
                  {item.customization && (
                    <div className="text-[11px] text-brown/55 mt-1">
                      Personalización: {item.customization}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2" role="group" aria-label={`Cantidad de ${item.product.name}`}>
                  <motion.button whileTap={{ scale: 0.82 }}
                    onClick={() => {
                      if (item.qty === 1) {
                        announce(`${item.product.name} eliminado del carrito`);
                      } else {
                        announce(`${item.product.name}: ${item.qty - 1}`);
                      }
                      changeQty(item.productId, -1);
                    }}
                    className="qty-btn-a11y w-[26px] h-[26px] rounded-full border border-cream-border bg-cream-dark flex items-center justify-center"
                    aria-label="Reducir cantidad">
                    <Minus size={11} strokeWidth={2.5} className="text-brown" />
                  </motion.button>
                  <span className="text-[14px] font-extrabold text-brown min-w-[16px] text-center" aria-live="polite">{item.qty}</span>
                  <motion.button whileTap={{ scale: 0.82 }}
                    onClick={() => { changeQty(item.productId, 1); announce(`${item.product.name}: ${item.qty + 1}`); }}
                    className="qty-btn-a11y w-[26px] h-[26px] rounded-full border border-cream-border bg-cream-dark flex items-center justify-center"
                    aria-label="Aumentar cantidad">
                    <Plus size={11} strokeWidth={2.5} className="text-brown" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Horarios */}
          <div className="mt-5 mb-1">
            <p className="text-[13px] font-extrabold text-brown mb-3" id="slots-label">
              Horario de recogida
            </p>
            <div role="radiogroup" aria-labelledby="slots-label">
              {SLOTS.map((slot, i) => (
                <motion.div key={i} whileTap={{ scale: 0.975 }}
                  onClick={() => {
                    setSlot(i);
                    const msg = slot.level === 'hi'
                      ? 'Horario saturado. Elige otro para ganar XP.'
                      : `${slot.time} seleccionado${slot.xp > 0 ? `, +${slot.xp} XP` : ''}`;
                    showToast(msg);
                    announce(msg);
                  }}
                  className={`flex items-center justify-between bg-white rounded-[16px] p-3.5 mb-2 cursor-pointer
                    border-[1.5px] transition-colors duration-200
                    shadow-[0_1px_3px_rgba(44,21,8,.07)]
                    ${selectedSlot === i ? 'border-accent' : 'border-transparent'}`}
                  role="radio"
                  aria-checked={selectedSlot === i}
                  aria-label={`${slot.time}, ${slot.msg}${slot.xp > 0 ? `, +${slot.xp} XP` : ''}`}
                >
                  <div>
                    <div className="text-[14px] font-bold text-brown">{slot.time}</div>
                    <div className="text-[11px] text-brown/45 font-medium mt-0.5">{slot.msg}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusPill level={slot.level} />
                    <span className="text-[11px] font-bold text-accent">
                      {slot.xp > 0 ? `+${slot.xp} XP` : '—'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <Button onClick={handleGoToReview} disabled={selectedSlot === null}>
              {selectedSlot === null ? 'Selecciona un horario' : 'Revisar pedido'}
            </Button>
          </div>

          {/* Repetir último */}
          <RepeatLastOrder />
        </div>
      )}

      <AlertDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Vaciar carrito"
        message="¿Eliminar todos los productos del carrito?"
        onConfirm={() => { clearCart(); announce('Carrito vaciado'); }}
        confirmLabel="Vaciar"
      />
    </div>
  );
}

function SummaryRow({ label, value, accent, bold }) {
  return (
    <div className="flex justify-between mb-2 last:mb-0">
      <span className={`text-[13px] font-${bold ? 'extrabold' : 'medium'} ${bold ? 'text-brown' : 'text-brown/50'}`}>{label}</span>
      <span className={`text-[13px] font-${bold ? 'extrabold' : 'bold'} ${accent ? 'text-accent' : 'text-brown'}`}>{value}</span>
    </div>
  );
}

function RepeatLastOrder() {
  const { orders, repeatOrder } = useStore();
  if (!orders.length) return null;
  return (
    <motion.button whileTap={{ scale: 0.975 }}
      onClick={() => { repeatOrder(orders[0]); announce('Último pedido agregado al carrito'); }}
      className="w-full mt-2.5 py-[14px] rounded-[14px] border-[1.5px] border-cream-border
        bg-cream-dark text-brown text-[14px] font-bold font-nunito transition-colors hover:bg-cream-border"
      aria-label="Repetir último pedido">
      Repetir último pedido
    </motion.button>
  );
}
