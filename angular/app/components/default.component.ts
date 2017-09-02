import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from "../services/login.service";
import {VideoService} from "../services/video.service";

@Component({
  selector: 'default',
  templateUrl: "app/view/default.html",
  directives: [ROUTER_DIRECTIVES],
  providers: [LoginService, VideoService]
})

// Clase del componente
export class DefaultComponent{

  public titulo = "Portada";
  public identity;
  public videos;
  public errorMessage;
  public status;

  constructor(private _loginService: LoginService, private _videoService: VideoService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit(){
    this.identity = this._loginService.getIdentity();
    console.log(this.identity);
    this.getAllVideos();
  }

  getAllVideos() {
    this._route.params.subscribe(params => {
      let page = +params["page"];
      if(!page) {
        page = 1;
      }

      this._videoService.getVideos(page).subscribe(
        response => {
          this.status = response.status;
          if(this.status != 'success') {
            this.status = "error";
          } else {
            this.videos = response.data;
            console.log(this.videos);
          }
        },
        error => {
          this.errorMessage = <any> error;
          if(this.errorMessage != null) {
            console.log(this.errorMessage);
          }
        }
      )

    });
  }

}
