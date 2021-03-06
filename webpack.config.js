const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'), // относительно какой папки мы работаем
    mode: 'development',
    entry: {
        filename: './index.js'
    },
    output: {
        filename: '[contenthash].js',
        path: path.resolve(__dirname, 'build')
    },
    devServer: {
        port: 4200,
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new HTMLWebpackPlugin({template: './index.html'}),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/assets'),
                to: path.resolve(__dirname, 'build/assets')
            },
            {
                from: path.resolve(__dirname, 'src/scripts'),
                to: path.resolve(__dirname, 'build/scripts')
            }
        ])
    ],
};
