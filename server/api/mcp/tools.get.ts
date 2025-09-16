export default defineEventHandler(async () => {
  // Return available MCP tools for the drawing application
  return {
    tools: [
      {
        name: 'create_drawing',
        description: 'Create a new drawing with specified parameters',
        category: 'drawing',
        parameters: {
          title: { type: 'string', required: true, description: 'Title of the drawing' },
          width: { type: 'number', required: false, default: 800, description: 'Canvas width in pixels' },
          height: { type: 'number', required: false, default: 600, description: 'Canvas height in pixels' },
          backgroundColor: { type: 'string', required: false, default: '#ffffff', description: 'Background color in hex format' },
        },
      },
      {
        name: 'save_drawing',
        description: 'Save drawing data to storage',
        category: 'storage',
        parameters: {
          drawingId: { type: 'string', required: true, description: 'Unique identifier for the drawing' },
          drawingData: { type: 'string', required: true, description: 'Base64 encoded drawing data' },
          metadata: { type: 'object', required: false, description: 'Additional metadata for the drawing' },
        },
      },
      {
        name: 'get_drawing',
        description: 'Retrieve a drawing by ID',
        category: 'storage',
        parameters: {
          drawingId: { type: 'string', required: true, description: 'Unique identifier for the drawing' },
        },
      },
      {
        name: 'list_drawings',
        description: 'List all available drawings',
        category: 'storage',
        parameters: {
          limit: { type: 'number', required: false, default: 10, description: 'Maximum number of drawings to return' },
          offset: { type: 'number', required: false, default: 0, description: 'Number of drawings to skip' },
        },
      },
      {
        name: 'generate_ai_drawing',
        description: 'Generate an AI-powered drawing based on prompt',
        category: 'ai',
        parameters: {
          prompt: { type: 'string', required: true, description: 'Text prompt for AI drawing generation' },
          style: { type: 'string', required: false, default: 'sketch', description: 'Drawing style (sketch, realistic, cartoon, etc.)' },
          size: { type: 'string', required: false, default: 'medium', description: 'Image size (small, medium, large)' },
        },
      },
    ],
    server: {
      name: 'atidraw-mcp-server',
      version: '1.0.0',
      capabilities: ['tools'],
    },
    status: 'active',
  }
})
