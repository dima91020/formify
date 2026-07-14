'use client'

import Link from "next/link";
import {Form} from "@prisma/client";
import {deleteForm, togglePublishStatus} from "@/actions/form.actions";
import {useEffect, useState} from "react";
import {FaSpinner} from "react-icons/fa";
import clsx from "clsx";
import {FaCopy} from "react-icons/fa6";
import {MdOutlineCheckCircle} from "react-icons/md";

export default function FormCard({ form }: { form: Form }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isCopying, setIsCopying] = useState(false);

    const handleDeleteForm = async (formId: string) => {
        setIsDeleting(true);
        try {
            const result = await deleteForm(formId);
            if (!result.success) {
                alert(result.error);
            }
        } catch (error) {
            console.error("Failed to delete form:", error);
            alert("Network error or server is unreachable. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePublishForm = async (formId: string) => {
        setIsPublishing(true);
        try {
            const result = await togglePublishStatus(formId);

            if (!result.success) {
                alert(result.error);
            }
        } catch (error) {
            console.error("Failed to update form:", error);
            alert("Network error or server is unreachable. Please try again.");
        }finally {
            setIsPublishing(false);
        }
    }

    const handleCopyFormLink = async (formId: string) => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/f/${formId}`);
            setIsCopying(true);
        } catch (error) {
            alert("Failed to copy link. Please check your browser permissions.")
        }
    }

    useEffect(() => {
        if (!isCopying) return;

        const timerId = setTimeout(() => {
            setIsCopying(false);
        }, 2000);

        return () => {
            clearTimeout(timerId);
        };
    }, [isCopying]);

    return (
        <div className="bg-white shadow-sm p-6 rounded-lg">
            <div className={clsx("flex justify-end", form.published ? "text-green-500" : "text-gray-500" )}>{form.published ? "Published" : "Draft"}</div>
            <h1 className="font-bold text-xl mb-2 text-gray-800">{form.title}</h1>
            <p className="mb-6 text-gray-500">Created: {form.createdAt.toLocaleDateString('uk-UA')}</p>
            <div className="flex gap-3 flex-col">
                <Link href={`/builder/${form.id}`} className="text-center text-gray-800 bg-gray-300 py-2 flex-1 rounded-md hover:bg-gray-200 transition-colors">
                    Edit
                </Link>
                <Link href={`/f/${form.id}`} className="text-center text-white bg-gray-800 py-2 flex-1 rounded-md hover:bg-gray-600 transition-colors">
                    View
                </Link>
                <Link href={`/dashboard/${form.id}/responses`} className="text-center text-white bg-gray-800 py-2 flex-1 rounded-md hover:bg-gray-600 transition-colors">
                    Responses
                </Link>
                <button
                    className="flex items-center justify-center gap-2 text-center text-white bg-gray-800 py-2 flex-1 rounded-md hover:bg-gray-600 transition-colors"
                    disabled={isPublishing}
                    onClick={() => handlePublishForm(form.id)}
                >
                    {isPublishing && <FaSpinner className="animate-spin" />}
                    <span>{form.published ? "Unpublish" : "Publish"}</span>
                </button>
                {form.published && (
                    <button
                        className={clsx(
                            "flex items-center justify-center gap-2 text-center py-2 flex-1 rounded-md transition-all duration-300",
                            isCopying ? "bg-green-600 text-white" : "bg-gray-800 text-white hover:bg-gray-600"
                        )}
                        disabled={isCopying}
                        onClick={() => handleCopyFormLink(form.id)}
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            <MdOutlineCheckCircle
                                className={clsx(
                                    "absolute transition-all duration-300 transform",
                                    isCopying ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-45"
                                )}
                            />
                            <FaCopy
                                className={clsx(
                                    "absolute transition-all duration-300 transform",
                                    isCopying ? "opacity-0 scale-50 rotate-45" : "opacity-100 scale-100 rotate-0"
                                )}
                            />
                        </div>

                        <span className="font-medium transition-all duration-300">
                            {isCopying ? "Copied!" : "Copy Link"}
                        </span>
                    </button>

                )}
                <button
                    className="flex items-center justify-center gap-2 text-center text-white bg-red-500 py-2 flex-1 rounded-md hover:bg-red-400 transition-colors"
                    disabled={isDeleting}
                    onClick={() => handleDeleteForm(form.id)}
                >
                    {isDeleting ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            <span>Deleting...</span>
                        </>
                    ) : (
                        "Delete"
                    )}
                </button>
            </div>
        </div>
    );
};