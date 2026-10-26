import { createRawSnippet } from 'svelte'

/** A plate of sushi, as an inline SVG illustration. */
export const sushiIllustration = createRawSnippet(() => ({
  render: () =>
    `<svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="var(--ds-color-surface-sunken)" /><circle cx="60" cy="60" r="34" fill="var(--ds-palette-neutral-0)" /><circle cx="60" cy="60" r="14" fill="var(--ds-palette-brand-200)" /></svg>`,
}))
