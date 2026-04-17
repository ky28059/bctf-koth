import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Components
import Header from '@/app/Header';
import ToastProvider from '@/components/ToastProvider';

import './globals.css';
import 'katex/dist/katex.min.css'


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "b01lers CTF KOTH dashboard",
    description: "KOTH dashboard for b01lers CTF, the CTF hosted by the b01lers CTF team at Purdue University.",
};

export default function RootLayout(props: Readonly<{ children: ReactNode }>) {
    return (
        <html
            lang="en"
            className={`dark ${inter.className} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col dark:text-white dark:bg-midnight">
                <ToastProvider>
                    <Header />
                    {props.children}
                </ToastProvider>
            </body>
        </html>
    );
}
