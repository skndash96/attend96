import { createContext } from "react";
import { Data } from "./data";

const dataContext = createContext<Data>({
    subjects: [],
    timetable: new Array(7).fill({}),
    addSubject: () => {},
    removeSubject: () => {},
    changeSubjectInTimetable: () => {},
    addColumnInTimetable: () => {},
    removeColumnInTimetable: () => {},
    saveSubjects: () => {},
    saveTimetable: () => {}
});

export default dataContext;