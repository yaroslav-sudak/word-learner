import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { NewWordComponent } from './components/new-word/new-word.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainComponent },
  { path: 'new-word', component: NewWordComponent },
];
