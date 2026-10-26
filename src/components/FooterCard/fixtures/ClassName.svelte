<script lang="ts">
  import FooterCard, { type FooterCardProps } from '../FooterCard.svelte'

  let args: FooterCardProps = $props()
</script>

<FooterCard {...args} />

<style>
  :global(.footercard-demo-inset) {
    margin: 1rem;
  }
</style>
