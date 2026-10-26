<!-- An order-confirmation paragraph with an inline link. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import Link from '../Link.svelte'
  import RouterLink from './RouterLink.svelte'

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<Card padded style="max-width: 28rem">
  <Heading level={3} size={4}>Thanks, your order is on its way</Heading>

  <div style="display: grid; gap: 1rem; margin-top: 1rem">
    <Body size="S">
      Burger Kingdom is preparing order DB-2291.
      <Link href="https://example.com/orders/DB-2291">Track it</Link> on the courier's site.
    </Body>

    <Body size="S">
      Or follow it in the app —
      <Link>
        {#snippet render(props)}<RouterLink to="/orders/DB-2291" {...props} />{/snippet}
        track it here
      </Link> without leaving Mealdrop.
    </Body>
  </div>
</Card>
