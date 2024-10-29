import { Injectable, OnInit } from '@angular/core';
import { IWord } from '../interfaces/word.interface';

@Injectable({
  providedIn: 'root',
})
export class WordsService implements OnInit {
  private words: { [id: string]: IWord } = {
    '123234': {
      word: '',
      translations: [],
      chance: 100,
      id: 123234,
    },
    '123235': {
      word: '',
      translations: [],
      chance: 100,
      id: 123235,
    },
    '123236': {
      word: '',
      translations: [],
      chance: 100,
      id: 123236,
    },
    '123237': {
      word: '',
      translations: [],
      chance: 100,
      id: 123237,
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
    return localStorage.getItem('words')
      ? JSON.parse(localStorage.getItem('words')!)
      : {};
  }

  private setWords(): void {
    localStorage.setItem('words', JSON.stringify(this.words));
  }

  getWord(id: number | string): IWord | undefined {
    if (typeof id === 'string' && id in this.words) {
      return this.words[id];
    } else if (typeof id === 'number') {
      if (id < 0 || id >= this.getSize()) {
        return undefined;
      }
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
  getRandomWord(): { [id: string]: IWord } | undefined {
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
      numberOfWords > this.words.length ||
      numberOfWords < 0 ||
      this.words.length === 0
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
    this.words.push({ word, translations, chance: 100, id: this.words.length });
    this.setWords();
  }

  removeWord(...ids: number[]): void {
    for (let id of ids) {
      if (0 <= id && id < this.words.length) {
        this.words.splice(id, 1);
      }
    }
    this.setWords();
  }

  removeAllWords(): void {
    this.words = [];
    this.setWords();
  }

  increaseChance(id: number): void {
    if (0 <= id && id < this.words.length) {
      this.words[id].chance /= 0.9;
      this.setWords();
    }
  }

  decreaseChance(id: number): void {
    if (0 <= id && id < this.words.length) {
      this.words[id].chance *= 0.9;
      this.setWords();
    }
  }

  getRandomTranslation(numberOfTranslations: number): string[] | undefined {
    if (
      this.words.length === 0 ||
      numberOfTranslations < 0 ||
      numberOfTranslations > this.words.length
    ) {
      return undefined;
    } else {
      return this.getRandomWords(numberOfTranslations)?.map(
        (w) => w.translations[this.random(0, w.translations.length - 1)]
      );
    }
  }
}
