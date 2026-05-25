import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Volume2, VolumeX, Eye, Moon, Sun, ZoomIn, Type, Maximize2, Minimize2, X } from 'lucide-react';
import { useStore } from '../store';

/* ─── Opciones del panel ─────────────────────────────────────
   Siguiendo el documento:
   • Visuales: texto grande, alto contraste, modo oscuro, reducir animaciones, glassmorphism off
   • Cognitivas: simplificar interfaz, espaciado visual aumentado
   • Motrices: botones más grandes, mayor área táctil
   • Auditivas: vibración háptica, sonidos de confirmación
   • Extra: lector de pantalla (TTS)
   ──────────────────────────────────────────────────────────── */
const SECTIONS = [
  {
    label: 'Visual',
    options: [
      { key: 'a11y-large-text',    label: 'Texto grande',        desc: '+20% tamaño de fuente',          icon: ZoomIn },
      { key: 'a11y-high-contrast', label: 'Alto contraste',      desc: 'Colores con máximo contraste',   icon: Eye },
      { key: 'a11y-dark',          label: 'Modo oscuro',         desc: 'Fondo oscuro, menos brillo',     icon: Moon },
      { key: 'a11y-no-anim',       label: 'Sin animaciones',     desc: 'Elimina transiciones y efectos', icon: Minimize2 },
    ],
  },
  {
    label: 'Cognitivo',
    options: [
      { key: 'a11y-dyslexia',      label: 'Fuente dislexia',     desc: 'Espaciado y fuente legible',     icon: Type },
      { key: 'a11y-spacing',       label: 'Más espacio',         desc: 'Aumenta separación visual',      icon: Maximize2 },
    ],
  },
  {
    label: 'Motor',
    options: [
      { key: 'a11y-large-touch',   label: 'Botones grandes',     desc: 'Mayor área táctil en controles', icon: Maximize2 },
    ],
  },
  {
    label: 'Auditivo & TTS',
    options: [
      { key: 'a11y-tts',           label: 'Lector de pantalla',  desc: 'Lee el contenido en voz alta',   icon: Volume2,  special: 'tts' },
      { key: 'a11y-sounds',        label: 'Sonidos UI',          desc: 'Sonidos de confirmación',        icon: Volume2,  special: 'sounds' },
      { key: 'a11y-haptic',        label: 'Vibración háptica',   desc: 'Vibra al confirmar acciones',    icon: Volume2,  special: 'haptic' },
    ],
  },
];

/* ─── TTS Engine ─────────────────────────────────────────────
   Usa la Web Speech API nativa (disponible en todos los browsers modernos)
   ──────────────────────────────────────────────────────────── */
class TTSEngine {
  constructor() {
    this._enabled = false;
    this._synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this._lastSpoken = '';
  }

  get supported() { return !!this._synth; }

  enable() {
    this._enabled = true;
    this.speak('Lector de pantalla activado. CaféUCol, aplicación de cafetería universitaria.');
  }

  disable() {
    this._synth?.cancel();
    this._enabled = false;
  }

  speak(text, priority = false) {
    if (!this._enabled || !this._synth) return;
    if (!priority && text === this._lastSpoken) return;
    this._lastSpoken = text;
    this._synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-MX';
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    // Prefer a Spanish voice if available
    const voices = this._synth.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
    if (esVoice) utter.voice = esVoice;
    this._synth.speak(utter);
  }

  stop() { this._synth?.cancel(); }
}

export const tts = new TTSEngine();

/* ─── Sounds ─────────────────────────────────────────────────*/
class SoundEngine {
  constructor() { this._enabled = false; this._ctx = null; }
  enable() {
    this._enabled = true;
    const ctx = this._ctx_get();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }
  disable() { this._enabled = false; }
  _ctx_get() {
    if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this._ctx;
  }
  play(type = 'confirm') {
    if (!this._enabled) return;
    try {
      const ctx = this._ctx_get();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      const freqs = { confirm: [523, 659], error: [330, 220], add: [440, 523], favorite: [659, 784] };
      const [f1, f2] = freqs[type] || freqs.confirm;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.frequency.setValueAtTime(f1, ctx.currentTime);
      osc.frequency.setValueAtTime(f2, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    } catch (_) {}
  }
}

export const sounds = new SoundEngine();

/* ─── Haptics ────────────────────────────────────────────────*/
export function haptic(pattern = [30]) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

/* ─── Live region helper ─────────────────────────────────────*/
export function announce(msg) {
  const el = document.getElementById('a11y-live');
  if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 50); }
  tts.speak(msg);
}

