import type { Metadata } from "next";
import { Noto_Sans } from 'next/font/google'

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const notoSerif = Noto_Sans({ subsets: ['latin'], weight: ['400', '700'] })
export const metadata: Metadata = {
    title: 'TibSchol',
    description: 'The Dawn of Tibetan Buddhist Scholasticism (11th–13th century)',
    icons: {
        icon: '/favicon.svg',
    }
}


export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${notoSerif.className} flex min-h-screen flex-col bg-gray-50 text-gray-900`}>
                <Header />
                <main className="flex-1 max-w-4xl mx-auto p-4">{children}</main>
                <Footer />
            </body>
        </html>

    );
}
