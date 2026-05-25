import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store';
import { BottomNav } from './components/BottomNav';
import { A11yPanel } from './components/A11yPanel';
import { Toast } from './components/ui';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';
import { CartScreen } from './screens/CartScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { EditOrderScreen } from './screens/EditOrderScreen';
import {
  NotificationsScreen,
  AchievementsScreen,
  FavoritesScreen,
  ReviewScreen,
  SuccessScreen,
} from './screens/SecondaryScreens';

const NAV_SCREENS = ['home', 'menu', 'cart', 'profile'];

const variants = {
  enter:  { x: '100%', opacity: 0 },
  center: { x: 0,      opacity: 1 },
  exit:   { x: '-8%',  opacity: 0.5 },
};

function Screen({ id, children }) {
  const currentScreen = useStore(s => s.currentScreen);
  if (currentScreen !== id) return null;
  return (
    <motion.div
      key={id}
      className="absolute inset-0 flex flex-col overflow-hidden"
      initial="enter" animate="center" exit="exit"
      variants={variants}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { load, loaded, loggedIn, currentScreen, toastMsg, toastVisible } = useStore();
  const isNavScreen = NAV_SCREENS.includes(currentScreen);

  useEffect(() => { load(); }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-brown">
        <div className="text-cream-DEFAULT/50 font-bold text-[14px] font-nunito">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#120804]">
      <div
        className="relative flex flex-col overflow-hidden font-nunito"
        style={{
          width: 'min(390px, 100vw)',
          height: 'min(844px, 100vh)',
          borderRadius: 'min(48px, 4vw)',
          background: '#FFFDF9',
          boxShadow: '0 0 0 1.5px #2C1508, 0 30px 80px rgba(0,0,0,.7)',
        }}
      >
        <StatusBar />

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {!loggedIn ? (
              <motion.div
                key="login"
                className="absolute inset-0 flex flex-col overflow-hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <LoginScreen />
              </motion.div>
            ) : (
              <>
                <Screen id="home"><HomeScreen /></Screen>
                <Screen id="menu"><MenuScreen /></Screen>
                <Screen id="cart"><CartScreen /></Screen>
                <Screen id="profile"><ProfileScreen /></Screen>
                <Screen id="notifications"><NotificationsScreen /></Screen>
                <Screen id="achievements"><AchievementsScreen /></Screen>
                <Screen id="favorites"><FavoritesScreen /></Screen>
                <Screen id="review"><ReviewScreen /></Screen>
                <Screen id="success"><SuccessScreen /></Screen>
                <Screen id="editorder"><EditOrderScreen /></Screen>
              </>
            )}
          </AnimatePresence>

          {loggedIn && <A11yPanel />}
        </div>

        <Toast visible={toastVisible} message={toastMsg} />
        {loggedIn && isNavScreen && <BottomNav />}
      </div>
    </div>
  );
}

function StatusBar() {
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  return (
    <div className="bg-brown px-7 pt-3.5 pb-2.5 flex items-center justify-between shrink-0">
      <span className="text-cream-DEFAULT text-[13px] font-bold">{time}</span>
      <span className="text-white text-[13px] font-extrabold tracking-wide">CaféUCol</span>
      <span className="text-cream-DEFAULT/70 text-[12px] font-semibold">●●●</span>
    </div>
  );
}
