import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  noBackground = input<boolean>(false);
  disabled = input<boolean>(false);
  onClick = output<void>();

  click() {
    if (!this.disabled()) {
      this.onClick.emit();
    }
  }
}
