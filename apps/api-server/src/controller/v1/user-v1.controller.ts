import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthContext,
  CreateUserV1Request,
  CreateUserV1Response,
  DeleteUserV1Request,
  FindUserByIdV1Request,
  FindUserV1RequestOptions,
  FindUserV1Response,
  IAuthService,
  InvalidArgumentsError,
  IUserService,
  QueryUsersV1Request,
  QueryUsersV1Response,
  UnauthorizedError,
  UpdateUserV1Request,
} from '@template/core';
import { z } from 'zod';

import { ParseAuthContext, UseAuthGuard } from '@/decorator/auth.decorator';

@ApiTags('User')
@Controller('users/v1')
export class UserV1Controller {
  constructor(
    @Inject('UserService') private readonly userService: IUserService,
    @Inject('AuthService') private readonly authService: IAuthService,
  ) {
    // do nothing
  }

  ///////////////////////////////////
  //             Create
  ///////////////////////////////////

  /**
   * @summary 유저 생성
   */
  @Post()
  @ApiBearerAuth()
  @UseAuthGuard({ credentials: ['Bearer'], roles: ['Master', 'Admin'] })
  // @ApplyAudit({ service: 'user', action: 'create' })
  async createUser(
    @ParseAuthContext(true) { authUser: _ }: AuthContext<true>,
    @Body() request: CreateUserV1Request,
  ): Promise<CreateUserV1Response> {
    // 매개변수 검증하기
    request = CreateUserV1Request.parse(request);

    // TODO: 권한 검증하기

    // 비밀번호 해싱하기
    let passwordHash: string | undefined = undefined;
    if (request.password) {
      passwordHash = await this.authService.hashPassword(request.password);
      request.password = undefined; // eslint-disable-line require-atomic-updates
    }

    // 유저 생성하기
    const user = await this.userService.createUser({
      ...request,
      passwordHash,
    });

    return { user };
  }

  ///////////////////////////////////
  //              Find
  ///////////////////////////////////

  /**
   * @summary 유저 검색
   */
  @Get()
  @ApiBearerAuth()
  @UseAuthGuard({ credentials: ['Bearer'], roles: ['Master', 'Admin'] })
  // @ApplyAudit({ service: 'user', action: 'query' })
  async queryUsers(
    @ParseAuthContext(true) { authUser: _ }: AuthContext<true>,
    @Query() _request: z.input<typeof QueryUsersV1Request>,
    @Query('withDeleted', new ParseBoolPipe({ optional: true }))
    withDeleted?: FindUserV1RequestOptions['withDeleted'],
    // Properties
    @Query('includePasswordChangedAt', new ParseBoolPipe({ optional: true }))
    includePasswordChangedAt?: FindUserV1RequestOptions['includePasswordChangedAt'],
  ): Promise<QueryUsersV1Response> {
    // 매개변수 검증하기
    const request = QueryUsersV1Request.parse(_request);
    const options = FindUserV1RequestOptions.parse({
      withDeleted,
      includePasswordChangedAt,
    });

    // TODO: 권한 검증하기

    // 유저 검색하기
    const users = await this.userService.queryUsers(request, options);

    return { users };
  }

  /**
   * @summary 유저(me) 조회
   */
  @Get('me')
  @ApiBearerAuth()
  @UseAuthGuard({ credentials: ['Bearer'] })
  // @ApplyAudit({ service: 'user', action: 'me' })
  async getUserByAuthenticatedCredential(
    @ParseAuthContext(true) { authUser }: AuthContext<true>,
  ): Promise<FindUserV1Response> {
    // 유저(me) 조회하기
    const user = await this.userService.getUser({ id: authUser.userId });

    return { user };
  }

  /**
   * @summary 유저 조회
   */
  @Get(':id')
  @ApiBearerAuth()
  @UseAuthGuard({ credentials: ['Bearer'] })
  // @ApplyAudit({ service: 'user', action: 'get' })
  async getUserById(
    @ParseAuthContext(true) { authUser: _ }: AuthContext<true>,
    @Param('id') id: FindUserByIdV1Request['id'],
    @Query() options?: FindUserV1RequestOptions,
  ): Promise<FindUserV1Response> {
    // 매개변수 검증하기
    const request = FindUserByIdV1Request.parse({ id });
    options = options ? FindUserV1RequestOptions.parse(options) : options;

    // TODO: 권한 검증하기

    // 유저 조회하기
    const user = await this.userService.getUser(request, options);

    return { user };
  }

  ///////////////////////////////////
  //             Update
  ///////////////////////////////////

  /**
   * @summary 유저 수정
   */
  @Patch(':id')
  @ApiBearerAuth()
  @UseAuthGuard({ credentials: ['Bearer'] })
  // @ApplyAudit({ service: 'user', action: 'update' })
  async updateUserById(
    @ParseAuthContext(true) { authUser }: AuthContext<true>,
    @Param('id') id: UpdateUserV1Request['id'],
    @Body() request: UpdateUserV1Request,
  ): Promise<void> {
    if (request.id !== id) {
      throw new InvalidArgumentsError('param(id) must be equal to body(id)');
    }

    // 매개변수 검증하기
    request = UpdateUserV1Request.parse(request);

    // TODO: 권한 검증하기

    // 비밀번호 해싱하기
    let passwordHash: string | undefined = undefined;
    if (request.password) {
      if (!['Master', 'Admin'].includes(authUser.userRole)) {
        throw new UnauthorizedError('Please use change-password API');
      }
      passwordHash = await this.authService.hashPassword(request.password);
      request.password = undefined; // eslint-disable-line require-atomic-updates
    }

    // 유저 수정하기
    await this.userService.updateUser({ ...request, passwordHash });
  }

  ///////////////////////////////////
  //             Delete
  ///////////////////////////////////

  /**
   * @summary 유저 삭제
   */
  @Delete(':id')
  @ApiBearerAuth()
  @UseAuthGuard({ credentials: ['Bearer'] })
  // @ApplyAudit({ service: 'user', action: 'delete' })
  async deleteUserById(
    @ParseAuthContext(true) { authUser: _ }: AuthContext<true>,
    @Param('id') id: DeleteUserV1Request['id'],
  ): Promise<void> {
    // 매개변수 검증하기
    const request = DeleteUserV1Request.parse({ id });

    // TODO: 권한 검증하기

    // 유저 삭제하기
    await this.userService.deleteUser(request);
  }
}
