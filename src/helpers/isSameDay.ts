export default (unixA: number, unixB: number): boolean => {
  const dateA = new Date(Math.floor(unixA) * 1000).toDateString()
  const dateB = new Date(Math.floor(unixB) * 1000).toDateString()
  return dateA === dateB
}
