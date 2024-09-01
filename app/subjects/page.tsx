"use client";
import dataContext from "@/lib/dataContext";
import { FormEventHandler, useContext, useRef, useState } from "react";

export default function Subjects() {
    let inputRef = useRef<HTMLInputElement>(null);
    let [currentEditing, setCurrentEditing] = useState<boolean>(false);

    let { subjects, addSubject, removeSubject, saveSubjects } = useContext(dataContext);

    const handleAdd: FormEventHandler = (e) => {
        e.preventDefault();

        if (!inputRef.current) return;

        let v = inputRef.current.value.trim();
        inputRef.current.value = "";

        if (v) {
            addSubject(v);
        }
    };

    const handleToggleEdit = () => {
        if (currentEditing) {
            saveSubjects();
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
                    {subjects.length === 0 && !currentEditing && (
                        <span>
                            No subjects found. Add using the above edit button
                        </span>
                    )}
                    
                    {subjects.map(item => (
                        <li key={item} className="p-2 bg-slate-200">
                            <div className="flex justify-between">
                                {item}

                                {currentEditing && (
                                    <button onClick={() => removeSubject(item)} className="text-red-500">
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