"use client";
import ChooseDate from "@/components/date";
import dataContext from "@/lib/dataContext";
import { useContext, useEffect, useState } from "react";

const weekIdxConvertion = (idx: number) => (idx+6)%7;

export default function Calendar() {
    let { timetable } = useContext(dataContext);
    let [date, setDate] = useState<Date>(new Date());

    let [today, setToday] = useState<string[]>(
        timetable[weekIdxConvertion(new Date().getDay())]
    );

    useEffect(() => {
        let subs = timetable[weekIdxConvertion(date.getDay())];

        setToday(subs.filter(Boolean));
    }, [date]);

    return (
        <>
            <main className="p-4">
                <h1 className="mb-4 text-2xl font-semibold">
                    Calendar
                </h1>

                <ChooseDate date={date} setDate={setDate} />

                <ul className="mt-4 flex flex-col gap-2">
                    {today.map((sub, idx) => (
                        <li className="p-2 bg-slate-200" key={idx}>
                            {sub}
                        </li>
                    ))}

                    {today.length === 0 && (
                        "Day off :)"
                    )}
                </ul>
            </main>
        </>
    );
}