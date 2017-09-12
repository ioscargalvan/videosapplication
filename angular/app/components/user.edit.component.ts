import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from "../services/login.service";
import {UploadService} from "../services/upload.service";
import {User} from '../model/user';
import {isDevMode} from "@angular/core";
import {Urls} from "../urls";


@Component({
  selector: 'user-edit',
  templateUrl: 'app/view/user.edit.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [LoginService, UploadService]
})

// Clase del componente
export class UserEditComponent implements OnInit {

  public titulo: String = "Actualizar mis datos";
  public user: User;
  public errorMessage;
  public status;
  public identity;
  public newPwd;

  public mainUrl;

  constructor(private _loginService: LoginService,
    private _uploadService: UploadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _urls: Urls
  ) {

    this.mainUrl = _urls.getMainUrl();

  }

  ngOnInit() {
    let identity = this._loginService.getIdentity();
    this.identity = identity;
    if(identity == null) {
      this._router.navigate(['/index']);
    } else {
      this.user = new User(identity.sub,
                          identity.role,
                          identity.name,
                          identity.surname,
                          identity.email,
                          identity.password,
                          "null");
    }

  }

  onSubmit() {
    console.log(this.user);

    this.newPwd = this.user.password;

    if(this.user.password == this.identity.password) {
      this.user.password = "";
    }

    this._loginService.updateUser(this.user).subscribe(
      response => {
        console.log(response);
        this.status = response.status;

        if(this.status != "success") {
          this.status = "error";
        } else {

          if(this.newPwd == this.identity.password) {
            this.user.password = this.identity.password;
          }

          localStorage.setItem('identity', JSON.stringify(this.user));
        }
      },
      error => {
        this.errorMessage = <any> error;
        if(this.errorMessage != null) {
          console.log(this.errorMessage);
          alert("Error en la petición.");
        }
      }
    );
  }

  public filesToUpload: Array<File>;
  public resultUpload;

  fileChangeEvent(fileInput: any) {
    console.log("Change event launched");
    this.filesToUpload = <Array<File>> fileInput.target.files;
    let token = this._loginService.getToken();
    //let url = "http://localhost/full_stack/symfony/web/app_dev.php/user/upload-image-user";
    let url = this.mainUrl + "user/upload-image-user";
    this._uploadService.makeFileRequest(token, url, ['image'], this.filesToUpload).then(
      (result) => {
        this.resultUpload = result;
        console.log(this.resultUpload);
      },
      (error) => {
        console.log(error);
      }
    );
  }



}
