/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        // Café accesible — header, nav, cards oscuras
        brown: {
          DEFAULT: '#4D2F21',
          light:   '#72503D',
          medium:  '#8C6A54',
        },
        // Crema cálida — fondo general, tarjetas
        cream: {
          DEFAULT: '#FDF5EB',   // crema cálida, tono miel
          dark:    '#F0E2CC',   // crema más oscura para fondos de iconos
          border:  '#DDC9A8',   // borde cálido
        },
        // Naranja suave — accent principal (doc: "naranja suave")
        accent:  '#C85820',
        // Verde matcha — badges, completado
        matcha:  '#4E6E34',
        // Beige cálido — textos secundarios sobre fondo oscuro
        beige:   '#F0C882',
      },
      borderRadius: {
        'xl2': '18px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(44,21,8,.07), 0 2px 8px rgba(44,21,8,.05)',
        md:   '0 4px 16px rgba(44,21,8,.12)',
        lg:   '0 8px 32px rgba(44,21,8,.18)',
      },
    },
  },
  plugins: [],
}
