import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from "../services/login.service";
import {User} from '../model/user';


@Component({
  selector: 'register',
  templateUrl: 'app/view/register.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [LoginService]
})

// Clase del componente
export class RegisterComponent implements OnInit {

  public titulo: String = "Registro";
  public user: User;

  constructor(private _loginService: LoginService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    this.user = new User(1, "user", "", "", "", "", "");
  }



}
