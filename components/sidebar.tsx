"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegCalendar } from "react-icons/fa";
import { FaTableCells } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";

export default function Sidebar() {
    let pathname = usePathname();

    return (
        <div className="grow w-full max-w-32 bg-slate-700 text-slate-200">
            <h1 className="p-2 text-lg font-semibold">Attend96</h1>

            <nav>
                <ul className="mt-2 flex flex-col items-stretch">
                    {[
                        {
                            href: "/timetable",
                            Icon: FaTableCells
                        },
                        {
                            href: "/calendar",
                            Icon: FaRegCalendar
                        },
                        {
                            href: "/subjects",
                            Icon: MdCategory
                        },
                    ].map(({ href, Icon }) => (
                        <li key={href} className="px-2 py-1 hover:bg-slate-500/25">
                            <Link className={`flex items-center gap-2 ${href === pathname ? "underline" : ""}`} href={href}>
                                <Icon size={18} className="opacity-75" />
                                {href.slice(1).substring(0, 1).toUpperCase() + href.slice(2)}
                            </Link>
                        </li>
                    ))
                    }
                </ul>
            </nav>
        </div>
    );
}