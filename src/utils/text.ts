import type { Snippet } from 'svelte'

/**
 * Text-bearing slots accept either a snippet or a plain string. Strings keep
 * the common case terse for consumers (`<Button children="Order now" />` or
 * `{children}` from props) and let plain CSF stories drive labels from a text
 * control, since a `.stories.ts` file has no template to write a snippet in.
 */
export type TextOrSnippet = Snippet | string
