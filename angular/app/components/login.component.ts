import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from "../services/login.service";

@Component({
  selector: 'login',
  templateUrl: 'app/view/login.html',
  providers: [LoginService]
})

// Clase del componente
export class LoginComponent implements OnInit {
  public titulo: string = "Por favor, inicia sesión.";
  public user;
  public errorMessage;
  public identity;
  public token;

  constructor(private _loginService: LoginService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {

      this._route.params.subscribe(params => {
        let logout = +params["id"];
        if(logout == 1) {
          localStorage.removeItem('identity');
          localStorage.removeItem('token');
          this.identity = null;
          this.token = null;

          //this._router.navigate(["/index"]);
          window.location.href = "/login";
        }
      });


      this.user = {
        "email" : "",
        "password" : "",
        "gethash" : false
      };

      let ide = this._loginService.getIdentity();
      let tk = this._loginService.getToken();

      console.log(ide);
      console.log(tk);


  }

  onSubmit() {
    console.log(this.user);

    this._loginService.signup(this.user).subscribe(
      response => {

        let identity = response;
        this.identity = identity;

        if(this.identity.length <= 1) {
          alert("Error en el servidor.");
        } else {
          if(!this.identity.status) {
            localStorage.setItem('identity', JSON.stringify(identity));

            // Get token
            this.user.gethash = "true";
            this._loginService.signup(this.user).subscribe(
                response => {
                  let token = response;
                  this.token = token;

                  if(this.token.length <= 0) {
                    console.log("Error.");
                  } else {
                    if(!this.token.status) {
                      localStorage.setItem("token", token);

                      // redirectTo
                      window.location.href = "/";
                    }
                  }
                },
                error => {
                  this.errorMessage = <any> error;
                  if(this.errorMessage != null) {
                    console.log(this.errorMessage);
                  }
                }
            )


          }
        }


      },
      error => {
        this.errorMessage = <any> error;
        if(this.errorMessage != null) {
          console.log("Error: " + this.errorMessage);
        }
      }
    );

  }
}
