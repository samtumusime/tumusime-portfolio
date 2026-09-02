import { Inter } from 'next/font/google';
import GlobalBackground from '@/components/GlobalBackground';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Tumusime Sam · ICT, AI & Networking',
  description:
    'Portfolio of Tumusime Sam — ICT and networking foundation with growing expertise in AI/ML, cloud, and IoT.',
  icons: {
    icon: '/assets/samu-cutout.png',
    apple: '/assets/samu-cutout.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg text-text font-sans antialiased overflow-x-hidden">
        {/* Global fixed background - renders once for entire site */}
        <GlobalBackground />
        
        {/* All content scrolls over the fixed background */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
