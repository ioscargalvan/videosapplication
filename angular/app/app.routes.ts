import {
  provideRouter, RouterConfig
} from '@angular/router';

import {LoginComponent} from './components/login.component';
import {RegisterComponent} from './components/register.component';
import {DefaultComponent} from './components/default.component';
import {UserEditComponent} from './components/user.edit.component';
import {VideoNewComponent} from "./components/video.new.component";
import {VideoDetailComponent} from "./components/video.detail.component";
import {VideoEditComponent} from "./components/video.edit.component";
import {SearchComponent} from "./components/search.component";

export const routes: RouterConfig = [
  {path: '', redirectTo: '/index', terminal: true},
  {path: 'index', component: DefaultComponent},
  {path: 'index/:page', component: DefaultComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login/:id', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user-edit', component: UserEditComponent},
  {path: 'create-video', component: VideoNewComponent},
  {path: 'video/:id', component: VideoDetailComponent},
  {path: 'edit-video/:id', component: VideoEditComponent},
  {path: 'search', component: SearchComponent},
  {path: 'search/:search', component: SearchComponent},
  {path: 'search/:search/:page', component: SearchComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
