<script lang="ts">
  import ButtonTooltip from './ButtonTooltip.svelte'

  let args: Record<string, unknown> = $props()
</script>

<ButtonTooltip {...args} />

<style>
  :global(.tooltip-demo-inset) {
    margin: 1rem;
  }
</style>
