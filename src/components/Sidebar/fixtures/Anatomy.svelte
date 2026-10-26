<!--
  Rendered open and with no trigger, so the panel scans the drawer's own parts
  rather than the button that would have opened it. The footer's reserved
  height is overridden ([#140]) so a one-line total sits in a bar rather than at
  the top of a 165px block.
-->
<script lang="ts">
  import { Body } from '../../Body'
  import Sidebar, { type SidebarProps } from '../Sidebar.svelte'

  let { children: _c, footer: _f, onClose: _o, ...args }: SidebarProps = $props()
</script>

<Sidebar {...args} onClose={() => {}}>
  <ul style="margin: 0; padding-left: 1rem">
    <li>Margherita — €9.50</li>
    <li>Garlic bread — €4.00</li>
    <li>Sparkling water — €2.50</li>
  </ul>
  {#snippet footer()}
    <Body type="span" fontWeight="bold">Total — €16.00</Body>
  {/snippet}
</Sidebar>

<style>
  :global(.sidebar-anatomy-footer .droppy-Sidebar-footer) {
    --droppy-sidebar-footer-height: 3.5rem;
    align-items: center;
  }
</style>
