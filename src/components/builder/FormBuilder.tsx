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
                <QuestionsSidebar />

                <div className="flex-1 bg-zinc-50/80 overflow-y-auto relative flex flex-col">
                    {currentTab === "questions" && <FormCanvas />}
                    {currentTab === "logic" && (
                        <div className="flex-1 h-full w-full">
                            <LogicMap />
                        </div>
                    )}
                </div>

                {currentTab === "questions" && <QuestionSettings />}
            </div>
        </div>
    );
}