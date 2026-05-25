import { create } from 'zustand';
import { db, DEFAULT_USER, NOTIFS_DEFAULT, NOTIFS_NEW_USER } from '../db';
import { getLevelInfo, BADGES, SLOTS, PRODUCTS } from '../data/catalog';

export const useStore = create((set, get) => ({
  // ─── State ───────────────────────────────────────────────
  user: { ...DEFAULT_USER },
  cart: {},            // productId -> { product, qty }
  favs: new Set(),
  orders: [],
  _lastOrder: null,
  _modifyingOrderId: null,
  badges: {},          // id -> { unlocked, unlockedAt }
  notifs: [],
  a11y: {},
  loaded: false,
  loggedIn: false,
  currentScreen: 'home',
  prevScreen: 'home',
  selectedSlot: null,
  currentCat: 'todos',
  toastMsg: '',
  toastVisible: false,
  _toastTimer: null,

  // ─── Boot ────────────────────────────────────────────────
  load: async () => {
    // user
    let user = await db.user.get('me');
    if (!user) { await db.user.add({ ...DEFAULT_USER }); user = { ...DEFAULT_USER }; }

    // cart
    const cartRows = await db.cart.toArray();
    const cart = {};
    cartRows.forEach(r => { cart[r.productId] = r; });

    // favs
    const favRows = await db.favs.toArray();
    const favs = new Set(favRows.map(r => r.productId));

    // orders
    const orders = await db.orders.orderBy('date').reverse().limit(20).toArray();

    // badges
    const badgeRows = await db.badges.toArray();
    const badges = {};
    badgeRows.forEach(r => { badges[r.id] = r; });

    // notifs
    let notifs = await db.notifs.toArray();
    if (!notifs.length) {
      await db.notifs.bulkAdd(NOTIFS_DEFAULT.map(n => ({ ...n })));
      notifs = await db.notifs.toArray();
    }

    // a11y
    const a11yRows = await db.a11y.toArray();
    const a11y = {};
    a11yRows.forEach(r => { a11y[r.key] = r.val; });

    const session = a11y['session'];
    set({ user, cart, favs, orders, badges, notifs, a11y, loaded: true, loggedIn: !!session });

    // apply a11y
    Object.entries(a11y).forEach(([k, v]) => {
      if (v) document.body.classList.add(k);
    });
  },

  // ─── Navigation ──────────────────────────────────────────
  navigate: (screen) => set(s => {
    const updates = { prevScreen: s.currentScreen, currentScreen: screen };
    // Solo limpiar estado de modificación al ir a home
    if (screen === 'home') {
      updates._modifyingOrderId = null;
    }
    return updates;
  }),
  goBack: () => set(s => ({ prevScreen: s.currentScreen, currentScreen: s.prevScreen })),

  // ─── Toast ───────────────────────────────────────────────
  showToast: (msg) => {
    const s = get();
    clearTimeout(s._toastTimer);
    const timer = setTimeout(() => set({ toastVisible: false }), 2400);
    set({ toastMsg: msg, toastVisible: true, _toastTimer: timer });
  },

  // ─── Cart ────────────────────────────────────────────────
  addToCart: async (product, customization = '') => {
    const { cart, showToast } = get();
    const existing = cart[product.id];
    const updated = existing
      ? { ...existing, qty: existing.qty + 1, customization: customization || existing.customization }
      : { productId: product.id, product, qty: 1, customization: customization || '' };
    await db.cart.put(updated);
    set(s => ({ cart: { ...s.cart, [product.id]: updated } }));
    showToast(`${product.name} agregado al carrito`);
  },

  changeQty: async (productId, delta) => {
    const { cart } = get();
    const item = cart[productId];
    if (!item) return;
    const newQty = item.qty + delta;
    if (newQty <= 0) {
      await db.cart.delete(productId);
      set(s => {
        const c = { ...s.cart };
        delete c[productId];
        return { cart: c };
      });
    } else {
      const updated = { ...item, qty: newQty };
      await db.cart.put(updated);
      set(s => ({ cart: { ...s.cart, [productId]: updated } }));
    }
  },

  clearCart: async () => {
    await db.cart.clear();
    set({ cart: {} });
  },

  setSlot: (idx) => set({ selectedSlot: idx }),

  // ─── Confirm Order ───────────────────────────────────────
  confirmOrder: async () => {
    const { cart, user, selectedSlot, showToast, _modifyingOrderId } = get();
    const items = Object.values(cart);
    const slot = SLOTS[selectedSlot];
    const productXP = items.reduce((a, i) => a + i.product.xp * i.qty, 0);
    const totalXP = productXP + (slot?.xp || 0);
    const total = items.reduce((a, i) => a + i.product.price * i.qty, 0);

    if (_modifyingOrderId) {
      // Actualizar pedido existente
      const existingOrder = await db.orders.get(_modifyingOrderId);
      if (!existingOrder) return { order: null };
      const updatedOrder = {
        ...existingOrder,
        slotLabel: slot?.time || '',
        items: items.map(i => ({
          id: i.product.id,
          name: i.product.name,
          qty: i.qty,
          price: i.product.price,
          xp: i.product.xp,
          image: i.product.image,
          customization: i.customization || '',
        })),
        total,
        xp: totalXP,
      };
      await db.orders.put(updatedOrder);
      await db.cart.clear();
      const orders = await db.orders.orderBy('date').reverse().limit(20).toArray();
      set({ cart: {}, selectedSlot: null, _modifyingOrderId: null, orders });
      showToast('Pedido cambiado exitosamente');
      return { order: updatedOrder, totalXP, leveledUp: false, newLevel: getLevelInfo(user.xp).level };
    }

    // Crear nuevo pedido
    const order = {
      date: Date.now(),
      dateLabel: new Date().toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      slotLabel: slot?.time || '',
      code: `C-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pendiente',
      items: items.map(i => ({
        id: i.product.id,
        name: i.product.name,
        qty: i.qty,
        price: i.product.price,
        xp: i.product.xp,
        image: i.product.image,
        customization: i.customization || '',
      })),
      total,
      xp: totalXP,
    };
    const orderId = await db.orders.add(order);
    order.id = orderId;

    // Update user
    const prevLvl = getLevelInfo(user.xp).level;
    const isMatcha = items.some(i => i.product.id.includes('matcha'));
    const newDistinct = [...new Set([...(user.distinctProductIds || []), ...items.map(i => i.product.id)])];
    const newUser = {
      ...user,
      xp: user.xp + totalXP,
      totalOrders: user.totalOrders + 1,
      streak: user.streak + 1,
      matchaCount: user.matchaCount + (isMatcha ? 1 : 0),
      distinctProductIds: newDistinct,
      lastOrderDate: Date.now(),
    };
    await db.user.put(newUser);

    // Check badges
    const { badges } = get();
    const newBadges = { ...badges };
    let unlockedName = null;
    for (const b of BADGES) {
      if (!newBadges[b.id]?.unlocked && b.cond(newUser)) {
        newBadges[b.id] = { id: b.id, unlocked: true, unlockedAt: Date.now() };
        await db.badges.put(newBadges[b.id]);
        unlockedName = b.name;
      }
    }

    // Clear cart
    await db.cart.clear();

    const orders = await db.orders.orderBy('date').reverse().limit(20).toArray();
    set({ user: newUser, cart: {}, badges: newBadges, selectedSlot: null, orders, _modifyingOrderId: null });

    const leveledUp = getLevelInfo(newUser.xp).level > prevLvl;
    if (unlockedName) setTimeout(() => showToast(`Insignia desbloqueada: ${unlockedName}`), 1200);

    return { order, totalXP, leveledUp, newLevel: getLevelInfo(newUser.xp).level };
  },

  cancelOrder: async (orderId) => {
    const { showToast } = get();
    const order = await db.orders.get(orderId);
    if (!order || order.status !== 'pendiente') return;
    const updated = { ...order, status: 'cancelado', canceledAt: Date.now() };
    await db.orders.put(updated);
    const orders = await db.orders.orderBy('date').reverse().limit(20).toArray();
    set({ orders });
    showToast('Pedido cancelado');
  },

  modifyOrder: async (order) => {
    const { showToast } = get();
    await db.cart.clear();
    const nextCart = {};
    for (const item of order.items) {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) continue;
      const updated = { productId: product.id, product, qty: item.qty, customization: item.customization || '' };
      await db.cart.put(updated);
      nextCart[product.id] = updated;
    }
    const slotIndex = SLOTS.findIndex(s => s.time === order.slotLabel);
    set({ cart: nextCart, selectedSlot: slotIndex >= 0 ? slotIndex : null, _modifyingOrderId: order.id });
    showToast('Pedido listo para modificar');
    get().navigate('editorder');
  },

  // ─── Favs ────────────────────────────────────────────────
  toggleFav: async (productId) => {
    const { favs, showToast } = get();
    const next = new Set(favs);
    if (next.has(productId)) {
      next.delete(productId);
      await db.favs.delete(productId);
      showToast('Eliminado de favoritos');
    } else {
      next.add(productId);
      await db.favs.put({ productId });
      showToast('Guardado en favoritos');
    }
    set({ favs: next });
  },

  // ─── Notifs ──────────────────────────────────────────────
  markNotifRead: async (id) => {
    await db.notifs.update(id, { read: true });
    set(s => ({ notifs: s.notifs.map(n => n.id === id ? { ...n, read: true } : n) }));
  },

  // ─── Accessibility ───────────────────────────────────────
  toggleA11y: async (key) => {
    const active = document.body.classList.toggle(key);
    await db.a11y.put({ key, val: active });
    set(s => ({ a11y: { ...s.a11y, [key]: active } }));
  },

  setCat: (cat) => set({ currentCat: cat }),

  // ─── Repeat order ────────────────────────────────────────
  repeatOrder: async (order) => {
    const { showToast } = get();
    for (const item of order.items) {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) continue;
      const existing = get().cart[product.id];
      const updated = existing
        ? { ...existing, qty: existing.qty + item.qty, customization: item.customization || existing.customization }
        : { productId: product.id, product, qty: item.qty, customization: item.customization || '' };
      await db.cart.put(updated);
      set(s => ({ cart: { ...s.cart, [product.id]: updated } }));
    }
    showToast('Pedido anterior agregado al carrito');
  },

  logout: async () => {
    await db.a11y.delete('session');
    set({ loggedIn: false, cart: {}, selectedSlot: null, currentScreen: 'home' });
  },

  setLoggedIn: (val) => set({ loggedIn: val }),
}));
