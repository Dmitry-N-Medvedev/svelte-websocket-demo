export const CompilerConfig = Object.freeze({
  compileTo: ['ts'],
  outputRootDir: './compiled',
  rootFile: './schema/main.fbs',
  languages: {
    ts: {
      generatorOptions: [
        '--natural-utf8',
        '--gen-all',
        '--gen-mutable',
        '--warnings-as-errors',
      ],
      preProcess: null,
      postProcess: (await import(new URL('../processors/ts/postProcess.mjs', import.meta.url))).postProcess,
    },
  },
});
