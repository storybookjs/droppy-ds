<script lang="ts">
  import Progress, { type ProgressProps } from '../Progress.svelte'

  let args: ProgressProps = $props()
</script>

<Progress {...args} />

<style>
  :global(.progress-demo-inset) {
    margin: 1rem;
  }
</style>
