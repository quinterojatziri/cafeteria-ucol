import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle, Bell, Trophy, Heart } from 'lucide-react';
import { useStore } from '../store';
import { BADGES, PRODUCTS, SLOTS } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { Button, EmptyState, StatusPill } from '../components/ui';
import { announce, sounds } from '../components/A11yPanel';

// ─── Back header ─────────────────────────────────────────────
function BackHeader({ title }) {
  const { goBack } = useStore();
  return (
    <div className="bg-brown px-4 pt-[18px] pb-[18px] flex items-center gap-3 sticky top-0 z-50
      shadow-[0_2px_12px_rgba(44,21,8,.18)]">
      <motion.button whileTap={{ scale: 0.86 }} onClick={() => { goBack(); announce('Atrás'); }}
        className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
        aria-label="Volver atrás">
        <ChevronLeft size={20} strokeWidth={2} className="text-white" />
      </motion.button>
      <h1 className="text-[21px] font-extrabold text-white tracking-tight">{title}</h1>
    </div>
  );
}

// ─── Notifications ───────────────────────────────────────────
export function NotificationsScreen() {
  const { notifs, markNotifRead } = useStore();
  const unread = notifs.filter(n => !n.read).length;

  // Announce summary when screen loads
  useEffect(() => {
    const msg = notifs.length === 0
      ? 'Sin notificaciones'
      : `${notifs.length} notificaciones, ${unread} sin leer`;
    announce(msg);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      <BackHeader title="Notificaciones" />
      {unread > 0 && (
        <div className="px-5 py-2.5 text-[12px] font-semibold text-brown/45"
          aria-live="polite">{unread} sin leer</div>
      )}
      {notifs.length === 0 ? (
        <EmptyState
          icon={<Bell size={28} strokeWidth={1.2} className="stroke-current" />}
          title="Sin notificaciones"
          description="Aquí aparecerán tus alertas y retos."
        />
      ) : (
        <div role="list" aria-label="Notificaciones">
          {notifs.map((n, i) => (
            <motion.div key={n.id || i} role="listitem"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => { if (!n.read) markNotifRead(n.id); announce(`${n.read ? '' : 'No leída. '}${n.title}. ${n.text}`); }}
              className={`flex items-start gap-3 px-5 py-4 border-b border-cream-border cursor-pointer
                transition-colors active:bg-cream-dark
                ${!n.read ? 'bg-accent/[0.04]' : ''}`}
              aria-label={`${n.read ? '' : 'No leída: '}${n.title}. ${n.text}`}
            >
              {!n.read
                ? <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-[6px]" aria-hidden="true" />
                : <div className="w-2 shrink-0" />}
              <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  className="stroke-beige" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className={`text-[13px] font-bold ${n.read ? 'text-brown/70' : 'text-brown'}`}>{n.title}</div>
                <div className="text-[12px] text-brown/45 font-medium mt-0.5 leading-relaxed">{n.text}</div>
                <div className="text-[10px] text-beige font-semibold mt-1">{n.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Achievements ────────────────────────────────────────────
export function AchievementsScreen() {
  const { badges } = useStore();
  const unlocked = BADGES.filter(b => badges[b.id]?.unlocked).length;

  useEffect(() => {
    announce(`Logros: ${unlocked} de ${BADGES.length} desbloqueados`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      <BackHeader title="Logros" />
      <div className="px-4 py-4">
        <p className="text-[12px] font-semibold text-brown/40 mb-4" aria-live="polite">
          {unlocked}/{BADGES.length} desbloqueados
        </p>
        <div role="list" aria-label="Logros y insignias">
          {BADGES.map((b, i) => {
            const isUnlocked = !!badges[b.id]?.unlocked;
            return (
              <motion.div key={b.id} role="listitem"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.22 }}
                onClick={() => announce(`Insignia: ${b.name}. ${b.desc}. ${isUnlocked ? 'Desbloqueada.' : `Bloqueada. Gana ${b.xp} XP al obtenerla.`}`)}
                className={`flex items-center gap-3.5 bg-white rounded-[16px]
                  shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]
                  p-3.5 mb-2.5 cursor-pointer ${!isUnlocked ? 'opacity-50' : ''}`}
                aria-label={`${b.name}: ${isUnlocked ? 'desbloqueada' : `bloqueada, +${b.xp} XP al obtener`}`}
              >
                <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0
                  ${isUnlocked ? 'bg-accent/10' : 'bg-cream-dark'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    className={isUnlocked ? 'stroke-accent' : 'stroke-beige'}
                    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {isUnlocked
                      ? <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>
                      : <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>}
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-brown">{b.name}</div>
                  <div className="text-[11px] text-brown/45 font-medium mt-0.5 leading-snug">{b.desc}</div>
                  <div className={`text-[11px] font-bold mt-1 ${isUnlocked ? 'text-matcha' : 'text-accent'}`}>
                    {isUnlocked ? 'Desbloqueada' : `+${b.xp} XP al obtener`}
                  </div>
                </div>
                {isUnlocked
                  ? <CheckCircle size={18} className="text-matcha shrink-0" strokeWidth={1.8} />
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-brown/25 shrink-0" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                }
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Favorites ───────────────────────────────────────────────
export function FavoritesScreen() {
  const { favs } = useStore();
  const favProducts = PRODUCTS.filter(p => favs.has(p.id));

  useEffect(() => {
    const msg = favProducts.length === 0
      ? 'Sin favoritos guardados'
      : `Tienes ${favProducts.length} producto${favProducts.length > 1 ? 's' : ''} favorito${favProducts.length > 1 ? 's' : ''}: ${favProducts.map(p => p.name).join(', ')}`;
    announce(msg);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      <BackHeader title="Favoritos" />
      {favProducts.length === 0 ? (
        <EmptyState
          icon={<Heart size={28} strokeWidth={1.2} className="stroke-current" />}
          title="Sin favoritos"
          description="Toca el corazón en cualquier producto para guardarlo aquí."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 p-4" role="list" aria-label="Productos favoritos">
          {favProducts.map((p, i) => (
            <motion.div key={p.id} role="listitem"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}>
              <ProductCard product={p} onOpenModal={(prod) => announce(`${prod.name}. ${prod.desc}. Precio: $${prod.price}. Gana ${prod.xp} XP.`)} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Review ────────────────────────────────────────────────
export function ReviewScreen() {
  const { cart, selectedSlot, confirmOrder, navigate, _modifyingOrderId } = useStore();
  const [ordering, setOrdering] = useState(false);
  const items = Object.values(cart);
  const slot = SLOTS[selectedSlot];
  const subtotal = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  const baseXP = items.reduce((a, i) => a + i.product.xp * i.qty, 0);
  const slotXP = slot?.xp || 0;
  const isModifying = !!_modifyingOrderId;

  const handleConfirm = async () => {
    if (selectedSlot === null || ordering) return;
    setOrdering(true);
    try {
      const result = await confirmOrder();
      useStore.setState({ _lastOrder: result });
      sounds.play('confirm');
      navigate(isModifying ? 'profile' : 'success');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      <BackHeader title={isModifying ? 'Confirmar cambios' : 'Revisa tu pedido'} />
      <div className="px-4 pt-4 pb-6">
        <div className="bg-white rounded-[20px] p-5 shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_10px_rgba(44,21,8,.08)] mb-4">
          <div className="text-[13px] font-semibold text-brown/55 mb-3">Verifica tu pedido antes de confirmarlo.</div>
          <div className="space-y-3">
            {items.map(item => (
              <div key={`${item.productId}-${item.customization || ''}`} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-brown truncate">{item.product.name} ×{item.qty}</div>
                  {item.customization && (
                    <div className="text-[11px] text-brown/55 mt-1">Personalización: {item.customization}</div>
                  )}
                  <div className="text-[11px] text-brown/45 mt-1">{item.product.desc}</div>
                </div>
                <div className="text-[13px] font-bold text-brown">${item.product.price * item.qty}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-cream-border mt-4 pt-4 space-y-3">
            <div className="flex items-center justify-between text-[13px] font-medium text-brown/70">
              <span>Horario de recogida</span>
              <span>{slot?.time || 'Sin horario'}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-medium text-brown/70">
              <span>Productos</span>
              <span>{items.reduce((a, i) => a + i.qty, 0)} unidades</span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-bold text-brown">
              <span>Total</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-bold text-accent">
              <span>XP estimada</span>
              <span>+{baseXP + slotXP} XP</span>
            </div>
            {slot && (
              <div className="flex items-center justify-between text-[12px] font-semibold">
                <span>Estado de horario</span>
                <StatusPill level={slot.level} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleConfirm} disabled={selectedSlot === null || items.length === 0 || ordering}>
            {ordering ? (isModifying ? 'Confirmando cambios...' : 'Confirmando...') : (isModifying ? 'Confirmar cambios' : 'Confirmar pedido')}
          </Button>
          <Button variant="secondary" onClick={() => navigate(isModifying ? 'profile' : 'cart')}>
            {isModifying ? 'Volver a órdenes' : 'Volver al carrito'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Order ─────────────────────────────────────────────
export function EditOrderScreen() {
  const { cart, selectedSlot, removeFromCart, navigate, showToast, _modifyingOrderId } = useStore();
  const items = Object.values(cart);
  const slot = SLOTS[selectedSlot];

  const handleAddFromMenu = () => {
    navigate('menu');
    setTimeout(() => showToast('Producto añadido al pedido'), 600);
  };

  const handleRemoveItem = (productId, customization) => {
    removeFromCart(productId, customization);
    showToast('Producto eliminado');
  };

  const handleChangeSlot = () => {
    navigate('cart');
  };

  const handleConfirmChanges = () => {
    if (items.length === 0) {
      showToast('Agrega al menos un producto');
      return;
    }
    navigate('review');
  };

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      <BackHeader title="Editar pedido" />
      <div className="px-4 pt-4 pb-6">
        
        {/* Items */}
        <div className="bg-white rounded-[20px] p-5 shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_10px_rgba(44,21,8,.08)] mb-4">
          <div className="text-[13px] font-semibold text-brown/55 mb-3">Productos en tu pedido</div>
          {items.length === 0 ? (
            <div className="text-[12px] text-brown/45 py-3">No hay productos. Agrega algunos.</div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={`${item.productId}-${item.customization || ''}`} className="flex items-start justify-between gap-2 pb-3 border-b border-cream-border last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold text-brown">{item.product.name} ×{item.qty}</div>
                    {item.customization && (
                      <div className="text-[10px] text-brown/55 mt-1">Personalización: {item.customization}</div>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveItem(item.productId, item.customization)}
                    className="text-[12px] font-semibold text-accent px-2 py-1 rounded-full"
                    aria-label={`Eliminar ${item.product.name}`}
                  >
                    Eliminar
                  </motion.button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slot Selection */}
        <div className="bg-white rounded-[20px] p-5 shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_10px_rgba(44,21,8,.08)] mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-semibold text-brown/55">Horario de recogida</div>
              <div className="text-[14px] font-bold text-brown mt-1">{slot?.time || 'Selecciona un horario'}</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleChangeSlot}
              className="text-[12px] font-semibold text-accent px-3 py-1.5 rounded-full"
            >
              Cambiar
            </motion.button>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button onClick={handleAddFromMenu} variant="secondary">
            + Agregar más productos
          </Button>
          <Button onClick={handleConfirmChanges} disabled={items.length === 0 || selectedSlot === null}>
            Confirmar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Success ────────────────────────────────────────────────
export function SuccessScreen() {
  const { navigate } = useStore();
  const lastOrderData = useStore(s => s._lastOrder);
  const order = lastOrderData?.order || lastOrderData;

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main" aria-live="assertive">
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-10 text-center">

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="w-[76px] h-[76px] rounded-full bg-green-50 flex items-center justify-center mb-6"
          aria-hidden="true"
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
            className="stroke-matcha" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="text-[23px] font-extrabold text-brown mb-2 tracking-tight"
        >
          Pedido confirmado
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="text-[13px] text-brown/45 font-medium mb-8 leading-relaxed"
        >
          Revisa el resumen de tu pedido y presenta el código al recoger.
        </motion.p>

        {order ? (
          <> 
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-full bg-white rounded-[18px] p-5 mb-6 shadow-[0_4px_20px_rgba(44,21,8,.22)]"
              role="status"
              aria-label={`Resumen del pedido ${order.code}`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-[14px] font-bold text-brown">Pedido {order.code}</div>
                  <div className="text-[12px] text-brown/55 mt-1">{order.dateLabel}</div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-bold text-brown/80">Recoger</div>
                  <div className="text-[13px] font-extrabold text-brown">{order.slotLabel}</div>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={`${item.id}-${item.qty}`} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-brown truncate">{item.name}</div>
                      {item.customization && (
                        <div className="text-[11px] text-brown/55 mt-1">Personalización: {item.customization}</div>
                      )}
                      <div className="text-[11px] text-brown/55 mt-1">{item.qty} × ${item.price}</div>
                    </div>
                    <div className="text-[13px] font-bold text-brown">${item.qty * item.price}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-border mt-4 pt-3 flex items-center justify-between">
                <span className="text-[13px] font-bold text-brown">Total</span>
                <span className="text-[15px] font-extrabold text-brown">${order.total}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.3 }}
              className="w-full bg-brown rounded-[18px] p-5 mb-8 shadow-[0_4px_20px_rgba(44,21,8,.22)]"
            >
              <div className="text-[12px] font-semibold text-white mb-1">Código de recogida</div>
              <div className="text-[32px] font-extrabold tracking-[0.08em] text-white">{order.code}</div>
              <div className="text-[12px] text-white/75 mt-3 leading-relaxed">
                Presenta este código al personal para recibir tu pedido.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.3 }}
              className="w-full bg-brown rounded-[18px] p-5 mb-6 shadow-[0_4px_20px_rgba(44,21,8,.22)]"
            >
              <div className="text-[12px] font-semibold text-white mb-1">XP ganado en este pedido</div>
              <div className="text-[46px] font-extrabold leading-none text-white">
                +{lastOrderData?.totalXP ?? 0}
              </div>
              <div className="text-[13px] font-bold text-white mt-2">
                {lastOrderData?.leveledUp ? `¡Subiste al Nivel ${lastOrderData.newLevel}!` : `Nivel ${lastOrderData?.newLevel ?? ''}`}
              </div>
            </motion.div>
          </>
        ) : (
          <p className="text-[13px] text-brown/55 leading-relaxed">Tu pedido fue confirmado. Regresa al inicio para continuar.</p>
        )}

        <Button onClick={() => { navigate('home'); announce('Inicio'); }}>
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
