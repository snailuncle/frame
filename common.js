//  //导入模块
//  function 导入常用函数模块(){
//   var url='https://raw.githubusercontent.com/snailuncle/frame/master/common.js'
//   var r = http.get(url)
//   log("code = " + r.statusCode);
//   var html=r.body.bytes()
//   files.write('./autojsCommonFunctions.js','')
//   files.writeBytes('./autojsCommonFunctions.js',html)
//   var common=require('./autojsCommonFunctions.js')
//   return common
// }
// var common=导入常用函数模块()
// log(common)
// for(let i=0;i<33;i++){
//   common.闪光弹('fire in the hole')
// }

var 是否打印日志 = false

function getSDPath() {
  return files.getSdcardPath()
}

function myLog() {
  var path = files.join(getSDPath(), 'myLog.txt')
  var info = JSON.stringify(Array.prototype.slice.call(arguments)) + '\n'
  if (是否打印日志) {
    files.append(path, info)
  }
}

function exist(propFeature, searchCount, intervalTime) {
  var searchCount = searchCount || 1
  var intervalTime = intervalTime || 1000
  //propFeature是一个json格式
  //desc,text,id,boundsInside,bounds,boundsContains
  if (!(getObjType(propFeature) == "Object")) {
    var obj = {
      k1: "v1",
      k2: "v2",
      k3: "v3"
    }
    throw '请传入一个对象,格式如下' + JSON.stringify(obj)
  }
  var propFeature = propFeature || {}
  var mySelector = ""
  for (var k in propFeature) {
    if (k == "boundsInside" || k == "bounds" || k == "boundsContains") {
      mySelector += k + "(" + propFeature[k][0] + "," + propFeature[k][1] + "," + propFeature[k][2] + "," + propFeature[k][3] + ")."
      continue;
    }
    mySelector += k + "(\"" + propFeature[k] + "\")."
  }
  mySelector += 'visibleToUser().findOnce()'
  for (var i = 0; i < searchCount; i++) {
    var searchResult = eval(mySelector)
    if (searchResult) {
      return searchResult
    }
    sleep(intervalTime)
  }
  return false
}

function getObjType(obj) {
  // JavaScript 标准文档中定义: [[Class]] 的值只可能是下面字符串中的一个： Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String.
  var result = Object.prototype.toString.call(obj)
  result = result.match(/ \w+/)[0]
  result = result.replace(/ /g, '')
  return result
}

function randomDelay(time) {
  var time = time || 1000
  time = time + random(0, 1000)
  sleep(time)
}

function 提取控件区域信息从控件的字符串描述中(view) {
  function findNum(str) {
    return str.match(/\d+/g);
  }
  var viewText = view.toString()
  var viewRect = viewText.match(/boundsInScreen: Rect\(\d+, \d+ \- \d+, \d+\);/)
  if (viewRect) {
    var nums = findNum(viewRect[0])
    if (nums) {
      if (nums.length === 4) {
        for (var i = 0; i < nums.length; i++) {
          nums[i] = parseInt(nums[i])
        }
        var info = {
          left: nums[0],
          top: nums[1],
          right: nums[2],
          bottom: nums[3],
        }
        return infok
      }
    }
  }
}

function getViewAreaInformation(view) {
  var viewBounds;
  try {
    viewBounds = view.bounds()
  } catch (e) {
    viewBounds = 提取控件区域信息从控件的字符串描述中(view)
  }
  if (viewBounds) {

  } else {
    alert('获取控件区域信息失败')
  }
  var left = viewBounds.left
  var top = viewBounds.top
  var right = viewBounds.right
  var bottom = viewBounds.bottom
  var centerX = viewBounds.left + (viewBounds.right - viewBounds.left) / 2
  var centerY = viewBounds.top + (viewBounds.bottom - viewBounds.top) / 2
  var width = viewBounds.right - viewBounds.left
  var height = viewBounds.bottom - viewBounds.top

  var info = {}
  info.left = left
  info.top = top
  info.right = right
  info.bottom = bottom
  info.centerX = centerX
  info.centerY = centerY
  info.width = width
  info.height = height

  return info
}

function doubleClick(x, y) {
  var k = 5
  press(x + random(-k, k), y + random(-k, k), random(3, 10))
  sleep(random(30, 100))
  press(x + random(-k, k), y + random(-k, k), random(3, 10))
}

