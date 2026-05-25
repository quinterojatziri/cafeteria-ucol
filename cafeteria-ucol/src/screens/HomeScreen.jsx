import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useStore } from '../store';
import { getLevelInfo, BADGES, CHALLENGES, PRODUCTS, getChallengeProgress } from '../data/catalog';
import { PageHeader, SectionTitle, ProgressBar, IconButton } from '../components/ui';
import { announce, sounds } from '../components/A11yPanel';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

export function HomeScreen() {
  const { user, badges, notifs, navigate, addToCart } = useStore();
  const li = getLevelInfo(user.xp);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';
  const unread = notifs.filter(n => !n.read).length;
  const combo = PRODUCTS.find(p => p.id === 'combo1');
  const challengeProgress = getChallengeProgress(user);

  return (
    <div className="flex-1 overflow-y-auto no-scroll bg-cream-DEFAULT" role="main">
      <PageHeader
        title={greeting}
        subtitle={`${li.name} · Nivel ${li.level}`}
        right={
          <IconButton
            onClick={() => { navigate('notifications'); announce('Notificaciones'); }}
            badge={unread > 0}
            label={`Notificaciones${unread > 0 ? `, ${unread} sin leer` : ''}`}
          >
            <Bell size={18} strokeWidth={1.7} className="text-cream-DEFAULT" />
          </IconButton>
        }
        xpData={{ xp: user.xp, min: li.min, max: li.max, level: li.level }}
      />

      <motion.div variants={container} initial="hidden" animate="show" className="pb-6">

        {/* ── Combo del día ──────────────────────────────── */}
        {combo && (
          <motion.section variants={fadeUp} className="px-4 pt-5" aria-label="Combo del día">
            <SectionTitle>Combo del día</SectionTitle>
            <motion.button
              className="w-full bg-brown rounded-[18px] p-4 flex items-center gap-4 text-left
                shadow-[0_4px_20px_rgba(44,21,8,.22)] active:scale-[.975] transition-transform"
              whileTap={{ scale: 0.975 }}
              onClick={() => { addToCart(combo); sounds.play('add'); announce(`${combo.name} agregado al carrito`); }}
              aria-label={`${combo.name}, $${combo.price}, +${combo.xp} XP. Toca para agregar al carrito.`}
            >
              {/* Ícono */}
              <div className="w-[54px] h-[54px] rounded-[14px] bg-white/15 flex items-center justify-center shrink-0">
                <CoffeeIcon className="stroke-white" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-extrabold text-white leading-tight">{combo.name}</div>
                <div className="text-[13px] text-white/85 font-medium mt-1 leading-tight truncate">{combo.desc}</div>
              </div>
              {/* Price */}
              <div className="text-right shrink-0">
                <div className="text-[19px] font-extrabold text-white">${combo.price}</div>
                <div className="text-[12px] font-bold mt-0.5" style={{ color: '#FFD699' }}>+{combo.xp} XP</div>
              </div>
            </motion.button>
          </motion.section>
        )}

        {/* ── Retos activos ──────────────────────────────── */}
        <motion.section variants={fadeUp} className="px-4 pt-5" aria-label="Retos activos">
          <SectionTitle>Retos activos</SectionTitle>
          {CHALLENGES.map(c => (
            <motion.div
              key={c.id}
              className="bg-white rounded-[16px] p-3.5 flex items-start gap-3 mb-2.5
                shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]"
              whileTap={{ scale: 0.98 }}
              onClick={() => announce(`Reto: ${c.title}. ${c.desc}. Gana ${c.xp} XP al completar.`)}
              role="article"
              aria-label={`Reto: ${c.title}. ${c.desc}. +${c.xp} XP al completar.`}
            >
              <div className="w-10 h-10 rounded-[10px] bg-cream-dark flex items-center justify-center shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  className="stroke-beige" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-brown leading-tight">{c.title}</div>
                <div className="text-[11px] text-brown/50 font-medium mt-0.5 leading-relaxed">{c.desc}</div>
                <div className="text-[11px] font-bold text-accent mt-1">+{c.xp} XP al completar</div>
                <ProgressBar value={c.progress} />
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ── Insignias ──────────────────────────────────── */}
        <motion.section variants={fadeUp} className="pt-5" aria-label="Insignias">
          <div className="px-4">
            <SectionTitle action={{ label: 'Ver todos', onClick: () => { navigate('achievements'); announce('Logros y logros'); } }}>
              Insignias
            </SectionTitle>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scroll px-4 pb-1" role="list">
            {BADGES.slice(0, 7).map(b => {
              const unlocked = !!badges[b.id]?.unlocked;
              return (
                <div
                  key={b.id}
                  className="flex flex-col items-center gap-1.5 shrink-0"
                  role="listitem"
                  aria-label={`${b.name}: ${unlocked ? 'desbloqueada' : 'bloqueada'}`}
                  onClick={() => announce(`Insignia: ${b.name}. ${unlocked ? 'Ya la tienes desbloqueada.' : `Bloqueada. Gana ${b.xp} XP al obtenerla.`}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center border-2 transition-all ${
                    unlocked
                      ? 'bg-accent/10 border-accent'
                      : 'bg-cream-dark border-cream-border opacity-40'
                  }`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      className={unlocked ? 'stroke-accent' : 'stroke-beige'}
                      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      {unlocked
                        ? <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>
                        : <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>
                      }
                    </svg>
                  </div>
                  <span className="text-[10px] font-semibold text-brown/45 max-w-[56px] text-center leading-tight">
                    {b.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Racha ──────────────────────────────────────── */}
        <motion.section variants={fadeUp} className="px-4 pt-5" aria-label="Racha actual">
          <div className="bg-brown rounded-[18px] p-4 flex items-center justify-between
            shadow-[0_4px_20px_rgba(44,21,8,.22)]"
            role="status"
            aria-label={`Racha actual: ${user.streak} días consecutivos`}
          >
            <div>
              <div className="text-[15px] font-bold text-white">Racha actual</div>
              <div className="text-[13px] text-white/80 font-medium mt-1 leading-tight">
                {user.streak >= 10
                  ? '¡Increíble, sigue así!'
                  : `${10 - user.streak} días para la próxima insignia`}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[48px] font-extrabold leading-none" style={{ color: '#FFD699' }}>
                {user.streak}
              </div>
              <div className="text-[12px] text-white/80 font-semibold">días</div>
            </div>
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}

function CoffeeIcon({ className = '' }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      className={className} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1"/>
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  );
}
