import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, Logger, Scope } from "@nestjs/common";
import DataLoader from "dataloader";
import { File } from "../entity/file.entity";


@Injectable({ scope: Scope.REQUEST })
export class FilesByFileIdLoader extends DataLoader<number, File> {
    private logger = new Logger(FilesByFileIdLoader.name);

    constructor(
        @InjectRepository(File)
        private readonly fileRepository: EntityRepository<File>
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(fileIds: readonly number[]): Promise<File[]> {
        this.logger.debug(fileIds);
        const files = await this.fileRepository.find(fileIds as number[]);
        const map: { [key: string]: File } = {};
        files.forEach(file => {
            map[file.id] = file
        });
        return fileIds.map(key => map[key]);
    }
 }