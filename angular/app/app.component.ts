// Importar el núcleo de Angular
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from "./services/login.service";
import {isDevMode} from "@angular/core";
import {Urls} from "./urls";
// Decorador component, indicamos en que etiqueta se va a cargar la plantilla
@Component({
    selector: 'my-app',
    templateUrl: 'app/view/layout.html' ,
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, Urls]
})

// Clase del componente donde irán los datos y funcionalidades
export class AppComponent {
  public identity;
  public token;
  public searchString: string;

  constructor(private _loginService: LoginService, private _router: Router, private _urls: Urls) {
    console.log(isDevMode());
    console.log(_urls.getMainUrl());
  }

  ngOnInit() {
    this.identity = this._loginService.getIdentity();
    this.token = this._loginService.getToken();
  }

  search() {
    if(this.searchString != null) {
      this._router.navigate(["/search", this.searchString]);
    } else {
      this._router.navigate(["/index"]);
    }
  }
}
