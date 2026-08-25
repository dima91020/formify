'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import QuestionsSidebar from "@/components/builder/QuestionsSidebar";
import FormCanvas from "@/components/builder/FormCanvas";
import QuestionSettings from "@/components/builder/QuestionSettings";
import { updateForm } from "@/actions/form.actions";
import { useEffect, useRef, useState } from "react";
import { FormBuilderState, setFullForm } from "@/store/slices/formSlice";
import { Form } from "@prisma/client";
import { CreateFormInput } from "@/schemas/form.schema";
import { useDebounce } from "@/hooks/useDebounce";
import BuilderHeader from "@/components/builder/BuilderHeader";
import {useSearchParams} from "next/navigation";
import {hasDuplicateOptions} from "@/utils/validators";
import LogicMap from "@/components/builder/LogicMap";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Layers, Settings2 } from "lucide-react";

export enum SYNC_STATUS {
    Saved = "Saved",
    Saving = "Saving...",
    Error = "Error saving",
}

export default function FormBuilder({ initialData }: { initialData: Form }) {
    const dispatch = useAppDispatch();
    const formState = useAppSelector(state => state.form);
    const [syncStatus, setSyncStatus] = useState<SYNC_STATUS>(SYNC_STATUS.Saved);
    const debouncedFormState = useDebounce<FormBuilderState>(formState, 1000);
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || 'questions';
    const isInitialized = useRef(false);
    const [activeMobileDrawer, setActiveMobileDrawer] = useState<"questions" | "settings" | null>(null);
    const activeQuestionIndex = formState.questions.findIndex(q => q.id === formState.activeQuestionId);

    const lastSavedData = useRef(JSON.stringify({
        title: initialData.title,
        schema: initialData.schema
    }));

    const hasErrors = debouncedFormState.questions.some((q) =>
        q.options && hasDuplicateOptions(q.options)
    );

    const currentDisplayStatus = hasErrors ? SYNC_STATUS.Error : syncStatus;

    useEffect(() => {
        if (initialData) {
            dispatch(setFullForm({
                title: initialData.title,
                schema: initialData.schema as CreateFormInput["schema"],
            }));

            isInitialized.current = true;
        }
    }, [dispatch, initialData.id]);

    useEffect(() => {
        if (hasErrors || !isInitialized.current) return;

        const dataToSave = {
            title: debouncedFormState.title,
            schema: {
                questions: debouncedFormState.questions,
                logic: debouncedFormState.logic || [],
            }
        };

        const currentDataString = JSON.stringify(dataToSave);

        if (currentDataString === lastSavedData.current) return;

        const saveToDatabase = async () => {
            setSyncStatus(SYNC_STATUS.Saving);

            try {
                const result = await updateForm(dataToSave, initialData.id);

                if (result.success) {
                    setSyncStatus(SYNC_STATUS.Saved);
                    lastSavedData.current = currentDataString;
                } else {
                    setSyncStatus(SYNC_STATUS.Error);
                }
            } catch (error) {
                setSyncStatus(SYNC_STATUS.Error);
            }
        }

        saveToDatabase();
    }, [debouncedFormState, initialData.id, hasErrors]);

    return (
        <div className="h-screen flex flex-col bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
            <BuilderHeader syncStatus={currentDisplayStatus} formId={initialData.id} />

            <div className="flex flex-1 overflow-hidden">
                <QuestionsSidebar className="hidden md:flex w-72 bg-white border-r border-zinc-200/80 flex-col h-[calc(100vh-4rem)] select-none shrink-0" />

                <div className="flex-1 bg-zinc-50/80 overflow-y-auto relative flex flex-col">
                    {currentTab === "questions" && <FormCanvas />}
                    {currentTab === "logic" && (
                        <div className="flex-1 h-full w-full">
                            <LogicMap />
                        </div>
                    )}
                </div>

                {currentTab === "questions" && <QuestionSettings className="hidden lg:flex w-80 bg-white border-l border-zinc-200/80 p-6 h-[calc(100vh-4rem)] overflow-y-auto flex-col gap-6 select-none scrollbar-thin scrollbar-thumb-zinc-200 shrink-0" />}
            </div>

            {currentTab === "questions" && (
                <div className="md:hidden flex justify-between items-center fixed bottom-4 inset-x-4 z-40 bg-zinc-950/90 rounded-2xl backdrop-blur-md text-white p-1.5 shadow-2xl border border-white/10 select-none">
                    <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold transition-all cursor-pointer"
                        onClick={() => setActiveMobileDrawer("questions")}
                    >
                        <Layers className="w-4 h-4" />
                        <span>Questions ({formState.questions.length})</span>
                    </button>

                    <span>{activeQuestionIndex >= 0 ? `Q${activeQuestionIndex + 1} of ${formState.questions.length}` : ""}</span>

                    <button
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold transition-all cursor-pointer"
                        onClick={() => setActiveMobileDrawer("settings")}
                    >
                        <Settings2 className="w-4 h-4" />
                        <span>Settings</span>
                    </button>
                </div>
            )}

            <Sheet open={activeMobileDrawer === "questions"} onOpenChange={(open) => !open && setActiveMobileDrawer(null)}>
                <SheetContent side="bottom" className="max-h-[80vh] p-4 pt-6 flex flex-col">
                    <SheetHeader className="mb-2">
                        <SheetTitle>Questions</SheetTitle>
                    </SheetHeader>
                    <QuestionsSidebar className="w-full flex flex-col max-h-[60vh] border-none p-0" onItemClick={() => setActiveMobileDrawer(null)} />
                </SheetContent>
            </Sheet>

            <Sheet open={activeMobileDrawer === "settings"} onOpenChange={(open) => !open && setActiveMobileDrawer(null)}>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto p-4 pt-6 flex flex-col">
                    <SheetHeader className="mb-2">
                        <SheetTitle>Settings</SheetTitle>
                    </SheetHeader>
                    <QuestionSettings className="w-full flex flex-col gap-6 p-0 border-none pb-6" />
                </SheetContent>
            </Sheet>
        </div>
    );
}