interface ICacheRepo {
  addItemToCache<T>(key: string, payload: T): Promise<void>;
  getItemsFromCache<T>(key: string): Promise<T[]>;
  getItemFromCache<T>(key: string): Promise<T>;
  deletefromCache<T>(key: string): Promise<void>;
  updateDataInCache<T>(key: string, payload: Partial<T>): Promise<void>;
}

export default ICacheRepo;
