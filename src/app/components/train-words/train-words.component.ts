import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-train-words',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './train-words.component.html',
  styleUrl: './train-words.component.scss'
})
export class TrainWordsComponent {

}
