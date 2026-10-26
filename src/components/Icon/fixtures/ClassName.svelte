<script lang="ts">
  import Icon, { type IconProps } from '../Icon.svelte'

  let args: IconProps = $props()
</script>

<Icon {...args} />

<style>
  :global(.icon-demo-inset) {
    margin: 1rem;
  }
</style>
