const sleep = (sleepTime: number = 1000): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, sleepTime)
  })
}

export default sleep
