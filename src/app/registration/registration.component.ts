import {Component, OnDestroy, OnInit} from '@angular/core';
import {Config} from '../../assets/config';
import {Scavenger} from '@wishtack/rx-scavenger';
import {CatalogueService} from '../services/catalogue.service';
import {UserModel} from '../model/user.model';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  private config = new Config();
  private scavenger = new Scavenger(this);
  user = new UserModel();

  constructor(private services: CatalogueService,
              private router: Router) {
  }

  ngOnInit() {
  }

  register() {
    this.services.saveResource(this.config.registrationURL, this.user)
      .pipe(this.scavenger.collect())
      .subscribe(() => this.succesful()
        , error => console.log(error));
  }

  ngOnDestroy(): void {
  }

  private succesful() {
    Swal.fire({
      title: 'Success',
      html: 'You have been succesfully registered!',
      type: 'success',
      showCloseButton: false,
      showCancelButton: false,
      allowOutsideClick: false
    }).then(data => {
      if (data.value) {
        this.router.navigate(['login']);
      }
    });
  }
}
