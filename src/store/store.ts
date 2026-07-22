import {configureStore} from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
import responseReducer from "./slices/responseSlice";
import {localStorageMiddleware} from "@/utils/localStorageMiddleware";

export const store = configureStore({
    reducer: {
        form: formReducer,
        response: responseReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;