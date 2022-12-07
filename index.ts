import {useState, useEffect} from 'react';
import {Observable, Observer, ObserverOptions} from 'object-observer';

// the resolved type of what would be `ReturnType<typeof Observable.from<T>>`
export type LiveObject<T extends object> = Observable & T;

export type UpdateHandler = Observer;
export type UpdateHandlerOptions = ObserverOptions | string;

export class Store<T extends object = {}> {
    value: LiveObject<T>;
    constructor(value: T) {
        if (value === null || typeof value !== 'object')
            throw new Error('Store value should be an object');
        this.value = Observable.from(value, {async: true});
    }
    observe(callback: UpdateHandler, options?: UpdateHandlerOptions) {
        Observable.observe(this.value, callback, typeof options === 'string' ? {pathsFrom: options} : options);
    }
    unobserve() {
        Observable.unobserve(this.value);
    }
}

export function useStore<T extends object>(
    store: Store<T>,
    options?: UpdateHandlerOptions | null,
): LiveObject<T> {
    let [, setRevision] = useState(0);

    if (!(store instanceof Store))
        throw new Error('The first argument should be an instance of Store');

    useEffect(() => {
        if (options === null)
            return;

        store.observe(() => {
            setRevision(Math.random());
        }, options);

        return () => {
            store.unobserve();
        };
    }, [store, options]);

    return store.value;
}
