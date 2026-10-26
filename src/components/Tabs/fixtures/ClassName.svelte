<script lang="ts">
  import Tabs, { type TabsProps } from '../Tabs.svelte'

  let args: TabsProps = $props()
</script>

<Tabs {...args} />

<style>
  :global(.tabs-demo-inset) {
    margin: 1rem;
  }
</style>
