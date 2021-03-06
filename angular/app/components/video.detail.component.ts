import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {VideoService} from "../services/video.service";
import {LoginService} from "../services/login.service";
import {GenerateDatePipe} from "../pipes/generate.date.pipe";
import {CommentsComponent} from "./comments.component";
import {User} from "../model/user";
import {Video} from "../model/video";

@Component({
  selector: "video-detail",
  templateUrl: ("app/view/video.detail.html"),
  directives: [ROUTER_DIRECTIVES, CommentsComponent],
  providers: [LoginService, VideoService],
  pipes: [GenerateDatePipe]
})

export class VideoDetailComponent implements OnInit {

  public errorMessage;
  public video;
  public status;
  public loading = "show";
  public latestVideos;
  public statusLatestVideos;
  public identity;

  constructor(private _loginService: LoginService, private _videoService: VideoService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {

    this.identity = this._loginService.getIdentity();

    this._route.params.subscribe(params => {

      this.loading = 'show';

      let id = +params["id"];

      this._videoService.getVideo(id).subscribe(
        response => {
          this.video = response.data;
          this.status = response.status;
          if(this.status != "success") {
            this._router.navigate(["/index"]);
            console.log(response);
            status = "error";
          }
          this.loading = "hide";
        },
        error => {
          this.errorMessage = <any> error;
          if(this.errorMessage != null) {
            console.log(this.errorMessage);
          }
        }
      )

      this._videoService.getLatestVideos().subscribe(
        response => {
          this.latestVideos = response.data;
          this.statusLatestVideos = response.status;
          if(this.statusLatestVideos != "success") {
            this._router.navigate(["/index"]);
          }
        },
        error => {
          this.errorMessage = <any> error;
          if(this.errorMessage != null) {
            console.log(this.errorMessage);
          }
        }
      );

    });
  }

}
