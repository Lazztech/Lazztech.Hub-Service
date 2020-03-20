import { Injectable, Logger } from '@nestjs/common';
import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  MultiFormatReader,
  RGBLuminanceSource,
} from '@zxing/library/esm5';
import * as jpeg from 'jpeg-js';

@Injectable()
export class QrService {

  private logger = new Logger(QrService.name);

  constructor() {
    this.logger.log("constructor");
  }

  public async scanQR(base64: string): Promise<any> {
    this.logger.log(this.scanQR.name);

    const buff = Buffer.from(base64.substr(23), 'base64');
    console.log('created buff');

    const rawImageData = jpeg.decode(buff);

    const hints = new Map();
    const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX];

    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    const reader = new MultiFormatReader();

    reader.setHints(hints);

    const len = rawImageData.width * rawImageData.height;

    const luminancesUint8Array = new Uint8ClampedArray(len);

    for (let i = 0; i < len; i++) {
      // tslint:disable-next-line:no-bitwise
      luminancesUint8Array[i] =
        ((rawImageData.data[i * 4] +
          rawImageData.data[i * 4 + 1] * 2 +
          rawImageData.data[i * 4 + 2]) /
          4) &
        0xff;
    }

    const luminanceSource = new RGBLuminanceSource(
      luminancesUint8Array,
      rawImageData.width,
      rawImageData.height,
    );

    console.log(luminanceSource);

    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    const qrCode = reader.decode(binaryBitmap);

    console.log(qrCode);

    if (qrCode) {
      return JSON.parse(qrCode.getText());
    } else {
      console.error('failed to decode qr code.');
    }
  }
}
