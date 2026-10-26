<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { LinkRenderProps } from '../Link'
  import type { TextOrSnippet } from '../../utils/text'

  export type FooterCardLink = {
    /** Visible label. */
    name: string
    /** Destination for the default `<a>`. Ignored when `render` is set — the
     *  rendered element owns its own destination (e.g. a router `to` prop). */
    href?: string
    /** Opens in a new tab with `rel="noopener noreferrer"`. */
    external?: boolean
    /** Escape hatch for a router-aware link — receives this link's class,
     *  label and attributes to spread onto your own element. */
    render?: Snippet<[LinkRenderProps]>
  }

  export type FooterCardProps = {
    title: string
    links?: FooterCardLink[]
    class?: string
    children?: TextOrSnippet
  }
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'
  import { Heading } from '../Heading'
  import { Link } from '../Link'

  /**
   * A titled list of links for a page footer — "Discover us", "Our social
   * media", or any other grouped column of footer navigation.
   *
   * Renders its links through `Link`, so a router-aware link can be swapped in
   * per item via `render` the same way `Breadcrumb` composes its crumbs.
   */
  let { title, links = [], children, class: className }: FooterCardProps = $props()
</script>

<div data-part="root" class={cx('droppy-FooterCard', className)}>
  <Heading data-part="title" level={2} class="droppy-FooterCard-title">{title}</Heading>
  {#if links.length > 0}
    <ul data-part="list" class="droppy-FooterCard-list">
      {#each links as link (link.name)}
        <li data-part="item" class="droppy-FooterCard-item">
          <Link
            data-part="link"
            href={link.href}
            render={link.render}
            class="droppy-FooterCard-link"
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.name}
          </Link>
        </li>
      {/each}
    </ul>
  {/if}
  {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
</div>
