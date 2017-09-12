import {Injectable} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import "rxjs/add/operator/map";
import {Observable} from "rxjs/Observable";
import {Urls} from "../urls";

@Injectable()
export class VideoService {

  public url;
  public identity;
  public token;

  constructor(private _http: Http, private _urls: Urls){
    this.url = _urls.getMainUrl();
  }

  create(token, video) {
    let json = JSON.stringify(video);
    let params = "json=" + json + "&authorization=" + token;
    let headers = new Headers({'Content-Type' : 'application/x-www-form-urlencoded'});

    return this._http.post(this.url + "video/new", params, {headers: headers}).map(res => res.json());
  }

  update(token, video, id) {
    let json = JSON.stringify(video);
    let params = "json=" + json + "&authorization=" + token;
    let headers = new Headers({'Content-Type' : 'application/x-www-form-urlencoded'});

    return this._http.post(this.url + "video/edit/" + id, params, {headers: headers}).map(res => res.json());
  }

  getVideo(id) {
    return this._http.get(this.url + "video/detail/" + id).map(res => res.json());
  }

  getLatestVideos() {
    return this._http.get(this.url + "video/latest-videos").map(res => res.json());
  }

  getVideos(page= null) {
    if(page == null) {
      page = 1;
    }
    return this._http.get(this.url + "video/list?page=" + page).map(res => res.json());
  }

  search(search = null, page = null) {
    if(page == null) {
      page = 1;
    }

    let http: any;
    if(search == null) {
      http = this._http.get(this.url + "video/search").map(res => res.json());
    } else {
      http = this._http.get(this.url + "video/search/" + search + "?page=" + page).map(res => res.json());
    }

    return http;
  }

  getChannel(user, page = null) {
    if(page == null) {
      page = 1;
    }

    return this._http.get(this.url + "user/channel/" + user + "?page=" + page).map(res => res.json());

  }


}
