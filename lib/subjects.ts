import { createContext, useEffect, useState } from "react";

export type Subject = string;

type SubjectsExport = {
    subs: Subject[],
    addSub(x: Subject): void
    delSub(x: Subject): void,
    saveSubs(): void
};

export const SubjectsContext = createContext<SubjectsExport>({
    subs: [],
    addSub() {},
    delSub() {},
    saveSubs() {}
});

export function useSubjects(): SubjectsExport {
    const [subs, setSubs] = useState<Subject[]>([]);

    useEffect(() => {
        let str = localStorage.getItem("subjects");

        if (str) setSubs(JSON.parse(str));
    }, []);

    const addSub = (x: Subject) => {
        setSubs(subs => [...subs, x]);
    };

    const delSub = (x: Subject) => {
        setSubs(subs => {
            let idx = subs.indexOf(x);

            if (idx !== -1) subs.splice(idx, 1);

            return [...subs];
        });
    };

    const saveSubs = () => {
        localStorage.setItem("subjects", JSON.stringify(subs));
    };

    return {
        subs, addSub, delSub, saveSubs
    };
}