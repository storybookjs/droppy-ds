<script lang="ts">
  import ProgressBar, { type ProgressBarProps } from '../ProgressBar.svelte'

  let args: ProgressBarProps = $props()
</script>

<div style="display: grid; gap: 0.75rem; width: 16rem">
  {#each [0, 1, 2, 3] as value (value)}
    <ProgressBar {...args} {value} />
  {/each}
</div>
