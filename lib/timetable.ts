import { createContext, useEffect, useState } from "react";
import { Subject } from "./subjects";

export type Timetable = Subject[][];

export const dayIndexMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type TimetableExport = {
    timetable: Timetable,
    changeSubjectInTimetable(day: number, idx: number, to: Subject): void,
    getSubjectInTimetable(day: number, idx: number): Subject,
    addColumnInTimetable(): void,
    delColumnInTimetable(idx: number): void,
    saveTimetable(): void
};

export const TimetableContext = createContext<TimetableExport>({
    timetable: [],
    changeSubjectInTimetable() {},
    getSubjectInTimetable() {return ""},
    addColumnInTimetable() {},
    delColumnInTimetable() {},
    saveTimetable() {}
});

export function useTimetable(): TimetableExport {
    let [tt, setTt] = useState<Timetable>(
        new Array(7).fill(new Array(5).fill(""))
    );

    useEffect(() => {
        let str = localStorage.getItem("timetable");

        if (str) setTt(JSON.parse(str));
    }, []);
    
    const changeSubjectInTimetable = (day: number, idx: number, to: Subject) => {
        setTt(timetable => {
            let newtt = [...timetable];
            
            newtt[day][idx] = to;

            return newtt;
        });
    };

    const getSubjectInTimetable = (day: number, idx: number) => {
        return tt[day][idx];
    };

    const delColumnInTimetable = (idx: number) => {
        setTt(tt => {
            let newtt = [...tt].map(day => {
                day.splice(idx, 1);
                return day;
            });

            return newtt;
        });
    };

    const addColumnInTimetable = () => {
        setTt(timetable => {
            let newtt = [...timetable].map(day => [...day, ""]);

            return newtt;
        });
    };
    
    const saveTimetable = () => {
        localStorage.setItem("timetable", JSON.stringify(tt));
    };

    return {
        timetable: tt,
        changeSubjectInTimetable,
        getSubjectInTimetable,
        addColumnInTimetable,
        delColumnInTimetable,
        saveTimetable
    };
}


const icea = [
    ["", "", "", "", ""],
    ["Mech", "Energy", "CP", "Civil", "Physics Lab"],
    ["Math", "Mech", "Civil", "Physics", ""],
    ["Physics", "Math", "CP", "Energy", "CS Lab"],
    ["EP", "Mech", "Energy", "", ""],
    ["Civil", "Physics", "Math", "Mech", ""],
    ["", "", "", "", ""],
];