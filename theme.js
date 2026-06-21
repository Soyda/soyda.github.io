// =============================================
// Soyda Portfolio — Theme Switcher
// Toggles between light/dark variants, persists choice
// Respects prefers-color-scheme as initial preference
// =============================================

(function () {
  const THEMES = ['theme-gray', 'theme-navy-light', 'theme-navy-dark'];
  const STORAGE_KEY = 'soyda-theme';
  const BTN_ID = 'theme-switcher';

  function getPreferred() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'theme-gray-dark';
    }
    return 'theme-gray'; // default light
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    let currentTheme = saved || getPreferred();

    // Ensure at least one theme class is active
    document.body.classList.add(currentTheme);

    const btn = document.getElementById(BTN_ID);
    if (!btn) return;

    function cycle() {
      // Determine next theme in the light/dark sequence
      const idx = THEMES.indexOf(currentTheme);
      const nextLight = THEMES[(idx + 1) % THEMES.length];
      const nextDark = THEMES[((idx + 2) % THEMES.length) + (currentTheme.includes('light') || currentTheme === 'theme-gray' ? -1 : -2)] || THEMES[0];

      // Simplified: just cycle through all 4 known themes
      const ALL_THEMES = ['theme-gray', 'theme-gray-dark', 'theme-navy-light', 'theme-navy-dark'];
      let ci = ALL_THEMES.indexOf(currentTheme);
      if (ci === -1) ci = 0; // fallback
      currentTheme = ALL_THEMES[(ci + 1) % ALL_THEMES.length];

      document.body.classList.remove(...ALL_THEMES);
      document.body.classList.add(currentTheme);
      localStorage.setItem(STORAGE_KEY, currentTheme);
    }

    btn.addEventListener('click', cycle);

    // Keyboard accessibility
    btn.setAttribute('aria-label', 'Cycle through themes');
    btn.setAttribute('role', 'button');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
