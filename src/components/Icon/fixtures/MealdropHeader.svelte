<!-- Mealdrop's header, where every icon reaches the page through a control's
     `icon` prop rather than a bare `Icon`. Mealdrop's Header is styled-components
     with a `breakpoints.M` query; the same rules are inlined so the story is a
     port, not a lookalike. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Button } from '../../Button'
  import { Heading } from '../../Heading'

  let {}: Record<string, unknown> = $props()

  const toCurrency = (amount: number) =>
    amount.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })
</script>

<header class="mealdrop-header">
  <Heading level={2} size={4}>Mealdrop</Heading>

  <div class="mealdrop-header-options">
    <span class="mealdrop-header-nav">
      <Button round clear icon="sun" aria-label="turn on dark mode" />
      <Button clear>Home</Button>
      <Button clear>All restaurants</Button>
    </span>
    <Button icon="cart" aria-label="food cart">
      <!-- Mealdrop colours these spans from the button's own text token;
           `inherit` is the same thing without naming a second token. -->
      <Body type="span" color="inherit">Order</Body>
      <Body type="span" color="inherit" fontWeight="bold">{toCurrency(24.75)}</Body>
    </Button>
  </div>
</header>

<style>
  .mealdrop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--ds-color-border-subtle);
    background: var(--ds-color-surface-page);
  }
  .mealdrop-header-options {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .mealdrop-header-nav {
    display: none;
  }
  @media (min-width: 768px) {
    .mealdrop-header {
      height: 72px;
    }
    .mealdrop-header-nav {
      display: contents;
    }
  }
</style>
