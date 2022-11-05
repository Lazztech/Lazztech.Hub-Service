import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const otelSDK = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://143.244.157.167:4318/v1/traces'
  }),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.NODE_ENV === 'development' ? 'Lazztech Hub Dev' : 'Lazztech Hub Prod'
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // disabled as it's causing an exception with the dataloaders
      "@opentelemetry/instrumentation-dataloader": {
        enabled: false,
      }
    }),
  ],
});

export default otelSDK;