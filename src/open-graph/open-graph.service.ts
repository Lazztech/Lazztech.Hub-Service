import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Event } from '../dal/entity/event.entity';
import { Hub } from '../dal/entity/hub.entity';
import { FileUrlService } from '../file/file-url/file-url.service';

export interface OpenGraphTagValues {
    ogUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
}

@Injectable()
export class OpenGraphService {

    constructor(
        @InjectRepository(Hub)
        private readonly hubRepository: EntityRepository<Hub>,
        @InjectRepository(Event)
        private readonly eventRepository: EntityRepository<Event>,
        private readonly fileUrlService: FileUrlService,
    ) {}
    
    public async getHubTagValues(shareableId: string, req: Request): Promise<OpenGraphTagValues> {
        const hub = await this.hubRepository.findOne({ shareableId });
        const ogUrl = `${req.protocol}://${req.get('host')}/hub/${shareableId}`;
        return {
            ogUrl,
            ogTitle: hub?.name,
            ogDescription: hub?.description,
            ogImage: hub?.image && this.fileUrlService.getWatermarkedFileUrl(hub.image, req),
          };
    }

    public async getEventTagValues(shareableId: string, req: Request): Promise<OpenGraphTagValues> {
        const event = await this.eventRepository.findOne({ shareableId });
        const ogUrl = `${req.protocol}://${req.get('host')}/event/${shareableId}`;
        return {
            ogUrl,
            ogTitle: event?.name,
            ogDescription: event?.description,
            ogImage: event?.image && this.fileUrlService.getWatermarkedFileUrl(event.image, req),
          };
    }

}
