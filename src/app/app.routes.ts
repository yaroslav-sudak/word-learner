import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { NewWordComponent } from './components/new-word/new-word.component';
import { TrainWordsComponent } from './components/train-words/train-words.component';
import { ChooseRightComponent } from './components/choose-right/choose-right.component';
import { ListOfWordsComponent } from './components/list-of-words/list-of-words.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: MainComponent },
  { path: 'new-word', component: NewWordComponent },
  { path: 'train-words', component: TrainWordsComponent },
  { path: 'choose-right', component: ChooseRightComponent },
  { path: 'list-of-words', component: ListOfWordsComponent },
];
