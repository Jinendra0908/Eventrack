import { Providers } from './providers'
import PerformanceMonitor from '../components/PerformanceMonitor'
import ClientOnly from '../components/ClientOnly'
import "./globals.css";

export const metadata = {
  title: "Eventrack",
  description: "Event Tracking Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <ClientOnly>
            <PerformanceMonitor />
          </ClientOnly>
          {children}
        </Providers>
      </body>
    </html>
  );
}
