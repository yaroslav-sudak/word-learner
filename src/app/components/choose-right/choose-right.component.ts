import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WordsService } from '../../services/words.service';
import { IWord } from '../../interfaces/word.interface';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-right',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './choose-right.component.html',
  styleUrl: './choose-right.component.scss',
})
export class ChooseRightComponent implements OnInit {
  @ViewChild('chooseRight') chooseRight?: ElementRef<HTMLElement>;
  @ViewChild('translationsElement')
  translationsElement?: ElementRef<HTMLElement>;
  translations: { translation: string; isRight: boolean }[][] = [];
  currentQuestion = 0;
  words: IWord[] = [];
  constructor(private wordsService: WordsService, private router: Router) {}

  ngOnInit(): void {
    this.words = this.getWords();
    this.words.forEach((w) => {
      let answer =
      w.translations[this.wordsService.random(0, w.translations.length - 1)];
      let others = this.getTranslations(answer);
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

  getTranslations(answer: string): string[] {
    let translations = this.wordsService.getRandomTranslation(4)!.filter(
      (t) => t !== answer
    );
    if (translations.length > 3) {
      translations.pop();
    }
    return translations;
  }

  shuffleTranslations(): void {
    let translations = this.translations[this.currentQuestion];
    translations.map((t, i) => {
      let randomIndex = this.wordsService.random(0, translations.length - 1);
      translations[i] = translations[randomIndex];
      translations[randomIndex] = t;
    });
  }

  nextQuestion(): void {
    this.currentQuestion++;
    this.shuffleTranslations();
  }

  checkAnswer(): void {
    let translationElements = this.translationsElement?.nativeElement
      .children as HTMLCollection;
    let translationElementsArray = Array.from(translationElements);
    translationElementsArray.forEach((element, index) => {
      if (this.translations[this.currentQuestion][index].isRight)
        element.classList.add('right');
    });
  }

  back(): void {
    document.body.classList.remove('fullscreen');
    this.chooseRight?.nativeElement.classList.add('hide');
    setTimeout(() => {
      this.router.navigate(['/train-words'], { queryParams: { fullscreen: false } });
    }, 250);
  }
}
