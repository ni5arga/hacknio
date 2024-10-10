// app/layout.tsx
import './globals.css';
import { Inter } from '@next/font/google';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'hacknio',
  description: 'just a hackernews client with some extra features :)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} p-4 flex justify-center`}>
        <div className="w-1/2">
          <div className="flex p-4 justify-between items-center mb-2">
            <Link href="/" className="text-2xl text-left">hackn<span className="text-orange-400 font-bold">io</span></Link>
            <Link
              href="https://github.com/ni5arga/hacknio"
              target="_blank"
              className="text-md underline text-orange-400"
            >
              github
            </Link>
          </div>

          {children}
        </div>
      </body>

    </html>
  );
}
