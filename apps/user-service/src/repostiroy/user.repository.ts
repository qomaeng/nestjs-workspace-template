import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  type CreateUserPayload,
  type FindUserPayload,
  type FindUserOptions,
  type QueryUsersPayload,
  type UpdateUserPayload,
  PostgresUtil,
  DuplicatedUserError,
  NotFoundUserError,
  DeleteUserPayload,
} from '@template/core';
import { Repository, In, IsNull, ILike, And, MoreThanOrEqual, LessThan } from 'typeorm';

import { UserEntity } from '@/entity/user.entity';

@Injectable()
export class UserRepository {
  private _columns: (keyof UserEntity)[];

  constructor(
    @InjectRepository(UserEntity) private readonly _users: Repository<UserEntity>,
  ) {
    this._columns = _users.metadata.columns.map(
      (column) => column.propertyName as keyof UserEntity,
    );
  }

  ///////////////////////////////////
  //             Create
  ///////////////////////////////////

  async createUser(payload: CreateUserPayload): Promise<UserEntity> {
    try {
      const entity = await this._users.save({
        role: payload.role,
        username: payload.username,
        passwordHash: payload.passwordHash,

        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      });

      return entity;
    } catch (error: unknown) {
      if (PostgresUtil.isUniqueConstraintError(error)) {
        throw new DuplicatedUserError();
      }
      throw error;
    }
  }

  ///////////////////////////////////
  //              Find
  ///////////////////////////////////

  async findUser(
    payload: FindUserPayload,
    options?: FindUserOptions,
  ): Promise<UserEntity | null> {
    const entity = await this._users.findOne({
      withDeleted: options?.withDeleted,
      select: this._columns.filter((column) => {
        if (column === 'passwordHash' && !options?.includePasswordHash) {
          return false;
        }
        if (column === 'passwordChangedAt' && !options?.includePasswordChangedAt) {
          return false;
        }
        if (column === 'deletedAt' && !options?.withDeleted) {
          return false;
        }
        return true;
      }),
      where: 'id' in payload ? { id: payload.id } : { username: payload.username },
    });

    return entity;
  }

  async queryUsers(
    payload: QueryUsersPayload,
    options?: FindUserOptions,
  ): Promise<UserEntity[]> {
    const entities = await this._users.find({
      withDeleted: options?.withDeleted,
      select: this._columns.filter((column) => {
        if (column === 'passwordHash' && !options?.includePasswordHash) {
          return false;
        }
        if (column === 'passwordChangedAt' && !options?.includePasswordChangedAt) {
          return false;
        }
        if (column === 'deletedAt' && !options?.withDeleted) {
          return false;
        }
        return true;
      }),
      where: {
        id: payload.ids ? In(payload.ids) : undefined,
        createdAt:
          payload.createdSince && payload.createdUntil
            ? And(MoreThanOrEqual(payload.createdSince), LessThan(payload.createdUntil))
            : payload.createdSince
              ? MoreThanOrEqual(payload.createdSince)
              : payload.createdUntil
                ? LessThan(payload.createdUntil)
                : undefined,
        username:
          payload.usernameLike === null
            ? IsNull()
            : payload.usernameLike !== undefined
              ? ILike(`%${payload.usernameLike}%`)
              : undefined,
        role: payload.role,
      },
      order: {
        createdAt: payload.sort === 'oldest' ? 'ASC' : 'DESC',
      },
      skip: ((payload.page || 1) - 1) * (payload.count ?? 10),
      take: payload.count,
    });

    return entities;
  }

  ///////////////////////////////////
  //             Update
  ///////////////////////////////////

  async updateUser(payload: UpdateUserPayload): Promise<void> {
    const criteria = { id: payload.id };

    try {
      const result = await this._users.update(criteria, {
        role: payload.role,
        passwordHash: payload.passwordHash,
        passwordChangedAt:
          payload.passwordHash !== undefined ? () => 'CURRENT_TIMESTAMP(3)' : undefined,

        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      });
      if (!result.affected) {
        throw new NotFoundUserError();
      }
    } catch (error: unknown) {
      if (PostgresUtil.isUniqueConstraintError(error)) {
        throw new DuplicatedUserError();
      }
      throw error;
    }
  }

  ///////////////////////////////////
  //             Delete
  ///////////////////////////////////

  async softDeleteUser(payload: DeleteUserPayload): Promise<void> {
    const criteria = { id: payload.id };

    const result = await this._users.softDelete(criteria);
    if (!result.affected) {
      throw new NotFoundUserError();
    }
  }
}
