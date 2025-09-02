import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import type { IUserService } from '@template/core';

@Controller()
export class UserRpcController {
  constructor(@Inject('UserService') private readonly userService: IUserService) {
    // do nothing
  }

  ///////////////////////////////////
  //             Create
  ///////////////////////////////////

  @MessagePattern('createUser')
  async createUser({
    payload,
  }: {
    payload: Parameters<IUserService['createUser']>[0];
  }): ReturnType<IUserService['createUser']> {
    return await this.userService.createUser(payload);
  }

  ///////////////////////////////////
  //              Find
  ///////////////////////////////////

  @MessagePattern('findUser')
  async findUser({
    payload,
    options,
  }: {
    payload: Parameters<IUserService['findUser']>[0];
    options?: Parameters<IUserService['findUser']>[1];
  }): ReturnType<IUserService['findUser']> {
    return await this.userService.findUser(payload, options);
  }

  @MessagePattern('getUser')
  async getUser({
    payload,
    options,
  }: {
    payload: Parameters<IUserService['getUser']>[0];
    options: Parameters<IUserService['getUser']>[1];
  }): ReturnType<IUserService['getUser']> {
    return await this.userService.getUser(payload, options);
  }

  @MessagePattern('queryUsers')
  async queryUsers({
    payload,
    options,
  }: {
    payload: Parameters<IUserService['queryUsers']>[0];
    options: Parameters<IUserService['queryUsers']>[1];
  }): ReturnType<IUserService['queryUsers']> {
    return await this.userService.queryUsers(payload, options);
  }

  ///////////////////////////////////
  //             Update
  ///////////////////////////////////

  @MessagePattern('updateUser')
  async updateUser({
    payload,
  }: {
    payload: Parameters<IUserService['updateUser']>[0];
  }): ReturnType<IUserService['updateUser']> {
    return await this.userService.updateUser(payload);
  }

  ///////////////////////////////////
  //             Delete
  ///////////////////////////////////

  @MessagePattern('deleteUser')
  async deleteUser({
    payload,
  }: {
    payload: Parameters<IUserService['deleteUser']>[0];
  }): ReturnType<IUserService['deleteUser']> {
    return await this.userService.deleteUser(payload);
  }
}
