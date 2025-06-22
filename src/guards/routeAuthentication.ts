import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

export const routeAuthenticationKey = 'routeAuthentication';

export const RouteAuthenticationGuard = () => {
  return applyDecorators(SetMetadata(routeAuthenticationKey, true), UseGuards(AuthGuard));
};

export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const hash = request.headers['x-hash'];

    if (hash === this.configService.get('authentication.hash')) return true;

    throw new UnauthorizedException('Usuário não autorizado');
  }
}
