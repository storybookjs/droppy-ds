<script lang="ts">
  import Breadcrumb, { type BreadcrumbProps } from '../Breadcrumb.svelte'

  let args: BreadcrumbProps = $props()
</script>

<Breadcrumb {...args} />

<style>
  :global(.breadcrumb-demo-inset) {
    margin: 1rem;
  }
</style>
