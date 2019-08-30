export class UserModel {
  shopId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  likedShops: Array<number>;
  dislikedShops: Array<string>;
  _links: any;
}
