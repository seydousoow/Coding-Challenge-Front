import {Component, OnDestroy, OnInit} from '@angular/core';
import {Scavenger} from '@wishtack/rx-scavenger';
import {Config} from '../../assets/config';
import {UserModel} from '../model/user.model';
import {CatalogueService} from '../services/catalogue.service';

@Component({
  selector: 'app-preferred-shops',
  templateUrl: './preferred-shops.component.html',
  styleUrls: ['./preferred-shops.component.css']
})
export class PreferredShopsComponent implements OnInit, OnDestroy {

  private scavenger = new Scavenger(this);
  private config = new Config();
  result: any;
  loggedUser: UserModel;

  constructor(private service: CatalogueService) {
  }

  ngOnInit() {
    this.service.getCredentials()
      .then(data => this.loggedUser = data,
        error => console.log(error))
      .finally(() => {
        if (this.loggedUser.likedShops.length > 0) {
          this.getShops();
        } else {
          this.result = null;
        }
      });
  }

  private getShops() {
    let url = this.config.shopURL + '/search/preferred';
    this.loggedUser.likedShops.forEach(id => {
      url += this.loggedUser.likedShops.indexOf(id) === 0 ? '?ids=' + id : `,` + id;
    });
    this.service.getResources(url)
      .pipe(this.scavenger.collect())
      .subscribe(data => {
        this.result = data;
      }, error => console.log(error));
  }

  ngOnDestroy(): void {
  }

  private getIdFromLink(link: string) {
    const split: Array<string> = link.split('/');
    return split[split.length - 1];
  }

  remove(shopLink: string) {
    this.loggedUser.likedShops.splice(this.loggedUser.likedShops.findIndex(x => x === +this.getIdFromLink(shopLink)), 1);

    this.service.updateResource(this.config.userURL + '/' + this.getIdFromLink(this.loggedUser._links.self.href), this.loggedUser)
      .pipe(this.scavenger.collect())
      .subscribe(() => location.reload()
        , error => console.log(error));
  }

}
