[![npm](https://img.shields.io/npm/v/react-live-store?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/react-live-store)

# react-live-store

*Shared data container for React apps with a mutable-like API*

A plain object stored in the React's `useContext()` hook produces a re-render only if the entire object value has changed, which requires extra effort of mutating the object to convey a single nested property change.

The `LiveStore` class introduced by this package makes an underlying object trigger an event whenever it's changed, and the `useLiveStore()` hook subscribes a React component to these changes in order to produce a re-render to update the component's content.

So, in order to make changes of an object stored in a React Context observable by other components, it's sufficient to replace the object with an instance of the `LiveStore` class and to read its value from the `useLiveStore()` hook.

## Example

```jsx
import {useContext} from 'react';
import {LiveStore, useLiveStore} from 'react-live-store';
import {createRoot} from 'react-dom/client';

const CounterContext = createContext();

const Display = () => {
    // The `useLiveStore()` hook subscribes this component to
    // changes in the store returned from the context.
    const state = useLiveStore(useContext(CounterContext));

    // Whenever any part of the live store value is updated,
    // the component runs a re-render to update its content
    // accordingly.
    return <span>{state.counter}</span>;
    // The response to changes is asynchronous and occurs once
    // per a set of sync value updates so as not to overwhelm
    // components with redundant notifications.
};

const PlusButton = () => {
    const state = useLiveStore(useContext(CounterContext));

    // Nested properties of a live store value being mutated
    // produce notifications for subscribed components to re-render
    // (which is not the case with plain objects).
    return <button onClick={() => state.counter++}>+</button>;
};

const App = () => <div><PlusButton/> <Display/></div>;

createRoot(document.querySelector('#app')).render(
    <CounterContext.Provider value={new LiveStore({counter: 42})}>
        <App/>
    </CounterContext.Provider>
);
```

A React app can have multiple live stores, whether in a single React Context or in separate Contexts.
