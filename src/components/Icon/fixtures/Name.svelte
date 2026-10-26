<script lang="ts">
  import Icon, { type IconProps } from '../Icon.svelte'
  import { iconNames } from '../icons'

  let args: IconProps = $props()
</script>

<div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
  {#each iconNames as name (name)}
    <div style="text-align: center; font-size: 0.75rem; width: 5rem">
      <Icon {...args} {name} size="2rem" style="margin: 0 auto 0.5rem" />
      {name}
    </div>
  {/each}
</div>
