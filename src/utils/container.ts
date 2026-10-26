/**
 * Where an overlay portals to: an element, a selector, or nothing. Bits UI's
 * `Portal` resolves selectors itself when the overlay opens, so no effect is
 * needed — `undefined` means its default container (`document.body`).
 */
export type PortalContainer = HTMLElement | string | null | undefined

export const portalTarget = (container: PortalContainer) => container ?? undefined
