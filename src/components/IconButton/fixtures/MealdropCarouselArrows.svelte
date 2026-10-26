<!-- Carousel arrows floating over restaurant photos. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import IconButton from '../IconButton.svelte'

  let {}: Record<string, unknown> = $props()

  const railTiles = [
    {
      name: 'Burger Kingdom',
      photoUrl:
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20',
    },
    {
      name: 'Kara Fin',
      photoUrl:
        'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      name: 'Ciao Bella',
      photoUrl:
        'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
  ]
</script>

<div style="position: relative; max-width: 34rem">
  <div style="display: flex; gap: 1rem; overflow: hidden">
    {#each railTiles as tile (tile.name)}
      <Card interactive style="min-width: 16rem">
        <img
          src={tile.photoUrl}
          alt=""
          style="display: block; height: 140px; width: 100%; object-fit: cover"
        />
        <div style="padding: 1rem">
          <Heading level={3} size={5}>{tile.name}</Heading>
          <Body size="XS">Delivers in 25–35 min</Body>
        </div>
      </Card>
    {/each}
  </div>

  <div style="position: absolute; top: 3rem; left: -1rem">
    <IconButton name="arrow-left" aria-label="Previous restaurants" />
  </div>
  <div style="position: absolute; top: 3rem; right: -1rem">
    <IconButton name="arrow-right" aria-label="Next restaurants" />
  </div>
</div>
