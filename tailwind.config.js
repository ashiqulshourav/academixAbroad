/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js,php}"],
  theme: {
    extend: {
      borderRadius: {
        "serviceActive": '0 0 10px 10px'
      },
      dropShadow: {
        'textShadow': '1px 2px 2px rgba(0,48,67,0.2)',
      },
      boxShadow: {       
        'serviceBoxShadow': 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        'ribbonShadow': '0 5px 10px rgba(27, 0, 0, 0.1)',
        'radioShadow': 'inset 0 0 0 .125em #c19267',
        'hoverRadioShadow': 'inset 0 0 0 .4375em #c19267',
        'textRadioShadow': 'inset 0 1px 3px rgba(0,0,0,.28)',
        'checkboxShadow': '0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05)',
      },
      colors: {
        "iconBg": '#b8b8b8',
        "themeColor": '#2f97f5',
        'bodyBg' : '#f5f5f5',
        'notblack' : '#1b3043',
        'gold': '#c9b55b',
        'red': 'red',
        'ribbon': '#3498db',
      },
      zIndex: {
        '-1': '-1px'
      },
      backgroundImage: {
        // 'largeSettementBg': "url('../img/bg.webp')",
        // 'footerUp': "linear-gradient(0deg, rgba(4, 30, 77, 0.1), rgba(4, 30, 77, 0.1)), url('../img/roundup2.webp')",
        // 'footerUp': "url('../img/footer.webp')",
      },
      keyframes: {
        buttonSpin: {
          'from': { transform: 'rotate(0turn)' },
          'to': { transform: 'rotate(1turn)' }
        }
      },
      animation: {
        buttonSpin: 'buttonSpin 1s ease infinite'
      }
    },
  },
  plugins: [],
}