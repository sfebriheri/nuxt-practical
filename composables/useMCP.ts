interface MCPTool {
  name: string
  description: string
  category: string
  parameters: Record<string, any>
}

interface MCPResponse {
  success: boolean
  message?: string
  [key: string]: any
}

export const useMCP = () => {
  const tools = ref<MCPTool[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch available MCP tools
  const fetchTools = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch<{ tools: MCPTool[] }>('/api/mcp/tools')
      tools.value = response.tools
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch MCP tools'
      console.error('Error fetching MCP tools:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Execute an MCP tool
  const executeTool = async (toolName: string, args: Record<string, any> = {}): Promise<MCPResponse> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch<MCPResponse>('/api/mcp/execute', {
        method: 'POST',
        body: {
          toolName,
          arguments: args,
        },
      })
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute MCP tool'
      error.value = errorMessage
      console.error(`Error executing MCP tool ${toolName}:`, err)
      
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      isLoading.value = false
    }
  }

  // Specific tool methods for convenience
  const createDrawing = async (title: string, options: { width?: number; height?: number; backgroundColor?: string } = {}) => {
    return await executeTool('create_drawing', {
      title,
      ...options,
    })
  }

  const saveDrawing = async (drawingId: string, drawingData: string, metadata?: Record<string, any>) => {
    return await executeTool('save_drawing', {
      drawingId,
      drawingData,
      metadata,
    })
  }

  const getDrawing = async (drawingId: string) => {
    return await executeTool('get_drawing', {
      drawingId,
    })
  }

  const listDrawings = async (options: { limit?: number; offset?: number } = {}) => {
    return await executeTool('list_drawings', options)
  }

  const generateAIDrawing = async (prompt: string, options: { style?: string; size?: string } = {}) => {
    return await executeTool('generate_ai_drawing', {
      prompt,
      ...options,
    })
  }

  // Get tools by category
  const getToolsByCategory = (category: string) => {
    return computed(() => tools.value.filter(tool => tool.category === category))
  }

  // Check if a specific tool is available
  const hasToolAvailable = (toolName: string) => {
    return computed(() => tools.value.some(tool => tool.name === toolName))
  }

  // Get tool information
  const getToolInfo = (toolName: string) => {
    return computed(() => tools.value.find(tool => tool.name === toolName))
  }

  return {
    // State
    tools: readonly(tools),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Methods
    fetchTools,
    executeTool,
    
    // Convenience methods
    createDrawing,
    saveDrawing,
    getDrawing,
    listDrawings,
    generateAIDrawing,
    
    // Computed helpers
    getToolsByCategory,
    hasToolAvailable,
    getToolInfo,
  }
}