function clickView(view) {
  if (view) {
    var x = view.bounds().centerX()
    var y = view.bounds().centerY()
    press(x, y, 1)
  } else {
    myLog('传入点击控件中的view异常\n' + 'view=' + String(view))
    toast('传入点击控件中的view异常\n' + 'view=' + String(view))
  }
}

function ring(播放时长, 铃声类型, 是否循环播放) {
  var 播放时长 = 播放时长 || 6000
  var 铃声类型 = 铃声类型 || 0
  var 是否循环播放 = 是否循环播放 || false
  if (是否循环播放) {
    播放时长 = 666 * 1000
  }
  var 铃声选择结果 = android.media.RingtoneManager.TYPE_NOTIFICATION
  switch (铃声类型) {
    case 0:
      铃声选择结果 = android.media.RingtoneManager.TYPE_RINGTONE
      break;
    case 1:
      铃声选择结果 = android.media.RingtoneManager.TYPE_ALARM
      break;
    case 2:
      铃声选择结果 = android.media.RingtoneManager.TYPE_ALL
      break;
    default:
      break;
  }
  var mp = new android.media.MediaPlayer();
  mp.setDataSource(context, android.media.RingtoneManager.getDefaultUri(铃声选择结果));
  if (是否循环播放) mp.setLooping(true);
  mp.prepare();
  mp.start();
  threads.start(function () {
    sleep(播放时长)
    if (mp.isPlaying()) {
      mp.stop()
    }
  });
  return mp;
}

function 启动app(appName) {
  launchApp(appName)
}

function getLatestApp() {
  var pm = context.getPackageManager()
  var appList = pm.getInstalledApplications(0)
  var appInfoList = []
  for (let i = 0; i < appList.size(); i++) {
    var app = appList.get(i)
    var appInfo = {
      appName: app.loadLabel(pm),
      packageName: app.packageName,
      isSystemApp: app.isSystemApp(),
      firstInstallTime: pm.getPackageInfo(app.packageName, 0).firstInstallTime
    }
    appInfoList.push(appInfo)
  }
  appInfoList.sort((a, b) => {
    return b.firstInstallTime - a.firstInstallTime
  })
  var packageName = appInfoList[0].packageName
  launch(packageName)
  return appInfoList[0].appName
}

function getAppVersion(appName) {
  function getPackageVersion(packageName) {
    importPackage(android.content);
    var pckMan = context.getPackageManager();
    var packageInfo = pckMan.getPackageInfo(packageName, 0);
    return packageInfo.versionName;
  }
  var packageName = getPackageName(appName);
  return getPackageVersion(packageName)
}

function getFileModificationTime(path) {
  var time = new java.io.File(files.path(path)).lastModified();
  return time
}

function getFileLength(path) {
  var size = new java.io.File(path).length()
  return size
}

function md5(string) {
  return java.math.BigInteger(1, java.security.MessageDigest.getInstance("MD5")
    .digest(java.lang.String(string).getBytes())).toString(16);
}

function getScreenOrientation() {
  var a = context.resources.configuration.orientation;
  if (a === 1) {
    return 'vertical'
  } else {
    return 'horizontal'
  }
}

function getTime(time) {
  if (time) {
    return new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(time));
  } else {
    return new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
  }
}

function getAppIcon(appName) {
  importClass(java.io.File);
  importClass(java.io.FileOutputStream);
  importClass(android.graphics.Bitmap);
  var pm = context.getPackageManager();
  importClass(android.util.DisplayMetrics)
  var name = appName
  var packageName = app.getPackageName(name);
  var appInfo = pm.getApplicationInfo(packageName, 0);
  var bmp = appInfo.loadIcon(pm).getBitmap();
  var imgPath = files.join(files.getSdcardPath(), name + '.jpg')
  files.create(imgPath);
  var f = new File(imgPath);
  var fOut = new FileOutputStream(f);
  bmp.compress(Bitmap.CompressFormat.JPEG, 100, fOut);
  fOut.flush();
  fOut.close();
  var img = images.read(imgPath)
  return img
  // app.viewFile(imgPath)
}

