export interface IGroupRepo<T> {
  createGroup(Group: Partial<T>): Promise<T>;
  userInGroup(group: T, user: string): Boolean;
  isAdmin(group: T, user: string): Boolean;
  getAllGroup(): Promise<T[]>;
  getAGroupById(id: string): Promise<T>;
  updateGroup(id: string, payload: object): Promise<T>;
  findAGroupByCode(code: string): Promise<T>;
  getUserGroups(user_id: string): Promise<T[]>;
}
