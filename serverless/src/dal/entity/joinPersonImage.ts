import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Image } from "./image";
import { Location } from "./location";
import { Person } from "./person";
import { PersonDescriptor } from "./personDescriptor";

@ObjectType()
@Entity()
export class JoinPersonImage extends BaseEntity {

    @Field((type) => ID)
    @PrimaryColumn()
    public personId: number;

    @Field((type) => ID)
    @PrimaryColumn()
    public imageId: number;

    @Field((type) => ID, { nullable: true })
    @Column()
    public personDescriptorId: number;

    @Field((type) => ID, { nullable: true })
    @Column({ nullable: true })
    public locationId: number;

    @Field({ nullable: true })
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    public timestamp: string;

    @Field((type) => Person)
    @ManyToOne(() => Person, (person) => person.imagesConnection, { primary: true })
    @JoinColumn()
    public person: Person;

    @Field((type) => Image)
    @ManyToOne(() => Image, (image) => image.personsConnection, { primary: true })
    @JoinColumn()
    public image: Image;

    @Field((type) => PersonDescriptor)
    @OneToOne(() => PersonDescriptor, (personDescriptor) => personDescriptor.personImageConnection)
    @JoinColumn()
    public personDescriptor: PersonDescriptor;

    @Field((type) => Location)
    @OneToOne(() => Location, (location) => location.personImageConnection, { nullable: true})
    @JoinColumn()
    public location: Location;

}
