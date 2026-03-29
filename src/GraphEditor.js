import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

let id = 3;

function App() {
  const makeNodeLabel = (title, field) => (
    <div>
      <strong>{title || " "}</strong>
      {field ? <div>{field}</div> : null}
    </div>
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeTitle, setNodeTitle] = useState("");
  const [nodeField, setNodeField] = useState("");

  // When user clicks a node, load its current title/field into the inputs.
  useEffect(() => {
    if (!selectedNodeId) return;
    const selected = nodes.find((n) => n.id === selectedNodeId);
    if (!selected) return;
    setNodeTitle(selected.data?.title ?? "");
    setNodeField(selected.data?.field ?? "");
  }, [selectedNodeId]);

  // When inputs change, update the selected node live.
  useEffect(() => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== selectedNodeId) return n;
        return {
          ...n,
          data: {
            ...n.data,
            title: nodeTitle,
            field: nodeField,
            label: makeNodeLabel(nodeTitle, nodeField),
          },
        };
      })
    );
  }, [selectedNodeId, nodeTitle, nodeField, setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const addNode = () => {
    if (!nodeTitle.trim()) return;
    const newNode = {
      id: String(id++),
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        title: nodeTitle,
        field: nodeField,
        label: makeNodeLabel(nodeTitle, nodeField),
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId(node.id);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0b1220",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          top: 10,
          left: 10,
          background: "#222222", // dark slate glass
          color: "#e5e7eb",
          padding: 10,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minWidth: 260,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={nodeTitle}
            onChange={(e) => setNodeTitle(e.target.value)}
            placeholder="Node name (title)"
            style={{ flex: 1 }}
          />
          <input
            value={nodeField}
            onChange={(e) => setNodeField(e.target.value)}
            placeholder="Node field"
            style={{ flex: 1 }}
          />
        </div>

        <button onClick={addNode} style={{ marginTop: 4 }}>
          Add Node
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}   // ✅ FIX
        onEdgesChange={onEdgesChange}   // ✅ FIX
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background variant="dots" gap={24} size={1} color="#222222" />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;