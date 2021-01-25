import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';

@Injectable()
export class HubGeofenceService {
  private readonly logger = new Logger(HubGeofenceService.name, true);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
  ) {}

  async enteredHubGeofence(userId: any, hubId: number) {
    this.logger.log(this.enteredHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    hubRelationship.isPresent = true;
    await this.joinUserHubRepository.save(hubRelationship);
    return hubRelationship;
  }

  async exitedHubGeofence(userId: any, hubId: number) {
    this.logger.log(this.exitedHubGeofence.name);
    let hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    hubRelationship.isPresent = false;
    hubRelationship = await this.joinUserHubRepository.save(hubRelationship);
    return hubRelationship;
  }
}
