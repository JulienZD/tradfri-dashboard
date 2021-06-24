<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  import { Jumper } from 'svelte-loading-spinners';
  import Toggle from 'svelte-toggle';
  import type { TradfriLightInfo } from '../../common';
  import { controlLight } from '../utils/controller';
  import RgbControls from './RGBControls.svelte';
  import { lightsStore } from '../stores/tradfri';
  import { tick } from 'svelte';

  export let light: TradfriLightInfo;

  $: light = $lightsStore.find((l) => l.id === light.id) ?? light;

  const operateLight = async (operation): Promise<void> => {
    await controlLight(light.id, operation);
    await tick();
  };

  const toggle = async (): Promise<void> => {
    await operateLight({ on: !light.isOn });
  };

  const setBrightness = async ({ detail: { value } }): Promise<void> => {
    if (value === light.brightness) return;
    await operateLight({ brightness: value });
  };

  const changeColor = async ({ detail: { color } }): Promise<void> => {
    if (color === light.color) return;
    await operateLight({ color: color });
  };
</script>

<div class="flex flex-col my-4 first:mt-0 last:mb-0">
  <div class="flex justify-between mb-3">
    <h2 class="font-medium text-lg">{light.name}</h2>
    <Toggle hideLabel toggledColor="#3B82F6" toggled={light.isOn} on:click={toggle} />
  </div>

  <RangeSlider float suffix="%" on:stop={setBrightness} values={[light.brightness]} />

  {#if light.hue !== undefined}
    <RgbControls currentColor={light.color} on:colorChange={changeColor} />
  {/if}
</div>

<style>
  /* RangeSlider */
  :root {
    --range-slider: #3b82f6; /* slider main background color */
    --range-handle-inactive: #0b60ea; /* inactive handle color */
    --range-handle: #1d49db; /* non-focussed handle color */
    --range-handle-focus: #0643b3; /* focussed handle color */
  }

  :global(.rangeSlider) {
    margin: 4px 0 !important;
    margin-right: 8px !important;
  }
</style>
