import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-train-words',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './train-words.component.html',
  styleUrl: './train-words.component.scss',
})
export class TrainWordsComponent {
  @ViewChild('trainWords') trainWords?: ElementRef<HTMLElement>;

  constructor(private router: Router) {}

  back() {
      this.router.navigate(['/home'], { queryParams: { fullscreen: false } });
  }

  chooseRight() {
    document.body.classList.add('fullscreen');
    this.trainWords?.nativeElement.classList.add('hide');
    setTimeout(() => {
      this.router.navigate(['/choose-right'], { queryParams: { fullscreen: true } });
    }, 250);
  }
}
