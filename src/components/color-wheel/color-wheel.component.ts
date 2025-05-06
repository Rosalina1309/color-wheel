import { Component } from '@angular/core';

@Component({
  selector: 'app-color-wheel',
  standalone: true,
  imports: [],
  templateUrl: './color-wheel.component.html',
  styleUrl: './color-wheel.component.scss'
})
export class ColorWheelComponent {

  /**
 * Converts a color from HSV (Hue, Saturation, Value) to RGB (Red, Green, Blue) format.
  *
  * @param hue - The hue angle in degrees (0–360), representing the color type.
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

  
}
