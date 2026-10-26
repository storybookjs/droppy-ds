<script module lang="ts">
  import type { TextOrSnippet } from '../../utils/text'

  export type TabItem = {
    /** Identifies this tab in `value`/`defaultValue`/`onValueChange` and links it to its panel. */
    value: string
    /** Rendered inside the tab button. */
    label: TextOrSnippet
    /** Rendered inside the panel when this tab is active. */
    content: TextOrSnippet
    disabled?: boolean
  }

  /** Passed as `onValueChange`'s second argument. */
  export type TabsChangeDetails = { reason: 'none' }

  export type TabsProps = {
    tabs: TabItem[]
    defaultValue?: string
    value?: string
    onValueChange?: (value: string, details: TabsChangeDetails) => void
    class?: string
  }
</script>

<script lang="ts">
  import { Tabs as BitsTabs } from 'bits-ui'
  import { tick } from 'svelte'

  import theme from '../../theme'
  import { cx } from '../../utils/cx'

  /**
   * A set of panels, one visible at a time, switched by a row of tab buttons —
   * settings sections, a profile's sub-views, anything reviewed one part at a
   * time rather than all at once.
   *
   * Bits UI's `Tabs` supplies the roving focus and manual activation; the
   * sliding indicator is measured here and written to the same CSS custom
   * properties (`--active-tab-left`, `--active-tab-width`, …) the theme animates.
   */
  let { tabs, defaultValue, value, onValueChange, class: className }: TabsProps = $props()

  // svelte-ignore state_referenced_locally
  let internal = $state(defaultValue ?? '')
  const active = $derived(value !== undefined ? value : internal)

  const setActive = (next: string) => {
    if (next === active) return
    // Controlled: report only — the caller decides whether the tab moves.
    if (value === undefined) internal = next
    onValueChange?.(next, { reason: 'none' })
  }

  let listEl = $state<HTMLElement | null>(null)
  let indicatorEl = $state<HTMLElement | null>(null)

  const measure = () => {
    if (!listEl || !indicatorEl) return
    const tab = listEl.querySelector<HTMLElement>('[role="tab"][data-state="active"]')
    if (!tab) {
      for (const prop of ['left', 'top', 'width', 'height'])
        indicatorEl.style.removeProperty(`--active-tab-${prop}`)
      return
    }
    indicatorEl.style.setProperty('--active-tab-left', `${tab.offsetLeft}px`)
    indicatorEl.style.setProperty('--active-tab-top', `${tab.offsetTop}px`)
    indicatorEl.style.setProperty('--active-tab-width', `${tab.offsetWidth}px`)
    indicatorEl.style.setProperty('--active-tab-height', `${tab.offsetHeight}px`)
  }

  $effect(() => {
    void active
    void tabs
    tick().then(measure)
  })

  $effect(() => {
    if (!listEl) return
    const observer = new ResizeObserver(measure)
    observer.observe(listEl)
    return () => observer.disconnect()
  })

  /* A disabled tab stays focusable (as in the React build) but never activates:
     the handlers below run before Bits UI's and cancel activation. */
  const blockClick = (event: MouseEvent) => event.preventDefault()
  const blockActivateKeys = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') event.preventDefault()
  }
</script>

{#snippet text(content: TextOrSnippet)}
  {#if typeof content === 'string'}{content}{:else}{@render content?.()}{/if}
{/snippet}

<BitsTabs.Root
  data-part="root"
  class={cx(theme.TabsRoot, 'droppy-Tabs', className)}
  activationMode="manual"
  bind:value={() => active, setActive}
>
  <BitsTabs.List data-part="list" class={theme.TabsList} bind:ref={listEl}>
    {#each tabs as tab (tab.value)}
      <BitsTabs.Trigger
        data-part="tab"
        value={tab.value}
        class={theme.TabsTab}
        data-active={tab.value === active ? '' : undefined}
        data-disabled={tab.disabled ? '' : undefined}
        aria-disabled={tab.disabled ? 'true' : undefined}
        onclick={tab.disabled ? blockClick : undefined}
        onkeydown={tab.disabled ? blockActivateKeys : undefined}
      >
        {@render text(tab.label)}
      </BitsTabs.Trigger>
    {/each}
    <span data-part="indicator" class={theme.TabsIndicator} bind:this={indicatorEl}></span>
  </BitsTabs.List>
  <div data-part="viewport" class={theme.TabsPanelViewport}>
    {#each tabs as tab (tab.value)}
      <BitsTabs.Content data-part="panel" value={tab.value} class={theme.TabsPanel}>
        {@render text(tab.content)}
      </BitsTabs.Content>
    {/each}
  </div>
</BitsTabs.Root>
