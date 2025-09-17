export default eventHandler(async (event) => {
  // For minimalist version, we'll skip authentication and storage
  // In a real app, you would implement proper authentication and storage
  
  // useUpload send a formData
  const form = await readFormData(event)
  const drawing = form.get('drawing') as File
  const name = form.get('name') as string

  if (!drawing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing drawing'
    })
  }

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing name'
    })
  }

  // For minimalist version, just return success without actually storing
  // In a real app, you would store to local filesystem or another storage service
  
  return {
    success: true,
    message: 'Drawing uploaded successfully (minimalist version - not actually stored)',
    name: name,
    size: drawing.size
  }
})
