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
  var cookies = document.cookie.split(";");
  var newCook = "";
  for (var i = 0; i < cookies.length; i++) {
    var spcook = cookies[i].split("=");
    var newC = spcook[0] + "=;expires=Thu, 21 Sep 1979 00:00:01 GMT;";
    newCook = newCook + newC;
  }
  document.cookie = newCook;
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
    this.authenticated = false;
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

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
