import '../styles/normalize.css'
import '../styles/flixle.webflow.css'
import '../styles/webflow.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
