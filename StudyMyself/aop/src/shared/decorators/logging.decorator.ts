import { Aspect, LazyDecorator, WrapParams } from '@toss/nestjs-aop';
import { Injectable, Logger } from '@nestjs/common';
import { LOGGING_DECORATOR } from './logging-lazy.decorator';

@Aspect(LOGGING_DECORATOR)
@Injectable()
export class LoggingDecorator implements LazyDecorator<any, any> {
  private readonly logger = new Logger(LoggingDecorator.name);

  wrap({ method }: WrapParams<any, any>) {
    return async (...args: any[]) => {
      console.log('method', method);
      console.log('method name', method.name);
      console.log('args', args);
      this.logger.log(
        `Before executing ${method.name} with arguments: ${JSON.stringify(args)}`,
      );
      const result = await method(...args);
      console.log('result', result);
      this.logger.log(
        `After executing ${method.name}, result: ${JSON.stringify(result)}`,
      );
      return result;
    };
  }
}
