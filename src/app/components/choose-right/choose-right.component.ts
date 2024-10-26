import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { WordsService } from "../../services/words.service";
import { IWord } from "../../interfaces/word.interface";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: "app-choose-right",
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: "./choose-right.component.html",
  styleUrl: "./choose-right.component.scss",
})
export class ChooseRightComponent implements OnInit {
  @ViewChild("translationsElement")
  translationsElement?: ElementRef<HTMLElement>;
  translations: { translation: string; isRight: boolean }[][] = [];
  currentQuestion = 0;
  words: IWord[] = [];
  constructor(private wordsService: WordsService) {}

  ngOnInit(): void {
    this.words = this.getWords();
    this.words.forEach((w) => {
      let answer =
        w.translations[this.wordsService.random(0, w.translations.length - 1)];
      let others = this.getTranslations();
      this.translations.push([
        { translation: answer, isRight: true },
        ...others.map((t) => ({ translation: t, isRight: false })),
      ]);
    });
    this.shuffleTranslations();
  }

  getWords(): IWord[] {
    return this.wordsService.getRandomWords(30) || this.wordsService.getWords();
  }

  getTranslations(): string[] {
    return this.wordsService.getRandomTranslation(3)!;
  }

  shuffleTranslations(): void {
    let translations = this.translations[this.currentQuestion];
    translations.forEach((t) => {
      let randomIndex = this.wordsService.random(0, translations.length - 1);
      let temp = translations[randomIndex];
      translations[randomIndex] = t;
      t = temp;
    });
  }

  nextQuestion(): void {
    this.currentQuestion++;
    this.shuffleTranslations();
  }

  checkAnswer(): void {
    let translationElements = this.translationsElement?.nativeElement.children as HTMLCollection;
    let translationElementsArray = Array.from(translationElements);
    translationElementsArray.forEach((element, index) => {
      // if(this.translations[this.currentQuestion]
      // element.classList.add("right");
    })  
  }
}
