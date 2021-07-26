import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.sass'],
})
export class PostCreateComponent implements OnInit {
  newPost: string = '';
  constructor() {}

  ngOnInit(): void {}
  onAddPost(postInput: any) {
    this.newPost = postInput.value;
  }
}
