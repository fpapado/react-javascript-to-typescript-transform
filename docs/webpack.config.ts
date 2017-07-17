import * as webpack from 'webpack';
import * as path from 'path';
import * as HTMLWebpackPlugin from 'html-webpack-plugin';
import * as  CopyWebpackPlugin from 'copy-webpack-plugin';

const config: webpack.Configuration = {
    entry: './editor.tsx',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'editor-[hash].js',
    },
    resolve: { extensions: [ '.js', '.ts', '.tsx'] },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        }),
        new CopyWebpackPlugin([
            {
                from: 'node_modules/monaco-editor/min/vs',
                to: 'vs',
            }
        ])
    ]
};

export default config;
