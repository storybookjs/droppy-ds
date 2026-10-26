<script lang="ts">
  import Separator, { type SeparatorProps } from '../Separator.svelte'

  let args: SeparatorProps = $props()
</script>

<div style="display: flex; flex-direction: column; gap: 1rem">
  <span>Above</span>
  <Separator {...args} />
  <span>Below</span>
</div>
