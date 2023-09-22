import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import handlebars from "vite-plugin-handlebars";
import { rollupFiles } from "./rollup";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// 設定ファイルで取得したデータを格納する
const configs = {
  global: {},
  meta: {},
};

// JSONファイルを読み込むための関数（./src/config/*.jsonでの利用を想定）
const readConfigJSONFile = (filePath) => {
  return new Promise(async (resolve) => {
    const file = fs.readFileSync(filePath);
    resolve(JSON.parse(file));
  });
};

// サイトのルートを決定
const root = resolve(__dirname, "src/pages");

export default defineConfig(async () => {
  // ビルド対象のHTMLファイルをリスト化する
  const rollupOptionsInput = await rollupFiles("./src/pages", ".html", {});
  // サイト設定のJSONファイルを読み込む
  configs.global = await readConfigJSONFile("./src/configs/global.json");
  configs.meta = await readConfigJSONFile("./src/configs/meta.json");

  return {
    root: root,
    base: "/",
    publicDir: resolve(__dirname, "public"),
    server: {
      port: 8080,
      // https: {
      //   // mkcert 等でSSL証明書を作成すると HTTPS が有効になります
      //   key: fs.readFileSync("./localhost-key.pem"),
      //   cert: fs.readFileSync("./localhost.pem"),
      // },
    },
    build: {
      outDir: resolve(__dirname, "dist"),
      rollupOptions: {
        input: rollupOptionsInput,
      },
      css: {
        devSourcemap: true, // SCSSのソースマップを生成（ビルド時には自動的に無効になる）
        postcss: {
          // .browserslistrcで指定したブラウザ用にCSSを自動で調整してくれる
          plugins: [autoprefixer()],
        },
      },
    },
    plugins: [
      // HTMLソースを minify する。
      // ◆ build -> minifyした後にprettierで整形（WordPress等の作業をしやすくする目的）
      // ◆ production -> minifyだけを行う（静的サイトとしてデプロイを前提とするため。）
      ViteMinifyPlugin(),
      // 共通パーツを読み込むための記述
      // partialDirectoryで指定したディレクトリのパーツが読み込まれる。
      handlebars({
        partialDirectory: [
          resolve(__dirname, "src/includes/globals"),
          resolve(__dirname, "src/includes/components"),
          resolve(__dirname, "src/includes/modules"),
        ],
        // /src/configs に格納のJSON設定ファイルを用いてページ毎に使える変数を適用
        // 詳しくは https://handlebarsjs.com/ をご覧ください。
        context(pagePath) {
          return {
            ...configs.global,
            page: typeof configs.meta[pagePath] !== "undefined" && configs.meta[pagePath],
            pagePath: pagePath,
          };
        },
      }),
      ViteImageOptimizer(configs.global.image.optimization),
    ],
    resolve: {
      // src/assets/scss を @ として読み込むことができる。
      // SCSSファイルで外部ファイルを読み込むときに活用すると便利。
      alias: {
        "@": resolve(__dirname, "src/assets/scss"),
        "@js": resolve(__dirname, "src/assets/js"),
      },
    },
  };
});
