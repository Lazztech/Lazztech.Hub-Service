import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
const grpc = require('@grpc/grpc-js');

const otelSDK = new NodeSDK({
  metricReader: new PrometheusExporter({
    port: 8081,
  }),
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4317',
    credentials: grpc.credentials.createInsecure(),
  }),
  spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-pino": undefined,
      "@opentelemetry/instrumentation-graphql": undefined,
      "@opentelemetry/instrumentation-http": undefined,
      "@opentelemetry/instrumentation-express": undefined,
      "@opentelemetry/instrumentation-nestjs-core": undefined,
      "@opentelemetry/instrumentation-dataloader": {
        enabled: false,
      }
    }),
  ],
});

export default otelSDK;