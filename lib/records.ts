import { createContext, useEffect, useState } from "react";
import { Subject } from "./subjects";

export type Status = -1|0|1|null;

export type Record = [Subject, Status];

export type Records = Map<string, Record[]>;

type RecordsExport = {
    loading: boolean,
    setRecordStatus(date: number, idx: number, status: Status): void,
    getRecord(date: number): Record[]|undefined,
    getRecordStatus(date: number, idx: number): Status,
    createRecord(date: number, subs: Subject[]): Record[] | undefined
};

export const RecordsContext = createContext<RecordsExport>({
        loading: true,
        getRecord: () => undefined,
        getRecordStatus: () => null,
        setRecordStatus() {},
        createRecord() { return []; }
});

export function useRecords(): RecordsExport {
    let [r, setR] = useState<Records>(new Map());
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let str = localStorage.getItem("records");

        if (str) {
            let d = Object.entries(JSON.parse(str));
            
            //@ts-ignore
            setR(new Map(d));
        }

        setLoading(false);
    }, []);

    useEffect(() => {        
        if (loading) return;

        localStorage.setItem(
            "records",
            JSON.stringify(Object.fromEntries(r))
        );
    }, [r]);

    const setRecordStatus = (date: number, idx: number, status: Status) => {
        if (loading) return;

        let rec = r.get(date.toString());

        if (!rec) return;

        rec[idx][1] = status;
        
        r.set(date.toString(), rec);

        setR(new Map(r));
    };

    const createRecord = (date: number, subs: Subject[]) => {
        if (loading) return;

        if (r.has(date.toString())) return r.get(date.toString());

        r.set(date.toString(), subs.filter(Boolean).map(s => [s, null]));

        setR(new Map(r));

        let rec : Record[] = r.get(date.toString())!;

        return rec;
    };

    const getRecord = (date: number) => {
        return r.get(date.toString());
    };

    const getRecordStatus = (date: number, idx: number) => {
        if (loading) return null;

        return r.get(date.toString())?.[idx][1] || null;
    };

    return {
        loading,
        getRecord,
        getRecordStatus,
        setRecordStatus,
        createRecord
    };
}