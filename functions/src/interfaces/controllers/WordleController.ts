import words from "../../config/words.json";

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
}

export class WordleController {
    generateWordle() {
        const random = getRandomInt(words.words.length)

        return words.words[random]
    }

  compareWordle(collectWord: string, answer: string) {
    const wordLength = collectWord.length;
    let wordle = [];
    for (let i = 0; i < wordLength; ++i) {
      if (collectWord[i] === answer[i]) {
        wordle.push({
          char: answer[i],
          status: "match"
        });
      } else if (collectWord.includes(answer[i])) {
        wordle.push({
          char: answer[i],
          status: "include"
        });
      } else {
        wordle.push({
          char: answer[i],
          status: "miss"
        });
      }
    }
    return wordle;
  }
}
