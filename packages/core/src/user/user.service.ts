import type { User } from './user.model.js';
import type {
  CreateUserPayload,
  DeleteUserPayload,
  FindUserOptions,
  FindUserPayload,
  QueryUsersPayload,
  UpdateUserPayload,
} from './user.payload.js';

export interface IUserService {
  ///////////////////////////////////
  //             Create
  ///////////////////////////////////

  createUser(payload: CreateUserPayload): Promise<User>;

  ///////////////////////////////////
  //              Find
  ///////////////////////////////////

  findUser(payload: FindUserPayload, options?: FindUserOptions): Promise<User | null>;

  getUser(...args: Parameters<IUserService['findUser']>): Promise<User>;

  queryUsers(payload: QueryUsersPayload, options?: FindUserOptions): Promise<User[]>;

  ///////////////////////////////////
  //             Update
  ///////////////////////////////////

  updateUser(payload: UpdateUserPayload): Promise<void>;

  ///////////////////////////////////
  //             Delete
  ///////////////////////////////////

  deleteUser(payload: DeleteUserPayload): Promise<void>;
}
