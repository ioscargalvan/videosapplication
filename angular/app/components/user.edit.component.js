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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var login_service_1 = require("../services/login.service");
var user_1 = require('../model/user');
var UserEditComponent = (function () {
    function UserEditComponent(_loginService, _route, _router) {
        this._loginService = _loginService;
        this._route = _route;
        this._router = _router;
        this.titulo = "Actualizar mis datos";
    }
    UserEditComponent.prototype.ngOnInit = function () {
        var identity = this._loginService.getIdentity();
        if (identity == null) {
            this._router.navigate(['/index']);
        }
        else {
            this.user = new user_1.User(identity.sub, identity.role, identity.name, identity.surname, identity.email, identity.password, "null");
        }
    };
    UserEditComponent.prototype.onSubmit = function () {
        var _this = this;
        console.log(this.user);
        this._loginService.updateUser(this.user).subscribe(function (response) {
            console.log(response);
            _this.status = response.status;
            if (_this.status != "success") {
                _this.status = "error";
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
                alert("Error en la petición.");
            }
        });
    };
    UserEditComponent = __decorate([
        core_1.Component({
            selector: 'user-edit',
            templateUrl: 'app/view/user.edit.html',
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, router_1.ActivatedRoute, router_1.Router])
    ], UserEditComponent);
    return UserEditComponent;
}());
exports.UserEditComponent = UserEditComponent;
//# sourceMappingURL=user.edit.component.js.map