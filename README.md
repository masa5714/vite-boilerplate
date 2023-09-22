# Vite ボイラープレート

Vite を活用した Web サイト制作者向けの開発キットです。

Vanilla JS や jQuery を用いて開発を始めようとすると、  
想定通りに動かないことが多く、ハードルが高く感じることがありました。

Vite ボイラープレートは、そのような問題を解決し、  
受託の Web 制作者が快適 & 高速に制作開始できる環境を意識しています。

## 特徴

- 今すぐに制作開始できる。
- HTML パーツの共通化ができる。（[Handlebars](https://handlebarsjs.com/)）
- ホットリロード（ファイル保存時に自動でブラウザをリロードしてくれる機能）
- ベンダープレフィックスの自動付与。
- meta 情報は JSON で設定するだけで簡単！（Twitter（X）のみ対応）
- 【ビルド時】画像の最適化（圧縮）
- 【ビルド時】HTML を自動整形
- 【デプロイ時】HTML を minify
- 【デプロイ時】SSH によるデプロイの雛形が用意されている。（Github Actions）

## 対象者

- LP やコーポレートサイトの受託制作をする人
- WordPress 組み込み前に静的コーディングしたい人
- Vanilla JS または jQuery でサイト制作したい人

# 【必須】制作を開始するには？

このページから zip をダウンロードし展開、  
フォルダ名を任意で変更して、下記コマンドを実行します。

```bash
npm install
```

これで準備は完了しました。  
※後述する「初期設定」を忘れずに行いましょう！

## 【必須】ローカルで開発を開始する

```bash
npm run dev
```

このコマンドを実行するとローカルサーバーが立ち上がり、  
いつでも開発が開始できます。

- http://localhost:8080/
- http://127.0.0.1:8080/

どちらでもアクセスできます。

## 【任意】HTTPS でアクセスできるようにするには？

mkcert 等で下記のコマンドを実行して、SSL 証明書を生成してください。

```bash
mkcert localhost 127.0.0.1
```

出てきたファイルを

- localhost-key.pem
- localhost.pem

という名前でルートディレクトリに格納してください。

最後に、vite.config.js の中の

```js
https: {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
},
```

この箇所のコメントアウトを解除すれば完了です。

## 【任意】ビルドをするには？

```bash
npm run build
```

このコマンドはローカル上での実行を想定しています。  
HTML や画像などの最適化を行った上で、HTML の整形処理を行います。

※ HTML の整形処理が不要であれば、 `npm run production` を実行してください。

## 【任意】デプロイするには？

`/.github/workflows/deploy.yml` というサンプルファイルをご用意しています。  
ブランチ名に「release-」が付いたものが push または merge されるとデプロイ処理が開始します。

が、使うためには下記の設定を済ませる必要があります。  
Github の settings -> Secrets and variables -> actions ページから、  
「New repository secrets」でシークレットを追加します。

| 項目名          | 説明                                           |
| --------------- | ---------------------------------------------- |
| PATH            | 公開サーバーのどのディレクトリにデプロイするか |
| HOST            | 公開サーバーのホスト名                         |
| PORT            | 公開サーバーの接続ポート                       |
| USER            | 公開サーバー接続用のユーザー名                 |
| PASS            | 公開サーバー接続用のパスワード                 |
| SSH_PRIVATE_KEY | SSH プライベートキー                           |

※rsync を用いて SSH でデプロイするため、SSH のプライベートキーが必要です。

※デプロイ時に dist ディレクトリが Github 上の Artifacts に保存されます。`workflows/remove-old-artifacts.yml` にて 7 日以前のものは毎週日曜日 0 時に削除するスケジューリングになっていますが、過度なデプロイをすると Github から与えられた容量を超える可能性も考えられます。その際は手動で Artifacts を削除するなどの対策を行ってください。

※エックスサーバーで実行確認済み。SSH に対応しているサーバーは問題なく動くかと思います。

# 初期設定を行っておきましょう

`/src/configs/global.json` がサイト全体の設定ファイルです。  
ここで設定した内容は、JS プラグインの利用、meta 情報や画像最適化に適用されます。

## global.json を設定

```js
{
  "site": {
    "name": "サンプルサイト", // サイトのタイトルを記入
    "name_separate": " | ", // ページタイトルとサイトタイトルの区切り文字
    "domain": "example.com", // 公開時のドメインを記入
    "favicon": "/favicon.svg", // faviconの格納箇所を指定（publicディレクトリ内）
    "description": "サンプルサイトの説明文です。", // サイトタイトルを指定
    "ogp": { // OGP
      "type": "website", // サイトの種類
      "image": "/ogp.jpg" // OGP画像のパス（publicディレクトリ内）
    },
    "twitter": { // Twitter（X）用OGP
      "card": "summary_large_image", // Twitter（X）カードの種類
      "username": "@example" // Twitter（X）アカウント
    }
  },
  "js": {
    "jQuery": true, // jQuery（true -> 使う / false -> 使わない）
    "jQueryEasing": true, // jQuery Easing（true -> 使う / false -> 使わない）
    "gsap": false // GSAP（true -> 使う / false -> 使わない）
  },
  "image": {
    "optimization": { // 画像の最適化処理（vite-plugin-image-optimizer）
      "png": { // .png が対象
        "quality": 80
      },
      "jpeg": { // .jpg が対象
        "quality": 80
      },
      "jpg": { // .jpeg が対象
        "quality": 80
      },
      "webp": { // .webp が対象
        "quality": 80,
        "lossless": true
      }
    }
  }
}
```

# HTML

HTML 周辺の使い方や書き方、注意点など。

### ページを追加するには？

`/src/pages/` に追加した HTML ファイルがページ扱いとなります。

例えば、

- `/src/pages/about/index.html` は `http://localhost:8080/about/` でアクセスできます。
- `/src/pages/about/enkaku.html` は `http://localhost:8080/about/enkaku.html` でアクセスできます。

※ ローカルサーバーでは `index.html` に限り、末尾に `/` が無いと正しくアクセスできません。

### リンクを貼るときの注意

`index.html` へのリンクを貼るときに限り、末尾の `/` を忘れずに！

```html
<a href="/about/">abouページへ</a>
```

開発環境では、 `/` を忘れるとページ遷移できません。  
※ビルド時には有無は影響しないようです。

### 共通パーツを作って適用するには？

[Handlebars](https://handlebarsjs.com/) を用いて HTML を共通化できます。

- `src/includes/globals`
- `src/includes/components`
- `src/includes/modules`

この中に格納した HTML ファイル（例： header.html）は `pages` の HTML にて下記のように呼び出すことができます。

```html
{{>header}}
```

ファイル名（拡張子無し）で指定するだけで読み込みされます。

なお、共通パーツの HTML は保存してもホットリロードが効きません。  
手動でブラウザをリロードしてください。

# SCSS

`/src/pages/app.scss` をスタート地点として、  
様々な SCSS ファイルを読み込んでいます。

リセット CSS として `ress.css` を採用しています。

各個人で使いやすい形式があるかと思いますので、  
自由にカスタマイズしてご利用ください。

### PC と スマホで要素の表示／非表示を切り替える

`globals/_common.scss` にてレスポンシブ用の切り替えの CSS を書いてあります。  
data 属性として HTML に付与するだけで利用でき、  
HTML を見るだけで明確にどのデバイス専用のソースかが読めるようになります。

- `[data-device="pc"]` : PC だけ表示をする。
- `[data-device="sp"]` : スマホだけ表示する。

```html
<div data-device="pc">PC表示のときだけ表示されます。</div>
<div data-device="sp">スマホ表示のときだけ表示されます。</div>
```

### VSCode で補完を効かせるためには？

本リポジトリでは、エイリアスをご用意していますが、  
VSCode 上で補完が効かないので相対パスでの指定を推奨します。

# JS

JS 周辺の使い方や書き方、注意点など。

`/src/pages/app.js` をスタート地点として、  
様々な JS ファイルをまとめた `/src/assets/js/index.js` を読み込むことで、  
JS が動く仕様にしています。

### JS ファイルを追加するには？

`/src/assets/js/` の中に自由に JS ファイルを追加してください。  
書き方にも特にルールはありません。（ただし、ページ全体で適用される関係上、要素の有無で処理可否を判定する処理を含める必要があります。後述します。）

適用するために、  
`/src/assets/js/index.js` にて `export * from "JSファイル名"` とすれば適用されます。

### 要素の有無で処理可否を判定する処理

ページ全体で処理が実行される関係上、
JS ファイル単位で処理対象の要素が存在するかをチェックする必要があります。

**判定の例**

```js
const process = () => {
  console.log("実行された");
};

(() => {
  const element = document.querySelector(".example");
  if (!element) {
    return; // 対象要素が存在しないのでここで終了
  }

  // 要素が存在すれば process 関数が実行される
  process();
})();
```

### JS ライブラリ（jQuery 等）を使いたい

デフォルトで jQuery と jQuery Easing は有効化しています。  
`/src/configs/global.json` の `js` 部分で有効化 / 無効化ができます。

| ライブラリ    | デフォルト |
| ------------- | ---------- |
| jQuery        | 有効       |
| jQuery Easing | 有効       |
| GSAP          | 無効       |

ここで設定した結果は、  
`/src/includes/globals/scripts.html` にて出力判定をしています。

※ `global.json` を変更した後はローカルサーバー停止後、改めて `npm run dev` を実行した後に適用されます。

### PC と スマホ で処理を分岐したい

PC と スマホで適用したい JS が異なるケースは多いことでしょう。  
`/src/assets/js/libs/breakpoints.js` というものをご用意しました。

`breakpoints.js` の冒頭に書かれた `breakpoints` の値はプロジェクトに応じて変更してください。

**使い方の例**

```js
import { observerStartBody } from "@js/libs/breakpoints";

const func = () => {
  console.log("eventが発火した！");
};

observerStartBody({
  pc: {
    add: () => {
      // PC表示注に適用したい処理
      window.addEventListener("scroll", func);
    },
    remove: () => {
      // PC表示以外になったときに解除したい処理
      window.removeEventListener("scroll", func);
    },
  },
  sp: {
    add: () => {
      // スマホ表示中に適用したい処理
      window.addEventListener("click", func);
    },
    remove: () => {
      // スマホ表示以外になったときに解除したい処理
      window.removeEventListener("click", func);
    },
  },
});
```

add は対象表示のときに適用を行います。  
remove は対象表示以外のものに切り替わったときに実行され、  
不要なイベントリスナー等をクリーンアップするなどの使い方ができます。

# 画像について

画像の扱いや注意点など。

### 画像はどこに格納すればいいの？

`/public/` 配下であれば自由に入れることができます。

※ただし、SVG については極力ここには入れないように心がけてください。

### SVG はどこに格納すればいいの？

SVG は `.svg` としてではなく、 `.html` 共通パーツとしての利用を推奨します。  
※画像データが含まれる SVG は `/public/` に格納しましょう。（ファイルサイズ 5kb を超えるかどうかを目安にしてみてください。）

参考例として、 `/src/includes/modules` に参考例を格納しています。

使うときは `{{>iconMenu}}` と書くだけで HTML として呼び出しされます。

**取り扱いやすい SVG にするための加工**

- width / height を削除しよう。
- viewbox はそのまま残しておこう。
- id 名を付与しておこう。

### SVG スプライトを積極的に使おう

`.html` 共通パーツとして SVG を使う場合、 SVG スプライトを積極的に使いましょう。  
SVG スプライトを使うと hover 時に fill や stroke を変更できるなど、実装が楽になります。

```html
<div class="use-sprite">{{>iconMenu}}</div>

<svg viewBox="0 -960 960 960">
  <use href="#icon-menu"></use>
</svg>
```

**SVG スプライトの使い方**
`<div class="use-sprite"> ~ </div>` で SVG を囲っておきます。  
`svg`タグで呼び出す SVG の viewbox と id 名を指定するだけ。

何度も同じ SVG が出てくるときは SVG スプライトを使うと便利です！

### 画像を表示するには？

**HTML の場合**

```html
<img src="/images/vite.png" />
```

**CSS の場合**

```scss
.hoge {
  background: url("/images/vite.png") no-repeat;
}
```

どちらも `/public/images/vite.png` を参照している例です。

### 画像の最適化（圧縮）

`npm run build` を実行すると自動的に画像の最適化が開始されます。
`/src/configs/global.json` の `image.optimization` の値を元に最適化処理が行われます。

最適化処理は [vite-plugin-image-optimizer](https://github.com/FatehAK/vite-plugin-image-optimizer) で行われています。（内部的には [Sharp.js](https://github.com/lovell/sharp) が処理しています。）

画像最適化オプションの記述は [Sharp.js の公式ドキュメント](https://sharp.pixelplumbing.com/api-output)をご覧ください。

# コンポーネントを作る

Web サイト制作をする際、先に小さなパーツを作ってしまった方が後々楽です。  
`/src/pages/components/` の中で自由にパーツを作っておきましょう。

ビルド時には `/src/pages/components/` の中は無視されます。  
もちろん開発環境では `http://localhost:8080/components/sample.html` などとして閲覧できます。  
ページとして生成されることはありませんので安心してください。（rollup.js で除外処理しています。）

※ Storybook はサイト制作としてはヘビーな感じがするので、/components/ ディレクトリを活用した方が気軽だと思います。

# meta 情報を記述するには？

各ページの HTML で `{{>head}}` を記述すると、 `/src/includes/globals/head.html` が呼び出され、meta 情報が出力されます。

meta 情報は下記の JSON ファイルで設定を行います。

- `/src/configs/global.json` : サイト全体の meta を指定
- `/src/configs/meta.json` : ページ単位の meta を指定

`npm run build` をして静的 HTML を生成して出力結果を確認してみましょう。

### global.json

```js
{
  "site": {
    "name": "サンプルサイト", // サイトのタイトルを記入
    "name_separate": " | ", // ページタイトルとサイトタイトルの区切り文字
    "domain": "example.com", // 公開時のドメインを記入
    "favicon": "/favicon.svg", // faviconの格納箇所を指定（publicディレクトリ内）
    "description": "サンプルサイトの説明文です。", // サイトタイトルを指定
    "ogp": { // OGP
      "type": "website", // サイトの種類
      "image": "/ogp.jpg" // OGP画像のパス（publicディレクトリ内）
    },
    "twitter": { // Twitter（X）用OGP
      "card": "summary_large_image", // Twitter（X）カードの種類
      "username": "@example" // Twitter（X）アカウント
    }
  }
}
```

### meta.json

```js
{
  // パス指定でページ単位のmeta情報を指定
  "/about/index.html": {
    "pageTitle": "会社概要", // ページタイトル
    "description": "会社概要ページの説明文です。", // ページの説明文
    "ogp": { // OGP
      "type": "article", // OGPの種類を上書き
      "image": "/images/ogp.jpg" // OGP画像のパスを上書き
    },
    "twitter": { // Twitter（X）
      "card": "summary" // Twitterカードの種類を上書き
    }
  },
  "/about/enkaku.html": {
    "pageTitle": "会社の沿革ページ"
  }
}
```

# エイリアス

エイリアスとは簡単に表すと、文字列にニックネームを付けるようなものです。  
JS ディレクトリや SCSS ディレクトリにどこからでも同じ記述でアクセスできて便利です。

| 項目 | エイリアス | パス               |
| ---- | ---------- | ------------------ |
| js   | @js        | `/src/assets/js`   |
| scss | @          | `/src/assets/scss` |

JS の場合 `import * as hoge from "@js/index";` のように書けます。  
SCSS の場合 `@use "@/globals" as *;` のように書けます。

---

# Github Actions

Vite ボイラープレートには、下記の Workflows を備えています。

- `deoloy.yml` : SSH でサーバーにデプロイします。「release-\*」ブランチへのプッシュで実行されます。利用には初期設定が必要です。
- `remove-old-artifacts.yml` : deploy.yml で出力された dist ディレクトリを毎週日曜日の午前 0 時に 7 日以前に作られたものを自動で削除します。Github から与えられた容量を確保します。

---

# npm scripts

| scripts     | 説明                                                                            |
| ----------- | ------------------------------------------------------------------------------- |
| prebuild    | ビルド前に実行。<br>dist ディレクトリを削除。                                   |
| dev         | 開発サーバーを起動。                                                            |
| build       | ビルドを実行。<br>dist ディレクトリを生成し、生成した HTML を prettier で整形。 |
| production  | ビルドを実行し、HTML を minify。                                                |
| preview     | ビルド結果をプレビュー。                                                        |
| format-html | dist ディレクトリの HTML ファイルを prettier で整形。                           |
