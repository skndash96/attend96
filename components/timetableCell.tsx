import dataContext from "@/lib/dataContext";
import { ChangeEventHandler, useContext, useEffect, useRef, useState } from "react";

export default function Cell({
    day, idx, sub, tableBeingEdited
}: {
    day: number,
    idx: number,
    sub: string,
    tableBeingEdited: boolean
}) {
    let { subjects, changeSubjectInTimetable } = useContext(dataContext);
    let lastClicked = useRef<number | null>(null);
    let [cellBeingEdited, setCellBeingEdited] = useState<boolean>(false);

    useEffect(() => {
        if (!tableBeingEdited) setCellBeingEdited(false);
    }, [tableBeingEdited]);

    const handleClick = () => {
        if (!tableBeingEdited) return;

        let now = Date.now();

        if (!lastClicked.current) {
            lastClicked.current = now;
            return;
        }

        let diff = now - lastClicked.current;
        if (diff < 500) {
            setCellBeingEdited(true);
        }

        lastClicked.current = now;
    };

    const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        changeSubjectInTimetable(day, idx, e.currentTarget.value);
    };

    return (
        <td onClick={handleClick} className={`relative border-[1px] border-slate-600 ${tableBeingEdited ? "cursor-pointer select-none" : ""} ${cellBeingEdited ? "" : "p-4"}`}>
            {cellBeingEdited ? (
                <select defaultValue={sub} onChange={handleChange} className="border-2 border-slate-800">
                    <option value="p-2 text-xs bg-slate-900 hover:bg-slate-700 text-white">
                        --
                    </option>

                    {subjects.map(s => (
                        <option key={s} className="p-2 text-xs bg-slate-900 hover:bg-slate-700 text-white">
                            {s}
                        </option>
                    ))}
                </select>
            ) : sub || "--"}
        </td>
    );
}
