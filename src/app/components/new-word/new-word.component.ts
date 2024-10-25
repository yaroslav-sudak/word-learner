import { Component, ElementRef, ViewChild } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WordsService } from '../../services/words.service';

@Component({
  selector: 'app-new-word',
  standalone: true,
  imports: [CommonModule, InputComponent, ButtonComponent],
  templateUrl: './new-word.component.html',
  styleUrl: './new-word.component.scss',
})
export class NewWordComponent {
  constructor(private router: Router, private wordsService: WordsService) {}

  @ViewChild('newWord') newWord?: ElementRef<HTMLElement>;

  translations: { value: string }[] = [{ value: '' }];
  word: string = '';

  isValidTranslation: boolean = false;
  isValidWord: boolean = false;
  isValid: boolean = false;

  translationsErrors: string[] = [''];
  wordError: string = '';

  setWord(word: string) {
    this.word = word;
    this.validateWord();
  }

  clearWord() {
    this.word = '';
    this.wordError = '';
    this.isValidWord = false;
  }

  addTranslation(index: number) {
    this.translations.splice(index + 1, 0, { value: '' });
    this.translationsErrors.splice(index + 1, 0, '');
    this.validateTranslations();
  }

  setTranslation(translation: string, index: number) {
    this.translations[index].value = translation;
    this.validateTranslations();
  }

  removeTranslation(index: number) {
    if (this.translations.length > 1) {
      this.translations.splice(index, 1);
      this.translationsErrors.splice(index, 1);
      this.validateTranslations();
    }
  }

  clearTranslations() {
    this.translations = [{ value: '' }];
    this.isValidTranslation = false;
    this.translationsErrors = [''];
  }

  setError(error: string, index: number) {
    this.translationsErrors[index] = error;
  }

  validateWord(): void {
    if (this.word == '') {
      this.wordError = 'Word is required';
      this.isValidWord = false;
    } else {
      this.isValidWord = true;
      this.wordError = '';
    }
    this.isValid = this.isValidTranslation && this.isValidWord;
  }

  validateTranslations(): void {
    this.isValidTranslation = this.translations.some((item) => {
      if (item.value == '') {
        return false;
      } else {
        return true;
      }
    });

    if (this.isValidTranslation) {
      this.translationsErrors = this.translationsErrors.map(() => '');
    }else if (this.translations.length == 1) {
      this.translationsErrors[0] = 'Translation is required'
    } else {
      this.translationsErrors = this.translationsErrors.map(
        () => 'At least one translation is required'
      );
    }

    this.isValid = this.isValidTranslation && this.isValidWord;
  }

  close() {
    this.newWord?.nativeElement.classList.add('hide');
    document.body.classList.remove('fullscreen');
    setTimeout(() => {
      this.router.navigate(['/home'], { queryParams: { fullscreen: false } });
    }, 250);
  }

  clear() {
    this.clearWord();
    this.clearTranslations();
    this.isValid = false;
  }

  save() {
    if (this.isValid) {
      this.wordsService.createWord({
        word: this.word.trim().toLowerCase(),
        translations: this.translations.map((item) =>
          item.value.trim().toLowerCase()
        ),
      });
      this.clear();
    }
  }
}
