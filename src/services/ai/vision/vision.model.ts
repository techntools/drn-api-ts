import { google } from '@google-cloud/vision/build/protos/protos'


export type ImageDetectionData = {
    text: TextData
    colors: (google.cloud.vision.v1.IColorInfo & Record<'name', string>)[]
}

export type TextData = {
    confidence: number
    words: {
        word: string
        confidence: number
    }[]
}
