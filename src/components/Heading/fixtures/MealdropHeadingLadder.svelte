<!-- The heading ladder on a restaurant detail page. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import Heading from '../Heading.svelte'

  const sections = [
    { section: 'Food', dishes: ['Cheeseburger', 'Fries'] },
    { section: 'Dessert', dishes: ['Vanilla ice cream'] },
    { section: 'Drinks', dishes: ['Coca-Cola', 'Sprite'] },
  ]

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: grid; gap: 2rem; max-width: 36rem">
  <Heading level={1}>Burger Kingdom</Heading>

  {#each sections as { section, dishes } (section)}
    <section style="display: grid; gap: 0.75rem">
      <Heading level={2}>{section}</Heading>
      {#each dishes as dish (dish)}
        <Card padded>
          <Heading level={3} size={4}>{dish}</Heading>
          <Body size="S">Nice grilled burger with cheese</Body>
        </Card>
      {/each}
    </section>
  {/each}
</div>
