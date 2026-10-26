<script lang="ts">
  import Progress, { type ProgressProps } from '../Progress.svelte'

  let args: ProgressProps = $props()
</script>

<div style="display: grid; gap: 1rem">
  {#each [0, 40, 100] as value (value)}
    <Progress {...args} {value} />
  {/each}
  <Progress {...args} value={null} showValue={false} />
</div>
