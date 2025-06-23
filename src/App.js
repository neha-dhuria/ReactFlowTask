import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import FlowCanvas from './components/FlowCanvas';

function App() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}

export default App;
