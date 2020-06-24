import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];
  showSpinner = false;
  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) { }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.books = [];
    this.store.select(getAllBooks).subscribe(books => {
      if (books) {
        this.showSpinner = false;
        this.books = books;
      }
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(clearSearch());
      this.showSpinner = true;
      // setTimeout(() => {
      //   this.showSpinner = false;
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
      // }, 500);
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  clearInput() {
    if (this.searchForm.value.term) {
      this.searchForm.get('term').setValue('');
    }
  }
}
