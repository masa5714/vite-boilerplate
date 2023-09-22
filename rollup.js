/*
 * このファイルは、Viteでビルド時にページとして生成するHTMLファイルをリスト化して、
 * rollupOptions.input に渡すための関数を含んでいます。
 *
 * excludesに配列でパスを渡すとビルド除外したいページを指定することもできます。
 *
 * Windows環境ではビルド除外処理の際にパスが正常に置換できない問題があるため、
 * is_windowsフラグを用いて分岐処理をしています。
 */

import { resolve } from "path";
import randomstring from "randomstring";
import { crawlingDirStream } from "directory-crawler";

const is_windows = process.platform === "win32";

const pathResolve = resolve;

export const rollupFiles = (dirName, ext, excludes = null) => {
  let excludePaths = [];
  if (is_windows) {
    if (excludes !== null && typeof excludes === "object") {
      for (let key in excludes) {
        excludePaths.push(excludes[key].replace(/\//g, "\\"));
      }
    }
  } else {
    excludePaths = excludes !== null ? excludes : [];
  }

  return new Promise(async (resolve) => {
    const extRegex = new RegExp(ext);
    const results = {};
    for await (const d of crawlingDirStream(Infinity, Infinity, dirName)) {
      let isOK = true;
      const theFilePath = pathResolve(d.path, "");

      if (d.path.match(/components/)) {
        continue;
      }

      if (d.isFile() && d.name.match(extRegex)) {
        for (let key in excludePaths) {
          if (theFilePath.includes(excludePaths[key])) {
            isOK = false;
            continue;
          }
        }
        if (isOK) {
          const keyIndex = randomstring.generate();
          results[keyIndex] = theFilePath;
        }
      }
    }
    resolve(results);
  });
};
