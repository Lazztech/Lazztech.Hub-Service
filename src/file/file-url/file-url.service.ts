import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FileUrlService {
  getFileUrl(fileName: string, req: Request): string {
    if (fileName) {
      return `https://${req.get('host')}/file/${fileName}`;
    } else {
      return fileName;
    }
  }
}
