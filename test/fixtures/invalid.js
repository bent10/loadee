// not support for commonjs!
exports.module = () => {
  return {
    root: 'src',
    output: 'dist',
    outputFormat: 'html',
    ignore: ['**/node_modules/**', '**/dist/**'],
    preserveData: true,
    dryRun: true
  }
}
