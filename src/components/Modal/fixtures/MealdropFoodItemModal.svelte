<script lang="ts">
  import type { PortalContainer } from '../../../utils/container'
  import { Body } from '../../Body'
  import { Button } from '../../Button'
  import { Heading } from '../../Heading'
  import { QuantityStepper } from '../../QuantityStepper'
  import Modal from '../Modal.svelte'

  let props: { container?: PortalContainer } = $props()

  /** Mealdrop formats with the runtime locale rather than a fixed one. */
  const toCurrency = (amount: number) =>
    amount.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })

  const dish = { name: 'Cheeseburger', description: 'Nice grilled burger with cheese', price: 8.5 }

  let isOpen = $state(false)
  let quantity = $state(1)
</script>

<!-- Mealdrop lays the modal out with styled-components and a `breakpoints.M`
     media query; the same rules are inlined here so the story is a port
     rather than an approximation. -->
<div>
  <div style="padding: 1rem">
    <Button onclick={() => (isOpen = true)}>{dish.name}</Button>
  </div>

  <Modal
    {isOpen}
    onClose={() => (isOpen = false)}
    container={props.container}
    aria-label={dish.name}
  >
    <div>
      <div class="mealdrop-modal-top">
        <Heading>{dish.name}</Heading>
        <Body class="mealdrop-modal-body">{dish.description}</Body>
      </div>
      <div class="mealdrop-modal-bottom">
        <div class="mealdrop-modal-steppers">
          <QuantityStepper
            value={quantity}
            onChange={(value: number) => (quantity = value)}
            min={1}
            max={10}
          />
        </div>
        <Button
          class="mealdrop-modal-confirm"
          aria-label="confirm"
          onclick={() => (isOpen = false)}
        >
          add for {toCurrency(dish.price * quantity)}
        </Button>
      </div>
    </div>
  </Modal>
</div>

<style>
  :global(.mealdrop-modal-top) {
    padding: 2.5rem 1.5rem;
    background: var(--ds-color-surface-sunken);
    border-radius: 16px 16px 0px 0px;
  }
  :global(.mealdrop-modal-body) {
    margin: 0;
    margin-top: 8px;
  }
  :global(.mealdrop-modal-bottom) {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
  }
  :global(.mealdrop-modal-steppers) {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex: 0.45;
    margin-bottom: 1.5rem;
    margin-right: 0;
  }
  :global(.mealdrop-modal-confirm) {
    flex: 1;
  }
  @media (min-width: 768px) {
    :global(.mealdrop-modal-bottom) {
      flex-direction: row;
    }
    :global(.mealdrop-modal-steppers) {
      margin-bottom: 0;
      margin-right: 1.5rem;
      justify-content: space-between;
    }
  }
</style>
