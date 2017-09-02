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
var VideoNewComponent = (function () {
    function VideoNewComponent(_uploadService, _loginService, _videoService, _route, _router) {
        this._uploadService = _uploadService;
        this._loginService = _loginService;
        this._videoService = _videoService;
        this._route = _route;
        this._router = _router;
        this.titulo = "Crear un nuevo video";
        this.uploadedImage = false;
    }
    VideoNewComponent.prototype.ngOnInit = function () {
        this.video = new video_1.Video(1, "", "", "public", "null", "null", null, null);
    };
    VideoNewComponent.prototype.callVideoStatus = function (value) {
        this.video.status = value;
    };
    VideoNewComponent.prototype.onSubmit = function () {
        var _this = this;
        var token = this._loginService.getToken();
        this._videoService.create(token, this.video).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != 'success') {
                _this.status = "error";
            }
            else {
                _this.video = response.data;
                console.log(_this.video);
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
            }
        });
    };
    VideoNewComponent.prototype.fileChangeEventImage = function (fileInput) {
        var _this = this;
        this.filesToUpload = fileInput.target.files;
        var token = this._loginService.getToken();
        var url = "http://localhost/full_stack/symfony/web/app_dev.php/video/upload-image/" + this.video.id;
        this._uploadService.makeFileRequest(token, url, ['image'], this.filesToUpload).then(function (result) {
            _this.resultUpload = result;
            console.log(_this.resultUpload);
        }, function (error) {
            console.log(error);
        });
    };
    VideoNewComponent.prototype.nextUploadVideo = function () {
        this.uploadedImage = true;
    };
    VideoNewComponent.prototype.fileChangeEventVideo = function (fileInput) {
        var _this = this;
        this.filesToUpload = fileInput.target.files;
        var token = this._loginService.getToken();
        var url = "http://localhost/full_stack/symfony/web/app_dev.php/video/upload-video/" + this.video.id;
        this._uploadService.makeFileRequest(token, url, ['video'], this.filesToUpload).then(function (result) {
            _this.resultUpload = result;
            console.log(_this.resultUpload);
        }, function (error) {
            console.log(error);
        });
    };
    VideoNewComponent.prototype.redirectToVideo = function () {
        this._router.navigate(['/video', this.video.id]);
    };
    VideoNewComponent = __decorate([
        core_1.Component({
            selector: "video-new",
            templateUrl: ("app/view/video.new.html"),
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [upload_service_1.UploadService, login_service_1.LoginService, video_service_1.VideoService]
        }), 
        __metadata('design:paramtypes', [upload_service_1.UploadService, login_service_1.LoginService, video_service_1.VideoService, router_1.ActivatedRoute, router_1.Router])
    ], VideoNewComponent);
    return VideoNewComponent;
}());
exports.VideoNewComponent = VideoNewComponent;
//# sourceMappingURL=video.new.component.js.map