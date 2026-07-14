'use client'

import {createDraftForm} from "@/actions/form.actions";
import {useRouter} from "next/navigation";

export default function CreateDraftFormButton() {
    const router = useRouter();

    const handleCreateDraftForm = async () => {
        try {
            const draftForm = await createDraftForm();

            if (!draftForm.success) {
                return;
            }

            router.push(`/builder/${draftForm.formId}`);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <button
            className="text-center bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            onClick={handleCreateDraftForm}
        >
            Create Form
        </button>
    );
}