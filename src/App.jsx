import './App.css';
import { PrimeReactProvider } from 'primereact/api';
import { Button } from 'primereact/button';

function App() {

  return (
    <PrimeReactProvider>
      <div className="App">
        <h1>Welcome to My PrimeReact App</h1>
        <Button label="Click Me"/>
      </div>
    </PrimeReactProvider>
  );
}

export default App;
