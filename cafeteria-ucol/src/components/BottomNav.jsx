import { Home, Coffee, ShoppingCart, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store';
import { announce } from './A11yPanel';

const NAV_ITEMS = [
  { id: 'home',    label: 'Inicio',  Icon: Home },
  { id: 'menu',    label: 'Menú',    Icon: Coffee },
  { id: 'cart',    label: 'Carrito', Icon: ShoppingCart },
  { id: 'profile', label: 'Perfil',  Icon: User },
];

export function BottomNav() {
  const { currentScreen, navigate, cart } = useStore();
  const cartCount = Object.values(cart).reduce((a, i) => a + i.qty, 0);

  return (
    <nav className="bg-brown flex shrink-0" role="navigation" aria-label="Navegación principal">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = currentScreen === id;
        const isCart = id === 'cart';
        return (
          <button
            key={id}
            onClick={() => { navigate(id); announce(label); }}
            className={clsx(
              'flex-1 flex flex-col items-center gap-1 py-2.5 pb-[22px] transition-colors duration-200',
              active ? 'bg-white/15' : ''
            )}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <div className="relative">
              <Icon
                size={24}
                strokeWidth={active ? 2.2 : 1.7}
                className={active ? 'text-white' : 'text-white/60'}
              />
              {isCart && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-accent text-white text-[9px] font-extrabold rounded-full flex items-center justify-center px-0.5 border-[1.5px] border-brown">
                  {cartCount}
                </span>
              )}
            </div>
            <span className={clsx('text-[11px] font-bold tracking-wide', active ? 'text-white' : 'text-white/60')}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
