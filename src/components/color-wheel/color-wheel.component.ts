import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-wheel',
  standalone: true,
  imports: [],
  templateUrl: './color-wheel.component.html',
  styleUrl: './color-wheel.component.scss'
})
export class ColorWheelComponent {
// Gets a reference to the <canvas> element in the template using its template variable 'canvas'.
// 'static: true' means the reference is available in ngAfterViewInit (needed when not using structural directives).
// The '!' tells TypeScript that this will definitely be assigned (not null or undefined).
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() colorPicked = new EventEmitter<string>();
  
  //These are the private variables for drawing the color circle
  private ctx!: CanvasRenderingContext2D;
  private size = 300;

  rgbResult: string = '';
// Lifecycle hook called after the component's view (DOM) has been fully initialized.
// Sets the canvas size, retrieves its 2D rendering context, and draws the color wheel.
  ngAfterViewInit() {

    const canvas = this.canvasRef.nativeElement;

    // Set canvas dimensions to match the desired size.
    canvas.width = this.size;
    canvas.height = this.size;

    // Get the 2D drawing context used to render shapes and colors on the canvas.
    this.ctx = canvas.getContext('2d')!;

    // Draw the color wheel after the canvas is ready.
    this.drawColorWheel();
  }
  /**
 * Converts a color from HSV (Hue, Saturation, Value) to RGB (Red, Green, Blue) format.
  *
  * @param hue - The hue angle in degrees (0–360), representing the color type. 0° hue = red, 120° hue = green, 240° hue = blue
  * @param sat - Saturation (0–1), where 0 is grayscale and 1 is full color.
  * @param val - Value (brightness, 0–1), where 0 is black and 1 is full brightness.
  * @returns A tuple [R, G, B], each in the range 0–255.
  *
  * This function uses the standard HSV to RGB conversion algorithm:
  * - 'c' is chroma, the intensity of the color.
  * - 'x' is the intermediate value based on hue.
  * - 'm' is used to shift RGB values to match the brightness (val).
  * RGB is computed by determining the correct sector of the hue angle.
  * More informations here https://www.geeksforgeeks.org/utilities/hsv-to-rgb-converter/
  */
 hsvToRgb(hue: number, sat: number, val: number) : [number, number, number] {
  let c = val* sat;
  let x = c *(1-Math.abs((hue/60)%2 -1));
  let m = val - c;
  let r =0, g=0, b =0;

  if(hue <60) {
    [r,g,b] = [c,x,0];
  } else if (hue <120) {
    [r,g,b] = [x, c, 0];
  } else if (hue <180) {
    [r,g,b] = [0,c,x];
  } else if (hue <240) {
    [r,g,b] = [0, x,c]
  } else if (hue <300) {
    [r,g,b] = [x, 0, c]
  } else {
    [r,g,b] = [c, 0, x]
  }

  return [
    Math.round((r+m)*255),
    Math.round((g+m)*255),
    Math.round((b+m)*255)
  ]
 }

 drawColorWheel () {
  const radius = this.size/2;
  const image = this.ctx.createImageData(this.size, this.size);

  for (let y = -radius; y < radius; y ++) {
    for (let x = -radius; x < radius; x++) {
      const dx = x;
      const dy = y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      const angle = Math.atan2(dy, dx) + Math.PI;

      if(dist <=radius) {
        const hue = angle*180/ Math.PI;
        const saturation = dist/ radius;
        const rgb = this.hsvToRgb(hue, saturation, 1);
        const px = ((y+ radius)*this.size +(x+ radius))*4;
        image.data[px] = rgb[0];
        image.data[px + 1] = rgb[1];
        image.data[px + 2] = rgb[2];
        image.data[px + 3] = 255;
      }
    }
  }

  this.ctx.putImageData(image, 0,0)
 }
  
 // a function which retrieve the picked color on the wheel
 onClick(event: MouseEvent) {
  const canvas = this.canvasRef.nativeElement;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX -rect.left;
  const y = event.clientY -rect.top;

  const pixel = this.ctx.getImageData(x,y,1,1).data;
  const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  this.rgbResult = rgb;
  console.log('Selected color:', rgb);
  localStorage.setItem('currentColor', rgb)
  this.colorPicked.emit(rgb);
 }
}
