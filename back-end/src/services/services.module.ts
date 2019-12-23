import { Module } from '@nestjs/common';
import { QrService } from './qr.service';

@Module({
    imports: [],
    controllers: [],
    providers: [QrService],
    exports: [QrService]
})
export class ServicesModule {}
