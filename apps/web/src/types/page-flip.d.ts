/** The parts of StPageFlip (page-flip 2.0.7, MIT) used by the textbook reader; it ships no types. */
declare module 'page-flip' {
  export interface FlipSetting {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    startPage?: number;
    showCover?: boolean;
    usePortrait?: boolean;
    autoSize?: boolean;
    drawShadow?: boolean;
    maxShadowOpacity?: number;
    flippingTime?: number;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
    useMouseEvents?: boolean;
    clickEventForward?: boolean;
    startZIndex?: number;
  }

  export interface WidgetEvent<T> {
    data: T;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, setting: FlipSetting);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    updateFromHtml(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    on(event: 'flip', cb: (e: WidgetEvent<number>) => void): PageFlip;
    on(
      event: 'changeOrientation',
      cb: (e: WidgetEvent<'portrait' | 'landscape'>) => void,
    ): PageFlip;
    on(
      event: 'init' | 'update',
      cb: (e: WidgetEvent<{ page: number; mode: string }>) => void,
    ): PageFlip;
    on(event: 'changeState', cb: (e: WidgetEvent<string>) => void): PageFlip;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(page: number, corner?: 'top' | 'bottom'): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): 'portrait' | 'landscape';
    update(): void;
    destroy(): void;
  }
}
