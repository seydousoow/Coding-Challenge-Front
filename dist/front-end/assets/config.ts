export class Config {
  readonly host = 'http://localhost:8080';
  readonly userURL = '/users';
  readonly loginURL = '/login';
  readonly registrationURL = '/register';
  readonly shopURL = '/shops';
  readonly TOKEN_NAME = 'token';
  readonly TOKEN_PREFIX = 'Bearer ';

  // rewriting of btoa encoder function
  utf8ToBase64(args: string) {
    return window.btoa(unescape(encodeURIComponent(args)));
  }

  // rewriting of atob decoder function
  b64ToUtf8(args: string) {
    return decodeURIComponent(escape(window.atob(args)));
  }

}
