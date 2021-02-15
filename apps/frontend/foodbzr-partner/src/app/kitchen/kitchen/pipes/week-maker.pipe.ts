import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'weekMaker' })
export class weekMakerPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 1:
                return 'Sunday';
                break;

            case 2:
                return 'Monday';
                break;

            case 3:
                return 'Tuesday';
                break;

            case 4:
                return 'Wednesday';
                break;

            case 5:
                return 'Thursday';
                break;

            case 6:
                return 'Friday';
                break;
            case 7:
                return 'Saturday';
                break;
        }
    }
}
