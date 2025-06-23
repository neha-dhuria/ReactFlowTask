import React, { useCallback, useState, useRef, useEffect } from 'react';

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

const BlockA = ({ data }) => (
  <div
    onContextMenu={data.onContextMenu}
    style={{
      padding: 10,
      background: '#a0e8af',
      borderRadius: 5,
      textAlign: 'center',
      position: 'relative',
    }}
  >
    block A
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </div>
);


const BlockB = ({ data }) => (
  <div
    onContextMenu={data.onContextMenu}
    style={{
      padding: 10,
      background: '#f9e076',
      borderRadius: 5,
      textAlign: 'center',
      position: 'relative',
    }}
  >
    block B
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </div>
);


const nodeTypes = {
  blockA: BlockA,
  blockB: BlockB,
};

let id = 0;
const getId = () => `node_${id++}`;

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const [availableBlocks, setAvailableBlocks] = useState([]);


  const canvasRef = useRef(null); 

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance || !canvasRef.current) return;

      const bounds = canvasRef.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          onContextMenu: handleContextMenu,
        },
      };

      setNodes((prev) => [...prev, newNode]);
    },
    [reactFlowInstance]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
  async function fetchBlocks() {
    try {
      const response = await fetch('http://localhost:5000/api/blocks');
      const data = await response.json();
      setAvailableBlocks(data); 
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  }

  fetchBlocks();
}, []);
  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      
      <div style={{ width: 150, padding: 10, borderRight: '1px solid #ccc' }}>
  {availableBlocks.map((block) => (
    <div
      key={block.id}
      style={{
        background: block.color,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        cursor: 'grab',
        textAlign: 'center',
      }}
      draggable
      onDragStart={(event) =>
        event.dataTransfer.setData('application/reactflow', block.id)
      }
    >
      {block.label}
    </div>
  ))}
</div>


      
      <div
        ref={canvasRef} // ✅ Attach the canvas ref here
        style={{ flexGrow: 1, position: 'relative' }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={closeContextMenu}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          fitView
          nodeTypes={nodeTypes}
        />

        {contextMenu && (
          <div
            style={{
              position: 'absolute',
              top: contextMenu.y,
              left: contextMenu.x,
              background: '#fffbe7',
              padding: '8px 12px',
              boxShadow: '0 0 6px rgba(0,0,0,0.2)',
              borderRadius: 5,
              zIndex: 1000,
            }}
          >
            hello world
          </div>
        )}
      </div>
    </div>
  );
}

export default FlowCanvas;
