import initialize from 'src/external/monaco'

// There are a number of problems with the type definitions from the monaco package
// TODO: type Monaco better

initialize().then((monaco: any) => {
  monaco.languages.registerCompletionItemProvider('flux', {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: 'from',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ['from(bucket: ${1})', '\t|>'].join('\n'),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'From-Statement',
        },
      ]
      return {suggestions: suggestions}
    },
  })
})
