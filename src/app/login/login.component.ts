import {Component, OnDestroy, OnInit} from '@angular/core';
import {CatalogueService} from '../services/catalogue.service';
import {Scavenger} from '@wishtack/rx-scavenger';
import {UserModel} from '../model/user.model';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  private scavenger: Scavenger = new Scavenger(this);

  user: UserModel = new UserModel();

  constructor(private services: CatalogueService, private router: Router) {
  }

  ngOnDestroy(): void {
  }

  doLogin() {
    this.services.login(this.user.email, this.user.password)
      .pipe(this.scavenger.collect())
      .subscribe(data => {
          this.services.token = data.headers.get('Authorization');
          this.router.navigate(['nearBy']);
        }, () => {
        Swal.fire({
          title: 'Error',
          html: 'Login or password incorrect!',
          type: 'error',
          showCancelButton: false,
          showCloseButton: false,
        }).then(() => {
          this.user.password = '';
        });
      });
  }
}
