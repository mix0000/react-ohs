##  Introduction
React OHS is simple hook&event based, mutable state manager for react.

-   Event based like **Effector**.
-   Mutable and magic like **MobX**.
-   Easy to use like **VueX**.

## Installation

    npm i -D react-ohs
    
## Why React Ohs?

-   **No need for connectors**  - You dont need to providers, mutliple functions or connectors just use `useOhs` hook and your component will reactive!
-   **Fully mutable** - No need to return everytime new state, just do whatever you want :)
-   **Async/await**  - Use async function for mutations and see the magic.
-   **Acces to store from everywhere**  - You can access to store from everywhere with `useOhs` hook. After you mutate the state all components which uses that store will re-render.

## Usage
**Store file:** 

```javascript
// Your whole store it's a just clear object.
export const store = {
  state: {
    counter: 0,
    todos: []
  },
  mutations: {
    // Every mutation gets current state.
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    // You can pass payload to your mutations.
    addNum(state, payload) { 
      state.counter += payload;
		    
      // You can prevent rerender by returning false.   
      return false;
    },
    async getTodos(state) {  
      const res = await fetch("https://jsonplaceholder.typicode.com/todos");  
      state.todos = await res.json();
    },
  }, 
}; 
```


**React component:** 

```javascript
// Import your hook. 
import { useOhs } from "react-ohs";
// Import your store object. 
import { store } from "./store";

function App() {
  // Pass to hook your store and it will return 
  // clear state object and modified mutations.
  const { state, mutations } = useOhs(store);  
  
  return (
    <div className="App">
      // Use your state data.
      <span>{state.counter}</span>  
      <br /> 
      // Now you can call your mutations.
      <button onClick={mutations.increment}>Increment</button>
      <button onClick={mutations.decrement}>Decrement</button>
      // Other components
      <AddFive />
      <Todos />
    </div>
  );
}
```

**Pass payload:** 
```javascript
import { useOhs } from "react-ohs";
import { store } from "./store";

export const AddFive = () => {  
  // You can acces to your store from everywhere in your app!
  const { mutations } = useOhs(store);
  
  // Just push the payload and wait for magic :)  
  return <button onClick={() => mutations.addNum(5)}>Add Five</button>;  
};
```

**Async mutations:**
```javascript
import { useOhs } from "react-ohs";
import { store } from "./store";

export const Todos = () => {  
  const { state, mutations } = useOhs(store);  
  
  useEffect(() => {
    // Call your async function and it will rerender your component when data is ready.  
    mutations.getTodos();
  }, [mutations]);
  
  return <span>{JSON.stringify(state.todos)}</span>;  
};
```

## Online Playground
You can try `react-ohs` in [CodeSandbox](https://codesandbox.io/s/stoic-tereshkova-yylbp?file=/src/components/Todos.jsx).
