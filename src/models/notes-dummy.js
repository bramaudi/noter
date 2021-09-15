import { LoremIpsum } from "lorem-ipsum";
import { formatDate } from "../helper/date";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 2,
    min: 1
  },
  wordsPerSentence: {
    max: 8,
    min: 3
  }
});

export const notesFetchAll = (limit = 10) => {
  let data = Array.from({ length: limit }, (v, i) => {
    return {
      id: Math.random().toString(36).substring(7),
      title: lorem.generateWords(Math.floor(Math.random() * 10)),
      body: lorem.generateSentences(Math.floor(Math.random() * 5)),
      tags: [],
      created_at: '2021-07-28 15:01:21',
      uodated_at: null
    }
  })
  return data.map(
    note => ({
      ...note,
      created_at: formatDate(note.created_at),
      updated_at: formatDate(note.updated_at),
    })
  )
}

	// const dummySet = [
  //   {
  //       "title": "Dalai Lama",
  //       "body": "People take different roads seeking fulfilment and happiness. Just because they’re not on your road doesn't mean they've gotten lost.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2019-09-23"
  //   },
  //   {
  //       "title": "Albert Einstein",
  //       "body": "I never think of the future. It comes soon enough.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2019-10-03"
  //   },
  //   {
  //       "title": "Plutarch",
  //       "body": "What we achieve inwardly will change outer reality.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2019-02-13"
  //   },
  //   {
  //       "title": "Buddha",
  //       "body": "To live a pure unselfish life, one must count nothing as one’s own in the midst of abundance.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2019-12-23"
  //   },
  //   {
  //       "title": "Epictetus",
  //       "body": "Men are disturbed not by things, but by the view which they take of them.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2021-05-07"
  //   },
  //   {
  //       "title": "Napoleon",
  //       "body": "The best cure for the body is a quiet mind.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2020-04-15"
  //   },
  //   {
  //       "title": "Ralph Waldo Emerson",
  //       "body": "Each man has his own vocation; his talent is his call. There is one direction in which all space is open to him.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2020-04-14"
  //   },
  //   {
  //       "title": "Lord Byron",
  //       "body": "Friendship is Love without his wings!",
  //       "tags": [
  //           "friendship"
  //       ],
  //       "created_at": "2021-03-26"
  //   },
  //   {
  //       "title": "Oscar Wilde",
  //       "body": "He has no enemies, but is intensely disliked by his friends.",
  //       "tags": [
  //           "friendship"
  //       ],
  //       "created_at": "2019-06-13"
  //   },
  //   {
  //       "title": "Buddha",
  //       "body": "The mind is everything. What you think you become.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2020-03-11"
  //   },
  //   {
  //       "title": "Isocrates",
  //       "body": "True knowledge exists in knowing that you know nothing.",
  //       "tags": [
  //           "wisdom"
  //       ],
  //       "created_at": "2019-12-23"
  //   },
  //   {
  //       "title": "Thích Nhất Hạnh",
  //       "body": "The amount of happiness that you have depends on the amount of freedom you have in your heart.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2019-12-13"
  //   },
  //   {
  //       "title": "Pablo Picasso",
  //       "body": "He can who thinks he can, and he can't who thinks he can't. This is an inexorable, indisputable law.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2020-03-07"
  //   },
  //   {
  //       "title": "Richard Bach",
  //       "body": "I gave my life to become the person I am right now. Was it worth it?",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2020-09-29"
  //   },
  //   {
  //       "title": "Oscar Wilde",
  //       "body": "Laughter is not at all a bad beginning for a friendship, and it is far the best ending for one.",
  //       "tags": [
  //           "friendship"
  //       ],
  //       "created_at": "2020-11-10"
  //   },
  //   {
  //       "title": "Albert Einstein",
  //       "body": "If A is success in life, then A equals x plus y plus z. Work is x; y is play; and z is keeping your mouth shut.",
  //       "tags": [
  //           "famous-quotes",
  //           "life",
  //           "success"
  //       ],
  //       "created_at": "2020-03-01"
  //   },
  //   {
  //       "title": "Nikola Tesla",
  //       "body": "Let the future tell the truth and evaluate each one according to his work and accomplishments. The present is theirs; the future, for which I have really worked, is mine.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2019-11-26"
  //   },
  //   {
  //       "title": "Dhammapada",
  //       "body": "Just as a flower, which seems beautiful has color but no perfume, so are the fruitless words of a man who speaks them but does them not.",
  //       "tags": [
  //           "famous-quotes"
  //       ],
  //       "created_at": "2019-12-23"
  //   },
  //   {
  //       "title": "Alexander Pope",
  //       "body": "Never find fault with the absent.",
  //       "tags": [
  //           "wisdom"
  //       ],
  //       "created_at": "2019-06-27"
  //   },
  //   {
  //       "title": "Henry Ford",
  //       "body": "My best friend is the one who brings out the best in me.",
  //       "tags": [
  //           "friendship"
  //       ],
  //       "created_at": "2021-01-30"
  //   }
	// ]
