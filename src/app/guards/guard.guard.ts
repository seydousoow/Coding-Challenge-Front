import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2';
import {CatalogueService} from '../services/catalogue.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {

  constructor(private services: CatalogueService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.services.isTokenExpired()) {
      // this.router.navigate(['nearBy']);
      return true;
    }
    Swal.fire({
      title: 'Unauthorized',
      text: 'Please log in!',
      type: 'info',
      showCancelButton: false,
      allowOutsideClick: false,
      showCloseButton: false
    }).then(value => {
      if (value.value) {
        this.router.navigate(['login']);
      }
    });
    return false;
  }
}
