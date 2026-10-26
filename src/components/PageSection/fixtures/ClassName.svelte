<script lang="ts">
  import PageSection, { type PageSectionProps } from '../PageSection.svelte'

  let args: PageSectionProps = $props()
</script>

<PageSection {...args} />

<style>
  :global(.pagesection-demo-inset) {
    margin: 1rem;
  }
</style>
