import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const index = (limit = 10) => {
  const data = Array.from({ length: limit }, (v, i) => {
    return {
      id: Math.random().toString(36).substring(7),
      title: lorem.generateWords(Math.floor(Math.random() * 10)),
      body: lorem.generateSentences(Math.floor(Math.random() * 20)),
      tags: [],
      created_at: '2021-07-28 15:01:21',
      uodated_at: null
    }
  })
  return { error: null, data }
}

const read = (id = '') => {
  const data = [
    {
      id: Math.random().toString(36).substring(7),
      title: lorem.generateWords(Math.floor(Math.random() * 10)),
      body: lorem.generateSentences(Math.floor(Math.random() * 20)),
      tags: [],
      created_at: '2021-07-28 15:01:21',
      uodated_at: null
    }
  ]
  return { error: null, data }
}

export default {
  index,
  read
}