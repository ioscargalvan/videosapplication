import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {UploadService} from "../services/upload.service";
import {VideoService} from "../services/video.service";
import {LoginService} from "../services/login.service";

import {User} from "../model/user";
import {Video} from "../model/video";

@Component({
  selector: "video-new",
  templateUrl: ("app/view/video.new.html"),
  directives: [ROUTER_DIRECTIVES],
  providers: [UploadService, LoginService, VideoService]
})

export class VideoNewComponent implements OnInit {

    public titulo = "Crear un nuevo video";
    public video;
    public errorMessage;
    public status;

    constructor(private _uploadService: UploadService, private _loginService: LoginService, private _videoService: VideoService, private _route: ActivatedRoute, private _router: Router) {

    }


  ngOnInit(){
    this.video = new Video(1, "", "", "public", "null", "null", null, null);

  }

  callVideoStatus(value) {
    this.video.status = value;
  }

  onSubmit() {


    let token = this._loginService.getToken();
    this._videoService.create(token, this.video).subscribe(
      response => {
        this.status = response.status;
        if(this.status != 'success') {
          this.status = "error";
        } else {
          this.video = response.data;
          console.log(this.video);
        }
      },
      error => {
        this.errorMessage = <any> error;
        if(this.errorMessage != null) {
          console.log(this.errorMessage);
        }
      }
    );

  }
}
