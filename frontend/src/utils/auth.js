

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


class Auth {
    constructor(){
        this.authenticated = false;
        this.user = null
    }
    
    login(cb){
        this.authenticated = true;
        cb();
        
    }

    logout(cb){
        this.setUser(null)
        this.authenticated = false;
        document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        cb();
    }

    setAuthenticated(bool){
        this.authenticated = bool;

    }

    isAuthenticated(){
        return this.authenticated;
    }

    setUser(user){
        this.user = user

    }
    getUser(){
        return this.user
    }


}

export default new Auth();