import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout/layout.component';
import { MainNavigationComponent } from './layout/main-navigation/main-navigation.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    LayoutComponent,
    MainNavigationComponent
  ],
})
export class AppComponent {
  title = 'meetup-app-angular';
}
