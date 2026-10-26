<script lang="ts">
  import Card, { type CardProps } from '../Card.svelte'

  let args: CardProps = $props()
</script>

<Card {...args} />

<style>
  :global(.card-demo-inset) {
    margin: 1rem;
  }
</style>
