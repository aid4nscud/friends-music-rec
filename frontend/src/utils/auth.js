export const getCookie = (name) => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const clearCookies = () => {
  document.cookie = "user=;expires=Thu, 21 Sep 1979 00:00:01 GMT;";
  document.cookie = "token=;expires=Thu, 21 Sep 1979 00:00:01 GMT;";
};

class Auth {
  constructor() {
    this.authenticated = false;
  }

  login(cb) {
    this.authenticated = true;
    cb();
  }

  logout(cb) {
    clearCookies();

    this.authenticated = false;

    cb();
  }

  setAuthenticated(bool) {
    this.authenticated = bool;
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
