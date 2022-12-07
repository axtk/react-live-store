import {useState, useEffect} from 'react';
import {Observable, Observer, ObserverOptions} from 'object-observer';

// the resolved type of what would be `ReturnType<typeof Observable.from<T>>`
export type LiveObject<T extends object> = Observable & T;

export type UpdateHandler = Observer;
export type UpdateHandlerOptions = ObserverOptions | string;

export class Store<T extends object = {}> {
    state: LiveObject<T>;
    constructor(state: T) {
        if (state === null || typeof state !== 'object')
            throw new Error('Store value should be an object');
        this.state = Observable.from(state, {async: true});
    }
    observe(callback: UpdateHandler, options?: UpdateHandlerOptions) {
        Observable.observe(this.state, callback, typeof options === 'string' ? {pathsFrom: options} : options);
    }
    unobserve() {
        Observable.unobserve(this.state);
    }
}

export function useStore<T extends object>(
    store: Store<T>,
    /**
     * Passing `null` or `false` will turn off the subscription to store changes.
     * Passing a string key of a nested object in the store state will result in
     * a subscription to changes in that object.
     */
    options?: UpdateHandlerOptions | null | false,
): LiveObject<T> {
    let [, setRevision] = useState(0);

    if (!(store instanceof Store))
        throw new Error('The first argument should be an instance of Store');

    useEffect(() => {
        if (options === null || options === false)
            return;

        store.observe(() => {
            setRevision(Math.random());
        }, options);

        return () => {
            store.unobserve();
        };
    }, [store, options]);

    return store.state;
}
