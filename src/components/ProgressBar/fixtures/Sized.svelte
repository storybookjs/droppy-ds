<!-- The default render: the bar inside a 16rem-wide parent. -->
<script lang="ts">
  import ProgressBar, { type ProgressBarProps } from '../ProgressBar.svelte'

  let args: ProgressBarProps = $props()
</script>

<div style="width: 16rem">
  <ProgressBar {...args} />
</div>

<style>
  :global(.progressbar-demo-inset) {
    margin: 1rem;
  }
</style>
