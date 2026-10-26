<script lang="ts">
  import PageSection, { type PageSectionProps } from '../PageSection.svelte'

  let args: PageSectionProps = $props()
</script>

<PageSection {...args} title="With an action" topButtonLabel="View all" />
<PageSection {...args} title="Without one" topButtonLabel={undefined} />
