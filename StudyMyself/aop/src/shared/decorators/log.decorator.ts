import { createDecorator } from '@toss/nestjs-aop';
import { LOGGING_DECORATOR } from './logging-lazy.decorator';

export const Log = () => createDecorator(LOGGING_DECORATOR);
