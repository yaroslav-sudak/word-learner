import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(private router: Router) {}

  @ViewChild('main') main?: ElementRef<HTMLElement>;
  newWordPage() {
    document.body.classList.add('fullscreen');
    this.main?.nativeElement.classList.add('hide');
    setTimeout(() => {
      this.router.navigate(['/new-word'], { queryParams: { fullscreen: true } });
    }, 250);
  }
}
