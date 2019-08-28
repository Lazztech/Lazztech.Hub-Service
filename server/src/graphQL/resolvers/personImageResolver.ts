import * as process from "child_process";
import { addYears, subDays, subYears } from "date-fns";
import * as fs from "fs";
import * as https from "https";
import { Writable } from "stream";
import { ReadableStreamBuffer, WritableStreamBuffer } from "stream-buffers";
import { Arg, Authorized, Int, Mutation, Query, Resolver, ID } from "type-graphql";
import { Between } from "typeorm";
import { FaceRecognition } from "../../services/faceRecognition/faceRecognition";
import { Image } from "./../../dal/entity/image";
import { JoinPersonImage } from "./../../dal/entity/joinPersonImage";
import { Person } from "./../../dal/entity/person";
import { PersonDescriptor } from "./../../dal/entity/personDescriptor";
import { InputImage } from "./inputTypes/inputImage";
import { InputPerson } from "./inputTypes/InputPerson";

@Resolver()
export class PersonImageResolver {

    private faceService: FaceRecognition;

    constructor(faceService: FaceRecognition) {
        this.faceService = faceService;
    }

    @Authorized()
    @Query((type) => [Person])
    public async getAllPersons(): Promise<Person[]> {
        try {
            return await Person.find();
        } catch (error) {
            console.error(error);
        }
    }

    @Authorized()
    @Query((type) => Person)
    public async getPerson(@Arg("id", () => Int) id: number): Promise<Person> {
        try {
            return await Person.findOne({ where: { id }});
        } catch (error) {
            console.error(error);
        }
    }

    @Authorized()
    @Query((type) => [Image])
    public async getAllImages(): Promise<Image[]> {
        try {
            return await Image.find();
        } catch (error) {
            console.error(error);
        }
    }

    @Authorized()
    @Query(() => Image)
    public async getImage(
        @Arg("id", () => ID) id: number
        ): Promise<Image> {
        const image = await Image.findOne({
            where: {
                id
            }
        });
        return image;
    }

    @Authorized()
    @Query((type) => [JoinPersonImage])
    public async personImageThisWeek(): Promise<JoinPersonImage[]> {
        try {
            const now = {};
            const aWeekAgo = {};

            const AfterDate = (date: Date) => Between(date, addYears(date, 100));
            const BeforeDate = (date: Date) => Between(subYears(date, 100), date);

            // // leter
            //     return Event.find({
            //     where: {
            //         date: AfterDate(new Date()),
            //     },
            //     });
            const results = await JoinPersonImage.find({
                where: {
                    timestamp: AfterDate(subDays(Date.now(), 7)),
                },
                relations: [
                    "person",
                    "image",
                    "descriptor"
                ]
            });
            return results;

        } catch (error) {
            console.error(error);
        }
    }

