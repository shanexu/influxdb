import initialize from 'src/external/monaco'

// There are a number of problems with the type definitions from the monaco package
// TODO: type Monaco better

initialize().then((monaco: any) => {
  monaco.languages.register({id: 'flux'})

  monaco.languages.setMonarchTokensProvider('flux', {
    keywords: ['from', 'range', 'filter', 'to'],
    tokenizer: {
      root: [
        [
          /[a-z_$][\w$]*/,
          {cases: {'@keywords': 'keyword', '@default': 'identifier'}},
        ],
      ],
    },
  })
})
