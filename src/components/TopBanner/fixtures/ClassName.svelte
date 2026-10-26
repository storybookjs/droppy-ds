<script lang="ts">
  import TopBanner, { type TopBannerProps } from '../TopBanner.svelte'

  let args: TopBannerProps = $props()
</script>

<TopBanner {...args} />

<style>
  :global(.topbanner-demo-inset) {
    margin: 1rem;
  }
</style>
