<!-- A category tile: round photo and a single label, on the same shell. -->
<script lang="ts">
  import { Body } from '../../Body'
  import Card from '../Card.svelte'

  const categories = [
    {
      title: 'Burgers',
      photoUrl:
        'https://images.pexels.com/photos/2233351/pexels-photo-2233351.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=550',
    },
    {
      title: 'Pizza',
      photoUrl:
        'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=550',
    },
    {
      title: 'Sushi',
      photoUrl:
        'https://images.pexels.com/photos/9210/food-japanese-food-photography-sushi.jpg?auto=compress&cs=tinysrgb&dpr=2&h=550',
    },
  ]

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: flex; gap: 1rem; flex-wrap: wrap">
  {#each categories as category (category.title)}
    <Card interactive padded style="width: 11rem; text-align: center" onclick={() => {}}>
      <img
        src={category.photoUrl}
        alt=""
        style="display: block; width: 6rem; height: 6rem; margin: 0 auto 0.75rem; border-radius: 50%; object-fit: cover"
      />
      <Body fontWeight="bold">{category.title}</Body>
    </Card>
  {/each}
</div>
