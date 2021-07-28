import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.sass'],
})
export class PostCreateComponent implements OnInit {
  enteredContent: string = '';
  enteredTitle: string = '';
  private mode = 'create';
  private id: any;
  public post: Post = {
    id: '',
    title: '',
    content: '',
  };
  isLoading: boolean = false;
  form: FormGroup;
  imagePreview: any = '';

  constructor(private postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.isLoading = true;
        this.postService.getPost(this.id).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          });
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.enteredContent = this.form.value.content;
      this.enteredTitle = this.form.value.title;
      const post: Post = {
        id: null,
        title: this.enteredTitle,
        content: this.enteredContent,
      };
      this.postService.addPost(post);
    } else {
      this.enteredContent = this.form.value.content;
      this.enteredTitle = this.form.value.title;
      this.postService.updatePost(
        this.post.id,
        this.form.value.title,
        this.form.value.content
      );
    }

    this.form.reset();
  }
}
