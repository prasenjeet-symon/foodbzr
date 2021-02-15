import * as moment from 'moment';

export class DateMaker implements IterableIterator<string> {
    protected start_moment_date!: moment.Moment;
    protected end_moment_date!: moment.Moment;
    protected current_date!: moment.Moment;

    constructor(protected start_date: string, end_date: string) {
        this.start_moment_date = moment(new Date(start_date));
        this.end_moment_date = moment(new Date(end_date));
    }

    public next(): IteratorResult<string> {
        if (this.current_date) {
            this.current_date = this.current_date.add('1', 'day');
        } else {
            this.current_date = this.start_moment_date;
        }

        if (this.current_date > this.end_moment_date) {
            return {
                done: true,
                value: '',
            };
        } else {
            return {
                done: false,
                value: this.current_date.format('YYYY-MM-DD'),
            };
        }
    }

    [Symbol.iterator](): IterableIterator<string> {
        return this;
    }
}
