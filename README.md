# sdk

## Prerequisites
Node version >= 20

# Setup 

1. Make sure the global `yarn` version is correct.
   
    ```bash
    yarn set version stable
    ```

2. Initalize a project with `yarn`.

    ```bash
    mkdir sdk
    cd sdk
    yarn init -y
    ```

3. Add a `yarnrc.yml` with following content.

    ```yaml
    nodeLinker: node-modules
    ```

4. Add an empty `yarn.lock` file.

    ```bash
    touch yarn.lock
    ```

5. Add a `.gitignore` file with following content.

    ```bash
    node_modules/
    .yarn/
    .yarn/*
    !.yarn/releases
    !.yarn/plugins
    !.yarn/sdks
    !.yarn/versions
    .yarn/cache/
    .yarn/build-state.yml
    .yarn/install-state.gz

    dist/
    *.tsbuildinfo

    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*

    *.js
    *.js.map
    *.d.ts
    *.d.ts.map

    .DS_Store
    Thumbs.db

    .vscode/
    .idea/
    *.suo
    *.ntvs*
    *.njsproj
    *.sln

    .env
    .env.*

    *.tgz
    !rollup.config.js
    ```

6. Install dependencies for sdk.

    ```bash
    yarn add typescript @rollup/plugin-typescript @rollup/plugin-terser tslib rollup @rollup/plugin-babel @babel/core @babel/preset-env -D
    yarn add axios
    ```


7. Add TON related dependencies (Optional)

    ```bash
    yarn add @ton/ton @ton/crypto @ton/core buffer
    ```


8. Create a `rollup.config.js` file with following content.

    ```javascript
    // rollup.config.js
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
    ```

9. Add following scripts to `package.json`, assume the project is named `v1-sdk`.

    ```json
    {
      "main": "dist/v1-sdk.cjs.js",
      "module": "dist/v1-sdk.esm.js",
      "browser": "dist/v1-sdk.umd.js",
      "types": "dist/types/index.d.ts",
      "scripts": {
        "build": "NODE_ENV=production rollup -c",
        "dev": "NODE_ENV=development rollup -c -w"
      },
      "files": [
        "dist",
        "types"
      ]
    }
    ```

10. Add a `tsconfig.json` file with following content.

    ```json
    {
      "compilerOptions": {
        "target": "ES5", // 兼容性较广的目标版本
        "module": "ESNext", // 使用 ESNext 模块系统，让 Rollup 等工具处理模块格式
        "declaration": true, // 生成 .d.ts 类型声明文件
        "declarationDir": "./types", // 指定声明文件的输出目录
        "outDir": "./dist", // 指定编译后的输出目录
        "strict": true, // 启用所有严格的类型检查选项
        "esModuleInterop": true, // 允许与 CommonJS 模块更好的互操作性
        "moduleResolution": "node", // 使 TypeScript 能够解析 Node.js 模块
        "removeComments": true, // 移除编译后的文件中的注释
        "sourceMap": true // 生成 source map 文件以便调试
      },
      "include": ["src"], // 包含 src 目录中的所有 TypeScript 文件
      "exclude": ["node_modules", "dist"] // 排除 node_modules 和 dist 目录
    }


    ```

11. Add `babel.config.json` file with following content.

    ```json
    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": "> 0.25%, not dead", // 目标浏览器/环境
            "modules": false // 保留 ES6 模块语法，以便 Rollup 处理
          }
        ]
      ]
    }

    ```

12. Add `.npmignore` file with following content.

      ```bash
      # 排除源码目录
      src/

      # 排除 TypeScript 配置文件
      tsconfig.json
      tslint.json

      # 排除 Rollup 配置文件
      rollup.config.js

      # 排除测试文件
      test/
      tests/
      *.test.js
      *.spec.js
      *.test.ts
      *.spec.ts

      # 排除构建工具和 IDE 配置文件
      .vscode/
      .idea/
      *.suo
      *.ntvs*
      *.njsproj
      *.sln

      # 排除日志文件
      npm-debug.log*
      yarn-debug.log*
      yarn-error.log*

      # 排除本地环境变量文件
      .env
      .env.*

      # 排除本地生成的锁定文件
      yarn.lock
      package-lock.json

      # 排除文档
      *.md
      docs/
      README.md

      # 排除 Git 相关文件
      .git/
      .gitattributes
      .gitignore

      # 排除 npm 忽略文件本身
      .npmignore

      # 排除编译生成的 source map（如果你不想发布它们）
      *.map

      # 保留的文件
      !dist/
      !types/

      # tgz 文件
      *.tgz

      # babel 配置文件
      babel.config.json

      # semantic-release 配置文件
      .releaserc.json
      ```

13. Install semantic-release for automatic versioning.

    ```bash
    yarn add @semantic-release/git @semantic-release/changelog -D
    ```

14. Add a `.releaserc.json` file with following content.
[reference](https://pjchender.dev/devops/devops-semantic-release/)

    ```json
    {
      "branches": ["main"],
      "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
          "@semantic-release/changelog",
          {
            "changelogFile": "docs/CHANGELOG.md"
          }
        ],
        [
          "@semantic-release/npm",
          {
            "npmPublish": true
          }
        ],
        [
          "@semantic-release/git",
          {
            "message": "chore(release): ${nextRelease.version} [skip ci]",
            "assets": ["docs/CHANGELOG.md"]
          }
        ]
      ]
    }

    ```

15. Initialize a git repository and publish to github.

    ```bash
    git init
    ```

    ```
    publish to github
    ```

16. Get NPM token and add it to github release environment's secret. (you need to create a new environment)

17. Setup cli for semantic-release.

    ```bash
    npx semantic-release-cli setup
    ```

18. Add a github workflow file `.github/workflows/release.yml` with following content.

    ```yaml
    name: CI and Release

    on:
      push:
        branches:
          - main

    permissions:
      contents: read # for checkout

    jobs:
      checks:
        name: Run Checks
        runs-on: ubuntu-latest
        environment: release
        permissions:
          contents: write # to be able to publish a GitHub release
          issues: write # to be able to comment on released issues
          pull-requests: write # to be able to comment on released pull requests
          id-token: write # to enable use of OIDC for npm provenance
        steps:
          - name: Checkout code
            uses: actions/checkout@v4
            with:
              fetch-depth: 0

          - name: Setup Node.js
            uses: actions/setup-node@v4
            with:
              node-version: 20

          - name: Setup yarn version
            run: corepack enable && yarn set version 4.4.1

          - name: Install dependencies
            run: yarn install --frozen-lockfile

          - name: Run Build
            run: yarn build

          - name: Publish to npm
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
              NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
            run: npx semantic-release

    ```

## Usage

1. Create a `src/index.ts` file with your logic.

2. Run `yarn dev` to start development.

3. Run `yarn build` to build the project.

# Local Development

1. Build the project.

    ```bash
    yarn build
    ```

2. Link this project in other repo.

    In other repo, run following command.
    ```bash
    YARN_IGNORE_PATH=1 yarn link <the relative path of this project>
    ```



