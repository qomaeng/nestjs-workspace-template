import { Injectable, Logger } from '@nestjs/common';
import {
  CreateUserPayload,
  DeleteUserPayload,
  FindUserOptions,
  FindUserPayload,
  IUserService,
  NotFoundUserError,
  QueryUsersPayload,
  UpdateUserPayload,
  User,
} from '@template/core';

import { UserEntity } from '@/entity/user.entity';
import { UserRepository } from '@/repostiroy/user.repository';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {
    // do nothing
  }

  ///////////////////////////////////
  //             Create
  ///////////////////////////////////

  async createUser(payload: CreateUserPayload): Promise<User> {
    // 매개변수 검증하기
    payload = CreateUserPayload.parse(payload);

    // 유저 생성하기
    const entity = await this.userRepository.createUser(payload);
    entity.passwordHash = undefined; // 유저 비밀번호 해쉬 숨기기
    this.logger.log(`Created new user: id=${entity.id}`);
    const user = UserEntity.toModel(entity);

    return user;
  }

  ///////////////////////////////////
  //              Find
  ///////////////////////////////////

  async findUser(
    payload: FindUserPayload,
    options?: FindUserOptions,
  ): Promise<User | null> {
    // 매개변수 검증하기
    payload = FindUserPayload.parse(payload);
    options = options ? FindUserOptions.parse(options) : options;

    // 유저 찾기
    const entity = await this.userRepository.findUser(payload, options);
    const user = entity ? UserEntity.toModel(entity) : entity;

    return user;
  }

  async getUser(...args: Parameters<UserService['findUser']>): Promise<User> {
    const user = await this.findUser(...args);
    if (!user) {
      throw new NotFoundUserError();
    }
    return user;
  }

  async queryUsers(
    payload: QueryUsersPayload,
    options?: FindUserOptions,
  ): Promise<User[]> {
    // 매개변수 검증하기
    payload = QueryUsersPayload.parse(payload);
    options = options ? FindUserOptions.parse(options) : options;

    // 유저들 찾기
    const entities = await this.userRepository.queryUsers(payload, options);
    const users = entities.map((entity) => UserEntity.toModel(entity));

    return users;
  }

  ///////////////////////////////////
  //             Update
  ///////////////////////////////////

  async updateUser(payload: UpdateUserPayload): Promise<void> {
    // 매개변수 검증하기
    payload = UpdateUserPayload.parse(payload);

    // 유저의 정보 수정하기
    await this.userRepository.updateUser(payload);
    this.logger.log(`Updated a user: id=${payload.id}`);
  }

  ///////////////////////////////////
  //             Delete
  ///////////////////////////////////

  async deleteUser(payload: DeleteUserPayload): Promise<void> {
    // 매개변수 검증하기
    payload = DeleteUserPayload.parse(payload);

    // 유저 삭제하기
    await this.userRepository.softDeleteUser(payload);
    this.logger.log(`User was (soft) deleted: id=${payload.id}`);
  }
}
