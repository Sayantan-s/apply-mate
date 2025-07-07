import z from "zod";

export const httpUrlSchema = z
  .string()
  .url("Try adding a correct resume url")
  .refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
    message: "Must be a valid HTTP or HTTPS URL",
  });
