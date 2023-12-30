import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Roboto } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import { ThemeProvider } from '@/components/context/ThemeContext'
import AuthProvider from '@/components/authProvider/AuthProvider'
import MobileNavbar from '@/components/mobileNavbar/MobileNavbar'
import {ErrorBoundary }from '@/components/GlobalError'

//@ts-ignore
const roboto = Roboto({weight:"400", subsets:['latin']})
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Programmieren für Ü 40',
  description: 'Programmier blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={roboto.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <div className="fullNavbar">
              <Navbar/>
              </div>
              <div className="mobileNavbar">
              <MobileNavbar/>
              </div>
              {children}
              <Footer/>
            </AuthProvider>
          </ThemeProvider>
          </ErrorBoundary>
        </body>
    </html>
  )
}
