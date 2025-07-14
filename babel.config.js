module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    // React Compiler must run first!
    [
      'babel-plugin-react-compiler',
      {
        // Optional: disable React Compiler for specific files
        // sources: (filename) => {
        //   return filename.indexOf('node_modules') === -1;
        // }
      }
    ],
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        resolvePath(sourcePath, currentFile) {
          // Transform .tsx/.ts imports to .js for the compiled output
          if (sourcePath.startsWith('./') || sourcePath.startsWith('../')) {
            return sourcePath.replace(/\.(tsx|ts)$/, '.js');
          }
          return sourcePath;
        }
      }
    ],
  ],
};
