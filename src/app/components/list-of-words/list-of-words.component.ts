import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { WordsService } from '../../services/words.service';
import { IWord } from '../../interfaces/word.interface';

@Component({
  selector: 'app-list-of-words',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './list-of-words.component.html',
  styleUrl: './list-of-words.component.scss',
})
export class ListOfWordsComponent implements OnInit {
  words: IWord[] = [];
  constructor(private router: Router, private wordsService: WordsService) {}
  @ViewChild('listOfWords') listOfWords?: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.words = this.wordsService.getWords();
  }
  back() {
    document.body.classList.remove('fullscreen');
    this.listOfWords?.nativeElement.classList.add('hide');
    setTimeout(() => {
      this.router.navigate(['/home'], { queryParams: { fullscreen: false } });
    }, 250);
  }

  toggleTranslation(countOfTranslations: number, event: Event) {
    if (countOfTranslations > 1) {
      let target = event.currentTarget as HTMLElement;
      if (!target.style.maxHeight || target.style.maxHeight === '1.5em') {
        target.classList.add('active');
        target.style.maxHeight = countOfTranslations * 1.5 + 'em';
      } else {
        target.classList.remove('active');
        target.style.maxHeight = '1.5em';
      }
    }
  }

  removeWord(index: number) {
    this.words.splice(index, 1);
    this.wordsService.removeWord(index);
  }

  addWordPage() {
    this.listOfWords?.nativeElement.classList.add('hide');
    setTimeout(() => {
      this.router.navigate(['/new-word'], { queryParams: { fullscreen: true } });
    }, 250);
  }
}
