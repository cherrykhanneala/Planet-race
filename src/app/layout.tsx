import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Planet Race - Multiplayer Racing Platform',
  description: 'Mobile-first multiplayer arcade racing game platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
