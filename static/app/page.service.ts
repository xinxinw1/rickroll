import { Injectable } from '@angular/core';

let pages = {
  'carol-of-the-bells': {
    pretend: 'https://www.youtube.com/watch?v=WSUFzC6_fp8',
    redirect: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
};

@Injectable()
export class PageService {
  get(name: string) {
    return new Promise((resolve, reject) => {
      if (pages[name]) {
        resolve(pages[name]);
      } else {
        reject('Error: doesn\'t exist');
      }
    });
  }

  create(name: string, pretend: string, redirect: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (pages[name]) {
        reject('Error: already exists');
      } else {
        console.log('here');
        pages[name] = {
          pretend: pretend,
          redirect: redirect
        };
        resolve();
      }
    });
  }
}
