import './App.css';
import { InputsPanel } from './components/InputsPanel';
import { MatrixTable } from './components/MatrixTable';
import { MatrixProvider } from './context';

function App() {
  return (
    <MatrixProvider>
      <div style={{ padding: 16 }}>
        <h1>Matrix Table App</h1>
        <InputsPanel />
        <MatrixTable />
      </div>
    </MatrixProvider>
  );
}

export default App;

