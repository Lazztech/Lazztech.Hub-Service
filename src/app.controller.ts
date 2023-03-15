import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Controller, Get, Render } from '@nestjs/common';
import { Event } from './dal/entity/event.entity';
import { FileUpload } from './dal/entity/fileUpload.entity';
import { Hub } from './dal/entity/hub.entity';
import { JoinUserHub } from './dal/entity/joinUserHub.entity';
import { User } from './dal/entity/user.entity';

@Controller()
export class AppController {

  constructor(
    @InjectRepository(Hub)
    private hubRepository: EntityRepository<Hub>,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: EntityRepository<FileUpload>,
  ) {}

  @Get()
  @Render('index')
  root() {
    return {
      message: 'Hello world!',
      ogTitle: 'Lazztech Hub - Social App',
      ogDescription: 'From app to the real world - Foster Community',
      ogImage: 'https://hub.lazz.tech/assets/banner.jpg',
    };
  }

  @Get('/migrate')
  async migrate() {
    try {
      const hubs = await this.hubRepository.findAll();
      for (const hub of hubs) {
        if (hub.image) {
          const admin = await this.joinUserHubRepository.findOne({
            hub,
            isOwner: true,
          });
          const fileUpload = this.fileUploadRepository.create({
            fileName: hub.image,
            createdOn: new Date().toISOString(),
            createdBy: (await admin.user.load()).id,
          });
          await this.fileUploadRepository.persistAndFlush(fileUpload);
          hub.coverImage = fileUpload as any;
          this.hubRepository.persist(hub);
        }
      }
      const users = await this.userRepository.findAll();
      for (const user of users) {
        if (user.image) {
          const fileUpload = this.fileUploadRepository.create({
            fileName: user.image,
            createdOn: new Date().toISOString(),
            createdBy: user.id
          });
          await this.fileUploadRepository.persistAndFlush(fileUpload);
          user.profileImage = fileUpload as any;
          this.userRepository.persist(user);
        }
      }
      const events = await this.eventRepository.findAll();
      for (const event of events) {
        if (event.image) {
          const fileUpload = this.fileUploadRepository.create({
            fileName: event.image,
            createdOn: new Date().toISOString(),
            createdBy: (await event.createdBy.load()).id,
          });
          this.fileUploadRepository.persistAndFlush(fileUpload);
          event.coverImage = fileUpload as any;
          this.eventRepository.persist(event);
        }
      }

      await this.fileUploadRepository.flush();
      await this.hubRepository.flush();
      await this.eventRepository.flush();
      await this.userRepository.flush();
    } catch (error) {
      console.warn(error);
      return error;
    }
    return 'success';
  }
}
