const path = require('path'); // eslint-disable-line
const CopyPlugin = require('copy-webpack-plugin'); // eslint-disable-line
const srcDir = '../src/';

module.exports = {
    entry: {
        // popup: path.join(__dirname, srcDir + 'popup.ts'),
        // options: path.join(__dirname, srcDir + 'options.ts'),
        background: path.join(__dirname, `${srcDir}background/background.ts`),
        contentscript: path.join(__dirname, `${srcDir}content/contentscript.ts`),
    },
    output: {
        path: path.join(__dirname, '../dist/js'),
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'initial',
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [new CopyPlugin([{ from: '.', to: '../' }], { context: 'public' })],
};
