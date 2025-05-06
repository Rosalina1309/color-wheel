import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ColorWheelComponent } from "../components/color-wheel/color-wheel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ColorWheelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
