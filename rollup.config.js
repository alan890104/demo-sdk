const typescript = require("@rollup/plugin-typescript");
const { defineConfig } = require("rollup");
const terser = require("@rollup/plugin-terser");
const babel = require("@rollup/plugin-babel");

// 读取环境变量
const isProduction = process.env.NODE_ENV === "production";

module.exports = defineConfig({
  input: "src/index.ts", // 入口文件
  external: ["moment"], // <-- suppresses the warning
  output: [
    {
      file: "dist/v1-sdk.esm.js",
      format: "esm", // ES Module 格式
      sourcemap: !isProduction, // 开发模式启用 sourcemap
    },
    {
      file: "dist/v1-sdk.cjs.js",
      format: "cjs", // CommonJS 格式
      sourcemap: !isProduction,
    },
    {
      file: "dist/v1-sdk.umd.js",
      format: "umd", // UMD 格式，适合在浏览器中直接引入
      name: "MySDK", // UMD 模块的全局变量名称
      sourcemap: !isProduction,
    },
    {
      file: "dist/v1-sdk.min.js",
      format: "iife", // IIFE 格式，立即执行函数，适合在浏览器中直接引入
      name: "MySDK", // IIFE 模块的全局变量名称
      plugins: isProduction ? [terser()] : [], // 生产环境下压缩代码
      sourcemap: !isProduction,
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json", // 使用你的 tsconfig.json 文件
      exclude: "node_modules/**", // 排除 node_modules
    }),
    babel({
      babelHelpers: "bundled", // Babel 辅助函数的处理方式
      extensions: [".js", ".ts"], // 处理哪些文件类型
      include: ["src/**/*"], // 包含哪些文件
      exclude: "node_modules/**", // 排除 node_modules
    }),
    isProduction &&
      terser({
        compress: {
          drop_console: true, // 生产环境移除 console
        },
      }), // 压缩代码
  ].filter(Boolean), // 过滤掉 false 的插件
});
