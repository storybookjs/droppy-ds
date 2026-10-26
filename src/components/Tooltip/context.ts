import { getContext, hasContext, setContext } from 'svelte'

const KEY = Symbol('droppy-tooltip-provider')

/** Marks that a `TooltipProvider` is above, so `Tooltip` skips its own. */
export const markTooltipProvider = () => setContext(KEY, true)
export const hasTooltipProvider = () => hasContext(KEY) && getContext<boolean>(KEY)
