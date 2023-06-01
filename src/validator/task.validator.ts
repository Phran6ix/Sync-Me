import { Schema, object, string } from "yup";

const taskSchema = object({
  group: string().required("input Group Id here").trim(),
  title: string().required("input the task title here"),
});

export { taskSchema };
