import { Providers } from './providers'
import PerformanceMonitor from '../components/PerformanceMonitor'
import "./globals.css";

export const metadata = {
  title: "Eventrack",
  description: "Event Tracking Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <PerformanceMonitor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
