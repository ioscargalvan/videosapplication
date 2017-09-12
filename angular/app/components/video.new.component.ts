import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {UploadService} from "../services/upload.service";
import {VideoService} from "../services/video.service";
import {LoginService} from "../services/login.service";

import {User} from "../model/user";
import {Video} from "../model/video";

import {Urls} from "../urls";

@Component({
  selector: "video-new",
  templateUrl: ("app/view/video.new.html"),
  directives: [ROUTER_DIRECTIVES],
  providers: [UploadService, LoginService, VideoService, Urls]
})

export class VideoNewComponent implements OnInit {

    public titulo = "Crear un nuevo video";
    public video;
    public errorMessage;
    public status;
    public uploadedImage;
    public identity;

    public mainUrl;

    constructor(private _uploadService: UploadService, private _urls: Urls, private _loginService: LoginService, private _videoService: VideoService, private _route: ActivatedRoute, private _router: Router) {
      this.uploadedImage = false;
      this.mainUrl = _urls.getMainUrl();
    }


  ngOnInit(){

    let identity = this._loginService.getIdentity();
    this.identity = identity;
    if(identity == null) {
      this._router.navigate(['/index']);
    } else {
      this.video = new Video(1, "", "", "public", "null", "null", null, null);
    }

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

  public filesToUpload: Array<File>;
  public resultUpload;

  fileChangeEventImage(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
    let token = this._loginService.getToken();
    let url = this.mainUrl + "video/upload-image/" + this.video.id;
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

  nextUploadVideo() {
    this.uploadedImage = true;
  }

  fileChangeEventVideo(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
    let token = this._loginService.getToken();

    let url = this.mainUrl + "video/upload-video/" + this.video.id;
    this._uploadService.makeFileRequest(token, url, ['video'], this.filesToUpload).then(
      (result) => {
        this.resultUpload = result;
        console.log(this.resultUpload);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  redirectToVideo() {
    this._router.navigate(['/video', this.video.id]);
  }
}
