"use client";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import { useData } from "@/lib/data";
import dataContext from "@/lib/dataContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let data = useData();

    return (
        <html lang="en">
            <head>
                <title> Attend96 </title>
                <meta name="description" content="Manage your college life" />
            </head>

            <body>
                <dataContext.Provider value={data}>
                    <div className="flex items-stretch h-[100dvh]">
                        <Sidebar />
                        {children}
                    </div>
                </dataContext.Provider>
            </body>
        </html>
    );
}