    @Authorized()
    @Mutation((type) => Boolean)
    public async watchNewStream(@Arg("url") url: string): Promise<boolean> {
        try {
                // request('https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4').pipe(fs.createWriteStream(__dirname + "video.mp4"));

                // ffmpeg commands
                // Takes screenshot for just the first frame
                // ffmpeg -i https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4 -f image2 -vframes 1 img%03d.jpg

                // Takes screenshot for the first 5 frames
                // ffmpeg -i https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4 -f image2 -vframes 5 img%03d.jpg

                // Takes one screenshot for every 120 frames
                // ffmpeg -i https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4 -f image2 -vf fps=fps=1/120 img%03d.jpg

                // Intends to take screenshot every 10 frames but the output is not formated for naming
                // ffmpeg -y -i https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4 -r 10 -f image2 imageOutput.jpg

                // Takes screenshot every 10 frames
                // ffmpeg -y -i https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4 -r 10 -f image2 img%03d.jpg

                // The following pipes the output from the ffmpeg stream screenshot to catimg
                // catimg <(ffmpeg -i https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4 -f image2 -vframes 1 pipe:1)
                // Alternate
                // ffmpeg -i https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4 -f image2 -vframes 1 - | catimg -

                // const readStream = fs.createReadStream("file");
                // const writeStream = fs.createWriteStream("file");

                const ws = new Writable();
                const bufferArray = [];
                ws._write = (chunk, enc, next) => {
                    console.log(chunk.length);
                    bufferArray.push(chunk);
                    next();
                };

                const writableStreamBuffer = new WritableStreamBuffer();
                const readableStreamBuffer = new ReadableStreamBuffer();
                const bufs: Buffer[] = [];
                let buffer: Buffer;
                let bufferFromStream: Buffer | false;
                readableStreamBuffer.pipe(writableStreamBuffer);

                const cmd: process.ChildProcess = process.exec("ffmpeg -i https://justadudewhohacks.github.io/face-api.js/media/bbt.mp4 -f image2 -vframes 1 -",
                (error: any, stdout: any, stderr: any) => {
                            // console.log(stdout);
                            // console.log(error);
                            // console.log(stderr);
                            bufs.push(stdout);
                        });
                cmd.stdout.pipe(writableStreamBuffer);

                const catimg: process.ChildProcess = process.exec("catimg -",
                (error: any, stdout: any, stderr: any) => {
                            console.log(stdout);
                            console.log(error);
                            console.log(stderr);
                        });
                readableStreamBuffer.pipe( catimg.stdin );
                // cmd.stdout.pipe(catimg.stdin);

                cmd.on("exit", () => {
                    console.log(`StreamBuffer size: ${writableStreamBuffer.size()}`);
                    buffer = Buffer.concat(bufs);

                    bufferFromStream = writableStreamBuffer.getContents();
                });

                // var stdout = "";
                // var stderr = "";
                // ffmpeg({
                //     mounts: [{type: "NODEFS", opts: {root: "."}, mountpoint: "/data"}],
                //     arguments: ["-i", "http://justadudewhohacks.github.io/face-api.js/media/bbt.mp4", "-f", "image2", "-vframes", "1", "/data/img%03d.jpg"],
                //     print: function(data: any) { stdout += data + "\n"; },
                //     printErr: function(data: any) { stderr += data + "\n"; },
                //     onExit: function(code: any) {
                //         console.log("Process exited with code " + code);
                //         console.log(stdout);
                //         console.error(stderr);
                //     },
                // });

            // await this.faceService.recognizeVideo(url);
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    @Authorized()
    @Mutation((type) => Boolean)
    public async renamePerson(@Arg("personId") personId: number, @Arg("newName") newName: string): Promise<boolean> {
        try {
            const person = await Person.findOne({ where: { id: personId }});
            if (!person) {
                return false;
            } else {
                person.name = newName;
                await person.save();
                return true;
            }
        } catch (error) {
            console.error(error);
        }
    }

    @Authorized()
    @Mutation((type) => Int)
    public async newPerson(@Arg("inputPerson") inputPerson: InputPerson): Promise<number> {
        try {
            const recognitionResults = await this.faceService.recognize(inputPerson.image);
            if (recognitionResults.length > 1) {
                throw new Error("Persons image must only contain that person.");
            } else if (recognitionResults.length === 0) {
                throw new Error("No person found in the image.");
            }
            if (recognitionResults[0].person !== undefined) {
                throw new Error("Person recognized as being already in database.");
            }
            const newPerson = await Person.create({ name: inputPerson.name }).save();
            const newImage = await Image.create({ image: inputPerson.image }).save();

            const newDescriptor = new PersonDescriptor();
            newDescriptor.descriptor = recognitionResults[0].descriptor;
            newDescriptor.x = recognitionResults[0].x;
            newDescriptor.y = recognitionResults[0].y;
            newDescriptor.height = recognitionResults[0].height;
            newDescriptor.width = recognitionResults[0].width;
            await newDescriptor.save();

            const newPersonImage = await JoinPersonImage.create({
                personId: newPerson.id,
                imageId: newImage.id,
                personDescriptorId: newDescriptor.id
            }).save();

            return newPerson.id;
        } catch (error) {
            console.error(error);
            throw (error);
        }

        return 0;
    }

    @Authorized()
    @Mutation((type) => Int)
    public async newImage(@Arg("inputImage") inputImage: InputImage): Promise<number> {
        try {
            const newImage = await Image.create({ ...inputImage }).save();

            if (inputImage.personDescriptors) {
                for (const inputPersonDescriptor of inputImage.personDescriptors) {
                    const person = await Person.create({ ...inputPersonDescriptor.person }).save();

                    let newDescriptor = new PersonDescriptor();
                    newDescriptor.descriptor = inputPersonDescriptor.descriptor;
                    newDescriptor = await PersonDescriptor.create(newDescriptor).save();

                    const personImage = await JoinPersonImage.create({
                        personId: person.id,
                        imageId: newImage.id,
                        personDescriptorId: newDescriptor.id
                    }).save();
                }
            } else if (!inputImage.personDescriptors) {
                // Perform face recognition and update/save to de-normalized object to db
                const recognitionResults = await this.faceService.recognize(inputImage.image);

                for (const result of recognitionResults) {
                    // Check the result before just saving a blank person!
                    let person: Person;
                    if (result.person !== undefined) {
                        person = result.person;
                    } else {
                        person = await Person.create(result.person).save();
                    }

                    let descriptor = new PersonDescriptor();
                    descriptor.descriptor = result.descriptor;
                    descriptor.x = result.x;
                    descriptor.y = result.y;
                    descriptor.height = result.height;
                    descriptor.width = result.width;

                    descriptor = await PersonDescriptor.create(descriptor).save();

                    const personImage = await JoinPersonImage.create({
                        personId: person.id,
                        imageId: newImage.id,
                        personDescriptorId: descriptor.id
                    }).save();
                }

                return newImage.id;
            } else {
                throw new Error(("Input not in a valid state"));
            }

        } catch (error) {
            console.error(error);
        }
        return 0;
    }

}
