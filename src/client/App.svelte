<script lang="ts">
  import TradfriManager from './components/TradfriManager.svelte';
  import ThemeSwitcher from './components/ThemeSwitcher.svelte';
</script>

<header class="mb-4 container grid place-items-center gap-y-8">
  <h1 class="text-4xl md:text-5xl">My Trådfri Home</h1>
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
