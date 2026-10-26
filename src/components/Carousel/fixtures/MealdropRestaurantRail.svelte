<!-- The 'Restaurants near you' rail. -->
<script lang="ts">
  import { Badge } from '../../Badge'
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import { PageSection } from '../../PageSection'
  import { Review } from '../../Review'
  import Carousel from '../Carousel.svelte'

  let {}: Record<string, unknown> = $props()

  type Restaurant = {
    name: string
    specialty: string
    rating?: number
    categories: string[]
    photoUrl: string
  }

  const nearbyRestaurants: Restaurant[] = [
    {
      name: 'Burger Kingdom',
      specialty: 'Nicest place for burgers',
      rating: 4.2,
      categories: ['burgers'],
      photoUrl:
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20',
    },
    {
      name: 'Kara Fin',
      specialty: 'Sarma (wine leafs with rice)',
      rating: undefined,
      categories: ['pizza'],
      photoUrl:
        'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      name: 'Ciao Bella',
      specialty: 'Takeaway lasagna',
      rating: 4.7,
      categories: ['pizza'],
      photoUrl:
        'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      name: 'Warung Atika',
      specialty: '€6 meals',
      rating: 4.4,
      categories: ['asian'],
      photoUrl: 'https://duyt4h9nfnj50.cloudfront.net/search_home/FastFood.jpg',
    },
    {
      name: "Yuan's Hot Pot",
      specialty: 'Cheap and fun evening meals',
      rating: 3.9,
      categories: ['thai'],
      photoUrl: 'https://duyt4h9nfnj50.cloudfront.net/search_home/FastFood.jpg',
    },
  ]
</script>

<PageSection title="Restaurants near you" topButtonLabel="View all" onTopButtonClick={() => {}}>
  <Carousel items={nearbyRestaurants} itemsPerView={{ mobile: 1.2, tablet: 2, desktop: 3 }}>
    {#snippet slide(restaurant: Restaurant)}
      <Card interactive>
        <img
          src={restaurant.photoUrl}
          alt=""
          style="display: block; height: 140px; width: 100%; object-fit: cover"
        />
        <div style="display: grid; gap: 0.5rem; padding: 1rem">
          <Heading level={3} size={4}>{restaurant.name}</Heading>
          <Review rating={restaurant.rating} />
          <Body size="S">{restaurant.specialty}</Body>
          <div style="display: flex; gap: 0.5rem">
            {#each restaurant.categories as category (category)}
              <Badge text={category} />
            {/each}
          </div>
        </div>
      </Card>
    {/snippet}
  </Carousel>
</PageSection>
