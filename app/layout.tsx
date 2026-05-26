import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Shaia Rugs — Quality Antique Oriental Rugs Since 1973',
    template: '%s | Shaia Rugs',
  },
  description:
    'Specializing in fine antique oriental rugs since 1973. Persian, Caucasian, and rare antique rugs from the collection of Frank Shaia, Williamsburg, Virginia.',
  keywords: [
    'antique rugs', 'oriental rugs', 'Persian rugs', 'Caucasian rugs',
    'Serapi', 'Heriz', 'Kazak', 'antique rug dealer', 'Williamsburg Virginia',
  ],
  openGraph: {
    siteName: 'Shaia Rugs',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="min-h-screen flex flex-col bg-cream font-[family-name:var(--font-lato)]">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
