export default (unixDate: number) => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return new Date(unixDate * 1000).toDateString() === yesterday.toDateString()
}
