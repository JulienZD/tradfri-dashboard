import { writable } from 'svelte/store';

const schema = '(prefers-color-scheme: dark)';

const initialValue =
  localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia(schema).matches) ? 'dark' : 'light';

initialValue === 'dark' && document.documentElement.classList.add('dark');
localStorage.theme = initialValue;
function createTheme() {
  const { subscribe, set } = writable<'dark' | 'light'>(initialValue);

  const swap = () => {
    const newValue = localStorage.theme === 'dark' ? 'light' : 'dark';

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia(schema).matches)) {
      document.documentElement.removeAttribute('class');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.theme = newValue;
    set(newValue);
  };

  return {
    subscribe,
    swap: swap,
  };
}

export const theme = createTheme();
