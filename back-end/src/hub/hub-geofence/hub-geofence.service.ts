import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HubGeofenceService {

    constructor(
        @InjectRepository(JoinUserHub)
        private joinUserHubRepository: Repository<JoinUserHub>
    ) {}

    async enteredHubGeofence(userId: any, hubId: number) {
        let hubRelationship = await this.joinUserHubRepository.findOne({
          userId,
          hubId,
        });
    
        if (!hubRelationship)
          throw Error(
            `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
          );
    
        hubRelationship.isPresent = true;
        await this.joinUserHubRepository.save(hubRelationship);
        return hubRelationship;
      }
    
      async exitedHubGeofence(userId: any, hubId: number) {
        let hubRelationship = await this.joinUserHubRepository.findOne({
          userId,
          hubId,
        });
    
        if (!hubRelationship)
          throw Error(
            `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
          );
    
        hubRelationship.isPresent = false;
        hubRelationship = await this.joinUserHubRepository.save(hubRelationship);
        return hubRelationship;
      }
}
