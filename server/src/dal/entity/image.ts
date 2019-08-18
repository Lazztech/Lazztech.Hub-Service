import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./person";
import { PersonDescriptor } from "./personDescriptor";
import { PersonImage } from "./personImage";

@ObjectType()
@Entity()
export class Image extends BaseEntity {

    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public image: string;

    @Field((type) => String, { nullable: true })
    public async savedAtTimestamp(): Promise<string> {
        const personImage = await PersonImage.findOne({
            where: { imageId: this.id }
        });
        return personImage.timestamp;
    }

    @OneToMany((type) => PersonImage, (personImage) => personImage.image)
    public personsConnection: PersonImage[];

    @Field((type) => [PersonDescriptor], { nullable: true })
    public async personDescriptors(): Promise<PersonDescriptor[]> {
        return this.getThisImagesDescriptors();
    }

    @Field((type) => [Person], { nullable: true })
    public async people(): Promise<Person[]> {
        return this.getThisImagesPersons();
    }

    private async getThisImagesPersons() {
        const people: Person[] = [];
        await PersonImage.find({
            where: { imageId: this.id },
            relations: [ "person" ]
        }).then((result) => {
            result.forEach((personImage) => {
                people.push(personImage.person);
            });
        });

        return people;
    }

    private async getThisImagesDescriptors() {
        const descriptors: PersonDescriptor[] = [];
        await PersonImage.find({
            where: { imageId: this.id },
            relations: [ "personDescriptor" ]
        }).then((result) => {
            result.forEach((descriptor) => {
                descriptors.push(descriptor.personDescriptor);
            });
        });

        return descriptors;
    }
}
