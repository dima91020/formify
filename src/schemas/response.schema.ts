import * as z from "zod";

export const saveAnswersSchema = z.record(
    z.string(),
    z.union([
        z.string().min(1, 'Answers should be at least 1 character'),
        z.array(z.string())
    ])
);

export type Answers = z.infer<typeof saveAnswersSchema>;
