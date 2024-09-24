import { Request, Response } from "express";

import type { FuseResultMatch, FuseResult } from 'fuse.js'
import Fuse from 'fuse.js'

import { PostImageTextRequest } from "./ai.service.model";
import vision from "./vision/vision";

import db from "../../db/db";


function getMatchedText(searchResult: FuseResult<FuseResultMatch>[]) {
    const matches = []

    searchResult.forEach(res => {
        matches.push({
            matches: res.matches,
            score: res.score
        })
    })

    matches.sort(function(a, b) {
        return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);
    })

    const matchedTo = []
    matches[0]?.matches.forEach((match: FuseResultMatch) => {
        matchedTo.push(match.value)
    })

    return matchedTo[0]
}

/**
 * handle post /ai/image request to send response of vision data
 *
 * @param {Request} req express request
 * @param {Response} res express response
 * @returns {Promise<void>} void promise
 */
export const postImageText = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body as PostImageTextRequest;
  const visionResponse: any = await vision.getImageText(body.data.image);

  const brandsDB = await db.getBrands(undefined);
  if ("errors" in brandsDB) {
    console.error(brandsDB, "errors in dbResponse (getBrands)");
    res.status(500).send(brandsDB);
    return;
  }

  const words: { word: string }[] = visionResponse.data.text.words

  const fuseOptions = {
      includeScore: true,
      threshold: 0.2,
      includeMatches: true,
      keys: ['MoldName', 'BrandName']
  }

  var fuse: Fuse<any> = new Fuse(<any>brandsDB.data, fuseOptions)
  words.forEach(word => {
      const result = fuse.search(word.word)

      const matchedTo = getMatchedText(result)
      if (matchedTo)
          word['matchedTo'] = [matchedTo]

      if (result.length)
          word['category'] = ['Brand']
  })

  const discsDB = await db.getDiscs(undefined, undefined, undefined);
  if ("errors" in discsDB) {
    console.error(discsDB, "errors in dbResponse (getDiscs)");
    res.status(500).send(discsDB);
    return;
  }

  var fuse: Fuse<any> = new Fuse(<any>discsDB.data, fuseOptions)
  words.forEach(word => {
      const result = fuse.search(word.word)

      const matchedTo = getMatchedText(result)
      if (matchedTo) {
          if (!word['matchedTo'])
              word['matchedTo'] = []

          if (!word['matchedTo'].includes(matchedTo))
              word['matchedTo'].push(matchedTo)
      }

      if (result.length) {
          if (word['category'])
              word['category'].push('Disc')
          else
              word['category'] = ['Disc']
      }
  })

  const phoneNumberPatterns = [
      /* (123) */
      /^\(\d{3}\)/,

      // 123-
      /\d{3}\-/,

      // -456
      /\-\d{3}/,

      // -4566
      /\-\d{4}/,
  ]

  words.forEach(word => {
      /*
       * If matches anything not allowed in phone number, ignore
       */
      if (/[^\-\d\(\)]{1}/.test(word.word)) {
          return
      }

      for (const pnp of phoneNumberPatterns) {
          if (pnp.test(word.word)) {
              word['category'] = ['PhoneNumber']
              break
          }
      }
  })

  if ("errors" in visionResponse) {
    res.status(500).send({ errors: [] });
    return;
  }
  res.send({ data: visionResponse.data });
};
