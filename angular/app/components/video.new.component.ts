import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {UploadService} from "../services/upload.service";
import {LoginService} from "../services/login.service"
import {User} from "../model/user";
import {Video} from "../model/video";

@Component({
  selector: "video-new",
  templateUrl: ("app/view/video.new.html"),
  directives: [ROUTER_DIRECTIVES],
  providers: [UploadService, LoginService]
})

export class VideoNewComponent implements OnInit {

    public titulo = "Crear un nuevo video";

    constructor(private _uploadService: UploadService, private _loginService: LoginService, private _route: ActivatedRoute, private _router: Router) {

    }


  ngOnInit(){
    console.log("Started video new component.");
  }
}
