"use client";
import Cell from "@/components/timetableCell";
import { dayIndexMap, TimetableContext } from "@/lib/timetable";
import { useContext, useEffect, useState } from "react";

export default function Timetable() {
    let { timetable, saveTimetable, delColumnInTimetable, addColumnInTimetable } = useContext(TimetableContext);
    let [currentEditing, setCurrentEditing] = useState<boolean>(false);
    let [max, setMax] = useState<number>(0);
    
    useEffect(() => {
        setMax(Math.max(...timetable.map(d => d.length)));
    }, [timetable]);

    const handleToggleEdit = () => {
        if (currentEditing) {
            saveTimetable();
        }

        setCurrentEditing(b => !b);
    };

    return (
        <>
            <main className="p-4">
                <h2 className="text-2xl font-semibold">
                    Timetable
                    <button
                        onClick={handleToggleEdit}
                        className="ml-2 text-sm underline"
                    >
                        {currentEditing ? "save" : "edit"}
                    </button>
                </h2>

                <p className="mt-4 mb-2">
                    {currentEditing && (
                        "Doube tap a cell to change subject"
                    )}
                </p>

                <table className="table table-fixed">
                    <tbody>
                        {currentEditing && (
                            <tr>
                                <td></td>
                                {new Array(max).fill(null).map((_, idx) => (
                                    <td key={idx} className="text-sm text-center text-red-500 break-words">
                                        <button onClick={() => delColumnInTimetable(idx)} className="">
                                            delete
                                        </button>
                                    </td>
                                ))}
                                <td className="text-center">
                                    <button onClick={addColumnInTimetable} className="ml-2 text-sm text-green-500">
                                        add
                                    </button>
                                </td>
                            </tr>
                        )}

                        {new Array(timetable.length).fill(null).map((_, row) => (
                            <tr key={row} className="even:bg-slate-200">
                                <th className="p-4 bg-slate-600 text-white border-[1px] border-slate-900">
                                    {dayIndexMap[(row+1)%7]}
                                </th>

                                {new Array(max).fill(null).map((_, col) => (
                                    <Cell
                                        key={col}
                                        tableBeingEdited={currentEditing}
                                        day={(row+1)%7}
                                        idx={col}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </>
    );
}