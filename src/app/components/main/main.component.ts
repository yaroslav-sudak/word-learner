import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { WordsService } from '../../services/words.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(private router: Router, private wordsService: WordsService) {}
  
  @ViewChild('main') main?: ElementRef<HTMLElement>;

  isEnoughWords() {
    return this.wordsService.getWords().length > 0
  }

  newWordPage() {
    document.body.classList.add('fullscreen');
    this.main?.nativeElement.classList.add('hide');
    setTimeout(() => {
      this.router.navigate(['/new-word'], { queryParams: { fullscreen: true } });
    }, 250);
  }

  trainWordsPage() {
      this.router.navigate(['/train-words'], { queryParams: { fullscreen: false } });
  }

  listOfWordsPage() {
    document.body.classList.add('fullscreen');
    this.main?.nativeElement.classList.add('hide');
    setTimeout(() => {
      this.router.navigate(['/list-of-words'], { queryParams: { fullscreen: true } });
    }, 250);
    
  }
}
