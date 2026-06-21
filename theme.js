// =============================================
// Soyda Portfolio — Theme Switcher
// Cycles through 12 terminal-style themes
// Respects prefers-color-scheme on first load
// Saves preference to localStorage
// =============================================

(function () {
  const THEMES = [
    'theme-gray',       // gray light (default)
    'theme-dark',       // dark terminal green
    'theme-blue',       // blue light
    'theme-blue-dark',  // dark navy blue
    'theme-emerald',    // emerald light
    'theme-emerald-dark', // dark terminal green
    'theme-violet',     // violet light
    'theme-violet-dark',  // dark purple
    'theme-amber',      // amber light
    'theme-amber-dark',   // dark terminal amber
    'theme-rose',       // rose light
    'theme-rose-dark',    // dark terminal pink
  ];
  const STORAGE_KEY = 'soyda-theme';
  const BTN_ID = 'theme-switcher';

  function getPreferred() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'theme-dark'; // default to terminal green on dark mode
    }
    return 'theme-gray'; // default light
  }

  function applyTheme(theme) {
    document.body.classList.remove(...THEMES);
    document.body.classList.add(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    let currentTheme = saved || getPreferred();

    // Ensure at least one theme class is active
    if (!document.body.classList.contains(currentTheme)) {
      currentTheme = getPreferred();
    }

    document.body.classList.add(currentTheme);

    const btn = document.getElementById(BTN_ID);
    if (!btn) return;

    function cycle() {
      let ci = THEMES.indexOf(currentTheme);
      if (ci === -1) ci = 0;
      currentTheme = THEMES[(ci + 1) % THEMES.length];
      applyTheme(currentTheme);
    }

    btn.addEventListener('click', cycle);
    btn.setAttribute('aria-label', 'Cycle through themes (' + THEMES.length + ')');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
