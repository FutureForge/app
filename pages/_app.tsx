import { RootLayout } from '@/modules/app/layout'
import { QueryProvider } from '@/modules/provider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThirdwebProvider } from 'thirdweb/react'
import { Inter } from 'next/font/google'
import '../utils/suppressConsoleErrors'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--inter' })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --font-inter: ${inter.style.fontFamily};
            --font-inter: ${inter.style.fontFamily};
            }`,
        }}
      />
      <QueryProvider>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </QueryProvider>
    </ThirdwebProvider>
  )
}
