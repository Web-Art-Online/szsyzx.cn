import path from 'node:path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: './src/index.ts',
  devtool: 'source-map',
  devServer: {
    port: 8000
  },
  output: {
    filename: 'main.js',
    path: path.resolve(import.meta.dirname, 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' }
      ]
    }),
    new HtmlWebpackPlugin({
      base: '/',
      template: './index.html',
      xhtml: true
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s(c|a)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
};
