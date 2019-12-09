var fs = require('fs');

var PATH = './imgs'; // 目录

//  遍历目录得到文件信息
function walk(path, callback) {
    var files = fs.readdirSync(path);

    files.forEach(function(file){
        if (fs.statSync(path + '/' + file).isFile()) {
            callback(path, file);
        }
    });
}

// 修改文件名称
function rename (oldPath, newPath) {
    fs.rename(oldPath, newPath, function(err) {
        if (err) {
          console.log(err);
            throw err;
        }
    });
}

// 运行
walk(PATH, function (path, fileName) {
  console.log(fileName, path);
    var oldPath = path + '/' + fileName, // 源文件路径
        newPath = '../../ishion/kkmob-weshineapp-com/src/pages/landing/imgs/landing_'+ fileName.replace('.png', '.jpg'); // 新路径
        console.log(oldPath, newPath);
    rename(oldPath, newPath);
});