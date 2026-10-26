<script module lang="ts">
  import type { Snippet } from 'svelte'

  /** Props a crumb hands to its `render` snippet — spread them onto your element. */
  export type BreadcrumbRenderProps = {
    'data-part': 'link'
    class: string
    'aria-current': 'page' | undefined
    /** The crumb's label. */
    children: string
  }

  export type BreadcrumbItem = {
    /** Visible label. */
    label: string
    /** Destination for the default `<a>`. Ignored when `render` is set — the
     *  rendered element owns its own destination (e.g. a router `to` prop). */
    href?: string
    /** Escape hatch for a router-aware link — receives this crumb's link class,
     *  label and, on the last item, `aria-current`. */
    render?: Snippet<[BreadcrumbRenderProps]>
  }

  export type BreadcrumbProps = {
    items: BreadcrumbItem[]
    class?: string
  }
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  /**
   * A trail of ancestor pages leading to the current one — categories,
   * restaurants, anything with a browsable hierarchy above it.
   *
   * Renders plain `<a>` crumbs by default. Pass `render` on an item to swap in
   * a router-aware link instead — the design system itself has no router
   * dependency.
   */
  let { items, class: className }: BreadcrumbProps = $props()
</script>

<nav data-part="root" aria-label="breadcrumb" class={cx('droppy-Breadcrumb', className)}>
  <ol data-part="list" class="droppy-Breadcrumb-list">
    {#each items as item, index (item.href ?? `${item.label}-${index}`)}
      {@const current = index === items.length - 1 ? ('page' as const) : undefined}
      <li data-part="item" class="droppy-Breadcrumb-item">
        {#if item.render}
          {@render item.render({
            'data-part': 'link',
            class: 'droppy-Breadcrumb-link',
            'aria-current': current,
            children: item.label,
          })}
        {:else if item.href}
          <a data-part="link" class="droppy-Breadcrumb-link" href={item.href} aria-current={current}
            >{item.label}</a
          >
        {:else}
          <span data-part="text" class="droppy-Breadcrumb-text" aria-current={current}
            >{item.label}</span
          >
        {/if}
        {#if index < items.length - 1}
          <span data-part="separator" class="droppy-Breadcrumb-separator" aria-hidden="true">/</span
          >
        {/if}
      </li>
    {/each}
  </ol>
</nav>
