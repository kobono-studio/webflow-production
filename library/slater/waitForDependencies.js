const waitForDependencies = (dependencies) => {
  return new Promise((resolve) => {
    const check = _.throttle(() => {
      if (dependencies.every((checkFn) => checkFn())) resolve()
      else check()
    }, 50)
    check()
  })
}
