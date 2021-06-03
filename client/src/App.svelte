<script lang="ts">
  import TradfriManager from './components/TradfriManager.svelte';
</script>

<main>
  <TradfriManager />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    body {
      @apply bg-gray-900 text-green-500;
    }
  }
</style>
