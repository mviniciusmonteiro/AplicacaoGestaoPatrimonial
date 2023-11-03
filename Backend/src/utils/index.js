const fs = require('fs');

// Funções úteis para manipulação de imagens
	// Convertendo binário em arquivo
function base64_decode(base64str, fileName){
      var bitmap = Buffer.from(base64str, 'base64');

      fs.writeFileSync('src/upload/' + fileName + '', bitmap, 'binary', function (err) {
        if (err) {
          console.log('Erro ao converter string na base 64 para arquivo de imagem');
        }
      });
    }
  
// Convertendo arquivo em binário
function base64_encode(fileName) {
  var bitmap = fs.readFileSync('src/upload/' + fileName + '');
  // new Buffer();
  return Buffer.from(bitmap,'base64').toString('base64');
}

exports.base64_encode = base64_encode;
exports.base64_decode = base64_decode;