import z from "zod";

export const registerSchema = z.object({
  //   studentId: z.string(),
  email: z.string(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  sex: z.enum(["MALE", "FEMALE"]),
  birthdate: z.string(),
  phone: z.string(),
  address: z.string(),
  studentId: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.string(),
  url: z.string(),
  password: z.string(),
});

export type RegisterForm = z.infer<typeof registerSchema>;
