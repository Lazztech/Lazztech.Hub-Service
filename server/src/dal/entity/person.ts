import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image";
import { PersonImage } from "./personImage";

@ObjectType()
@Entity()
export class Person extends BaseEntity {

    @Field((type) => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public name?: string;

    // @Field((type) => [PersonImage], { nullable: true })
    @OneToMany((type) => PersonImage, (personImage) => personImage.person)
    public imagesConnection: PersonImage[];

    @Field(() => [Image], { nullable: true })
    public async images(): Promise<Image[]> {
        return await this.getThisPersonsImages();
    }

    private async getThisPersonsImages() {
        const images: Image[] = [];
        await PersonImage.find({
            where: { personId: this.id },
            relations: [ "image" ]
        }).then((result) => {
            result.forEach( (personImage) => {
                images.push(personImage.image);
            });
        });

        return images;
    }

}
