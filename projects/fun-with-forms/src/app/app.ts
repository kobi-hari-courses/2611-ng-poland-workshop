import { Component } from '@angular/core';
import { TalkForm } from './components/talk-form/talk-form';

@Component({
  selector: 'app-root',
  imports: [TalkForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
