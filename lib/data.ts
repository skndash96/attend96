import { useEffect, useState } from "react"

export type Data = {
    subjects: string[],
    timetable: string[][],
    
    addSubject(item: string): void,
    removeSubject(item: string): void,
    saveSubjects(): void,
    
    changeSubjectInTimetable(day: number, idx: number, to: string): void,
    addColumnInTimetable(): void,
    removeColumnInTimetable(idx: number): void,
    saveTimetable(): void
};

export const dayIndexMap = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

const defaultSubjects : string[] = [];
const defaultTimetable : string[][] = new Array(7).fill(new Array(5).fill(""));

export function useData(): Data {
    const [subjects, setSubjects] = useState<string[]>(defaultSubjects);
    const [timetable, setTimetable] = useState<string[][]>(defaultTimetable);
    
    const addSubject = (item: string) => setSubjects(s => [...s, item]);
    
    const removeSubject = (item: string) => setSubjects(s => {
        let idx = s.indexOf(item);
        if (idx !== -1) {
            s.splice(idx, 1);
            //TODO: confirm, replace all occurence by "" 
        }
        return [...s];
    });

    const changeSubjectInTimetable = (day: number, idx: number, to: string) => {
        setTimetable(timetable => {
            let newtt = [...timetable];
            
            newtt[day][idx] = to;

            return newtt;
        });
    };

    const removeColumnInTimetable = (idx: number) => {
        setTimetable(timetable => {
            let newtt = [...timetable].map(day => {
                day.splice(idx, 1);
                return day;
            });

            return newtt;
        });
    };

    const addColumnInTimetable = () => {
        setTimetable(timetable => {
            let newtt = [...timetable].map(day => [...day, ""]);

            return newtt;
        });
    };

    const loadSubjects = () => {
        let str = localStorage.getItem("subjects");

        let prev = str ? JSON.parse(str) : defaultSubjects;

        setSubjects(prev);
    };

    const saveSubjects = () => {
        localStorage.setItem("subjects", JSON.stringify(subjects));
    };
    
    const loadTimetable = () => {
        let str = localStorage.getItem("timetable");

        let prev = str ? JSON.parse(str) : defaultTimetable;

        setTimetable(prev);
    };
    
    const saveTimetable = () => {
        localStorage.setItem("timetable", JSON.stringify(timetable));
    };

    useEffect(() => {
        loadSubjects();
        loadTimetable();
    }, []);

    return {
        subjects,
        timetable,
        
        addSubject,
        removeSubject,
        saveSubjects,

        changeSubjectInTimetable,
        addColumnInTimetable,
        removeColumnInTimetable,
        saveTimetable,
    };
}