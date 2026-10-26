<script lang="ts">
  import Card, { type CardProps } from '../Card.svelte'

  let { children: _children, ...args }: CardProps = $props()
</script>

<Card {...args} style="width: 16rem">
  <img
    src="https://placehold.co/320x180"
    alt=""
    style="display: block; width: 100%; height: 10rem; object-fit: cover"
  />
  <div style="padding: 1rem">Restaurant name</div>
</Card>
