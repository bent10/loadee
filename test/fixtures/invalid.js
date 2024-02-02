// error: cjs in .js files is not supported
exports.default = () => {
  return [
    { name: 'John Doe', subscription: 'Standard' },
    { name: 'Jane Smith', subscription: 'Free' }
  ]
}
