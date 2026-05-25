import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { db, NOTIFS_NEW_USER } from '../db';
import { useStore } from '../store';

// Usuarios demo
const DEMO_USERS = [
  {
    email: 'nuevo@ucol.mx',
    password: '123456',
    name: 'Nuevo Usuario',
    // Datos de usuario recién registrado
    data: {
      xp: 0, streak: 0, totalOrders: 0,
      distinctProductIds: [], matchaCount: 0,
      earlyOrders: 0, offPeakOrders: 0,
      lastOrderDate: null,
    },
    badges: [],
  },
  {
    email: 'jatziri@ucol.mx',
    password: '131989',
    name: 'Jatziri Quintero',
    // Usuario avanzado: Nivel 6, muchas insignias, racha alta
    data: {
      xp: 1850, streak: 22, totalOrders: 64,
      distinctProductIds: ['latte','matcha','frappe','americano','cappuccino','jugo','matchafrio','croissant','pan'],
      matchaCount: 7,
      earlyOrders: 5,
      offPeakOrders: 4,
      lastOrderDate: Date.now(),
    },
    badges: ['b_frequent','b_early','b_explorer','b_streak10','b_matcha'],
  },
];

export function LoginScreen() {
  const [tab, setTab] = useState('login');  // 'login' | 'register'

  return (
    <div
      className="flex flex-col h-full bg-brown overflow-y-auto no-scroll"
      role="main"
      aria-label="Pantalla de acceso"
    >
      {/* Hero */}
      <div className="flex flex-col items-center justify-center pt-14 pb-8 px-6 shrink-0">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 200 }}
          className="w-20 h-20 rounded-[24px] bg-white/15 border border-white/25 flex items-center justify-center mb-5"
          aria-hidden="true"
        >
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"
            className="stroke-white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1"/>
            <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/>
            <line x1="10" y1="1" x2="10" y2="4"/>
            <line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[28px] font-extrabold text-white tracking-tight"
        >
          CaféUCol
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="text-[14px] text-white/80 font-medium mt-1"
        >
          Cafetería universitaria
        </motion.p>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.3 }}
        className="flex-1 bg-cream-DEFAULT rounded-t-[28px] px-5 pt-6 pb-8"
      >
        {/* Tabs */}
        <div className="flex bg-cream-dark rounded-[12px] p-1 mb-6" role="tablist">
          {[
            { id: 'login',    label: 'Iniciar sesión' },
            { id: 'register', label: 'Registrarse' },
          ].map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-[10px] text-[13px] font-bold transition-all duration-200
                ${tab === t.id
                  ? 'bg-white text-brown shadow-[0_1px_4px_rgba(44,21,8,.12)]'
                  : 'text-brown/45'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'login'
          ? <LoginForm />
          : <RegisterForm onDone={() => setTab('login')} />
        }

      </motion.div>
    </div>
  );
}

/* ─── Login form ─────────────────────────────────────────────── */
function LoginForm() {
  const { load, setLoggedIn } = useStore();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // simula latencia

    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!user) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    // Persiste sesión con los datos propios de cada usuario
    await db.user.delete('me');
    await db.user.add({ id: 'me', ...user.data, name: user.name });
    await db.cart.clear();
    await db.orders.clear();

    // Historial de pedidos demo para el usuario Carlos
    if (user.email === 'jatziri@ucol.mx') {
      await db.orders.bulkAdd([
        {
          date: Date.now() - 1000 * 60 * 60 * 24 * 2,
          dateLabel: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          slotLabel: '9:30 AM',
          code: 'C-3481',
          status: 'completado',
          items: [
            { id: 'hotcakes', name: 'Orden de hotcakes', qty: 1, price: 38, xp: 10, image: '/images/products/products/hotcakes.avif', customization: 'Con miel' },
            { id: 'cafe', name: 'Café', qty: 1, price: 20, xp: 5, image: '/images/products/products/cafe.jpeg', customization: '' },
          ],
          total: 58,
          xp: 15,
        },
        {
          date: Date.now() - 1000 * 60 * 60 * 24 * 5,
          dateLabel: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          slotLabel: '12:00 PM',
          code: 'C-5612',
          status: 'completado',
          items: [
            { id: 'desayuno_huevo', name: 'Desayuno (huevo, frijoles, café)', qty: 1, price: 45, xp: 12, image: '/images/products/products/desayuno.jpg', customization: 'Sin chile' },
          ],
          total: 45,
          xp: 12,
        },
        {
          date: Date.now() - 1000 * 60 * 60 * 24 * 10,
          dateLabel: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          slotLabel: '2:20 PM',
          code: 'C-7720',
          status: 'completado',
          items: [
            { id: 'torta_lomo', name: 'Torta de lomo', qty: 1, price: 52, xp: 14, image: '/images/products/products/torta_de_lomo.jpg', customization: 'Sin mayo' },
          ],
          total: 52,
          xp: 14,
        },
      ]);
    }

    await db.badges.clear();
    // Carga las insignias del usuario
    for (const badgeId of (user.badges || [])) {
      await db.badges.put({ id: badgeId, unlocked: true, unlockedAt: Date.now() });
    }
    await db.favs.clear();
    await db.a11y.put({ key: 'session', val: user.email });

    await load();
    setLoggedIn(true);
  };

  return (
    <div>
      <Field label="Correo institucional" id="login-email">
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="usuario@ucol.mx"
          autoComplete="email"
          className={inputCls}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          aria-required="true"
        />
      </Field>

      <Field label="Contraseña" id="login-pw">
        <div className="relative">
          <input
            id="login-pw"
            type={showPw ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className={`${inputCls} pr-11`}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            aria-required="true"
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown/70 transition-colors"
            aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPw ? <EyeOff size={17} strokeWidth={1.8}/> : <Eye size={17} strokeWidth={1.8}/>}
          </button>
        </div>
      </Field>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-[12px] font-semibold mb-3 -mt-1"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        whileTap={{ scale: 0.975 }}
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-[14px] rounded-[14px] bg-accent text-white font-bold text-[15px] font-nunito
          shadow-[0_4px_14px_rgba(200,85,32,.28)] disabled:opacity-60 transition-opacity mt-1"
        aria-busy={loading}
      >
        {loading ? 'Entrando...' : 'Iniciar sesión'}
      </motion.button>
    </div>
  );
}

