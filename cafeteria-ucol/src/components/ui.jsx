import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

/* ─────────────────────────────────────────────────────────────
   UI Components — siguiendo el doc:
   • Material Design como guía (cards, nav inferior, botones, diálogos)
   • Estilo semi-flat moderno
   • Paleta: café oscuro, crema, naranja suave, verde matcha, beige cálido
   • Sombras suaves, bordes redondeados, microanimaciones (Framer Motion)
   • Glassmorphism en overlays
   ───────────────────────────────────────────────────────────── */

// ─── Card (Material elevation 1) ───────────────────────────
export function Card({ children, className, onClick }) {
  return (
    <motion.div
      className={clsx(
        'bg-white rounded-[18px] overflow-hidden',
        'shadow-[0_1px_3px_rgba(44,21,8,.07),0_2px_8px_rgba(44,21,8,.05)]',
        className
      )}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.975 } : undefined}
      transition={{ duration: 0.14 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Button (Material filled / outlined) ───────────────────
export function Button({ children, onClick, variant = 'primary', disabled, className, type = 'button' }) {
  const base = clsx(
    'w-full py-[14px] rounded-[14px] font-nunito font-bold text-[15px] tracking-wide',
    'transition-all duration-200 outline-none',
    'focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-accent/60',
    'active:scale-[.975]',
    'text-white'
  );
  const variants = {
    primary:   'bg-accent text-white shadow-[0_4px_14px_rgba(217,98,40,.28)] disabled:bg-cream-border disabled:text-brown/30 disabled:shadow-none',
    secondary: 'bg-brown text-white border-transparent hover:bg-brown/90 disabled:bg-brown/50 disabled:text-white/60',
    danger:    'bg-red-600 text-white shadow-[0_4px_14px_rgba(220,38,38,.25)]',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={clsx(base, variants[variant], className)}>
      {children}
    </button>
  );
}

// ─── Chip (Material filter chip) ───────────────────────────
export function Chip({ label, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.12 }}
      className={clsx(
        'shrink-0 px-4 py-[7px] rounded-full text-[12px] font-bold',
        'border-[1.5px] transition-all duration-200 font-nunito',
        active
          ? 'bg-brown text-white border-brown shadow-sm'
          : 'bg-white text-brown/65 border-cream-border hover:border-brown/30'
      )}
    >
      {label}
    </motion.button>
  );
}

// ─── XP Bar con gradiente naranja ──────────────────────────
export function XPBar({ xp, min, max, label, sublabel }) {
  const pct = Math.min(100, Math.max(0, ((xp - min) / (max - min)) * 100));
  return (
    <div className="mt-3">
      <div className="flex justify-between mb-[5px]">
        <span className="text-[12px] font-semibold text-white">{label}</span>
        <span className="text-[12px] font-semibold text-white">{sublabel}</span>
      </div>
      <div className="h-[6px] rounded-full bg-white/15 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #D96228, #F59042)' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

// ─── Section Title ──────────────────────────────────────────
export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-[13px] font-extrabold text-brown tracking-tight leading-none">{children}</span>
      {action && (
        <button onClick={action.onClick}
          className="text-[12px] font-bold text-accent active:opacity-70 transition-opacity">
          {action.label}
        </button>
      )}
    </div>
  );
}

// ─── Skeleton loader ────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={clsx('skeleton', className)} />;
}

// ─── Toast — Material Snackbar ──────────────────────────────
export function Toast({ visible, message }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className={clsx(
            'absolute bottom-[72px] left-1/2 -translate-x-1/2 z-[900]',
            'bg-[#2C1508] text-white px-4 py-3 rounded-xl',
            'text-[12px] font-semibold shadow-lg whitespace-normal text-center break-words max-w-[calc(100vw-72px)] pointer-events-none',
            'backdrop-blur-sm'
          )}
          role="status"
          aria-live="polite"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Bottom Sheet — Material bottom sheet ──────────────────
export function BottomSheet({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[800] flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          {/* Glassmorphism backdrop */}
          <div className="absolute inset-0 bg-brown/40 backdrop-blur-[2px]" />
          <motion.div
            className={clsx(
              'relative w-full rounded-t-[24px] pt-[10px] pb-7 px-5',
              'max-h-[82%] overflow-y-auto no-scroll',
              'bg-cream-DEFAULT',
              'shadow-[0_-4px_32px_rgba(44,21,8,.18)]'
            )}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.9 }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="w-9 h-1 rounded-full bg-cream-border mx-auto mb-4" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Alert Dialog — Material dialog (Radix AlertDialog pattern)
export function AlertDialog({ open, onClose, title, message, onConfirm, confirmLabel = 'Confirmar', confirmVariant = 'danger' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[850] flex items-center justify-center px-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-brown/45 backdrop-blur-[2px]" />
          <motion.div
            className="relative w-full bg-white rounded-[20px] p-6 shadow-[0_20px_60px_rgba(44,21,8,.3)]"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <h3 className="text-[16px] font-extrabold text-brown mb-2 tracking-tight">{title}</h3>
            <p className="text-[13px] text-brown/55 font-medium mb-5 leading-relaxed">{message}</p>
            <div className="flex gap-2.5">
              <Button variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
              <Button variant={confirmVariant} className="flex-1" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Progress bar (retos/challenges) ────────────────────────
export function ProgressBar({ value }) {
  return (
    <div className="h-[4px] rounded-full bg-cream-border mt-2 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(90deg, #D96228, #F59042)' }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
      />
    </div>
  );
}

// ─── Status Pill (horarios) ─────────────────────────────────
export function StatusPill({ level }) {
  const cfg = {
    low: { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500', label: 'Disponible' },
    mid: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400', label: 'Moderado'   },
    hi:  { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500',   label: 'Saturado'   },
  }[level] || {};
  return (
    <span className={clsx('inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full', cfg.bg, cfg.text)}>
      <span className={clsx('w-[6px] h-[6px] rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ─── Page Header (sticky, brown bg) ────────────────────────
export function PageHeader({ title, subtitle, right, xpData }) {
  return (
    <div className="bg-brown px-5 pt-[18px] pb-[20px] sticky top-0 z-50
      shadow-[0_2px_12px_rgba(44,21,8,.18)]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[23px] font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] font-medium text-white/80 mt-0.5 leading-tight">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
      {xpData && (
        <XPBar xp={xpData.xp} min={xpData.min} max={xpData.max}
          label={`XP ${xpData.xp} / ${xpData.max}`}
          sublabel={`Nivel ${xpData.level}`} />
      )}
    </div>
  );
}

// ─── Icon Button ────────────────────────────────────────────
export function IconButton({ onClick, children, badge, label }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={{ duration: 0.12 }}
      aria-label={label}
      className="relative w-9 h-9 rounded-full bg-white/12 flex items-center justify-center
        focus-visible:ring-2 focus-visible:ring-cream-DEFAULT/50"
    >
      {children}
      {badge && (
        <span className="absolute top-[3px] right-[3px] w-[8px] h-[8px] bg-accent rounded-full border-[1.5px] border-brown" />
      )}
    </motion.button>
  );
}

// ─── Empty State ────────────────────────────────────────────
export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mb-5 text-cream-border">
        {icon}
      </div>
      <h3 className="text-[15px] font-bold text-brown/55 mb-2">{title}</h3>
      <p className="text-[13px] text-brown/38 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
