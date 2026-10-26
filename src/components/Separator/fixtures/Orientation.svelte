<script lang="ts">
  import Separator, { type SeparatorProps } from '../Separator.svelte'

  let args: SeparatorProps = $props()
</script>

<div style="display: grid; gap: 1.5rem">
  <div style="display: flex; flex-direction: column; gap: 1rem">
    <span>Above</span>
    <Separator {...args} orientation="horizontal" />
    <span>Below</span>
  </div>
  <div style="display: flex; align-items: center; gap: 1rem; height: 2rem">
    <span>Left</span>
    <Separator {...args} orientation="vertical" />
    <span>Right</span>
  </div>
</div>
