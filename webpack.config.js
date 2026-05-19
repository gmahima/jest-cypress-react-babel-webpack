const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src'), 'shared'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camel-case-only',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true,
    hot: true,
  },
}
