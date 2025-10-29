import z from "zod";

export const EdgeConfig = z.object({
    "enforce-code-patches": z.optional(z.boolean())
})

export const EdgeOptions = z.object({
    config: z.optional(z.union([z.string(), EdgeConfig]))
})