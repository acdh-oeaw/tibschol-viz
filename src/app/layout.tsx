import type { Metadata } from "next";
import { Noto_Serif, Noto_Serif_Tibetan } from 'next/font/google'

import "./globals.css";

const notoSerif = Noto_Serif({ subsets: ['latin'], weight: ['400', '700'] })
const notoTibetan = Noto_Serif_Tibetan({ weight: ['400'], subsets: ['tibetan'] })
export const metadata: Metadata = {
    title: 'TibSchol',
    description: 'The Dawn of Tibetan Buddhist Scholasticism (11th–13th century)',
    icons: {
        icon: 'favicon.svg',
    }
}


export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${notoSerif.className} ${notoTibetan.className}`}>
                <header className="flex justify-between p-4 border-b">
                    <h1 className="text-xl">TibSchol Data Explorer</h1>
                </header>
                <main className="p-4">{children}</main>
            </body>
        </html>

    );
}
