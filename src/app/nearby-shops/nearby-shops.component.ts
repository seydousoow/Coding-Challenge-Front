import {Component, OnDestroy, OnInit} from '@angular/core';
import {Scavenger} from '@wishtack/rx-scavenger';
import {Config} from '../../assets/config';
import {CatalogueService} from '../services/catalogue.service';
import {UserModel} from '../model/user.model';

@Component({
  selector: 'app-nearby-shops',
  templateUrl: './nearby-shops.component.html',
  styleUrls: ['./nearby-shops.component.css']
})
export class NearbyShopsComponent implements OnInit, OnDestroy {

  private scavenger = new Scavenger(this);
  private config = new Config();
  result: any;
  loggedUser: UserModel;

  constructor(private service: CatalogueService) {
  }

  ngOnInit() {
    this.service.getCredentials()
      .then(data => {
          this.loggedUser = data;
          this.loggedUser.dislikedShops.forEach(shop => {
            const date = Date.parse(shop.split('#')[1]);
            if (Math.floor((Date.now() - date) / 1000 / 60 / 60)) {
              this.loggedUser.dislikedShops.splice(this.loggedUser.dislikedShops.indexOf(shop), 1);
            }
          });
        },
        error => console.log(error))
      .finally(() => this.fetchUser());
  }

  private fetchUser() {
    this.service.getCredentials()
      .then(data => this.loggedUser = data, error => console.log(error))
      .finally(() => this.getShops());
  }

  private getShops() {
    this.service.getResources(this.setUrl())
      .pipe(this.scavenger.collect())
      .subscribe(data => this.result = data, error => console.log(error));
  }

  private setUrl() {
    let url = this.config.shopURL;
    if (this.loggedUser.likedShops.length > 0 && this.loggedUser.dislikedShops.length > 0) {
      url += '/search/all';
    } else if (this.loggedUser.likedShops.length > 0) {
      url += '/search/liked';
    } else if (this.loggedUser.dislikedShops.length > 0) {
      url += '/search/disliked';
    }

    this.loggedUser.likedShops.length > 0 ?
      this.loggedUser.likedShops.forEach(id => url += this.loggedUser.likedShops.indexOf(id) === 0 ? '?ids=' + id : `,` + id)
      : url += '?';

    if (this.loggedUser.dislikedShops.length > 0) {
      if (url.charAt(url.length - 1) !== '?') {
        url += '&';
      }
      let test = true;
      this.loggedUser.dislikedShops.forEach(id => {
        url += test ? 'undesired=' + +id.split('#')[0] : `,` + +id.split('#')[0];
        test = false;
      });
    }
    return url;
  }

  ngOnDestroy(): void {
  }

  private getIdFromLink(link: string) {
    const split: Array<string> = link.split('/');
    return +split[split.length - 1];
  }

  setLiking(shopLink: string, liked: boolean) {
    const date = new Date();
    const id = this.getIdFromLink(shopLink);
    liked ? this.loggedUser.likedShops.push(id) : this.loggedUser.dislikedShops.push(String(id) + '#' + String(date));
    this.updateListLikedShop(this.loggedUser);
  }

  private updateListLikedShop(userModel: UserModel) {
    this.service.updateResource(this.config.userURL + '/' + this.getIdFromLink(userModel._links.self.href), userModel)
      .pipe(this.scavenger.collect())
      .subscribe(() => location.reload(), error => console.log(error));
  }

}
