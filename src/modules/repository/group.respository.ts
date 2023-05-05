export interface IGroupRepo<T> {
  createGroup(Group: Partial<T>): Promise<T>;
  userInGroup(group: string, user: string): Promise<Boolean>;
  isAdmin(group: string, user: string): Promise<Boolean>;
  getAllGroup(): Promise<T[]>;
  getAGroupById(id: string): Promise<T>;
  updateGroup(id: string, payload: object): Promise<T>;
  findAGroup(id: string): Promise<T>;
}
