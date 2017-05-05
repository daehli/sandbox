const path = require('path');

module.exports = [{
  context: path.join(__dirname),
  entry: 'index',
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test:/\.jsx?$/,
        exclude:/node_modules/,
        loader:'babel-loader'
      },
      { test: /\.css$/, loader: 'style-loader!css-loader?-svgo' },
      ]
  },
  resolve:{
    extensions:['.js','.jsx'],
    modules:[
      path.join(__dirname,'client'),
      'node_modules'
    ]
  }
}];
