<!--
  Stands in for a router's own link component to demonstrate the `render`
  escape hatch without adding a router dependency to the stories.
-->
<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import type { TextOrSnippet } from '../../../utils/text'

  let {
    to,
    children,
    ...rest
  }: { to: string; children?: TextOrSnippet } & Omit<HTMLAnchorAttributes, 'children'> = $props()
</script>

<a href={to} data-router-link="" {...rest}>
  {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
</a>
