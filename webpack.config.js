// Webpack uses this to work with directories
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return ({
    // Path to your entry point. From this file Webpack will begin his work
    entry: ["./src/main.js"],

    // Path and filename of your result bundle.
    // Webpack will bundle all JavaScript into this file
    output: {
      path: path.join(__dirname, "docs"),
      filename: "bundle.js"
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(svg|png|jpe?g|gif)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
        {
          // Apply rule for .sass, .scss or .css files
          test: /\.(sa|sc|c)ss$/,

          // Set loaders to transform files.
          // Loaders are applying from right to left(!)
          // The first loader will be applied after others
          use: [
            // After all CSS loaders we use plugin to do his work.
            // It gets all transformed CSS and extracts it into separate
            // single bundled file
            MiniCssExtractPlugin.loader,
            {
              // This loader resolves url() and @imports inside CSS
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              // Then we apply postCSS fixes like autoprefixer and minifying
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                config: {
                  path: "postcss.config.js"
                }
              }
            },
            {
              // First we transform SASS to standard CSS
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
                sourceMap: true
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css"
      }),
      new HtmlWebpackPlugin({
        template: "src/index.html"
      })
    ],

    // Default mode for Webpack is production.
    // Depending on mode Webpack will apply different things
    // on final bundle. For now we don't need production's JavaScript
    // minifying and other thing so let's set mode to development
    mode: argv.mode,
      devtool: isDevelopment ? 'source-map' : '#eval-source-map'
  })
}