import { getContext, setContext } from 'svelte'

export type ToastType = 'success' | 'error' | 'info' | 'loading' | (string & {})

export type ToastOptions = {
  id?: string
  title?: string
  description?: string
  type?: ToastType
  /** Overrides the provider's `timeout` for this toast. `0` disables auto-dismiss. */
  timeout?: number
}

export type ToastObject = ToastOptions & {
  id: string
  /** `starting` for the first frame, `ending` while the exit runs. */
  transitionStatus?: 'starting' | 'ending'
  /** The toast's natural height in px, measured on mount. */
  height?: number
}

export type ToastPromiseOptions<T> = {
  loading: ToastOptions
  success: ToastOptions | ((value: T) => ToastOptions)
  error: ToastOptions | ((reason: unknown) => ToastOptions)
}

const EXIT_MS = 400
let counter = 0

/**
 * The toast queue behind `ToastProvider`. Hand-rolled — Bits UI has no toast —
 * but shaped like Base UI's manager so call sites read the same:
 * `add` / `close` / `update` / `promise`, and a reactive `toasts` list.
 */
export class ToastManager {
  toasts = $state<ToastObject[]>([])
  // Timer handles are bookkeeping, not UI state, so a plain Map is right here.
  // eslint-disable-next-line svelte/prefer-svelte-reactivity
  #timers = new Map<string, ReturnType<typeof setTimeout>>()
  #defaults: () => { timeout: number }

  constructor(defaults: () => { timeout: number }) {
    this.#defaults = defaults
  }

  add = (options: ToastOptions): string => {
    const id = options.id ?? `droppy-toast-${++counter}`
    this.toasts = [{ ...options, id, transitionStatus: 'starting' }, ...this.toasts]
    // Two frames: one to paint the starting style, one to transition from it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this.#patch(id, { transitionStatus: undefined }))
    )
    this.#schedule(id, options)
    return id
  }

  update = (id: string, options: ToastOptions) => {
    this.#patch(id, options)
    this.#schedule(id, { ...this.toasts.find((toast) => toast.id === id), ...options })
  }

  close = (id: string) => {
    clearTimeout(this.#timers.get(id))
    this.#timers.delete(id)
    this.#patch(id, { transitionStatus: 'ending' })
    setTimeout(() => {
      this.toasts = this.toasts.filter((toast) => toast.id !== id)
    }, EXIT_MS)
  }

  promise = <T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T> => {
    const id = this.add({ ...options.loading, type: 'loading', timeout: 0 })
    promise.then(
      (value) => {
        const next =
          typeof options.success === 'function' ? options.success(value) : options.success
        this.update(id, { type: 'success', timeout: undefined, ...next })
      },
      (reason) => {
        const next = typeof options.error === 'function' ? options.error(reason) : options.error
        this.update(id, { type: 'error', timeout: undefined, ...next })
      }
    )
    return promise
  }

  /** Records a toast's measured height, for the stacking variables. */
  measure = (id: string, height: number) => this.#patch(id, { height })

  #patch(id: string, patch: Partial<ToastObject>) {
    this.toasts = this.toasts.map((toast) => (toast.id === id ? { ...toast, ...patch } : toast))
  }

  #schedule(id: string, options: ToastOptions) {
    clearTimeout(this.#timers.get(id))
    const timeout = options.timeout ?? this.#defaults().timeout
    if (timeout > 0 && options.type !== 'loading') {
      this.#timers.set(
        id,
        setTimeout(() => this.close(id), timeout)
      )
    }
  }
}

const KEY = Symbol('droppy-toast')

export const provideToastManager = (manager: ToastManager) => setContext(KEY, manager)

/**
 * Raises and manages toasts from anywhere beneath `ToastProvider`: `add`
 * queues a toast and returns its id, and `promise` chains a loading toast
 * through to success or error so async work reports its own outcome.
 * Call it during component initialisation, like any Svelte context read.
 */
export const useToast = (): ToastManager => {
  const manager = getContext<ToastManager | undefined>(KEY)
  if (!manager) {
    throw new Error('Droppy: useToast() must be called inside a <ToastProvider>.')
  }
  return manager
}