function getEditDistance(sm, sn) {
  // var mindist=minEditDist("126","456")
  // print(mindist)
  var m = sm.length + 1
  var n = sn.length + 1
  var matrix = new Array();
  for (var i = 0; i < m; i++) {
    matrix[i] = new Array();
    for (var j = 0; j < n; j++) {
      matrix[i][j] = 0;
    }
  }
  matrix[0][0] = 0
  for (let i = 1; i < m; i++) {
    matrix[i][0] = matrix[i - 1][0] + 1
  }
  for (let j = 1; j < n; j++) {
    matrix[0][j] = matrix[0][j - 1] + 1
  }
  cost = 0
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (sm[i - 1] == sn[j - 1]) {
        cost = 0
      } else {
        cost = 1
      }
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)
    }
  }
  return matrix[m - 1][n - 1]

}

function getAllAppNames() {
  var allAppNames = []
  var pm = context.getPackageManager()
  let list = pm.getInstalledApplications(0)
  for (let i = 0; i < list.size(); i++) {
    let p = list.get(i)
    var app = {
      appName: p.loadLabel(pm),
      packageName: p.packageName
    }
    allAppNames.push(app.appName)
  }
  return allAppNames
}

function getAllText(setting) {
  var setting = setting || {}
  var defaultSetting = {
    getText: true,
    getDesc: true,
    getId: false,
    removeRepetitiveElements: true
  }
  Object.assign(defaultSetting, setting);
  var allStr = []
  var getDescAndTextAndIdOfNode = function (node) {
    if (node) {
      if (defaultSetting.getText) {
        var text = node.text()
        if (!!text) {
          allStr.push(text)
        }
      }
      if (defaultSetting.getDesc) {
        var desc = node.desc()
        if (!!desc) {
          allStr.push(desc)
        }
      }
      if (defaultSetting.getId) {
        var id = node.id()
        if (!!id) {
          allStr.push(id)
        }
      }
    }
    for (let i = 0; i < node.childCount(); i++) {
      getDescAndTextAndIdOfNode(node.child(i));
    }
  }
  var getFrameLayoutNode = function () {
    return className('FrameLayout').findOne(2000)
  }
  getDescAndTextAndIdOfNode(getFrameLayoutNode())

  function removeRepetitiveElements(arr) {
    var obj = {}
    for (let i = 0; i < arr.length; i++) {
      if (obj.hasOwnProperty(arr[i])) {} else {
        obj[arr[i]] = true
      }
    }
    return Object.keys(obj)
  }
  if (defaultSetting.removeRepetitiveElements) {
    allStr = removeRepetitiveElements(allStr)
  }
  return allStr
}

function flash(content, x, y, color, t) {

  var single = (function () {
    var unique;

    function getInstance() {
      if (unique === undefined) {
        unique = new Flash();
      }
      return unique;
    }
    return {
      getInstance: getInstance
    }
  })();

  function Flash() {}
  Flash.prototype.update = function (content, x, y, color, t) {
    this.content = content || '未传入参数'
    this.x = x || random(100, 300)
    this.y = y || random(100, 900)
    this.color = color || -2278181
    this.t = t || 2000
  }
  Flash.prototype.show = function () {
    var window = floaty.rawWindow( <card cardBackgroundColor = "#aa00FF00"
      cardCornerRadius = "18dp" >
      <text id = "text"
      size = "30dp"
      layout_width = "wrap_content"
      layout_height = "wrap_content"
      layout_gravity = "center"
      gravity = "center"
      paddingLeft = "10"
      paddingRight = "10"
      paddingTop = "10"
      paddingBottom = "10" > 123 </text> </card>
    );
    window.text.setText(this.content);
    window.text.setBackgroundColor(this.color);
    window.setPosition(this.x, this.y);
    setTimeout(() => {
      window.close();
    }, this.t);
  }

  function flash(content, x, y, color, t) {
    var content = content.toString()
    var f = single.getInstance()
    f.update(content, x, y, color, t)
    f.show()
  }
  var color = color || colors.rgb(random(0, 255), random(0, 255), random(0, 255))
  flash(content, x, y, color, t);

}

