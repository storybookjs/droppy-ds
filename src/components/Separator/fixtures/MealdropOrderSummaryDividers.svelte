<!-- Dividers in Mealdrop's order summary. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import Separator from '../Separator.svelte'

  const summaryLines = [
    { name: 'Cheeseburger ×2', amount: '€17.00' },
    { name: 'Fries ×1', amount: '€2.50' },
    { name: 'Coca-Cola ×3', amount: '€5.25' },
  ]

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<Card padded style="max-width: 24rem">
  <Heading level={3} size={4}>Order summary</Heading>

  <div style="display: grid; gap: 0.75rem; margin-top: 1rem">
    {#each summaryLines as line, index (line.name)}
      <div style="display: grid; gap: 0.75rem">
        <div style="display: flex; justify-content: space-between">
          <Body size="S">{line.name}</Body>
          <Body size="S">{line.amount}</Body>
        </div>
        {#if index < summaryLines.length - 1}<Separator />{/if}
      </div>
    {/each}
  </div>

  <div style="margin: 1.5rem 0">
    <Separator />
  </div>

  <div style="display: flex; justify-content: space-between">
    <Body fontWeight="bold">Total</Body>
    <Body fontWeight="bold">€24.75</Body>
  </div>
</Card>
