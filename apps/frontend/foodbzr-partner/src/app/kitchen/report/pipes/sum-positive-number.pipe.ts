import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sumPositiveNumber' })
export class SumPositiveNumberPipe implements PipeTransform {
    constructor() {}

    transform(value: number[], exponent?: number) {
        if (value.length !== 0) {
            const val = value.reduce((prev, curr) => {
                return prev + curr;
            });
            return +val.toFixed(2);
        } else {
            return 0;
        }
    }
}
