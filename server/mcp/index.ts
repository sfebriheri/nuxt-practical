import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type {
  Tool,
  CallToolRequest
} from '@modelcontextprotocol/sdk/types.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

// Define proper types for MCP tool arguments
interface CreateDrawingArgs {
  title: string
  width?: number
  height?: number
  backgroundColor?: string
}

interface SaveDrawingArgs {
  drawingId: string
  drawingData: string
  metadata?: Record<string, unknown>
}

interface GetDrawingArgs {
  drawingId: string
}

interface ListDrawingsArgs {
  limit?: number
  offset?: number
}

interface GenerateAIDrawingArgs {
  prompt: string
  style?: string
  size?: string
}

// MCP Server for AI Drawing Application
class DrawingMCPServer {
  private server: Server

  constructor() {
    this.server = new Server(
      {
        name: 'atidraw-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      },
    )

    this.setupToolHandlers()
    this.setupErrorHandling()
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_drawing',
            description: 'Create a new drawing with specified parameters',
            inputSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the drawing',
                },
                width: {
                  type: 'number',
                  description: 'Canvas width in pixels',
                  default: 800,
                },
                height: {
                  type: 'number',
                  description: 'Canvas height in pixels',
                  default: 600,
                },
                backgroundColor: {
                  type: 'string',
                  description: 'Background color in hex format',
                  default: '#ffffff',
                },
              },
              required: ['title'],
            },
          },
          {
            name: 'save_drawing',
            description: 'Save drawing data to storage',
            inputSchema: {
              type: 'object',
              properties: {
                drawingId: {
                  type: 'string',
                  description: 'Unique identifier for the drawing',
                },
                drawingData: {
                  type: 'string',
                  description: 'Base64 encoded drawing data',
                },
                metadata: {
                  type: 'object',
                  description: 'Additional metadata for the drawing',
                },
              },
              required: ['drawingId', 'drawingData'],
            },
          },
          {
            name: 'get_drawing',
            description: 'Retrieve a drawing by ID',
            inputSchema: {
              type: 'object',
              properties: {
                drawingId: {
                  type: 'string',
                  description: 'Unique identifier for the drawing',
                },
              },
              required: ['drawingId'],
            },
          },
          {
            name: 'list_drawings',
            description: 'List all available drawings',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of drawings to return',
                  default: 10,
                },
                offset: {
                  type: 'number',
                  description: 'Number of drawings to skip',
                  default: 0,
                },
              },
            },
          },
          {
            name: 'generate_ai_drawing',
            description: 'Generate an AI-powered drawing based on prompt',
            inputSchema: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'Text prompt for AI drawing generation',
                },
                style: {
                  type: 'string',
                  description: 'Drawing style (sketch, realistic, cartoon, etc.)',
                  default: 'sketch',
                },
                size: {
                  type: 'string',
                  description: 'Image size (small, medium, large)',
                  default: 'medium',
                },
              },
              required: ['prompt'],
            },
          },
        ] as Tool[],
      }
    })

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params

      switch (name) {
        case 'create_drawing':
          return await this.handleCreateDrawing(args as unknown as CreateDrawingArgs)
        case 'save_drawing':
          return await this.handleSaveDrawing(args as unknown as SaveDrawingArgs)
        case 'get_drawing':
          return await this.handleGetDrawing(args as unknown as GetDrawingArgs)
        case 'list_drawings':
          return await this.handleListDrawings(args as unknown as ListDrawingsArgs)
        case 'generate_ai_drawing':
          return await this.handleGenerateAIDrawing(args as unknown as GenerateAIDrawingArgs)
        default:
          throw new Error(`Unknown tool: ${name}`)
      }
    })
  }

  private async handleCreateDrawing(args: CreateDrawingArgs) {
    const { title, width = 800, height = 600, backgroundColor = '#ffffff' } = args

    const drawingId = `drawing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            drawingId,
            title,
            dimensions: { width, height },
            backgroundColor,
            createdAt: new Date().toISOString(),
          }),
        },
      ],
    }
  }

  private async handleSaveDrawing(args: SaveDrawingArgs) {
    const { drawingId, drawingData, metadata = {} } = args

    // In a real implementation, this would save to a database or file system
    // For now, we'll simulate the save operation

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            drawingId,
            savedAt: new Date().toISOString(),
            dataSize: drawingData.length,
            metadata,
          }),
        },
      ],
    }
  }

  private async handleGetDrawing(args: GetDrawingArgs) {
    const { drawingId } = args

    // Simulate retrieving drawing data
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            drawingId,
            title: `Drawing ${drawingId}`,
            createdAt: new Date().toISOString(),
            // In real implementation, would include actual drawing data
            drawingData: 'base64_encoded_drawing_data_placeholder',
          }),
        },
      ],
    }
  }

  private async handleListDrawings(args: ListDrawingsArgs) {
    const { limit = 10, offset = 0 } = args

    // Simulate listing drawings
    const mockDrawings = Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `drawing_${Date.now() - i * 1000}_${Math.random().toString(36).substr(2, 9)}`,
      title: `Drawing ${i + 1}`,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      thumbnail: 'thumbnail_placeholder',
    }))

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            drawings: mockDrawings,
            total: mockDrawings.length,
            limit,
            offset,
          }),
        },
      ],
    }
  }

  private async handleGenerateAIDrawing(args: GenerateAIDrawingArgs) {
    const { prompt, style = 'sketch', size = 'medium' } = args

    // Simulate AI drawing generation
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            prompt,
            style,
            size,
            generatedAt: new Date().toISOString(),
            drawingId: `ai_drawing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            // In real implementation, would include actual generated image data
            imageData: 'base64_encoded_ai_generated_image_placeholder',
          }),
        },
      ],
    }
  }

  private setupErrorHandling() {
    this.server.onerror = (error: Error) => {
      console.error('[MCP Error]', error)
    }

    process.on('SIGINT', async () => {
      await this.server.close()
      process.exit(0)
    })
  }

  async run() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Drawing MCP server running on stdio')
  }
}

// Export the server class
export { DrawingMCPServer }

// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new DrawingMCPServer()
  server.run().catch(console.error)
}
