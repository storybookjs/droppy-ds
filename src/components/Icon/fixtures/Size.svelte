<script lang="ts">
  import Icon, { type IconProps } from '../Icon.svelte'

  let args: IconProps = $props()
</script>

<div style="display: flex; gap: 1rem; align-items: center">
  {#each ['1rem', '1.5rem', '2rem', '3rem'] as size (size)}
    <Icon {...args} {size} />
  {/each}
</div>
