import {Injectable, OnDestroy} from '@angular/core';
import {Config} from '../../assets/config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Scavenger} from '@wishtack/rx-scavenger';
import {JwtHelperService} from '@auth0/angular-jwt';
import {UserModel} from '../model/user.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService implements OnDestroy {

  private config: Config = new Config();
  private readonly TOKEN_NAME = this.config.TOKEN_NAME;
  private readonly TOKEN_PREFIX = this.config.TOKEN_PREFIX;

  private _token: string = null;
  private scavenger = new Scavenger(this);
  private jwtHelper = new JwtHelperService();

  private readonly header: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', this.token);

  get token(): string {
    this._token = localStorage.getItem(this.TOKEN_NAME);
    return this.TOKEN_PREFIX + this._token;
  }

  set token(value: string) {
    localStorage.setItem(this.TOKEN_NAME, value);
    this._token = value;
  }

  /*
   * Method to delete the token
   */
  deleteToken(): void {
    if (this.token !== null) {
      localStorage.removeItem(this.TOKEN_NAME);
    }
  }

  ngOnDestroy(): void {
  }

  constructor(private http: HttpClient, private router: Router) {
  }

  getResources(url: string) {
    return this.http.get(this.config.host + url, {headers: this.header});
  }

  updateResource(url: string, item: any) {
    return this.http.put(this.config.host + url, item, {headers: this.header});
  }

  saveResource(url: string, item: any) {
    return this.http.post(this.config.host + url, item);
  }

  login(email: string, password: string) {
    return this.http.post(this.config.host + this.config.loginURL, {
      email,
      password
    }, {observe: 'response'});
  }

  isTokenExpired() {
    const token = this.token;
    /*
     * return true if the token equals null
     */
    if (token.length < 20) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    /*
     * Delete the token from the localStorage
     *
     */
    this.deleteToken();
    this.router.navigate(['login']);
  }

  /*
   * Query the username and the role of the current user
   */
  getCredentials() {
    const token = this.token;
    if (token.length < 20) {
      return null;
    }
    const decoded = this.jwtHelper.decodeToken(token);
    const username: string = decoded.sub;
    const header: HttpHeaders = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: token
    });
    return this.http.get<UserModel>(this.config.host + this.config.userURL + '/search/byEmail?email=' + username, {headers: header})
      .pipe(this.scavenger.collect())
      .toPromise();
  }
}