function randomStr(PassLength) {
  var PassLength = PassLength || 2
  var str = 'abcdefghijklmnopqrstuvwxyz';
  var STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var num = '0123456789';
  var sym = '+=-@#~,.[]()!%^*$';
  var text = str.split('').concat(STR.split(''))
  var pw = '';
  for (i = 0; i < PassLength; i++) {
    var strpos = random(0, text.length - 1);
    pw += text[strpos].charAt(random(0, text[strpos].length - 1));
  }
  return pw;
}

function slippery(slipperyDistance) {
  var slipperyDistance = slipperyDistance || 100;
  var randomP = random(500, 600);
  var points = [randomP];
  var interval = 0.1;
  var x0 = random(780, 900);
  var y0 = random(1500, 1600);
  var a = slipperyDistance;
  for (var t = 0; t < Math.PI / 2; t += interval) {
    var x = x0 - a * (1.8 * Math.cos(t * 0.9) - Math.cos(2 * t * 0.9));
    var y = y0 - a * (5 * Math.sin(t * 0.9) - Math.sin(2 * t * 0.9));
    points.push([parseInt(x), parseInt(y)]);
  }
  gesture.apply(null, points);
}

function getDeflateWebPage(url, headers) {
  importClass('java.io.BufferedReader');
  importClass('java.io.InputStreamReader');
  importClass("java.util.zip.InflaterInputStream")
  importClass('java.io.ByteArrayInputStream');
  importClass("java.util.zip.Inflater")
  var headers = headers || {}
  var res = http.get(
    url, {
      headers: headers
    })
  var deflateFileContent = res.body.bytes()
  var 网页内容 = null;
  if (deflateFileContent) {
    var br = new BufferedReader(new InputStreamReader(new InflaterInputStream(new ByteArrayInputStream(deflateFileContent), new Inflater(true))));
    var lns = [],
      cl;
    while (cl = br.readLine()) lns.push(cl);
    网页内容 = lns.join("\n")
    return 网页内容
  } else {
    toast('getDeflateWebPage ERROR')
    return false
  }
}

function getGzipWebPage(url, form, headers, method) {
  var method = method || 'get'
  var headers = headers || {}

  function 保存zip文件(zipFile) {
    var path = files.join(files.cwd(), "getGzipWebPage/webPage.gzip.js")
    files.createWithDirs(path)
    log("path=", path)
    // path= /storage/emulated/0/脚本/zip文件专用/test.zip
    files.writeBytes(path, zipFile)
    var r = 解压zip文件(path)
    log(r)
    return r
  }

  function 解压zip文件(文件路径) {
    //同一目录下的同一文件名
    // unzipGzipFile(sourceGzipFilePath, targetPath)
    var fileName = files.getName(文件路径)
    var 解压后的文件路径 = 文件路径.replace(fileName, 'webPage.js')
    log('解压的解压后的文件路径=', 解压后的文件路径)
    files.createWithDirs(解压后的文件路径)
    // com.stardust.io.Zip.unzip(new java.io.File(文件路径), new java.io.File(解压后的文件路径))
    var sourceGzipFilePath = 文件路径
    var targetPath = 解压后的文件路径
    unzipGzipFile(sourceGzipFilePath, targetPath)
    return targetPath
  }

  function unzipGzipFile(sourceGzipFilePath, targetPath) {
    importClass(java.io.FileInputStream);
    importClass(java.util.zip.GZIPInputStream);
    importClass('java.io.FileOutputStream');
    var sourceGzipFilePath = sourceGzipFilePath || files.join(files.getSdcardPath(), 'tempSourceGzipFilePath.js')
    var targetPath = targetPath || files.join(files.getSdcardPath(), 'tempTargetPath.js')
    var sChunk = 8192;
    var gzipFileInputStream = new FileInputStream(sourceGzipFilePath);
    var zipin = new GZIPInputStream(gzipFileInputStream);
    var buffer = util.java.array('byte', sChunk)
    var out = new FileOutputStream(targetPath);
    var length;
    while ((length = zipin.read(buffer, 0, sChunk)) != -1)
      out.write(buffer, 0, length);
    out.close();
    zipin.close();
  }
  var res = null;
  if (method == 'get') {
    res = http.get(
      url, {
        headers: headers
      })
  } else if (method == 'post') {
    res = http.post(
      url, form, {
        headers: headers
      })
  } else {
    alert('请自行添加get post 之外的方法')
    return false
  }

  var gzipFileContent = res.body.bytes()
  var 网页内容 = null;
  if (gzipFileContent) {
    var 网页保存路径 = 保存zip文件(gzipFileContent)
    网页内容 = files.read(网页保存路径)
    return 网页内容
  } else {
    toast('getGzipWebPage ERROR')
    return false
  }
}

