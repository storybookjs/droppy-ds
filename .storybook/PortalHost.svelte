<!--
  Gives an overlay story its own portal target inside its own canvas.

  `contain` makes the host the containing block for the overlay's fixed
  positioning, so a popup cannot cover the page. One host per story stops a docs
  page from stacking every open overlay on the body. And releasing the body
  scroll lock in docs keeps the page scrollable — a docs page mounts every open
  story at once and the locks compound.
-->
<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    id,
    height,
    isDocs,
    children,
  }: { id: string; height: string; isDocs: boolean; children: Snippet } = $props()
</script>

<svelte:head>
  {#if isDocs}
    <style>
      body {
        overflow: auto !important;
      }
    </style>
  {/if}
</svelte:head>

<div
  {id}
  style:position="relative"
  style:contain="layout paint"
  style:overflow="hidden"
  style:height
>
  {@render children()}
</div>
