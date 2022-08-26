const { accessSync } = require('fs');
const { join, dirname } = require('path');

module.exports = api => {
  if (api.env('server')) {
    return {
      sourceMaps: 'inline',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ]
    }
  } else {
    return {
      sourceMaps: 'inline',
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              esmodules: true
            }
          }
        ]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        ({ types }) => ({
          visitor: {
            ImportDeclaration(path, state) {
              if (/^\.\.?\/.*(?!\.js)$/.test(path.node.source.value)) {
                try {
                  const asDir = `${path.node.source.value}/index.js`;
                  accessSync(join(dirname(state.file.opts.filename), asDir));
                  path.node.source.value = asDir;
                } catch (ex) {
                  path.node.source.value = `${path.node.source.value}.js`;
                }
              }
            }
          }
        })
      ]
    }
  }
};