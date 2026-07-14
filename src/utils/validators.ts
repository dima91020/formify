export const hasDuplicateOptions = (options?: Array<{ id: string, value: string }>) => {
    if (!options || !options.length) return false;

    const optionsValues = options.map(option => option.value);

    return new Set(optionsValues).size !== options.length;
}