let path = require('path');
module.exports = {
  devtool: "source-map",
  entry: {
    app: './source/js/app.js'
  },
  output: {
    filename: "[name].js"
  },
  externals: {
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(frag|vert)$/,
        loader: 'webpack-glsl'
      }
    ]
  }
};
