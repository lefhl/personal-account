const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const fs = require("fs");
const path = require("path");

let targetBrowser = "web";
let pluginImgMinify = () => {};
function resolveSrc(_path) {
  return path.join(__dirname, _path);
}

module.exports = function (env, argv) {
  if (argv.mode === "production") {
    targetBrowser = "browserslist";
    pluginImgMinify = new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: "84-85",
      },
      gifsicle: {
        optimizationLevel: 1,
      },
      svgo: null,
      plugins: [
        imageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
      ],
    });
  }
  let templates = [];
  let arrTemplates = fs.readdirSync("src/pug");
  arrTemplates.forEach((file) => {
    if (file.match(/\.pug$/)) {
      let filename = file.substring(0, file.length - 4);
      templates.push(
        new HtmlWebpackPlugin({
          template: "src/pug/" + filename + ".pug",
          filename: filename + ".html",
        })
      );
    }
  });

  return {
    target: targetBrowser,
    devtool: "source-map",

    entry: ["./src/js/app.js"],
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "./",
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: ["raw-loader", "pug-html-loader"],
        },

        {
          type: "javascript/auto",
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: "file-loader",
          options: {
            name: "../images/" + "[name].[ext]",
          },
        },
        {
          type: "javascript/auto",
          test: /\.(woff|ttf|otf|woff2|eot)$/i,
          loader: "file-loader",
          options: {
            name: "../fonts/" + "[name].[ext]",
          },
        },

        {
          type: "javascript/auto",
          test: /\.(webmanifest|ico)$/i,
          loader: "file-loader",
        },

        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: false,
                url: false,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  sourceMap: false,
                  ident: "postcss",
                  url: false,
                  plugins: [require("autoprefixer")],
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: false,
                webpackImporter: false,
                sassOptions: {
                  includePaths: [resolveSrc("node_modules")],
                },
              },
            },
            {
              loader: "import-glob",
            },
          ],
        },
      ],
    },
    devServer: {
      static: resolveSrc("./dist/"),

      port: 3010,
      hot: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },
    watchOptions: {
      poll: true,
    },
    plugins: [
      ...templates,
      new CleanWebpackPlugin({ dry: false, cleanStaleWebpackAssets: false }),
      new MiniCssExtractPlugin({
        filename: "./css/style.css",
      }),
      new CopyPlugin({
        patterns: [
          { from: "src/i", to: "./i", noErrorOnMissing: true },
          { from: "src/images", to: "./images", noErrorOnMissing: true },
          { from: "src/json", to: "./json", noErrorOnMissing: true },
          { from: "src/fonts", to: "./fonts", noErrorOnMissing: true },
        ],
      }),
      pluginImgMinify,
    ],
  };
};
