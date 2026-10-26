<script lang="ts">
  import { Badge } from '../../Badge'
  import { Body } from '../../Body'
  import Accordion, { type AccordionProps } from '../Accordion.svelte'

  let args: Omit<AccordionProps, 'items'> & { items?: AccordionProps['items'] } = $props()
</script>

{#snippet loyaltyTitle()}
  <span style="display: inline-flex; align-items: center; gap: 0.5rem">
    Droppy Rewards
    <Badge text="new" variant="positive" />
  </span>
{/snippet}

{#snippet loyaltyContent()}
  <ul style="margin: 0; padding-left: 1rem">
    <li>€1 spent = 1 point</li>
    <li>100 points = free delivery</li>
    <li>Points never expire</li>
  </ul>
{/snippet}

{#snippet allergensContent()}
  <Body size="XS">
    Every menu item lists its allergens. Ask the restaurant directly about cross-contamination.
  </Body>
{/snippet}

<Accordion
  {...args}
  items={[
    { value: 'loyalty', title: loyaltyTitle, content: loyaltyContent },
    { value: 'allergens', title: 'Allergen information', content: allergensContent },
  ]}
/>
