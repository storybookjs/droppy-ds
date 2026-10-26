<script lang="ts">
  import PageTemplate, { type PageTemplateProps } from '../PageTemplate.svelte'

  let args: PageTemplateProps = $props()
</script>

<PageTemplate {...args} />

<style>
  :global(.pagetemplate-demo-inset) {
    margin: 1rem;
  }
</style>
