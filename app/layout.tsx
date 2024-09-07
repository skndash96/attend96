"use client";
import { SubjectsContext, useSubjects } from "@/lib/subjects";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import { TimetableContext, useTimetable } from "@/lib/timetable";
import { RecordsContext, useRecords } from "@/lib/records";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let subjects = useSubjects();
    let timetable = useTimetable();
    let records = useRecords();
    
    return (
        <html lang="en">
            <head>
                <title> Attend96 </title>
                <meta name="description" content="Manage your college life" />
            </head>

            <body>
                <SubjectsContext.Provider value={subjects}>
                    <TimetableContext.Provider value={timetable}>
                        <RecordsContext.Provider value={records}>
                            <div className="flex items-stretch h-[100dvh]">
                                <Sidebar />
                                {children}
                            </div>
                        </RecordsContext.Provider>
                    </TimetableContext.Provider>
                </SubjectsContext.Provider>
            </body>
        </html>
    );
}
