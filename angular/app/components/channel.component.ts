import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import {LoginService} from "../services/login.service";
import {VideoService} from "../services/video.service";

@Component({
  selector: 'channel',
  templateUrl: "app/view/channel.html",
  directives: [ROUTER_DIRECTIVES],
  providers: [LoginService, VideoService]
})

// Clase del componente
export class ChannelComponent{

  public titulo = "Canal";
  public identity;
  public videos;
  public userChannel;

  public errorMessage;
  public status;
  public loading;
  public pages;
  public pagePrev = 1;
  public pageNext = 1;



  constructor(private _loginService: LoginService, private _videoService: VideoService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit(){
    this.loading = "show";
    this.identity = this._loginService.getIdentity();
    console.log(this.identity);
    this.getChannelVideos();
  }

  getChannelVideos() {

    this._route.params.subscribe(params => {
      let page = +params["page"];
      let user: any = params["user"];


      if(!user) {
        user = this.identity.sub;

      }

      if(!page) {
        page = 1;
      }

      this.loading = "show";

      this._videoService.getChannel(user, page).subscribe(
        response => {
          this.status = response.status;
          if(this.status != 'success') {
            this.status = "error";
          } else {
            this.videos = response.data.videos;
            console.log(this.videos);
            this.loading = "hide";
            this.userChannel = response.data.user;

            this.pages = [];
            for(let i = 0; i < response.total_pages; i++) {
                this.pages.push(i);
            }

            if(page >= 2) {
              this.pagePrev = (page - 1);
            } else {
              this.pagePrev = page;
            }

            if(page < response.total_pages || page == 1) {
              this.pageNext = (page + 1);
            } else {
              this.pageNext = page;
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

    });
  }

}
