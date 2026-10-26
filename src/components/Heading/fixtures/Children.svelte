<script lang="ts">
  import Heading, { type HeadingProps } from '../Heading.svelte'

  let { children: _children, ...args }: HeadingProps = $props()
</script>

<Heading {...args}>Best food in <em>town</em></Heading>
