const merge = require("webpack-merge");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const baseConfig = require("./webpack.base.conf.js");
module.exports = merge(baseConfig, 
    {
        plugins:[
            new CleanWebpackPlugin()
        ],
    optimization: {
        runtimeChunk: {
            name: "runtime"
        },
        splitChunks: {
            minSize:30000,
            cacheGroups: {
                // vender: {
                //     name: "vender",
                //     filename: "static/js/vender.[chunkhash].js",
                //     test: /(vue|vuex)/,
                //     chunks: "initial"
                // },
                vender:{
                    test: /[\\/]node_modules[\\/]/,
                    filename:"static/js/vender.[chunkhash].js",
                    name: 'vender',
                    chunks:'initial'
                },
                //除Vue之外其他框架
                // main:{
                //     filename:"static/js/main.[chunkhash].js",
                //     test:/[\\/]node_modules[\\/]?!(vue)[\\/]/,
                //     name: 'main',
                //     chunks:'all'
                // },
                //业务中可复用的js
                extractedJS:{
                    test:/[\\/]src[\\/].+\.js$/,
                    filename:'static/js/extractedJS.[chunkhash].js',
                    name:'extractedJS.js',
                    chunks:'all'
                }
            }
        }
    }
});