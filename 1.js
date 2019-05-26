 //导入模块
 function 导入常用函数模块(是否强制重新下载common) {
   var 是否强制重新下载common = 是否强制重新下载common || false
   var commonFunctionPath = './common.js'

   function downloadCommon() {
     var url = 'https://raw.githubusercontent.com/snailuncle/frame/master/common.js'
     var r = http.get(url)
     var html = r.body.bytes()
     files.write(commonFunctionPath, '')
     files.writeBytes(commonFunctionPath, html)
   }
   if (是否强制重新下载common) {
     downloadCommon()
   }
   if (files.exists(commonFunctionPath)) {} else {
     downloadCommon()
   }
   var common = require(commonFunctionPath)
   return common
 }
 var common = 导入常用函数模块()
 for (let i = 0; i < 33; i++) {
   common.flash('fire in the hole')
 }
