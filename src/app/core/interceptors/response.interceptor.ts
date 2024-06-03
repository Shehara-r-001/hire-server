import {
  Injectable,
  NestInterceptor,
  Logger,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, tap, Observable } from 'rxjs';

import { PAYLOAD_STATUS, IPayload } from '../../shared/models/Payload.model';
import { Request } from '../../shared/models/Request.model';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IPayload<T>> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IPayload<T>> {
    context.switchToHttp().getRequest<Request>().start = Date.now();

    return next.handle().pipe(
      map((data) => ({
        status: PAYLOAD_STATUS.SUCCESS,
        message: null,
        data:
          typeof data !== 'undefined' && typeof data !== 'function'
            ? data
            : null,
      })),
      tap(() => {
        const request = context.switchToHttp().getRequest<Request>();
        const method = request.method.toUpperCase();
        const path = request.path.toLowerCase();
        const status = context.switchToHttp().getResponse().statusCode;
        const time = request.start ? Date.now() - request.start : 0;

        this.logger.log(`${method} ${path} => ${status}. ( ${time} ms)`);
      })
    );
  }
}
