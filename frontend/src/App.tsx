import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello World!</h1>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} alt="React logo" />
      </a>
      <p className="count">Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default App;
