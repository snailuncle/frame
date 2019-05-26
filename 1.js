//  //导入模块
//  function 导入常用函数模块() {
//    var url = 'https://raw.githubusercontent.com/snailuncle/frame/master/common.js'
//    var r = http.get(url)
//    log("code = " + r.statusCode);
//    var html = r.body.bytes()
//    var commonFunctionPath = './common.js'
//    files.write(commonFunctionPath, '')
//    files.writeBytes(commonFunctionPath, html)
//    var common = require(commonFunctionPath)
//    return common
//  }
//  var common = 导入常用函数模块()
//  log(common)
//  for (let i = 0; i < 33; i++) {
//    common.flash('fire in the hole')
//  }
