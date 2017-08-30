"use strict";
var router_1 = require('@angular/router');
var login_component_1 = require('./components/login.component');
var register_component_1 = require('./components/register.component');
var default_component_1 = require('./components/default.component');
var user_edit_component_1 = require('./components/user.edit.component');
exports.routes = [
    { path: '', redirectTo: '/index', terminal: true },
    { path: 'index', component: default_component_1.DefaultComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'login/:id', component: login_component_1.LoginComponent },
    { path: 'register', component: register_component_1.RegisterComponent },
    { path: 'user-edit', component: user_edit_component_1.UserEditComponent }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(exports.routes)
];
//# sourceMappingURL=app.routes.js.map