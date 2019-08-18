import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "./image";
import { JoinPersonImage } from "./joinPersonImage";

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
    @OneToMany((type) => JoinPersonImage, (personImage) => personImage.person)
    public imagesConnection: JoinPersonImage[];

    @Field(() => [Image], { nullable: true })
    public async images(): Promise<Image[]> {
        return await this.getThisPersonsImages();
    }

    private async getThisPersonsImages() {
        const images: Image[] = [];
        await JoinPersonImage.find({
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
