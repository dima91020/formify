import {useEffect, useState} from "react";

export const useDebounce = <T,>(dataToSave: T, ms: number): T => {
    const [newData, setNewData] = useState(dataToSave);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNewData(dataToSave)
        }, ms);

        return () => {
            clearTimeout(timer);
        }
    }, [dataToSave, ms]);

    return newData;
}