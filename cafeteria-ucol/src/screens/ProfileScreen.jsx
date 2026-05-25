import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { getLevelInfo, BADGES } from '../data/catalog';
import { XPBar, SectionTitle, Button } from '../components/ui';
import { announce } from '../components/A11yPanel';

export function ProfileScreen() {
  const { user, orders, badges, navigate, repeatOrder, logout, cancelOrder, modifyOrder } = useStore();
  const li = getLevelInfo(user.xp);
  const unlockedCount = BADGES.filter(b => badges[b.id]?.unlocked).length;

  const activeOrders = orders.filter(o => o.status === 'pendiente' || o.status === 'preparando');
  const historyOrders = orders.filter(o => !o.status || o.status === 'completado' || o.status === 'cancelado');

  const statusConfig = {
    pendiente: { label: 'Pendiente', classes: 'bg-amber-50 text-amber-700' },
    preparando: { label: 'En preparación', classes: 'bg-sky-50 text-sky-700' },
    listo: { label: 'Listo para recoger', classes: 'bg-green-50 text-green-700' },
    cancelado: { label: 'Cancelado', classes: 'bg-red-50 text-red-700' },
    completado: { label: 'Completado', classes: 'bg-green-50 text-green-700' },
  };

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">

      {/* Profile hero */}
      <div className="bg-brown px-5 pt-6 pb-7 text-center shadow-[0_2px_12px_rgba(44,21,8,.18)]">
        <div className="relative inline-block mb-3">
          <div className="w-[72px] h-[72px] rounded-full bg-white/15 border-2 border-white/30
            flex items-center justify-center mx-auto">
            <User size={32} strokeWidth={1.5} className="text-white" />
          </div>
          <span className="absolute bottom-0 right-0 w-[26px] h-[26px] bg-accent rounded-full
            flex items-center justify-center text-[11px] font-extrabold text-white border-2 border-brown"
            aria-label={`Nivel ${li.level}`}>
            {li.level}
          </span>
        </div>
        <div className="text-[20px] font-extrabold text-white">{user.name}</div>
        <div className="text-[13px] font-medium text-white/80 mt-1">{li.name} · {user.streak} días de racha</div>
        <XPBar xp={user.xp} min={li.min} max={li.max}
          label={`XP ${user.xp} / ${li.max}`} sublabel={`Nivel ${li.level}`} />
      </div>

      <div className="px-4 pt-4 pb-6">

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4" role="list" aria-label="Estadísticas">
          {[
            { num: user.totalOrders, label: 'Pedidos realizados' },
            { num: user.xp,          label: 'XP acumulado' },
            { num: user.streak,      label: 'Racha actual' },
            { num: unlockedCount,    label: 'Insignias obtenidas' },
          ].map((s, i) => (
            <motion.div key={i} role="listitem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.24 }}
              className="bg-white rounded-[16px] p-3.5 text-center
                shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]"
              aria-label={`${s.label}: ${s.num}`}
            >
              <div className="text-[26px] font-extrabold text-brown">{s.num}</div>
              <div className="text-[11px] text-brown/45 font-semibold mt-0.5 leading-tight">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Streak */}
        <div className="bg-brown rounded-[18px] p-4 flex items-center justify-between mb-4
          shadow-[0_4px_20px_rgba(44,21,8,.22)]"
          role="status"
          aria-label={`Racha actual: ${user.streak} días consecutivos`}>
          <div>
            <div className="text-[15px] font-bold text-white">Racha actual</div>
            <div className="text-[13px] text-white/80 font-medium mt-1">
              {user.streak >= 10 ? '¡Increíble, sigue así!' : `${10 - user.streak} días para la próxima insignia`}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[48px] font-extrabold leading-none" style={{ color: '#FFD699' }}>{user.streak}</div>
            <div className="text-[12px] text-white/80 font-semibold">días</div>
          </div>
        </div>

        {/* Pedidos activos */}
        <SectionTitle>Pedidos activos</SectionTitle>
        {activeOrders.length === 0 ? (
          <p className="text-[13px] text-brown/40 font-medium text-center py-6">No hay pedidos activos por el momento.</p>
        ) : (
          activeOrders.map((order, i) => {
            const status = statusConfig[order.status] || statusConfig.pendiente;
            return (
              <motion.div key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.22 }}
                className="bg-white rounded-[16px] p-3.5 mb-2.5
                  shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]"
                role="article"
                aria-label={`Pedido activo ${order.code || order.id}, total $${order.total}`}>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="text-[13px] font-bold text-brown">Pedido {order.code || order.id}</div>
                    <div className="text-[12px] text-brown/40 font-semibold">{order.dateLabel} · {order.slotLabel}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-[5px] rounded-full ${status.classes}`}>
                    {status.label}
                  </span>
                </div>
                <div className="text-[12px] text-brown/55 font-medium leading-relaxed">
                  {order.items.map(i => `${i.name}${i.qty > 1 ? ' ×' + i.qty : ''}`).join(' · ')}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold bg-accent/10 text-accent px-2.5 py-[4px] rounded-[6px]">
                    +{order.xp} XP
                  </span>
                  <span className="text-[12px] font-bold text-brown">Total ${order.total}</span>
                  <button
                    onClick={() => { modifyOrder(order); announce('Modificar pedido'); }}
                    className="ml-auto text-[11px] font-bold text-brown bg-cream-dark
                      border border-cream-border rounded-[8px] px-3 py-1.5
                      active:bg-cream-border transition-colors"
                    aria-label={`Modificar pedido ${order.code || order.id}`}>
                    Modificar
                  </button>
                  <button
                    onClick={() => { cancelOrder(order.id); announce('Cancelar pedido'); }}
                    className="text-[11px] font-bold text-red-700 bg-red-50
                      border border-red-100 rounded-[8px] px-3 py-1.5
                      active:bg-red-100 transition-colors"
                    aria-label={`Cancelar pedido ${order.code || order.id}`}>
                    Cancelar
                  </button>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Historial */}
        <SectionTitle>Historial de pedidos</SectionTitle>
        {historyOrders.length === 0 ? (
          <p className="text-[13px] text-brown/40 font-medium text-center py-6">No hay pedidos aún.</p>
        ) : (
          historyOrders.map((order, i) => {
            const status = statusConfig[order.status || 'completado'];
            return (
              <motion.div key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.22 }}
                className="bg-white rounded-[16px] p-3.5 mb-2.5
                  shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]"
                role="article"
                aria-label={`Pedido del ${order.dateLabel}, total $${order.total}`}>
                <div className="flex items-between justify-between mb-1.5 gap-3">
                  <div>
                    <div className="text-[13px] font-bold text-brown">Pedido {order.code || order.id}</div>
                    <div className="text-[12px] text-brown/40 font-semibold">{order.dateLabel} · {order.slotLabel}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-[5px] rounded-full ${status.classes}`}>
                    {status.label}
                  </span>
                </div>
                <div className="text-[12px] text-brown/55 font-medium leading-relaxed">
                  {order.items.map(i => `${i.name}${i.qty > 1 ? ' ×' + i.qty : ''}`).join(' · ')}
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-bold bg-accent/10 text-accent px-2.5 py-[4px] rounded-[6px]">
                    +{order.xp} XP
                  </span>
                  <span className="text-[10px] font-bold text-brown/60">Total ${order.total}</span>
                </div>
              </motion.div>
            );
          })
        )}

        <div className="mt-3">
          <Button variant="secondary" onClick={() => { navigate('achievements'); announce('Logros'); }}>
            Ver todos los logros
          </Button>
          <button
            onClick={() => { logout(); announce('Sesión cerrada'); }}
            className="w-full mt-2.5 py-3 rounded-[14px] border-[1.5px] border-cream-border
              bg-cream-dark flex items-center justify-center gap-2
              text-brown/50 text-[14px] font-bold font-nunito
              active:bg-cream-border transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut size={15} strokeWidth={2} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
