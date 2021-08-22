module.exports = {
    presets: [
        'module:metro-react-native-babel-preset',
        'module:@babel/preset-typescript'
    ],
    env: {
        production: {
            plugins: ['react-native-paper/babel'],
        },
    },
    plugins: [
        [
          require.resolve('babel-plugin-module-resolver'),
          {
            cwd: 'babelrc',
            extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
            alias: {
              '~': './src',
              '@utils': './src/Functions'
            }
          }
        ],
        'jest-hoist',
        'react-native-reanimated/plugin',
    ]
};
