const menu = () => {
  console.log("このメッセージは /src/assets/js/menu.js から出力しています。");
  // jQueryを使う場合はそのまま記述すれば使えます。
  const dom = $(".hoge");
  console.log(dom);

  // 要素の有無によって実行するかどうかを判定する
  const targetElement = document.querySelector(".hoge");
  if (targetElement) {
    console.log(".hoge があるのでこのページでは実行されました。");
  } else {
    console.log(".hoge が無いのでこのページでは実行されません。");
  }
};

menu();
