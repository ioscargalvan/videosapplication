"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var upload_service_1 = require("../services/upload.service");
var video_service_1 = require("../services/video.service");
var login_service_1 = require("../services/login.service");
var video_1 = require("../model/video");
var urls_1 = require("../urls");
var VideoEditComponent = (function () {
    function VideoEditComponent(_uploadService, _urls, _loginService, _videoService, _route, _router) {
        this._uploadService = _uploadService;
        this._urls = _urls;
        this._loginService = _loginService;
        this._videoService = _videoService;
        this._route = _route;
        this._router = _router;
        this.titulo = "Editar el video";
        this.uploadedImage = false;
        this.mainUrl = _urls.getMainUrl();
    }
    VideoEditComponent.prototype.ngOnInit = function () {
        this.loading = "show";
        this.video = new video_1.Video(1, "", "", "public", "null", "null", null, null);
        this.getVideo();
        this.identity = this._loginService.getIdentity();
    };
    VideoEditComponent.prototype.callVideoStatus = function (value) {
        this.video.status = value;
    };
    VideoEditComponent.prototype.onSubmit = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var id = +params['id'];
            var token = _this._loginService.getToken();
            _this._videoService.update(token, _this.video, id).subscribe(function (response) {
                _this.status = response.status;
                if (_this.status != 'success') {
                    _this.status = "error";
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                }
            });
        });
    };
    VideoEditComponent.prototype.getVideo = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var id = +params["id"];
            _this.loading = 'show';
            _this._videoService.getVideo(id).subscribe(function (response) {
                _this.video = response.data;
                _this.status_get_video = response.status;
                console.log(response);
                if (_this.status_get_video != "success") {
                    _this._router.navigate(["/index"]);
                    console.log(response);
                    _this.status_get_video = "error";
                }
                if (_this.identity && _this.identity != null && _this.identity.sub == _this.video.user.id) {
                }
                else {
                    _this._router.navigate(["/index"]);
                }
                _this.loading = "hide";
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                }
            });
        });
    };
    VideoEditComponent.prototype.fileChangeEventImage = function (fileInput) {
        var _this = this;
        this.filesToUpload = fileInput.target.files;
        var token = this._loginService.getToken();
        var url = this.mainUrl + "video/upload-image/" + this.video.id;
        this._uploadService.makeFileRequest(token, url, ['image'], this.filesToUpload).then(function (result) {
            _this.resultUpload = result;
            console.log(_this.resultUpload);
        }, function (error) {
            console.log(error);
        });
    };
    VideoEditComponent.prototype.nextUploadVideo = function () {
        this.uploadedImage = true;
    };
    VideoEditComponent.prototype.fileChangeEventVideo = function (fileInput) {
        var _this = this;
        this.filesToUpload = fileInput.target.files;
        var token = this._loginService.getToken();
        var url = this.mainUrl + "video/upload-video/" + this.video.id;
        this._uploadService.makeFileRequest(token, url, ['video'], this.filesToUpload).then(function (result) {
            _this.resultUpload = result;
            console.log(_this.resultUpload);
        }, function (error) {
            console.log(error);
        });
    };
    VideoEditComponent.prototype.redirectToVideo = function () {
        this._router.navigate(['/video', this.video.id]);
    };
    VideoEditComponent.prototype.setChangeUpload = function (value) {
        this.changeUpload = value;
    };
    VideoEditComponent = __decorate([
        core_1.Component({
            selector: "video-edit",
            templateUrl: ("app/view/video.edit.html"),
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [upload_service_1.UploadService, login_service_1.LoginService, video_service_1.VideoService, urls_1.Urls]
        }), 
        __metadata('design:paramtypes', [upload_service_1.UploadService, urls_1.Urls, login_service_1.LoginService, video_service_1.VideoService, router_1.ActivatedRoute, router_1.Router])
    ], VideoEditComponent);
    return VideoEditComponent;
}());
exports.VideoEditComponent = VideoEditComponent;
//# sourceMappingURL=video.edit.component.js.map