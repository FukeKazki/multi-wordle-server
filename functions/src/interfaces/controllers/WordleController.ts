export class WordleController {
  generateWordle() {
    return "さつまいも";
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
