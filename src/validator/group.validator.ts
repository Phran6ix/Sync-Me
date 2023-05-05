import { object, string } from "yup";

const groupSchema = object({
  name: string().required().trim(),
  description: string().optional(),
});

export { groupSchema };
