import {
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  ArgumentsHost,
} from '@nestjs/common';

import { PAYLOAD_STATUS } from '../../shared/models/Payload.model';
import { Request } from '../../shared/models/Request.model';
import { Response } from '../../shared/models/Response.model';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const httpArgumentHost = host.switchToHttp();

    const request = httpArgumentHost.getRequest<Request>();
    const response = httpArgumentHost.getResponse<Response>();

    const method = request.method.toUpperCase();
    const path = request.path.toLowerCase();
    const status = exception.getStatus();
    const time = request.start ? Date.now() - request.start : 0;
    const exceptionResponse = exception.getResponse
      ? (exception.getResponse() as string | any)
      : null;

    let data;
    if (typeof exceptionResponse === 'string') {
      data = exceptionResponse;
    } else if (exceptionResponse && exceptionResponse.message) {
      data = exceptionResponse.message;
    } else {
      data = exceptionResponse;
    }

    this.logger.log(`${method} ${path} => ${status}. (${time} ms)`);

    response.status(status).json({
      status: PAYLOAD_STATUS.FAIL,
      message: exception.message,
      data: data || null,
    });
  }
}
