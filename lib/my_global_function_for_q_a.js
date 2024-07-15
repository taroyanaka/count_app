function move_to_portal(){
  window.location.href = 'portal.html';
};
let tapCount = 0;
let lastTapTime = 0;
document.addEventListener('touchend', function(event) {
  const currentTime = new Date().getTime();
  const tapTime = currentTime - lastTapTime;
  if (tapTime < 500 && tapCount === 2) {
    // トリプルタップ
    console.log('tripple tap');
    // confrmでOKが押されたらportal.htmlに遷移
    if(window.confirm('go to portal?')){
      move_to_portal();
    }
    tapCount = 0;
  } else if (tapTime < 500) {
    tapCount++;
  } else {
    tapCount = 1;
  }
  lastTapTime = currentTime;
});


// 正規表現だけでURLかどうかを判定する関数
function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if(!pattern.test(str)) {
  // alert("URLではありません");
  return false;
  } else {
  return true;
  }
};

// 1秒後に任意の関数を実行する関数、第一引数にmsを入れる、第二引数に関数を入れる
// imgタグのsrcにURLを入れるときに使う
function sleep(ms, fn) {
  return new Promise(resolve => setTimeout(resolve, ms)).then(fn);
};

function to_ary(it){
  return JSON.parse(JSON.stringify(it));
};
  