<script lang="ts">
  import Card, { type CardProps } from '../Card.svelte'

  let { children: _children, ...args }: CardProps = $props()
</script>

<Card {...args}>
  <strong>Burger Kingdom</strong>
  <p style="margin: 0.25rem 0 0">Nicest place for burgers</p>
</Card>
