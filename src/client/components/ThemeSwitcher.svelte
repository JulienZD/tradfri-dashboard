<script lang="ts">
  import { theme } from '../stores/theme';
</script>

<button
  class="float-right py-1 px-2 rounded dark:hover:bg-green-500 dark:hover:text-gray-900 duration-300"
  on:click={theme.swap}>{$theme === 'dark' ? 'Light' : 'Dark'} Mode</button
>
