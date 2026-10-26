<!-- The container tinted, so the width bound is visible. -->
<script lang="ts">
  import Container, { type ContainerProps } from '../Container.svelte'

  let args: ContainerProps = $props()
</script>

<Container {...args} style="background: var(--ds-color-surface-highlight)" />

<style>
  :global(.container-demo-inset) {
    margin: 1rem;
  }
</style>
