<!--
  Story harness: a Carousel of plain tiles. `items` is a list of labels, so the
  stories drive the slides from a plain-data arg.
-->
<script lang="ts">
  import { Card } from '../../Card'
  import Carousel, { type CarouselProps } from '../Carousel.svelte'

  let { slide: _slide, ...args }: Omit<CarouselProps<string>, 'slide'> & { slide?: unknown } =
    $props()
</script>

<Carousel {...args}>
  {#snippet slide(label: string)}
    <Card padded style="height: 8rem; display: flex; align-items: center">{label}</Card>
  {/snippet}
</Carousel>

<style>
  :global(.carousel-demo-inset) {
    margin: 1rem;
  }
</style>
