import { Injectable, OnInit } from '@angular/core';
import { IWord } from '../interfaces/word.interface';

@Injectable({
  providedIn: 'root',
})
export class WordsService implements OnInit {
  private words: { [id: string]: IWord } = {
    '123234': {
      word: 'a',
      translations: ['a1', 'a2', 'a3'],
      chance: 100,
      id: '123234',
    },
    '123235': {
      word: 'b',
      translations: ['b1', 'b2', 'b3'],
      chance: 100,
      id: '123235',
    },
    '123236': {
      word: 'c',
      translations: ['c1', 'c2', 'c3'],
      chance: 100,
      id: '123236',
    },
    '123237': {
      word: 'd',
      translations: ['d1', 'd2', 'd3'],
      chance: 100,
      id: '123237',
    },
  };

  // ! Front side

  ngOnInit(): void {
    this.words = this.loadWords();
  }

  private getSize(): number {
    return this.getKeys().length;
  }

  private getKeys(): string[] {
    return Object.keys(this.words);
  }

  getWords(): IWord[] {
    return this.getKeys().map((key) => this.words[key]);
  }

  private loadWords(): { [id: string]: IWord } {
    let words = localStorage.getItem('words')
      ? JSON.parse(localStorage.getItem('words')!)
      : [];
    let wordsList: { [id: string]: IWord } = {};
    words.forEach((w: IWord) => (wordsList[w.id] = w));
    return wordsList;
  }

  private setWords(): void {
    localStorage.setItem('words', JSON.stringify(this.getWords()));
  }

  getWord(id: number | string): IWord | undefined {
    if (typeof id === 'string' && id in this.words) {
      return this.words[id];
    } else if (typeof id === 'number' && 0 <= id && id < this.getSize()) {
      return this.words[this.getKeys()[id]];
    }
    return undefined;
  }

  // ! Back side

  random(...args: number[]): number {
    if (args.length === 1) {
      return Math.round(Math.random() * args[0]);
    } else {
      return Math.round(Math.random() * (args[1] - args[0])) + args[0];
    }
  }

  // Return random word from words array with checking chance of its appearance
  getRandomWord(): IWord | undefined {
    if (this.getSize() === 0) {
      return undefined;
    }
    let randomWord = this.getWord(this.random(0, this.getSize() - 1));
    if (randomWord && randomWord.chance <= this.random(0, 100)) {
      return randomWord;
    } else {
      return this.getRandomWord();
    }
  }

  // Return array of unique random words
  getRandomWords(numberOfWords: number): IWord[] | undefined {
    if (
      numberOfWords > this.getSize() ||
      numberOfWords <= 0 ||
      this.getSize() === 0
    ) {
      return undefined;
    }
    let words: IWord[] = [];
    let getUniqueWord = (): IWord => {
      let word = this.getRandomWord();
      if (!word || words.includes(word)) {
        word = getUniqueWord();
      }
      return word;
    };

    for (let i = 0; i < numberOfWords; i++) {
      words.push(getUniqueWord());
    }
    return words;
  }

  createWord(w: { word: string; translations: string[] }): void {
    let word = w.word;
    let translations = w.translations;
    let id = Date.now() + '';
    this.words[id] = { word, translations, chance: 100, id };
    this.setWords();
  }

  removeWord(...ids: (string | number)[]): void {
    for (let id of ids) {
      if (typeof id === 'string' && id in this.words) {
        delete this.words[id];
      } else if (typeof id === 'number' && 0 <= id && id < this.getSize()) {
        delete this.words[this.getKeys()[id]];
      }
    }
    this.setWords();
  }

  removeAllWords(): void {
    this.words = {};
    this.setWords();
  }

  increaseChance(id: string | number): void {
    let word = this.getWord(id);
    if (word) {
      word.chance /= 0.9;
      this.setWords();
    }
  }

  decreaseChance(id: number): void {
    let word = this.getWord(id);
    if (word) {
      word.chance *= 0.9;
      this.setWords();
    }
  }

  getRandomTranslation(numberOfTranslations: number): string[] | undefined {
    return this.getRandomWords(numberOfTranslations)?.map(
      (w) => w.translations[this.random(0, w.translations.length - 1)]
    );
  }
}
