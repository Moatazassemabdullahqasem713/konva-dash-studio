import React from "react";
import CanvasEditor from "./components/CanvasEditor";
import Toolbar from "./components/Toolbar";

/* /* الواجهة الأساسية تجمع اللوحة والشريط الجانبي */ */
export default function App() {
  return (
    <div className="app">
      <div style={{flex:1}} className="canvas-area">
        <CanvasEditor />
      </div>
      <div className="sidebar">
        <Toolbar />
      </div>
    </div>
  );
}
