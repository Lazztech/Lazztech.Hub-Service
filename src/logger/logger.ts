import Pino, { destination, Logger } from 'pino';
import { LoggerOptions } from 'pino';
import { trace, context } from '@opentelemetry/api';

export const loggerOptions: LoggerOptions = {
  formatters: {
    log(object) {
      const span = trace.getSpan(context.active());
      if (!span) return { ...object };
      const { spanId, traceId } = trace.getSpan(context.active())?.spanContext();
      return { ...object, spanId, traceId };
    },
  },
  redact: ['req.headers.authorization'],
};

export const logger: Logger = Pino(
  loggerOptions, 
  // destination(`${process.cwd()}/data/lazztech-hub.log`)
);