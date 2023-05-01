import { object, string } from "yup";

const signupSchema = object({
  email: string()
    .required()
    .email("PLease input a valid email")
    .lowercase()
    .trim(),
  password: string()
    .required("Password field cannot be empty")
    .min(8, "Password must be more than 8 characters")
    .trim(),
  fullname: string().required(),

  username: string()
    .required()
    .min(8, "Username should have more than 8 characters")
    .trim(),
});

export { signupSchema };
