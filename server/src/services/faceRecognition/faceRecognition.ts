import * as faceapi from "face-api.js";
import { LabeledFaceDescriptors, TinyFaceDetectorOptions } from "face-api.js";
import * as fs from "fs";
import { request } from "http";
import { interval, Observable } from "rxjs";
import { Service } from "typedi";
import { Image } from "../../dal/entity/image";
import { Person } from "../../dal/entity/person";
import { PersonDescriptor } from "../../dal/entity/personDescriptor";
import { PersonImage } from "../../dal/entity/personImage";
import { canvas, faceDetectionNet, saveFile } from "./common";
import { RecognitionResult } from "./recognitionResult";
const uuidv1 = require("uuid/v1");
import * as http from "http";

@Service({ global: true })
export class FaceRecognition {

  public recognizablePeople: { [key: number]: PersonDescriptor };
  public labeledDescriptors: LabeledFaceDescriptors[];
  public faceMatcher: faceapi.FaceMatcher;

  public modelsLoaded: Promise<boolean>;
  public loadedPeople: Promise<void>;

  constructor() {
    this.recognizablePeople = [];
    this.labeledDescriptors = [];

    this.modelsLoaded = this.loadModels();
    this.loadedPeople = this.getRecognizedFaces();
  }

  public async getRecognizedFaces() {
    const recognizedFaces = await PersonDescriptor.find();

    for (const result of recognizedFaces) {
      const person = await result.person();
      this.recognizablePeople[person.id] = result;

      const descriptor = new Float32Array(result.descriptor);
      const labeledDescriptor = new faceapi.LabeledFaceDescriptors(`${person.id}`, [descriptor]);
      this.labeledDescriptors.push(labeledDescriptor);
      this.faceMatcher = new faceapi.FaceMatcher(this.labeledDescriptors);
    }
  }

  public async recognizeVideo(videoUrl: string) {
    await this.modelsLoaded;
    if (this.faceMatcher === undefined) {
      await this.getRecognizedFaces();
    }

    const video = document.createElement("video");
    video.src = videoUrl;

    const counter: Observable<number> = interval(1000);
    counter.subscribe(async () => {

      const faceapiResults = await faceapi
        .detectAllFaces(video, new TinyFaceDetectorOptions())
        .withFaceLandmarks(true)
        .withFaceDescriptors();
      const detectionsForSize = await faceapi.resizeResults(faceapiResults, { width: 640, height: 480 });
      const results: RecognitionResult[] = [];
      for (const detection of detectionsForSize) {
          const result = new RecognitionResult();
          result.x = detection.detection.box.x;
          result.y = detection.detection.box.y;
          result.height = detection.detection.box.height;
          result.width = detection.detection.box.width;
          result.descriptor = Array.prototype.slice.call(detection.descriptor);

          let bestMatch: faceapi.FaceMatch;
          if (this.faceMatcher) {
            bestMatch = this.faceMatcher.findBestMatch(detection.descriptor);

            if (bestMatch.label !== "unknown") {
              const recognizedPerson = this.recognizablePeople[parseInt(bestMatch.label, 10)];
              const person = await recognizedPerson.person();
              const boxWithText = new faceapi.BoxWithText(
                detection.detection.box, `${person.name} ${bestMatch.distance}`
              );
              result.person = person;

              result.boxWithText = boxWithText;
            } else {
              const boxWithText = new faceapi.BoxWithText(
                detection.detection.box, `${bestMatch.label}`
              );
              console.log(`Recognized Person: ${bestMatch.label}`);

              const outQuery = faceapi.createCanvasFromMedia(video) as any;
              faceapi.drawDetection(outQuery, boxWithText);
              const imageName = `${uuidv1()}.jpg`;
              saveFile(imageName, outQuery.toBuffer("image/jpeg"));
              console.log("done, saved results to out/queryImage.jpg");

              this.saveResult(result, imageName);
            }
          }
        }
    });
  }

  public async saveResult(result: RecognitionResult, imageName: string) {
    const newImage = await Image.create({ image: imageName });
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

    const personImage = await PersonImage.create({
        personId: person.id,
        imageId: newImage.id,
        personDescriptorId: descriptor.id
    }).save();
}

  public async recognize(imageUrl: string): Promise<RecognitionResult[]> {
    await this.modelsLoaded;
    if (this.faceMatcher === undefined) {
      await this.getRecognizedFaces();
    }

    const cnvs = await canvas.loadImage(imageUrl);
    const faceapiResults = await faceapi
      .detectAllFaces(cnvs, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true)
      .withFaceDescriptors();
    const detectionsForSize = await faceapi.resizeResults(faceapiResults, { width: 640, height: 480 });

    const results: RecognitionResult[] = [];
    for (const detection of detectionsForSize) {
      const result = new RecognitionResult();
      console.log(detection.descriptor);
      result.x = detection.detection.box.x;
      result.y = detection.detection.box.y;
      result.height = detection.detection.box.height;
      result.width = detection.detection.box.width;
      result.descriptor = Array.prototype.slice.call(detection.descriptor);

      let bestMatch: faceapi.FaceMatch;
      if (this.faceMatcher) {
        bestMatch = this.faceMatcher.findBestMatch(detection.descriptor);

        if (bestMatch.label !== "unknown") {
          const recognizedPerson = this.recognizablePeople[parseInt(bestMatch.label, 10)];
          const person = await recognizedPerson.person();
          const boxWithText = new faceapi.BoxWithText(
            detection.detection.box, `${person.name} ${bestMatch.distance}`
          );
          result.person = person;

          result.boxWithText = boxWithText;
        } else {

          const boxWithText = new faceapi.BoxWithText(
            detection.detection.box, `${bestMatch.label}`
          );

          result.boxWithText = boxWithText;
        }
      }

      results.push(result);
    }

    return results;
  }

  public async savePerson(image: string, name: string) {
    const results = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();

    if (results) {
      const labeledDescriptor = new faceapi.LabeledFaceDescriptors(name, [results.descriptor]);
      this.labeledDescriptors.push(labeledDescriptor);
      console.log("Added to array of labeled descriptors");

      this.faceMatcher = new faceapi.FaceMatcher(this.labeledDescriptors);
    } else {
      console.error("Nobody detected.");
    }
  }

  private async loadModels(): Promise<boolean> {
    await faceDetectionNet.loadFromDisk(process.cwd() + "/models/");
    // await faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/../../../../models/");
    await faceapi.nets.faceRecognitionNet.loadFromDisk(process.cwd() + "/models/");
    await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(process.cwd() + "/models/");
    await faceapi.nets.tinyFaceDetector.loadFromDisk(process.cwd() + "/models/");
    return true;
  }

}
