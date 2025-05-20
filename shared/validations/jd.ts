import { z } from "zod";

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const jdDocSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, { message: "File is required" })
  .refine((file) => file.size <= 3 * 1024 * 1024, {
    message: "Max file size is 3MB",
  })
  .refine((file) => allowedTypes.includes(file.type), {
    message: "Only PDF, DOC, DOCX files are allowed",
  });

export const jdFormSchema = z.object({
  file: jdDocSchema,
  jd: z.string().min(20, { message: "JD is required" }),
});
