#!/bin/sh
npm run format \
&& npm run lint \
&& npm run test:cov \
&& npm run test:e2e