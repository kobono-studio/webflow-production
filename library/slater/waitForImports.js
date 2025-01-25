// Initialize Kobono structure
;(window.Kobono ??= {}).loaded ??= {}

// Create an array to store all import promises
window._importPromises = []

// Save the original import function
const originalImport = window.import

// Create a global promise that will resolve
// when all modules are loaded
window.modulesLoaded = new Promise((resolve) => {
  window.signalModulesLoaded = resolve
})

// Replace the global import function
// with our instrumented version
window.import = function (url) {
  const importPromise = originalImport.apply(this, arguments)
  // Extract module name from URL
  const moduleName = url.split('/').pop().split('?')[0].split('.')[0]
  // Track this specific import
  importPromise.then(() => {
    window.Kobono.loaded[moduleName] = true
    console.log(`Module ${moduleName} loaded`)
  })

  window._importPromises.push(importPromise)
  return importPromise
}

// Check when all imports are done
// and signal completion
setTimeout(() => {
  Promise.all(window._importPromises)
    .then(() => {
      console.log(
        'All modules are loaded!',
        window._importPromises.length,
        'modules in total'
      )
      console.log('Loaded modules:', window.Kobono.loaded)
      window.modulesLoaded = Promise.resolve(true)
      // Indicates that everything is loaded
    })
    .catch((error) => {
      console.error('Error loading modules:', error)
      window.modulesLoaded = Promise.reject(error)
      // Indicates that something went wrong
    })
}, 1000)
