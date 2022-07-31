import {useState, useEffect} from 'react';
import {Observable, Observer, ObserverOptions} from 'object-observer';

// the resolved type of what would be `ReturnType<typeof Observable.from<T>>`
export type LiveObject<T extends object> = Observable & T;

export type UpdateHandler = Observer;
export type UpdateHandlerOptions = ObserverOptions;

const isObject = <T = unknown>(value: T): value is NonNullable<T> =>
    value !== null && typeof value === 'object';

export class LiveStore<T extends object = {}> {
    value: LiveObject<T>;
    constructor(value: T) {
        if (!isObject(value))
            throw new Error('LiveStore value should be an object');
        this.value = Observable.from(value, {async: true});
    }
    observe(callback: UpdateHandler, options?: UpdateHandlerOptions) {
        Observable.observe(this.value, callback, typeof options === 'string' ? {pathsFrom: options} : options);
    }
    unobserve() {
        Observable.unobserve(this.value);
    }
    valueOf() {
        return this.value.valueOf();
    }
    toString() {
        return this.value.toString();
    }
}

export function useLiveStore<T extends object>(
    liveStore: LiveStore<T>,
    options?: UpdateHandlerOptions,
): LiveObject<T> {
    let [, setRevision] = useState(0);

    if (!(liveStore instanceof LiveStore))
        throw new Error('The first argument should be an instance of LiveStore');

    useEffect(() => {
        liveStore.observe(() => {
            setRevision(revision => revision === Number.MAX_SAFE_INTEGER ? 0 : revision + 1);
        }, options);

        return () => {
            liveStore.unobserve();
        };
    }, [liveStore, options]);

    return liveStore.value;
}
