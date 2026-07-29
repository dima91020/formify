import { Middleware, isAction } from "@reduxjs/toolkit";
import { ResponseState } from "@/store/slices/responseSlice";

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const saveToLocalStorage = (state: ResponseState) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem("surveyProgress", JSON.stringify(state));
    } catch {}
};

export const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    const result = next(action);

    if (isAction(action) && action.type.startsWith("response/")) {
        const state = (storeAPI.getState() as { response: ResponseState }).response;

        if (action.type === "response/updateAnswer") {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                saveToLocalStorage(state);
                timeoutId = null;
            }, 500);
        } else {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            saveToLocalStorage(state);
        }
    }

    return result;
};