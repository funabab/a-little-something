const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const { GenerateSW } = require('workbox-webpack-plugin')

const mode = process.env.NODE_ENV || 'development'
const isProduction = mode === 'production'

module.exports = {
  mode,

  entry: {
    css: './src/styles/global.css',
    home: './src/pages/home.ts',
    view: './src/pages/view.ts',
    post: './src/pages/post.ts',
    images: './src/pages/images.ts',
    comment: './src/pages/comment.ts',
  },
  output: {
    filename: 'js/[name]-[contenthash].js',
    path: path.join(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        use: ['ts-loader'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  devtool: isProduction ? false : 'eval-source-map',
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://127.0.0.1:5000',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      filename: 'css/style-[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
        },
      ],
    }),
    new WebpackPwaManifest({
      name: 'Credo App',
      short_name: 'Credo',
      description: 'Sample Project',
      background_color: '#81f1ff',
      theme_color: '#074efc',
      ios: true,
      inject: true,
      filename: 'mainfest.json',
      publicPath: '/',
      start_url: '/',
      icons: [
        {
          src: path.join(__dirname, 'public', 'logo.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          ios: true,
        },
        {
          src: path.join(__dirname, 'public', 'logo.png'),
          size: '512x512',
          purpose: 'maskable',
          ios: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['home', 'css'],
    }),
    new HtmlWebpackPlugin({
      template: './src/post.html',
      filename: 'post/index.html',
      chunks: ['post', 'css'],
    }),
    new HtmlWebpackPlugin({
      template: './src/view.html',
      filename: 'view/index.html',
      chunks: ['view', 'css'],
    }),
    new HtmlWebpackPlugin({
      template: './src/images.html',
      filename: 'images/index.html',
      chunks: ['images', 'css'],
    }),
    new HtmlWebpackPlugin({
      template: './src/comment.html',
      filename: 'comment/index.html',
      chunks: ['comment', 'css'],
    }),
    new GenerateSW({
      skipWaiting: true,
    }),
  ],
}
