"use client";
import ChooseDate from "@/components/date";
import { Record, RecordsContext, Status } from "@/lib/records";
import { TimetableContext } from "@/lib/timetable";
import { useContext, useEffect, useState } from "react";

export default function Calendar() {
    let { timetable } = useContext(TimetableContext);
    let { loading, getRecord, createRecord, setRecordStatus } = useContext(RecordsContext);

    const __today = new Date();
    __today.setHours(0, 0, 0, 0);

    let [currentDate, setCurrentDate] = useState<Date>(__today);
    let [currentRecord, setCurrentRecord] = useState<Record[] | undefined>(undefined);

    useEffect(() => {
        if (loading === true) return;
        
        let rec = getRecord(currentDate.valueOf());
        
        if (!rec) {
            let tt = timetable[currentDate.getDay()];
            rec = createRecord(currentDate.valueOf(), tt);
        }

        setCurrentRecord(rec);
    }, [currentDate, loading]);

    const handleStatus = (idx: number, to: Status) => {
        setRecordStatus(currentDate.valueOf(), idx, to);
    };

    return (
        <>
            <main className="p-4">
                <h1 className="mb-4 text-2xl font-semibold">
                    Calendar
                </h1>

                <ChooseDate date={currentDate} setDate={setCurrentDate} />

                {loading ? (
                    <span className="mt-4">
                        Loading...
                    </span>
                ) : (
                    <ul className="mt-4 flex flex-col gap-2">
                        {currentRecord?.map(([sub, stat], idx) => (
                            <li className="p-2 bg-slate-200" key={idx}>
                                <div>
                                    {sub}
                                    <div className="flex gap-2">
                                        <button onClick={() => handleStatus(idx, stat === -1 ? null : -1)} className={`underline ${stat === -1 ? "bg-blue-200" : ""}`}>off</button>
                                        <button onClick={() => handleStatus(idx, stat === 0 ? null : 0)} className={`underline ${stat === 0 ? "bg-red-200" : ""}`}>absent</button>
                                        <button onClick={() => handleStatus(idx, stat === 1 ? null : 1)} className={`underline ${stat === 1 ? "bg-green-200" : ""}`}>present</button>
                                    </div>
                                </div>
                            </li>
                        ))}

                        {currentRecord?.length === 0 && (
                            "Day off :)"
                        )}
                    </ul>
                )}
            </main >
        </>
    );
}