import bcrypt from "bcrypt";

async function hashpassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 13);
}

async function comparepassword(
  input_password: string,
  hashed_password: string
): Promise<Boolean> {
  return await bcrypt.compare(input_password, hashed_password);
}

export { hashpassword, comparepassword };
