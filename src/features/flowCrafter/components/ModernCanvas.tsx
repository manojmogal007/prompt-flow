import React, { useRef, useCallback } from 'react';
import { ReactFlow, addEdge, useNodesState, useEdgesState, Controls, useReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Handle, useNodeId, useReactFlow as useReactFlowHook } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Grid3X3,
  Layers,
  GitBranch,
  Play,
  Pause,
  Settings,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import { type BackgroundVariant } from '@xyflow/react';
import { Cursor } from './Cursor';

interface ModernCanvasProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onNodeClick: (event: React.MouseEvent, node: any) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerLeave: () => void;
  onCursorMove?: (x: number, y: number) => void;
  nodeTypes: any;
  collaborators: any[];
}

export const ModernCanvas: React.FC<ModernCanvasProps> = ({
  nodes = [],
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDrop,
  onDragOver,
  onNodeClick,
  onPointerMove,
  onPointerLeave,
  onCursorMove,
  nodeTypes,
  collaborators = [],
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [showGrid, setShowGrid] = React.useState(true);
  const [showMinimap, setShowMinimap] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleZoomIn = useCallback(() => {
    // Zoom in logic
  }, []);

  const handleZoomOut = useCallback(() => {
    // Zoom out logic
  }, []);

  const handleFitView = useCallback(() => {
    // Fit view logic
  }, []);

  const handleReset = useCallback(() => {
    // Reset view logic
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  console.log('nodes', nodes);
  return (
    <div
      ref={reactFlowWrapper}
      onPointerMove={(e) => {
        if (reactFlowWrapper.current && onCursorMove) {
          const { left, top } = reactFlowWrapper.current.getBoundingClientRect();
          onCursorMove(Math.round(e.clientX - left), Math.round(e.clientY - top));
        }
        onPointerMove(e);
      }}
      onPointerLeave={(e) => {
        // Only clear cursor if actually leaving the canvas container
        // Check if the related target is outside this element
        if (!reactFlowWrapper.current?.contains(e.relatedTarget as Node)) {
          onPointerLeave();
        }
      }}
      className={`relative w-full h-full bg-gradient-to-br from-slate-50 to-white dark:from-dark-900 dark:to-dark-800 ${isFullscreen ? 'fixed inset-0 z-50' : ''
        }`}
    >
      {/* Canvas Header */}
      <div className='absolute top-4 left-4 right-4 z-10 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border border-slate-200 dark:border-dark-700 rounded-lg px-3 py-2 shadow-sm'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-sm font-medium text-slate-700 dark:text-dark-200'>Canvas Ready</span>
            </div>
          </div>

          {collaborators.length > 0 && (
            <div className='bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border border-slate-200 dark:border-dark-700 rounded-lg px-3 py-2 shadow-sm'>
              <div className='flex items-center space-x-2'>
                <div className='flex -space-x-2'>
                  {collaborators.slice(0, 3).map((collaborator, index) => (
                    <div
                      key={index}
                      className='w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium'
                    >
                      {collaborator?.presence?.userName
                        ?.split(' ')
                        ?.map((word) => word.charAt(0))
                        .join('') || 'U'}
                    </div>
                  ))}
                  {collaborators.length > 3 && (
                    <div className='w-6 h-6 bg-slate-100 rounded-full border-2 border-white flex items-center justify-center text-xs text-slate-600 font-medium'>
                      +{collaborators.length - 3}
                    </div>
                  )}
                </div>
                <span className='text-sm text-slate-600 dark:text-dark-300'>{collaborators?.length} online</span>
              </div>
            </div>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          {/* View Controls */}
          <div className='bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border border-slate-200 dark:border-dark-700 rounded-lg shadow-sm'>
            <div className='flex items-center divide-x divide-slate-200 dark:divide-dark-700'>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 transition-colors ${showGrid
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-600 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-700'
                  }`}
                title='Toggle Grid'
              >
                <Grid3X3 className='w-4 h-4' />
              </button>

              <button
                onClick={() => setShowMinimap(!showMinimap)}
                className={`p-2 transition-colors ${showMinimap
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-slate-600 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-700'
                  }`}
                title='Toggle Minimap'
              >
                <Layers className='w-4 h-4' />
              </button>

              <button
                onClick={toggleFullscreen}
                className='p-2 text-slate-600 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors'
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}
              </button>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className='bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border border-slate-200 dark:border-dark-700 rounded-lg shadow-sm'>
            <div className='flex items-center divide-x divide-slate-200 dark:divide-dark-700'>
              <button
                onClick={handleZoomOut}
                className='p-2 text-slate-600 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors'
                title='Zoom Out'
              >
                <ZoomOut className='w-4 h-4' />
              </button>

              <button
                onClick={handleFitView}
                className='px-3 py-2 text-sm font-medium text-slate-600 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors'
                title='Fit View'
              >
                Fit
              </button>

              <button
                onClick={handleZoomIn}
                className='p-2 text-slate-600 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors'
                title='Zoom In'
              >
                <ZoomIn className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className='p-2 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm border border-slate-200 dark:border-dark-700 rounded-lg text-slate-600 dark:text-dark-400 hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors shadow-sm'
            title='Reset View'
          >
            <RotateCcw className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className='w-full h-full' ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes || []}
          edges={edges || []}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          className='bg-transparent'
        >
          <Background
            color={showGrid ? '#e2e8f0' : 'transparent'}
            gap={20}
            size={1}
            variant={(showGrid ? 'dots' : 'lines') as BackgroundVariant}
          />

          <Controls
            className='!bg-white/90 dark:!bg-dark-800/90 !backdrop-blur-sm !border !border-slate-200 dark:!border-dark-700 !rounded-lg !shadow-sm'
            position='bottom-left'
            showZoom={false}
            showFitView={false}
            showInteractive={false}
          />
        </ReactFlow>
      </div>

      {/* Canvas Footer */}
      {/* <div className='absolute bottom-4 left-4 right-4 z-10'>
        <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-slate-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span className='text-sm text-slate-600 dark:text-gray-300'>{nodes.length} nodes</span>
              </div>

              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                <span className='text-sm text-slate-600 dark:text-gray-300'>{edges.length} connections</span>
              </div>

              <div className='flex items-center space-x-2'>
                <GitBranch className='w-4 h-4 text-slate-500' />
                <span className='text-sm text-slate-600 dark:text-gray-300'>Workflow ready</span>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <button className='flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                <Play className='w-4 h-4' />
                <span className='text-sm font-medium'>Run Workflow</span>
              </button>

              <button className='p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors'>
                <Settings className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Welcome State (when no nodes) */}
      {nodes.length === 0 && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='text-center'>
            <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center'>
              <Zap className='w-12 h-12 text-white' />
            </div>
            <h3 className='text-xl font-semibold text-slate-800 dark:text-dark-100 mb-2'>Start Building Your Workflow</h3>
            <p className='text-slate-500 dark:text-dark-400 max-w-md'>
              Drag components from the sidebar to begin creating your workflow. Connect nodes to define the flow of your process.
            </p>
          </div>
        </div>
      )}

      {/* Collaborator Cursors */}
      {(() => {
        console.log('🎨 Rendering cursors for', collaborators.length, 'collaborators');

        const getColorForUser = (connectionId: number) => {
          const colors = ['#D53F8C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
          return colors[connectionId % colors.length];
        };

        return collaborators.map((other) => {
          console.log('👤 Collaborator:', other.connectionId, 'has cursor:', other.presence?.cursor, 'info:', other.info);
          if (!other.presence?.cursor) {
            console.log('❌ No cursor for', other.connectionId);
            return null;
          }

          const userName = other.presence?.userName || `User ${other.connectionId}`;
          // const userName =
          //   other?.presence?.userName
          //     ?.split(' ')
          //     ?.map((word) => word.charAt(0))
          //     .join('') || `User ${other.connectionId}`;
          const userColor = getColorForUser(other.connectionId);

          console.log('✅ Rendering cursor for', other.connectionId, 'name:', userName);
          return (
            <Cursor key={other.connectionId} x={other.presence.cursor.x} y={other.presence.cursor.y} name={userName} color={userColor} />
          );
        });
      })()}
    </div>
  );
};
