const parser=require('node-html-parser');
var https = require('https');

var options = {
  host: 'finanswebde.com',
  path: '/doviz',
}
function simpleStringify (object){
  var simpleObject = {};
  for (var prop in object ){
    if (!object.hasOwnProperty(prop)){
      continue;
    }
    if (typeof(object[prop]) == 'object'){
      continue;
    }
    if (typeof(object[prop]) == 'function'){
      continue;
    }
    simpleObject[prop] = object[prop];
  }
  return JSON.stringify(simpleObject); // returns cleaned up JSON
}
var request = https.request(options, function (res) {
  var data = '';
  res.on('data', function (chunk) {
    data += chunk;
  });
  res.on('end', function () {
    const root = parser.parse(data)
    let rows=root.querySelector('.portfolio tbody').childNodes;
    rows.forEach(row => {
      if(row.childNodes.length===7){
        let code = row.childNodes[0].querySelector('h3 a').childNodes[0].rawText
        let buying = row.childNodes[1].querySelector('span span').childNodes[0].rawText
        let selling = row.childNodes[2].querySelector('span span').childNodes[0].rawText
        let difference = row.childNodes[5].querySelector('span span').childNodes[0].rawText
      }
    });
  });
});
request.on('error', function (e) {
  console.log(e.message);
});
request.end();

