<script lang="ts">
  import FooterCard, { type FooterCardProps } from '../FooterCard.svelte'

  let args: FooterCardProps = $props()
</script>

<FooterCard {...args}>
  <!-- No color set here — it inherits FooterCard's own on-dark text color. -->
  <p style="margin: 0">Available on iOS and Android.</p>
</FooterCard>
