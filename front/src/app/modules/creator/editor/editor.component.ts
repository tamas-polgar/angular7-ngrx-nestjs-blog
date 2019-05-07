import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Checklist from '@editorjs/checklist';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { CategoryModel } from 'src/app/models/category.model';
import { categoriesSimpleSelector } from 'src/app/ngrx/selectors/category.selectors';

import { CreatorActionTypes, SendArticleAction } from '../state/creator.actions';

const NEW_NOTE_INIT = {
  time: Date.now(),
  blocks: [
    {
      type: 'paragraph',
      data: {
        text: 'New article here...',
      },
    },
  ],
  version: '2.12.4',
};

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  categories$: Observable<CategoryModel[]>;
  editor: EditorJS;
  articleForm: FormGroup;

  constructor(
    private readonly store: Store<any>,
    private readonly actions: Actions,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.setForm();
    this.categories$ = this.store.select(categoriesSimpleSelector);

    setTimeout(() => {
      this.editor =
        this.editor ||
        new EditorJS({
          onReady: () => this.formChanged(),
          onChange: () => this.formChanged(),
          holder: 'editor',
          autofocus: true,
          data: NEW_NOTE_INIT,
          tools: {
            header: Header,
            list: List,
            checklist: Checklist,
            quote: Quote,
            image: SimpleImage,
          },
        });
    }, 250);
  }

  setForm() {
    this.articleForm = this.fb.group({
      title: [null, [Validators.required]],
      categories: [[], [Validators.required]],
    });
  }

  formChanged() {}

  formFieldStatus(field: string) {
    return !this.articleForm.get(field).valid && this.articleForm.get(field).touched ? 'error' : 'null';
  }

  async save() {
    const ob = {
      title: this.articleForm.value.title,
      categoryIds: this.articleForm.value.categories,
      body: JSON.stringify(await this.editor.saver.save()),
    };
    this.store.dispatch(new SendArticleAction({ article: ob }));

    this.actions
      .pipe(
        ofType(CreatorActionTypes.sendArticleOK),
        first(),
        tap(action => {
          this.onBack();
        }),
      )
      .subscribe();
  }

  onBack() {
    this.router.navigate(['../'], {
      relativeTo: this.route,
    });
  }
}
