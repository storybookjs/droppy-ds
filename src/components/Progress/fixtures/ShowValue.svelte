<script lang="ts">
  import Progress, { type ProgressProps } from '../Progress.svelte'

  let args: ProgressProps = $props()
</script>

<div style="display: grid; gap: 1rem">
  <Progress {...args} showValue />
  <Progress {...args} showValue={false} />
</div>
