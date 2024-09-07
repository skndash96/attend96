"use client";
import { SubjectsContext } from "@/lib/subjects";
import { FormEventHandler, useContext, useRef, useState } from "react";

export default function Subjects() {
    let inputRef = useRef<HTMLInputElement>(null);
    let [currentEditing, setCurrentEditing] = useState<boolean>(false);

    let { subs, addSub, delSub, saveSubs } = useContext(SubjectsContext);

    const handleAdd: FormEventHandler = (e) => {
        e.preventDefault();

        if (!inputRef.current) return;

        let v = inputRef.current.value.trim();
        inputRef.current.value = "";

        if (v) {
            addSub(v);
        }
    };

    const handleToggleEdit = () => {
        if (currentEditing) {
            saveSubs();
        }

        setCurrentEditing(b => !b);
    };

    return (
        <>
            <main className="p-4">
                <div>
                    <h1 className="mb-4 text-2xl font-semibold">
                        Subjects

                        <button onClick={handleToggleEdit} className="ml-4 text-sm underline">
                            {currentEditing ? "save" : "edit"}
                        </button>
                    </h1>
                </div>

                <form className={currentEditing ? "" : "hidden"} onSubmit={handleAdd}>
                    <h2> Add Subject </h2>

                    <div className="flex">
                        <input
                            ref={inputRef}
                            className="px-1 bg-slate-200"
                            type="text"
                            placeholder="Type Subject name"
                        />

                        <button className="p-2 font-semibold bg-slate-700 text-white">
                            Add
                        </button>
                    </div>
                </form>

                <ul className="mt-4 flex flex-col gap-2">
                    {subs.length === 0 && !currentEditing && (
                        <span>
                            No subs found. Add using the above edit button
                        </span>
                    )}
                    
                    {subs.map(item => (
                        <li key={item} className="p-2 bg-slate-200">
                            <div className="flex justify-between">
                                {item}

                                {currentEditing && (
                                    <button onClick={() => delSub(item)} className="text-red-500">
                                        x
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </>
    );
}