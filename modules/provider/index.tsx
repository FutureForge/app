import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { useToast } from '../app/hooks/useToast'

type QueryProviderProps = {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const toast = useToast()
  const [loadingToastId, setLoadingToastId] = useState<string | number | undefined>(undefined)

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 0 } },
        mutationCache: new MutationCache({
          onMutate: () => {
            const id = toast.loading('Transaction In Process...', { duration: Infinity })
            setLoadingToastId(id)
          },
          onSuccess: (_data, _variables, _context, mutation) => {
            console.log('query provider success', _data, _variables, _context, mutation)

            const successMessage = mutation?.meta?.successMessage as {
              title?: string
              description: string
            }

            if (loadingToastId) {
              toast.dismiss(loadingToastId)
              toast.success(
                successMessage ? successMessage.description : 'Transaction was Successful',
                {
                  duration: 5000,
                },
              )
            }

            setLoadingToastId(undefined)
          },
          onError: (error, _variables, _context, mutation) => {
            console.log('query provider error: ', error)

            const errorMessage = mutation?.meta?.errorMessage as {
              title?: string
              description: string
            }

            if (loadingToastId) {
              toast.dismiss(loadingToastId)
              toast.error(
                errorMessage ? `${errorMessage.description} ${error.message}` : error.message,
                {
                  duration: 5000,
                },
              )
            }

            setLoadingToastId(undefined)
          },
        }),
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
