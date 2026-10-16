import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject } from '@angular/core';
import { CONTACT, CONTACT_CARDS } from './contact.config';
import { CONTACT_EFFECTS } from './contact-effects';

@Component({
  selector: 'app-contact',
  imports: [NgOptimizedImage],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly contact = CONTACT;
  protected readonly cards = CONTACT_CARDS;
  private readonly effects = inject(CONTACT_EFFECTS);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const scope = this.element.nativeElement;
      const cleanup = this.effects.createMotionContext(scope, () =>
        this.effects.animateContact(scope),
      );
      this.destroyRef.onDestroy(cleanup);
    });
  }
}
