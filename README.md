[![npm](https://img.shields.io/npm/v/react-live-store?labelColor=royalblue&color=royalblue&style=flat-square)](https://www.npmjs.com/package/react-live-store)

# react-live-store

*Shared data container for React apps with a mutable-like API*

A plain object stored in the React's `useContext()` hook produces a re-render only if the entire object value has changed, which requires extra effort of mutating the object to convey a single nested property change.

The `Store` class introduced by this package makes an object capable of triggering an event whenever it's changed, and the `useStore()` hook subscribes a React component to the changes in a store.

## Example

```jsx
import {createContext, useContext} from 'react';
import {Store, useStore} from 'react-live-store';
import {createRoot} from 'react-dom/client';

const AppContext = createContext();

const Display = () => {
    const state = useStore(useContext(AppContext));

    return <span>{state.counter}</span>;
};

const PlusButton = () => {
    const state = useStore(useContext(AppContext));

    // The mutation of the store state is visible to
    // components subscribed to this store
    return <button onClick={() => state.counter++}>+</button>;
};

const App = () => <div><PlusButton/> <Display/></div>;

createRoot(document.querySelector('#app')).render(
    <AppContext.Provider value={new Store({counter: 42})}>
        <App/>
    </AppContext.Provider>
);
```

By passing a string key of a nested object in the state as the second parameter of the `useStore()` hook it is possible to subscribe to changes in this particular part of the store. Passing `null` or `false` as the second parameter will turn off the subscription to store changes altogether.

A React app can have multiple stores, whether in a single React Context or in separate Contexts.
