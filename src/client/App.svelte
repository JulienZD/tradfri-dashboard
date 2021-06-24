<script lang="ts">
  import TradfriManager from './components/TradfriManager.svelte';
  import ThemeSwitcher from './components/ThemeSwitcher.svelte';
</script>

<header>
  <ThemeSwitcher />
</header>
<main>
  <TradfriManager />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    body {
      @apply text-gray-900 dark:bg-gray-900 dark:text-gray-200 transition-colors;
    }
  }
</style>
