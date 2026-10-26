<!-- Mealdrop's footer link columns. -->
<script lang="ts">
  import FooterCard from '../FooterCard.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<div style="display: flex; flex-wrap: wrap; gap: 3rem">
  <FooterCard
    title="Discover us"
    links={[
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' },
      { name: 'About', href: '/about' },
    ]}
  />
  <FooterCard
    title="Our social media"
    links={[
      { name: 'Facebook', href: 'https://facebook.com', external: true },
      { name: 'Instagram', href: 'https://instagram.com', external: true },
      { name: 'Twitter', href: 'https://twitter.com', external: true },
    ]}
  />
  <FooterCard title="Check our apps">
    <div style="display: grid; gap: 0.5rem">
      <img src="https://placehold.co/120x40?text=App+Store" alt="Download on the App Store" />
      <img src="https://placehold.co/120x40?text=Google+Play" alt="Get it on Google Play" />
    </div>
  </FooterCard>
</div>
