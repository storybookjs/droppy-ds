<!-- Mealdrop's checkout step indicator. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Button } from '../../Button'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import ProgressBar from '../ProgressBar.svelte'

  let {}: Record<string, unknown> = $props()

  const checkoutSteps = ['Contact details', 'Delivery details']

  let step = $state(1)
</script>

<Card padded style="max-width: 30rem">
  <div
    style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem"
  >
    <Heading level={3} size={4}>{checkoutSteps[step - 1]}</Heading>
    <Body size="XS" type="span">Step {step} of {checkoutSteps.length}</Body>
  </div>

  <ProgressBar value={step} max={checkoutSteps.length} label="Checkout progress" />

  <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem">
    <Button clear disabled={step === 1} onclick={() => (step = Math.max(1, step - 1))}>
      Previous
    </Button>
    <Button
      disabled={step === checkoutSteps.length}
      onclick={() => (step = Math.min(checkoutSteps.length, step + 1))}
    >
      Next
    </Button>
  </div>
</Card>
