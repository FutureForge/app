import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" sizes="any" href="/logo.svg" />
        <meta property="og:title" content="MintMingle" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
