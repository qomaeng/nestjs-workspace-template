import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AuthContext,
  ChangePasswordV1Request,
  IAuthService,
  RefreshV1Request,
  RefreshV1Response,
  SignInV1Request,
  SignInV1Response,
  UnauthorizedError,
} from '@template/core';

import { ParseAuthContext, UseAuthGuard } from '@/decorator/auth.decorator';

@ApiTags('Auth')
@Controller('auth/v1')
export class AuthV1Controller {
  constructor(@Inject('AuthService') private readonly authService: IAuthService) {
    // do nothing
  }

  /**
   * @summary 로그인
   */
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  // @ApplyAudit({ service: 'auth', action: 'signin' })
  async signin(@Body() request: SignInV1Request): Promise<SignInV1Response> {
    // 매개변수 검증하기
    request = SignInV1Request.parse(request);

    // 로그인하기
    const result = await this.authService.signIn(request);

    return result;
  }

  /**
   * @summary 비밀번호 변경
   */
  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseAuthGuard({ credentials: ['Bearer'] })
  // @ApplyAudit({ service: 'auth', action: 'change-password' })
  async changePassword(
    @ParseAuthContext(true) { authUser }: AuthContext<true>,
    @Body() request: ChangePasswordV1Request,
  ): Promise<void> {
    // 매개변수 검증하기
    request = ChangePasswordV1Request.parse(request);

    // 다른 유저의 비밀번호를 변경하려는 경우 에러 리턴하기
    if (request.username !== authUser.username) {
      throw new UnauthorizedError("Cannot change another user's password");
    }

    // 비밀번호 변경하기
    await this.authService.changePassword(request);
  }

  /**
   * @summary 엑세스 토큰 갱신
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  // @ApplyAudit({ service: 'auth', action: 'refresh' })
  async refresh(@Body() request: RefreshV1Request): Promise<RefreshV1Response> {
    // 매개변수 검증하기
    request = RefreshV1Request.parse(request);

    // 엑세스 토큰 갱신하기
    const result = await this.authService.refresh(request);

    return result;
  }
}
