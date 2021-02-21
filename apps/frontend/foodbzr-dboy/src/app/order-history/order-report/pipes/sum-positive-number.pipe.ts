import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sumPositiveNumber' })
export class SumPositiveNumberPipe implements PipeTransform {
    constructor() {}

    transform(value: number[], exponent?: number) {
        if (value.length !== 0) {
            return value.reduce((prev, curr) => {
                return prev + curr;
            });
        } else {
            return 0;
        }
    }
}
