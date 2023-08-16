import { array, object, string } from "yup";

const groupSchema = object({
  name: string().required().trim(),
  description: string().optional(),
  members: array().optional(),
});

export { groupSchema };
