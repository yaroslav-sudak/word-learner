import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  placeholder = input<string>("");
  inputValue = input<string>("");
  
  type = input<string>('text');
  label = input<string>("");
  error = input<string>("");

  valueOutput = output<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueOutput.emit(value);
  }
}
