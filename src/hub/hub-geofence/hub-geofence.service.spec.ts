import { Test, TestingModule } from '@nestjs/testing';
import { HubGeofenceService } from './hub-geofence.service';
import { Repository } from 'typeorm';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('HubGeofenceService', () => {
  let service: HubGeofenceService;
  let joinUserHubRepository: Repository<JoinUserHub>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HubGeofenceService,
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HubGeofenceService>(HubGeofenceService);
    joinUserHubRepository = module.get<Repository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for enteredHubGeofence', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      userId,
      hubId,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);
    const saveCall = jest
      .spyOn(joinUserHubRepository, 'save')
      .mockResolvedValueOnce({
        userId,
        hubId,
        isOwner: true,
      } as JoinUserHub);
    // Act
    const result = await service.enteredHubGeofence(userId, hubId);
    // Assert
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for exitedHubGeofence', async () => {
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      userId,
      hubId,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);
    const saveCall = jest
      .spyOn(joinUserHubRepository, 'save')
      .mockResolvedValueOnce({
        userId,
        hubId,
        isOwner: false,
      } as JoinUserHub);
    // Act
    const result = await service.exitedHubGeofence(userId, hubId);
    // Assert
    expect(saveCall).toHaveBeenCalled();
  });
});
