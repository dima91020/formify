'use client'

import { setTitle } from "@/store/slices/formSlice";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {SYNC_STATUS} from "@/components/builder/FormBuilder";
import clsx from "clsx";

const TABS = ["Questions", "Logic"];

export default function BuilderHeader({ syncStatus }: {syncStatus: SYNC_STATUS}) {
    const dispatch = useAppDispatch();
    const formState = useAppSelector(state => state.form);

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", newTab);

        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="h-16 border-b px-6 grid grid-cols-3 items-center shadow-sm bg-white">

            <div className="flex items-center justify-start">
                <input
                    className="text-lg font-medium text-gray-800 bg-transparent focus:outline-none w-full leading-none"
                    value={formState.title}
                    onChange={(e) => dispatch(setTitle(e.target.value))}
                    placeholder="Form Title"
                />
            </div>

            <div className="flex items-center justify-center gap-4 text-md text-gray-500 cursor-pointer">
                {TABS.map((tab, index) => (
                    <div
                        key={index}
                        className={clsx({"underline text-gray-700": searchParams.get("tab") === tab.toLowerCase()})}
                        onClick={() => handleTabChange(tab.toLowerCase())}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end gap-4">
                <p className={`text-sm font-medium leading-none ${
                    syncStatus === SYNC_STATUS.Error ? 'text-red-500' : 'text-gray-500'
                }`}>
                    {syncStatus}
                </p>
            </div>
        </div>
    )
}