const path = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyFilePlugin = require("copy-webpack-plugin");
const glob = require('glob');
const { VueLoaderPlugin } = require('vue-loader');


const plugins = [
    new CopyFilePlugin({
        patterns: [
            {
                context: "src/",
                from: "*.html",
            },
        ],
    }),
    new CopyFilePlugin({
        patterns: [
            {
                from: "assets/*",
            },
        ],
    }),
    new WriteFilePlugin(),
];

const main = (mode, devtool) => ({
    devtool,
    cache: true,
    module: {
        rules: [{
            test: /.ts$/,
            include: [
                path.resolve(__dirname, 'src'),
            ],
            exclude: [
                path.resolve(__dirname, 'node_modules'),
            ],
            loader: 'ts-loader',
        },
        {
            test: /\.node$/,
            loader: "node-loader",
            options: {
                name: mode === "production" ? "[name].[ext]" : "[contenthash].[ext]",
            }
        },
        ]
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.js', '.ts', ".node"]
    },
    externals: [
        { "../build/Debug/iconv.node": '"no module"' },
    ],
    mode,
    target: 'electron-main',
    entry: path.join(__dirname, 'src', 'main'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins,
});

const renderer = (mode, devtool) => ({
    mode,
    cache: true,
    target: 'web',
    devtool,
    entry: path.join(__dirname, 'src', 'renderer', 'index'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist', 'renderer')
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.css', '.ts', '.tsx', ".vue"],
        alias: {
            'vue': '@vue/runtime-dom',
            "@components": path.resolve(__dirname, 'src', "lib", "client", "components"),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ],
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                ],
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
});
const repEx = name => name.replace(".ts", ".js");
const preloaderGen = entry => (mode, devtool) => ({
    devtool,
    cache: true,
    module: {
        rules: [{
            test: /.ts$/,
            include: [
                path.resolve(__dirname, 'src'),
            ],
            exclude: [
                path.resolve(__dirname, 'node_modules'),
            ],
            loader: 'ts-loader',
        },]
    },
    node: {
        __dirname: true,
        __filename: false
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    mode,
    target: 'electron-renderer',
    entry,
    output: {
        filename: repEx(path.basename(entry)),
        path: path.resolve(__dirname, 'dist', "preloader")
    },
});
const preloader = glob.sync(path.join(__dirname, 'src', 'preloader', '*.ts')).map(preloaderGen);

module.exports = [
    main, renderer, ...preloader
];
