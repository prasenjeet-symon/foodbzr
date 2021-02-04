import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { DaoLife } from '@sculify/node-room-client';

export class LiveData<T> {
    public uuid: string;
    private BSubject: Subject<T> = new Subject();

    constructor() {
        this.uuid = uuidv4();
    }

    public observe = (ctx?: any) => {
        if (ctx && ctx instanceof DaoLife) {
            (ctx as DaoLife).push_live_data(this);
        }
        return this.BSubject.asObservable();
    };

    public kill() {
        this.BSubject.complete();
        this.BSubject.unsubscribe();
        return true;
    }

    public push(data: T, uuid: string) {
        if (uuid === this.uuid) {
            this.BSubject.next(data);
            return true;
        } else {
            return false;
        }
    }

    public pushError(err: Error, uuid: string) {
        console.error(err);
        if (uuid === this.uuid) {
            this.BSubject.error(err);
            return true;
        } else {
            return false;
        }
    }

    public is_alive() {
        return true;
    }
}
