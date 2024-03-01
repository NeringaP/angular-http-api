import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { catchError, map, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class PostsService {

    constructor(private http: HttpClient) {}

    createAndStorePost(postTitle: string, postContent: string) {
        const postData: Post = {title: postTitle, content: postContent}
        return this.http
            .post<{ name: string }>(
                'https://angular-http-requests-faf9a-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
                postData,
                {
                    observe: 'body'
                }
            );
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key');
       return this.http
            .get<{ [key: string]: Post}>(
                'https://angular-http-requests-faf9a-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
            {
                headers: new HttpHeaders({ "Custom-Header": 'Hello'}),
                params: searchParams
            })
            .pipe(
                map(responseData => {
                    if(responseData !== null && responseData !== undefined) {
                        return Object.keys(responseData).map(key => ({...responseData[key], id: key}));
                    } else {
                        return [];
                    }
                    
                }),
                catchError(errorResponse => {
                    //log it or send to another server to do smth with it
                    console.error('Error fetching posts:', errorResponse)
                    return throwError(errorResponse);
                })

            );
    }

    deletePosts() {
        return this.http
            .delete(
                'https://angular-http-requests-faf9a-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
                {
                    observe: 'events',
                    responseType: 'json'
                }
            ).pipe(
                tap(event => {
                    console.log(event);
                    if(event.type === HttpEventType.Sent) {
                        // ...
                    }
                    if(event.type === HttpEventType.Response) {
                        console.log(event.body);
                    }
                })
            );
    }

}