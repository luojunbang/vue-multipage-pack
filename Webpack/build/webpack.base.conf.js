const fs = require("fs");
const path = require("path");
const VueLoader = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


const mode = process.env.NODE_ENV;
const devMode = process.env.NODE_ENV === "development";
console.log("...................devMode..................", devMode);

const pagesDirPath = path.resolve(__dirname, "../src/pages");
console.log(pagesDirPath)
/**
 * 通过约定，降低编码复杂度
 * 每新增一个入口，即在src/pages目录下新增一个文件夹，以页面名称命名，内置一个页面名称.js作为入口文件 example：/src/pages/home/home.js
 * 通过node的文件api扫描pages目录
 * 这样可以得到一个形如{page1: "入口文件地址", page2: "入口文件地址", ...}的对象
 */
const getEntries = () => {
    let result = fs.readdirSync(pagesDirPath);
    let entry = {};
    //index
    entry['index'] = path.resolve(__dirname, `../src/index.js`);
    //pages 
    result.forEach(item => {
        //   过滤掉隐藏文件
        if (item[0] != '.') {
            entry[item] = path.resolve(__dirname, `../src/pages/${item}/${item}.js`);
        }

    });
    return entry;
}
console.log(getEntries());
/**
 * 扫描pages文件夹，为每个页面生成一个插件实例对象
 */
const generatorHtmlWebpackPlugins = () => {
    const arr = [];
    let result = fs.readdirSync(pagesDirPath);
    arr.push(new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../src/public/index.html"),
        filename: `index.html`,
        chunks: ["runtime", "vender", "main", "extractedJS", 'index']
    }))
    result.forEach(item => {
        //判断页面目录下有无自己的index.html
        if (item[0] != '.') {
            let templatePath;
            let selfTemplatePath = pagesDirPath + `/${item}/${item}.html`;
            let publicTemplatePath = path.resolve(__dirname, "../src/public/index.html");
            try {
                fs.accessSync(selfTemplatePath);
                templatePath = selfTemplatePath;
            } catch (err) {
                templatePath = publicTemplatePath;
            }
            arr.push(new HtmlWebpackPlugin({
                template: templatePath,
                filename: `pages/${item}.html`,
                chunks: ["runtime", "vender", "main", "extractedJS", item]
            }));
        }
    });
    return arr;
}

console.log(generatorHtmlWebpackPlugins())

module.exports = {
    mode,
    entry: getEntries(),
    // entry: path.resolve(__dirname, "../src/pages/P1/index.js"),
    // entry: "./src/index.js",
    output: {
        publicPath: devMode ? "/" : "/",
        filename: devMode ? "[name].js" : "static/js/[name].[chunkhash].js",
        path: path.resolve(__dirname, "../dist")
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: "vue-loader"
            },
            // {
            //     test: /\.css$/,
            //     use: ["style-loader", "css-loader"]
            // },
            {
                test: /\.(le|c)ss$/,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "less-loader"
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                use: [{
                    loader: "file-loader",
                    options: {
                        limit: 8192,
                        name: devMode ? "[name].[hash:8].[ext]" : "static/images/[name].[hash:8].[ext]",
                        // publicPath: "/static/"
                    }
                }]
            }
        ]
    },
    plugins: [
        new VueLoader(),
        new MiniCssExtractPlugin({
            filename: devMode ? "[name].css" : "static/css/[name].[hash].css",
            chunkFilename: devMode ? "[id].css" : "static/css/[name].[hash].css"
        }),
        // new CleanWebpackPlugin(path.resolve(__dirname, "../dist")),
        ...generatorHtmlWebpackPlugins(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "../src/public/static"),
            to: path.resolve(__dirname, "../dist/static")
        }])
        // new HtmlWebpackPlugin()
    ],
    resolve: {
        extensions: [".js", ".vue"]
    }
}
