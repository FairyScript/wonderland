const ui = Bun.spawn({
  cmd: ['bunx', 'tsr', 'watch'],
  stdout: 'inherit',
})

const server = Bun.spawn({
  cmd: ['bun', '--watch', 'src/server/index.ts'],
  stdout: 'inherit',
})

Promise.all([ui.exited, server.exited]).then(([uiExit, serverExit]) => {
  if (uiExit !== 0) {
    console.error(`UI process exited with code ${uiExit}`)
  }
  if (serverExit !== 0) {
    console.error(`Server process exited with code ${serverExit}`)
  }
  process.exit(Math.max(uiExit, serverExit))
})

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down...')
  ui.kill('SIGINT')
  server.kill('SIGINT')
})
