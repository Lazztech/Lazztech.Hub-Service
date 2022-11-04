import Pino, { Logger } from 'pino';
import { LoggerOptions, destination } from 'pino';
import { trace, context } from '@opentelemetry/api';
import fs from 'fs';

export const loggerOptions: LoggerOptions = {
  formatters: {
    level(label) {
      return { level: label };
    },
    log(object) {
      const span = trace.getSpan(context.active());
      if (!span) return { ...object };
      const { spanId, traceId } = trace
        .getSpan(context.active())
        ?.spanContext();
      return { ...object, spanId, traceId };
    },
  },
};

export const logger: Logger = Pino(
  loggerOptions,
  destination({
    fd: fs.openSync(`${process.cwd()}/data/lazztech-hub.log`,'a'),
  }),
);