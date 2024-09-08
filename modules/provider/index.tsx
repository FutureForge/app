import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { useToast } from '../app/hooks/useToast'

type QueryProviderProps = {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const toast = useToast()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 0 } },
        mutationCache: new MutationCache({
          onSuccess: (_data, _variables, _context, mutation) => {
            console.log('query provider success', _data, _variables, _context, mutation)

            const successMessage = mutation?.meta?.successMessage as {
              title?: string
              description: string
            }

            if (!successMessage) return toast.success('Transaction was Successfully')

            toast.success(`${successMessage.description}: `, {
              title: successMessage.title,
            })

            console.log({ message: successMessage, data: _data })
          },
          onError: (error, _variables, _context, mutation) => {
            console.log('query provider error: ', error)

            const errorMessage = mutation?.meta?.errorMessage as {
              title?: string
              description: string
            }

            if (!errorMessage) return toast.error(error.message)

            toast.error(`${errorMessage.description} ${error.message}: `, {
              title: errorMessage.title,
            })
            console.log({ message: errorMessage, error: error.message })

            // if (errorMessage) {
            //   toast.error(errorMessage.description, {
            //     title: errorMessage.title,
            //   });
            // } else {
            //   toast.error(error.message);
            // }
          },
        }),
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
