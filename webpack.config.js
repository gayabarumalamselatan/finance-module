const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Call dotenv and it will return an Object with a parsed key 
const env = dotenv.config({ path: './.env.development' }).parsed;

// Reduce it to a nice object, the same as before (but with the variables from .env)
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = {
    entry: './src/index',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'financemodule'),
        publicPath: 'auto',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader", // Creates `style` nodes from JS strings
                    "css-loader",   // Translates CSS into CommonJS
                ],
            },
            {
                test: /\.svg$/,
                use: ['file-loader'],
            },
            {
                test: /\.m?js$/, // Matches .mjs and .js files
                resolve: {
                    fullySpecified: false,
                }
            }

            // Additional loaders for other file types can be added here
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'gritfinancemodule',
            filename: 'financeModule.js',
            exposes: {
                './Coa': './src/components/Coa',
                './DashboardPr': './src/components/DashboardPr',

                './AddPurchaseRequest': './src/formComponents/AddPurchaseRequest',
                './PurchaseRequest': './src/components/PurchaseRequest',

                './PurchaseOrder': './src/formComponents/AddPurchaseOrder',
                './ListPurchaseOrder': './src/components/PurchaseOrder',

                './PurchaseInvoice': './src/formComponents/AddPurchaseInvoice',
                './ListPurchaseInvoice': './src/components/PurchaseInvoice',

                './PettyCash': './src/formComponents/AddPettyCash',
                './ListPettyCash': './src/components/PettyCash',
                
                './PurchaseExpanseVoucher': './src/formComponents/AddPurchaseExpanseVoucher',
                './ListPurchaseExpanseVoucher': './src/components/PurchaseExpanseVoucher',
                
                './SalesOrder': './src/components/SalesOrder',
            },
            shared: {
                react: { 
                    singleton: true, 
                    eager: true,
                    requiredVersion: '^18.2.0' // Ganti dengan versi React yang digunakan dalam aplikasi Anda
                  },
                  'react-dom': { 
                    singleton: true, 
                    eager: true,
                    requiredVersion: '^18.2.0' // Ganti dengan versi yang sesuai
                  },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'], // Provide a polyfill for the Buffer variable if needed
        }),
        new webpack.DefinePlugin(envKeys),
    ],
    // Optionally, you can specify a resolve section for resolving file extensions
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
