export interface IUserRepo<T> {
  createUser(User: Partial<T>): Promise<T>;
  findUserByEmail(email: string): Promise<T | null>;
  findUserByUsername(username: string): Promise<T | null>;
  findUserById(userId: string): Promise<T | null>;
  userExists(username?: string, email?: string): Promise<Boolean>;
  updateUser(userId: string, User: Partial<T>): Promise<Boolean>;
}