/* ─── Component ──────────────────────────────────────────────*/
export function A11yPanel() {
  const [open, setOpen] = useState(false);
  const { a11y, toggleA11y } = useStore();
  const panelRef = useRef(null);

  // Sync TTS / sounds / haptic with store
  useEffect(() => {
    if (a11y['a11y-tts'])    { tts.enable(); }
    else                     { tts.disable(); }
    if (a11y['a11y-sounds']) sounds.enable();
    else                     sounds.disable();
    // Spacing: add class to <html> so rem-based Tailwind utilities also scale
    if (a11y['a11y-spacing']) {
      document.documentElement.classList.add('a11y-spacing');
    } else {
      document.documentElement.classList.remove('a11y-spacing');
    }
  }, [a11y]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [open]);

  const handleToggle = useCallback(async (key, special) => {
    await toggleA11y(key);
    const next = !a11y[key];

    // Special behaviors
    if (special === 'tts') {
      if (next) tts.enable(); else tts.disable();
    }
    if (special === 'sounds') {
      if (next) { sounds.enable(); sounds.play('confirm'); } else sounds.disable();
    }
    if (special === 'haptic') {
      if (next) haptic([40, 30, 40]);
    }

    // Announce change
    const allOpts = SECTIONS.flatMap(s => s.options);
    const opt = allOpts.find(o => o.key === key);
    if (opt) announce(`${opt.label} ${next ? 'activado' : 'desactivado'}`);
  }, [a11y, toggleA11y]);

  const openPanel = () => {
    setOpen(o => !o);
    announce('Panel de accesibilidad');
  };

  // Keyboard shortcut: Alt+A
  useEffect(() => {
    const handler = (e) => { if (e.altKey && e.key === 'a') setOpen(o => !o); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const activeCount = SECTIONS.flatMap(s => s.options).filter(o => a11y[o.key]).length;

  return (
    <>
      {/* ARIA live region — invisible, for screen readers */}
      <div id="a11y-live" className="sr-live" aria-live="polite" aria-atomic="true" />

      {/* FAB button */}
      <motion.button
        className="absolute bottom-20 right-4 z-[700] w-11 h-11 rounded-full bg-brown flex items-center justify-center shadow-md focus-visible:ring-2 focus-visible:ring-accent"
        whileTap={{ scale: 0.88 }}
        onClick={openPanel}
        aria-label={`Accesibilidad${activeCount > 0 ? `, ${activeCount} opciones activas` : ''}`}
        aria-expanded={open}
        aria-controls="a11y-panel"
        title="Menú de accesibilidad (Alt+A)"
      >
        <Accessibility size={19} strokeWidth={1.7} className="text-white" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[9px] font-extrabold text-white flex items-center justify-center border border-brown">
            {activeCount}
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="a11y-panel"
            role="dialog"
            aria-label="Opciones de accesibilidad"
            className="absolute bottom-[88px] right-4 z-[700] bg-white rounded-2xl shadow-lg border border-cream-border overflow-hidden"
            style={{ width: 240 }}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-cream-border">
              <span className="text-[12px] font-extrabold text-brown tracking-wide uppercase">Accesibilidad</span>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-cream-dark flex items-center justify-center" aria-label="Cerrar">
                <X size={12} strokeWidth={2.5} className="text-brown/60" />
              </button>
            </div>

            {/* Scrollable options */}
            <div className="overflow-y-auto no-scroll" style={{ maxHeight: 380 }}>
              {SECTIONS.map((section, si) => (
                <div key={si}>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[10px] font-extrabold text-brown/35 uppercase tracking-widest">{section.label}</span>
                  </div>
                  {section.options.map(({ key, label, desc, icon: Icon, special }) => {
                    const on = !!a11y[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-dark/50 transition-colors cursor-pointer"
                        onClick={() => handleToggle(key, special)}
                        role="row"
                        aria-label={`${label}: ${on ? 'activado' : 'desactivado'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${on ? 'bg-accent/10' : 'bg-cream-dark'}`}>
                          <Icon size={15} strokeWidth={1.8} className={on ? 'text-accent' : 'text-brown/40'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-bold text-brown leading-tight">{label}</div>
                          <div className="text-[10px] text-brown/40 font-medium leading-tight mt-0.5 truncate">{desc}</div>
                        </div>
                        {/* Toggle switch */}
                        <button
                          role="switch"
                          aria-checked={on}
                          aria-label={label}
                          onClick={e => { e.stopPropagation(); handleToggle(key, special); }}
                          className={`relative w-9 h-[22px] rounded-full transition-colors duration-200 shrink-0 focus-visible:ring-2 focus-visible:ring-accent ${on ? 'bg-matcha' : 'bg-cream-border'}`}
                        >
                          <motion.span
                            className="absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow-sm"
                            animate={{ x: on ? 16 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* TTS controls when active */}
              {a11y['a11y-tts'] && (
                <div className="mx-4 mb-3 mt-1 bg-accent/8 rounded-xl p-3 border border-accent/20">
                  <div className="text-[11px] font-bold text-accent mb-2">Lector activo</div>
                  <div className="flex gap-2">
                    <TTSTestButton label="Probar voz" text="Hola, esto es una prueba del lector de pantalla de CaféUCol." />
                    <button
                      onClick={() => tts.stop()}
                      className="flex-1 py-1.5 rounded-lg bg-brown/10 text-[11px] font-bold text-brown text-center"
                    >
                      Detener
                    </button>
                  </div>
                </div>
              )}

              {/* Reset all */}
              <div className="px-4 pb-4 pt-2">
                <button
                  onClick={() => {
                    SECTIONS.flatMap(s => s.options).forEach(o => {
                      if (a11y[o.key]) handleToggle(o.key, o.special);
                    });
                  }}
                  className="w-full py-2 rounded-xl bg-cream-dark border border-cream-border text-[11px] font-bold text-brown/60 hover:bg-cream-border transition-colors"
                >
                  Restablecer todo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TTSTestButton({ label, text }) {
  return (
    <button
      onClick={() => { tts.speak(text, true); }}
      className="flex-1 py-1.5 rounded-lg bg-accent/15 text-[11px] font-bold text-accent text-center"
    >
      {label}
    </button>
  );
}
