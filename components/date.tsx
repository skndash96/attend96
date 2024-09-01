import { ChangeEventHandler, useEffect } from "react";
import { FaBackward, FaCaretLeft, FaCaretRight, FaForward, FaRegCalendar } from "react-icons/fa";

export default function ChooseDate({
    date,
    setDate
}: {
    date: Date,
    setDate: (d: Date) => void
}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setDate(new Date(e.currentTarget.value));
    };

    const handlePrev = () => {
        setDate(new Date(date.valueOf() - 24 * 60 * 60 * 1000));
    };
    const handleNext = () => {
        setDate(new Date(date.valueOf() + 24 * 60 * 60 * 1000));
    };

    const handleToday = () => {
        setDate(today);
    };

    useEffect(() => {
        setDate(today);
    }, []);

    return (
        <div>
            <span className="text-lg">
                {date.toDateString()}
            </span>

            <div id="datepicker" className="ml-4 inline-block relative w-4 h-4">

                <span className="absolute w-full h-full left-0 top-0">
                    <FaRegCalendar />
                </span>

                <input onChange={handleChange} className="absolute w-full h-full left-0 top-0 cursor-pointer opacity-0" type="date" />
            </div>

            <div className="flex gap-2">
                <button onClick={handlePrev} className="bg-slate-200 flex items-center gap-1">
                    <FaCaretLeft size={20} />
                    Back
                </button>

                <button onClick={handleNext} className="bg-slate-200 flex items-center gap-1">
                    Next
                    <FaCaretRight size={20} />
                </button>

                {date.valueOf() != today.valueOf() && (
                    <button onClick={handleToday} className="underline text-slate-700 flex items-center gap-1">
                        Goto Today
                    </button>
                )}
            </div>
        </div>
    );
}