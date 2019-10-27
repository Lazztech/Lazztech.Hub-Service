import * as faceapi from "face-api.js";
import { Person } from "../../dal/entity/person";

export class RecognitionResult {

    public person: Person;
    public boxWithText: faceapi.BoxWithText;
    public descriptor: number[];
    public x: number;
    public y: number;
    public height: number;
    public width: number;

}
