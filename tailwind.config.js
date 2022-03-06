const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require('tailwindcss/plugin');


/** @type {import("tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: [
    "index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        "tablet": "850px",
        "desktop": "1090px"
      }
    },
  },
  plugins: [
    require('tailwindcss-children'),
    require('@tailwindcss/typography'),
    plugin(function({ addVariant }) {
      addVariant('not-hover', '&:not(:hover)');
      addVariant('not-active', '&:not(:active)');
      addVariant('not-focus', '&:not(:focus)');
      addVariant('not-focus-visible', '&:not(:focus-visible)');
      addVariant('not-disabled', '&:not([disabled])');
    })
  ],
}
