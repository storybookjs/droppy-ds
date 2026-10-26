<!-- Category tags and a new flag on a restaurant tile. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import { Review } from '../../Review'
  import Badge from '../Badge.svelte'

  // Mealdrop's own listings (`src/stub/restaurants.ts`) — one rated, one newly listed.
  const listings = [
    {
      name: 'Burger Kingdom',
      specialty: 'Nicest place for burgers',
      rating: 4.2 as number | undefined,
      categories: ['burgers', 'comfort food'],
      isNew: false,
      photoUrl:
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20',
    },
    {
      name: "'t Kuyltje",
      specialty: 'Pastrami sandwiches',
      rating: undefined as number | undefined,
      categories: ['comfort food'],
      isNew: true,
      photoUrl: 'https://duyt4h9nfnj50.cloudfront.net/search_home/FastFood.jpg',
    },
  ]

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: flex; flex-wrap: wrap; gap: 1.5rem">
  {#each listings as listing (listing.name)}
    <Card interactive style="width: 18rem">
      <div style="position: relative; display: flex">
        {#if listing.isNew}
          <span style="position: absolute; top: 0.5rem; left: 0.5rem; z-index: 1">
            <Badge text="new" variant="positive" />
          </span>
        {/if}
        <img src={listing.photoUrl} alt="" style="height: 160px; width: 100%; object-fit: cover" />
      </div>
      <div style="display: grid; gap: 0.5rem; padding: 1.5rem">
        <Heading level={2} size={4}>{listing.name}</Heading>
        <Review rating={listing.rating} />
        <Body size="S">{listing.specialty}</Body>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem">
          {#each listing.categories as category (category)}
            <Badge text={category} />
          {/each}
        </div>
      </div>
    </Card>
  {/each}
</div>
