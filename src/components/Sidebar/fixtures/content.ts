import { createRawSnippet } from 'svelte'

import { componentSnippet } from '../../../utils/componentSnippet'
import Checkout from './Checkout.svelte'

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }))

/** A short order list. */
export const order = () =>
  html(
    `<ul style="margin: 0; padding-left: 1rem"><li>Margherita — €9.50</li><li>Garlic bread — €4.00</li><li>Sparkling water — €2.50</li></ul>`
  )

/** Twenty lines — enough to scroll. */
export const longOrder = () =>
  html(`<ul style="margin: 0; padding-left: 1rem">${'<li>Margherita — €9.50</li>'.repeat(20)}</ul>`)

/** A total and a checkout button, for the footer. */
export const checkout = (total: string) => componentSnippet(Checkout, { total })
