import "./global.css"


export const metadata = {
  title: 'Statutory Regulations',
  description: 'App by Naufal Suyudi ',
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
