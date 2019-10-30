import initialize from 'src/external/monaco'

// There are a number of problems with the type definitions from the monaco package
// TODO: type Monaco better

initialize().then((monaco: any) => {
  monaco.editor.defineTheme('fluxTheme', {
    base: 'vs',
    inherit: false,
    rules: [{token: 'keyword', foreground: 'ff00ff', fontStyle: 'bold'}],
  })
})
