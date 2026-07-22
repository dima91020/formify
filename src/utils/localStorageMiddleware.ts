import { Middleware, isAction } from "@reduxjs/toolkit";
import {ResponseState} from "@/store/slices/responseSlice";

export const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    const result = next(action);

    if (isAction(action) && action.type.startsWith("response/")) {
        const state = storeAPI.getState() as { response : ResponseState };
        window.localStorage.setItem("surveyProgress", JSON.stringify(state.response));
    }

    return result;
};