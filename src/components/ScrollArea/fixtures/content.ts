import { createRawSnippet } from 'svelte'

const paragraphs = [
  `Vernacular architecture is building done outside any academic tradition, and without professional guidance. It is not a particular architectural movement or style, but rather a broad category encompassing a wide range of building types, with differing methods of construction, from around the world, both historical and modern.`,
  `This type of architecture usually serves immediate, local needs, is constrained by the materials available in its particular region and reflects local traditions and cultural practices. More recently it has been examined by designers and the building industry in an effort to be more energy conscious with contemporary design and construction.`,
  `Vernacular architecture constitutes the majority of the world's built environment, as measured against the small percentage of new buildings every year designed by architects and built by engineers.`,
]

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }))

/** Three paragraphs of prose — overflows vertically. */
export const prose = () => html(`<div>${paragraphs.map((text) => `<p>${text}</p>`).join('')}</div>`)

/** A 20-column grid of 100 cells — overflows both axes. */
export const wideGrid = () =>
  html(
    `<ul style="display: grid; grid-template-columns: repeat(20, 4rem); margin: 0; padding: 0">${Array.from(
      { length: 100 },
      (_, index) => `<li style="list-style: none; padding: 0.5rem">${index + 1}</li>`
    ).join('')}</ul>`
  )

/** A row of twelve cards — overflows horizontally only. */
export const cardRow = (bordered = true) =>
  html(
    `<div style="display: flex; gap: 1rem">${Array.from(
      { length: 12 },
      (_, index) =>
        `<div style="flex: 0 0 auto; width: 8rem${
          bordered
            ? '; height: 4rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--ds-color-border-subtle)'
            : ''
        }">Card ${index + 1}</div>`
    ).join('')}</div>`
  )