function strip(str) {
  var whitespace = ' \0\n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
  for (var i = 0, len = str.length; i < len; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }
  for (i = str.length - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

function isLargeArrayContainsSmallArray(bigArr, smallArr) {
  //对于重复的元素采用计数的方式对比
  var bigArrObj = {}
  var smallArrObj = {}
  for (let i = 0; i < bigArr.length; i++) {
    var has = bigArrObj.hasOwnProperty(bigArr[i])
    if (has) {
      bigArrObj[bigArr[i]]++;
    } else {
      bigArrObj[bigArr[i]] = 1
    }
  }
  for (let i = 0; i < smallArr.length; i++) {
    var has = smallArrObj.hasOwnProperty(smallArr[i])
    if (has) {
      smallArrObj[smallArr[i]]++;
    } else {
      smallArrObj[smallArr[i]] = 1
    }
  }
  for (var k in smallArrObj) {
    if (bigArrObj.hasOwnProperty(k) && bigArrObj[k] >= smallArrObj[k]) {} else {
      return false
    }
  }
  return true
}

function deepCopy(obj) {
  if (typeof obj != 'object') {
    return obj;
  }
  var newobj = {};
  for (var attr in obj) {
    newobj[attr] = deepCopy(obj[attr]);
  }
  return newobj;
};

function oppositeColor(color) {
  return (-1 - colors.argb(0, colors.red(color), colors.green(color), colors.blue(color)));
};

function dateToTimestamp(date) {
  // log(dateToTimestamp('2019-04-28 18:24:23'))
  var 参数符合格式吗 = /\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/.test(date)
  if (!参数符合格式吗) {
    alert('日期格式错误,正确的日期格式 = yyyy-MM-dd HH:mm:ss')
    return false
  }
  var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
  var ts = java.lang.String.valueOf(sdf.parse(date).getTime());
  ts = new java.math.BigDecimal(ts).toPlainString().toString();
  return (ts);
}

function Command(name, todo, propFeatureOfTheWidgetThatMustAppear) {
  this.name = name
  this.todo = todo
  this.propFeatureOfTheWidgetThatMustAppear = propFeatureOfTheWidgetThatMustAppear
  this.limitTime = 3
  this.serialNumber = 0
  this.intervalTime = 1000
  this.success = false
}
Command.prototype.check = function () {
  return exist(this.propFeatureOfTheWidgetThatMustAppear)
}
Command.prototype.go = function () {
  for (var i = 0; i < this.limitTime; i++) {
    this.todo()
    this.success = this.check()
    if (this.success) {
      return true
    } else {
      sleep(random(1000, 2000) + this.intervalTime)
    }
  }
}

var common = {}
common.getSDPath = getSDPath
common.myLog = myLog
common.exist = exist
common.getObjType = getObjType
common.randomDelay = randomDelay
common.提取控件区域信息从控件的字符串描述中 = 提取控件区域信息从控件的字符串描述中
common.getViewAreaInformation = getViewAreaInformation
common.doubleClick = doubleClick
common.clickView = clickView
common.ring = ring
common.启动app = 启动app
common.getLatestApp = getLatestApp
common.getAppVersion = getAppVersion
common.getFileModificationTime = getFileModificationTime
common.getFileLength = getFileLength
common.md5 = md5
common.getScreenOrientation = getScreenOrientation
common.getTime = getTime
common.getAppIcon = getAppIcon
common.getEditDistance = getEditDistance
common.getAllAppNames = getAllAppNames
common.getAllText = getAllText
common.flash = flash
common.randomStr = randomStr
common.slippery = slippery
common.getDeflateWebPage = getDeflateWebPage
common.getGzipWebPage = getGzipWebPage
common.strip = strip
common.isLargeArrayContainsSmallArray = isLargeArrayContainsSmallArray
common.deepCopy = deepCopy
common.oppositeColor = oppositeColor
common.dateToTimestamp = dateToTimestamp
common.Command = Command
