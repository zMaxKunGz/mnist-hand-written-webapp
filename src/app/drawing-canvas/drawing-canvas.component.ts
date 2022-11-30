import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild,ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import {fromEvent, Observable, Subject} from 'rxjs';
import { map, tap, switchMap, takeUntil, finalize} from 'rxjs/operators';
import { IPredictionResponse } from '../model/prediction-response';

@Component({
  selector: 'app-drawing-canvas',
  template: `<canvas #canvas [style.border]="'1px solid black'"width="200" height="200"></canvas>`,
})

export class DrawingCanvasComponent {

  @Input() buttonEvents: Observable<string>;
  @Output() predictedEvents: EventEmitter<IPredictionResponse> = new EventEmitter<IPredictionResponse>();
  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>; 
  ctx: CanvasRenderingContext2D;

  classifyUrl = "http://127.0.0.1:5000/classify";

  constructor(private http: HttpClient) { }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    const mouseDownStream = fromEvent(this.canvas.nativeElement, 'mousedown');
    const mouseMoveStream = fromEvent(this.canvas.nativeElement, 'mousemove');
    const mouseUpStream = fromEvent(window, 'mouseup');
    mouseDownStream.pipe(
      tap((event: MouseEvent) => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 10;
        this.ctx.lineJoin = 'round';
        this.ctx.moveTo(event.offsetX, event.offsetY);
      }),
      switchMap(() => mouseMoveStream.pipe(
        tap((event: MouseEvent) => {
          this.ctx.lineTo(event.offsetX, event.offsetY);
          this.ctx.stroke();
        }),
        takeUntil(mouseUpStream),
        finalize(() => {
          this.ctx.closePath();
        })
      ))
    ).subscribe();

    this.buttonEvents.subscribe((type: string) => {
      if (type == "submit") {
        let imageData = this.ctx.getImageData(0, 0, 200, 200);
        let normalizeImg = this.transformImage(imageData);
        this.http.put(this.classifyUrl, {'data' : normalizeImg}).subscribe(
          res => {
            this.predictedEvents.emit(res as IPredictionResponse);
          }
        );
      } else {
        this.ctx.clearRect(0, 0, 200, 200);
      }
    })
  }

  transformImage(image: ImageData) {
    let tempData: number[] = [];
    for(let i = 4; i <= image.data.length; i += 4) {
      tempData[(i/4)-1] = image.data[i-1] / 255;
    }
    let reshaped = [];
    while(tempData.length) reshaped.push(tempData.splice(0,200));
    return reshaped;
  }
}
