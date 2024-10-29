import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('content') content?: ElementRef<HTMLElement>;
  mousemoveendEvent: Event = new Event('mousemoveend');

  gradienTransitionInterval: NodeJS.Timeout | undefined;
  randomCoordinatesInterval: NodeJS.Timeout | undefined;
  randomCoordinatesTimeout: NodeJS.Timeout | undefined;
  mouseStopTimeout: NodeJS.Timeout | undefined;

  gradientMoveSpeed: number = 0.2;

  destinationDistance: number = 50;
  isFinalDistance: boolean = false;
  currentDistance: number = 50;

  destinationDeg: number = 0;
  isFinalDeg: boolean = false;
  currentDeg: number = 0;

  isMoving: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['fullscreen'] === 'true') {
        document.body.classList.add('fullscreen');
      }
    });
    document.body.classList;
  }

  ngAfterViewInit(): void {
    this.startGradientMove();
  }

  adaptAngle = (deg: number): number => {
    return 90 - deg;
  };

  randomCoordinates = (): [number, number] => {
    return [Math.random() * 1.6 - 0.8, Math.random() * 1.6 - 0.8];
  };

  averageColor = (color1: string, color2: string): string => {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r = Math.round(((c1 >> 16) + (c2 >> 16)) / 2);
    const g = Math.round((((c1 >> 8) & 0xff) + ((c2 >> 8) & 0xff)) / 2);
    const b = Math.round(((c1 & 0xff) + (c2 & 0xff)) / 2);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  getCoordinates = (event: MouseEvent): [number, number] => {
    return [
      (event.clientX / window.innerWidth) * 2 - 1,
      ((event.clientY / window.innerHeight) * 2 - 1) * -1,
    ];
  };

  getDeg = (x: number, y: number): number => {
    return Math.round((Math.atan2(y, x) * 180) / Math.PI);
  };

  getDistance = (x: number, y: number): number => {
    return Math.max(
      Math.min(Math.round(Math.sqrt(x * x + y * y) * 100), 70),
      30
    );
  };

  setParameters = (x: number, y: number): void => {
    this.destinationDistance = this.getDistance(x, y);
    this.destinationDeg = this.getDeg(x, y);
    this.isFinalDistance = this.destinationDistance == this.currentDistance;
    this.isFinalDeg = this.destinationDeg == this.currentDeg;
  };

  newDistance = (): number => {
    if (this.currentDistance != this.destinationDistance) {
      const deltaDistance = Math.sign(
        this.destinationDistance - this.currentDistance
      );
      return (this.currentDistance += deltaDistance);
    } else {
      this.isFinalDistance = true;
      return this.currentDistance;
    }
  };

  newDeg = (): number => {
    if (this.destinationDeg % 360 != this.currentDeg % 360) {
      let deltaDeg = this.destinationDeg - this.currentDeg;

      if (deltaDeg > 180) {
        deltaDeg -= 360;
      } else if (deltaDeg < -180) {
        deltaDeg += 360;
      }

      return (this.currentDeg =
        (this.currentDeg + Math.sign(deltaDeg) + 360) % 360);
    } else {
      this.isFinalDeg = true;
      return this.currentDeg;
    }
  };

  setNewGradient = (deg: number, distance: number): void => {
    if (isPlatformBrowser(this.platformId) && document) {
      const gradientColor1 = getComputedStyle(document.body)
        .getPropertyValue('--gradient-color1')
        .trim();

      const gradientColor2 = getComputedStyle(document.body)
        .getPropertyValue('--gradient-color2')
        .trim();

      const midColor = this.averageColor(gradientColor1, gradientColor2);

      document.body.style.setProperty(
        '--gradient-main',
        `linear-gradient(
        ${this.adaptAngle(deg)}deg,
        ${gradientColor1} ${distance - 10}%,
        ${midColor} ${(distance + 100) / 2}%,
        ${gradientColor2} 100%
      )`
      );
    }
  };

  setGradientTransitionInterval = (): void => {
    this.gradienTransitionInterval = setInterval(() => {
      this.setNewGradient(
        this.isFinalDeg ? this.currentDeg : this.newDeg(),
        this.isFinalDistance ? this.currentDistance : this.newDistance()
      );
    }, 10 / this.gradientMoveSpeed);
  };

  setRandomCoordinatesTimeout = (): void => {
    this.randomCoordinatesTimeout = setTimeout(() => {
      this.randomCoordinatesInterval = setInterval(() => {
        clearTimeout(this.gradienTransitionInterval);
        this.setParameters(...this.randomCoordinates());
        this.setGradientTransitionInterval();
      }, 8000);
    }, 5000);
  };

  mouseMoveCheck = (): void => {
    clearTimeout(this.mouseStopTimeout);
    this.mouseStopTimeout = setTimeout(() => {
      document.dispatchEvent(this.mousemoveendEvent);
    }, 50);
  };

  moveGradient = (event: MouseEvent): void => {
    if (!this.isMoving) {
      clearTimeout(this.randomCoordinatesTimeout);
      clearInterval(this.randomCoordinatesInterval);
      clearInterval(this.gradienTransitionInterval);
      this.setGradientTransitionInterval();
      this.isMoving = true;
    }
    this.setParameters(...this.getCoordinates(event));
  };

  startGradientMove = (): void => {
    if (document) {
      document.addEventListener('mousemove', (event: MouseEvent) => {
        this.mouseMoveCheck();
        this.moveGradient(event);
      });

      document.addEventListener('mousemoveend', () => {
        this.isMoving = false;
        this.setRandomCoordinatesTimeout();
      });
      this.setGradientTransitionInterval();
      this.setRandomCoordinatesTimeout();
    }
  };
}
