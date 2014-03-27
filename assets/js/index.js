$(function() {
/**
* 删除左右两端的空格
*/
function trim(str){
     return str.replace(/(^\s*)(\s*$)/g,'');
}
/**
* 删除左边的空格
*/
function ltrim(str){
  return str.replace(/(^\s*)/g,'');
}
/**
* 删除右边的空格
*/
function rtrim(str){
  return str.replace(/(\s*$)/g,'');
}

//debugger;
function Check() {
  var searchValue = document.getElementById("ck").value;
  if (trim(searchValue) == "" || searchValue == null) {
    alert("请输入搜索内容！");
    return false;
  }
      
  if(trim(searchValue).indexOf(' ')>=0){
    alert("搜索内容中不能含有空格！");
    return false;
  }
  //正则表达式，填写#号部分,test结果为false表示不含有非法字符   /^[^####]*$/.test()
  if (!(/^[^'?`;"_~<>!@#$%^&*()+-]*$/.test(searchValue))) {
    alert("搜索内容中含有非法字符！");
    return false;
  }
  return true; 
}
});