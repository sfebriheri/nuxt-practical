export default eventHandler(async (event) => {
  const { cursor } = await getQuery<{ cursor?: string }>(event)

  // Return empty list since hub storage is disabled for minimalist version
  return {
    blobs: [],
    cursor: null,
    truncated: false
  }
})
