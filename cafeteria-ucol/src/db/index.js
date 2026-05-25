import Dexie from 'dexie';

export const db = new Dexie('CafeUCol');

db.version(1).stores({
  user:    'id',
  cart:    'productId',
  orders:  '++id,date',
  favs:    'productId',
  badges:  'id',
  notifs:  '++id,read',
  a11y:    'key',
});

export const DEFAULT_USER = {
  id: 'me',
  xp: 0,
  streak: 0,
  totalOrders: 0,
  distinctProductIds: [],
  matchaCount: 0,
  earlyOrders: 0,
  offPeakOrders: 0,
  name: '',
  lastOrderDate: null,
};

export const NOTIFS_DEFAULT = [
  { icon: 'zap',    title: 'Reto del día',          text: 'Pide antes de las 10 AM y gana +50 XP.',           time: 'Hace 5 min', read: false },
  { icon: 'flame',  title: 'Racha activa',           text: '¡Llevas varios días consecutivos, no la rompas!',   time: 'Hace 2h',    read: false },
  { icon: 'star',   title: 'Combo nuevo disponible', text: 'El Combo Matcha está disponible hoy.',              time: 'Hace 4h',    read: false },
  { icon: 'sun',    title: 'Horario recomendado',    text: 'Las 8:00 AM tiene baja afluencia hoy.',             time: 'Ayer',       read: false },
  { icon: 'award',  title: 'Insignia desbloqueada',  text: 'Obtuviste la insignia "Cliente Frecuente".',        time: 'Hace 2 días',read: false },
];

export const NOTIFS_NEW_USER = [
  { icon: 'star',   title: '¡Bienvenido a CaféUCol!',     text: 'Tu cuenta fue creada con éxito. Explora el menú y haz tu primer pedido.',           time: 'Ahora',      read: false },
  { icon: 'zap',    title: 'Gana XP con cada pedido',     text: 'Cada producto que pidas te da puntos XP. Acumula XP para subir de nivel.',          time: 'Ahora',      read: false },
  { icon: 'award',  title: 'Desbloquea insignias',        text: 'Completa retos y haz pedidos para desbloquear insignias exclusivas de la cafetería.',time: 'Ahora',      read: false },
];
