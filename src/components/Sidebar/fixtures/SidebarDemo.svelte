<!--
  A trigger plus a Sidebar whose open state starts at the `isOpen` arg. With
  `hostId`, a portal target with that id renders first (the `container` demos).
-->
<script lang="ts">
  import { Button } from '../../Button'
  import Sidebar, { type SidebarProps } from '../Sidebar.svelte'

  let {
    isOpen: initialOpen,
    onClose,
    hostId,
    hostTestId,
    ...args
  }: SidebarProps & { hostId?: string; hostTestId?: string } = $props()

  // Writable derived: follows the arg when the control changes, and can
  // still be set locally by the demo's own interactions.
  let isOpen = $derived(initialOpen)
</script>

{#if hostId}<div id={hostId} data-testid={hostTestId}></div>{/if}
<div style="padding: 1rem">
  <Button icon="cart" onclick={() => (isOpen = true)}>Open cart</Button>
  <Sidebar
    {...args}
    {isOpen}
    onClose={() => {
      isOpen = false
      onClose()
    }}
  />
</div>

<style>
  :global(.sidebar-demo-inset) {
    margin: 1rem;
  }
</style>
