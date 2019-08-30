import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {CatalogueService} from './services/catalogue.service';
import {UserModel} from './model/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'front-end';

  path: boolean;
  user = new UserModel();

  constructor(private router: Router, private services: CatalogueService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(
      arg => {
        if (arg instanceof NavigationEnd) {
          this.path = this.router.url === '/login' || this.router.url === '/register';
        }
      }, () => {
      }, () => this.getCurrentUser()
    );
  }

  private getCurrentUser() {
    if (!this.path) {
      this.services.getCredentials()
        .then(data => {
          this.user = data;
        }, error => console.log(error));
    }
  }

  logout() {
    this.services.logout();
  }
}
