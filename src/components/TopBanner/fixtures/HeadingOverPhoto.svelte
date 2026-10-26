<script lang="ts">
  import TopBanner, { type TopBannerProps } from '../TopBanner.svelte'

  let { photo, ...args }: TopBannerProps & { photo?: string } = $props()
</script>

<TopBanner {...args} title="Without a photo" photoUrl={undefined} />
<TopBanner {...args} title="Over a photo" photoUrl={photo} />
