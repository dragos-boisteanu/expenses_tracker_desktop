export default (unixA: number, unixB: number): boolean => {
  const dateA = new Date(unixA * 1000).toDateString()
  const dateB = new Date(unixB * 1000).toDateString()
  return dateA === dateB
}