/* ─── Register form ──────────────────────────────────────────── */
function RegisterForm({ onDone }) {
  const { load, setLoggedIn } = useStore();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Completa todos los campos.');
      return;
    }
    if (!email.includes('@')) {
      setError('Ingresa un correo válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    // Guarda usuario nuevo en DB — siempre desde cero
    await db.user.delete('me');
    await db.user.add({ id: 'me', xp: 0, streak: 0, totalOrders: 0,
      distinctProductIds: [], matchaCount: 0, name: name.trim(), lastOrderDate: null });
    await db.cart.clear();
    await db.orders.clear();
    await db.badges.clear();
    await db.favs.clear();
    // Notificaciones de bienvenida para usuario nuevo (solo 3, todas sin leer)
    await db.notifs.clear();
    await db.notifs.bulkAdd(NOTIFS_NEW_USER.map(n => ({ ...n })));
    await db.a11y.put({ key: 'session', val: email });
    await load();
    setLoggedIn(true);

    setLoading(false);
    onDone();
  };

  return (
    <div>
      <Field label="Nombre completo" id="reg-name">
        <input id="reg-name" type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Tu nombre" autoComplete="name" className={inputCls} aria-required="true" />
      </Field>

      <Field label="Correo institucional" id="reg-email">
        <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="usuario@ucol.mx" autoComplete="email" className={inputCls} aria-required="true" />
      </Field>

      <Field label="Contraseña" id="reg-pw">
        <div className="relative">
          <input id="reg-pw" type={showPw ? 'text' : 'password'} value={password}
            onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
            autoComplete="new-password" className={`${inputCls} pr-11`} aria-required="true"
            onKeyDown={e => e.key === 'Enter' && handleRegister()} />
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown/70 transition-colors"
            aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
            {showPw ? <EyeOff size={17} strokeWidth={1.8}/> : <Eye size={17} strokeWidth={1.8}/>}
          </button>
        </div>
      </Field>

      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-[12px] font-semibold mb-3 -mt-1" role="alert">
          {error}
        </motion.p>
      )}

      <motion.button whileTap={{ scale: 0.975 }} onClick={handleRegister} disabled={loading}
        className="w-full py-[14px] rounded-[14px] bg-accent text-white font-bold text-[15px] font-nunito
          shadow-[0_4px_14px_rgba(200,85,32,.28)] disabled:opacity-60 transition-opacity mt-1"
        aria-busy={loading}>
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </motion.button>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────── */
const inputCls = `w-full bg-white border-2 border-cream-border rounded-[12px]
  px-4 py-3.5 text-[14px] font-medium text-brown placeholder-brown/40
  outline-none focus:border-accent focus:ring-2 focus:ring-accent/20
  transition-all font-nunito`;

function Field({ label, id, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-[13px] font-bold text-brown mb-2 ml-0.5">
        {label}
      </label>
      {children}
    </div>
  );
}
