import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { pipe, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: any[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any[] }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((postData) => {
        this.posts = postData;
        this.postsUpdated.next([...this.posts]);
      });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
    // return { ...this.posts.find((p) => p.id === id) };
  }
  addPost(sendedPost: Post) {
    this.http
      .post<{ message: string; id: string }>(
        'http://localhost:3000/api/posts',
        sendedPost
      )
      .subscribe((res) => {
        const id = res.id;
        sendedPost.id = id;
        this.posts.push(sendedPost);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, sendedTitle: string, sendedContent: string) {
    const post: Post = {
      id: id,
      title: sendedTitle,
      content: sendedContent,
    };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + id)
      .subscribe((res) => {
        const updatedPosts = this.posts.filter((post) => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
