var emmet = require("emmet");
if (process.argv.length >= 3 && process.argv[2] == "TEST") {
  console.log("Running tests");
  if (process.argv.length > 3) {
    for (var i = 3; i < process.argv.length; i++) {
      var arg = process.argv[i];
      console.log("Converting: " + arg);
      var expanded = emmet.default(arg);
      console.log("Converted to: \r\n" + expanded);
    }
  }
} else if (process.argv.length >= 3 && process.argv[2] == "help") {
  showHelp();
} else if (process.argv.length >= 3 && process.argv[2] == "RUN") {
  var PORT = 8888;
  if (process.argv.length >= 4) {
    PORT = parseInt(process.argv[3]);
  }
  run(PORT);
}

function showHelp() {
  console.log("To run: run 'node index.js RUN [PORT:optional]'");
  console.log("To test: run 'npm test'");
  console.log("To test some other case: run 'node index.js TEST div.test'");
}

var lastEmmetExp = "div.test";
function handleTestEndpoints(q, req, res) {
  var type = "text/plain";
  if (q.query.type == "json") {
    type = "application/json";
  } else if (q.query.type == "xml") {
    type = "application/xml";
  } else if (q.query.type == "html") {
    type = "text/html";
  }
  res.writeHead(200, { 'Content-Type': type });
  //console.log("converting :"+q.query.exp);
  var expand = emmet.default(q.query.exp);
  lastEmmetExp = q.query.exp;
  if (type == "text/html") {
    var defaultValue = q.query.exp;
    res.end(styleForHTML() + formToQueryEmmet(defaultValue) + "<textarea id='loremOutput' cols='51' rows='10'>" + expand + "</textarea><h1>Output:</h1>" + expand + scriptForHtml());
  } else if (type == "application/json") {
    res.end("{\"output\":\"" + expand + "\"}");
  } else if (type == "application/xml") {
    res.end(expand);
  } else if (type == "text/plain") {
    res.end(expand);
  }
}

function serverFunction(req, res) {
  if (String(req.url).indexOf("%3F") > -1) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end("Invalid url: " + req.url + "<a href='/test?exp=" + lastEmmetExp + "&type=html'>Go Back</a>");
  }
  try {
    var q = url.parse(String(req.url), true);
    if (q.pathname == "/test") {
      handleTestEndpoints(q, req, res);
    }
  } catch (e) {
    res.end(e);
  }
}

function formToQueryEmmet(defaultValue, preventAutoSubmit) {
  if (preventAutoSubmit == undefined) {
    preventAutoSubmit = "";
  }
  return `
  <form id="emmetTestForm" mathod="GET" action="test">
  <table>
  <tr><td colspan="2"><input type="hidden" name="type" value="html" style="text-align:center;font-size:20px" readonly></td></tr>
  <tr><td id="emmetExpTitle">Enter emmet expression: </td><td><input id="exp123123123" type="text" name="exp" value="${defaultValue}"></td></tr>
  <tr><td colspan="2"><input type="checkbox" name="preventAutoSubmit">Prevent Auto Submit</td></tr>
  <tr><td colspan="2"><input type="submit" value="Expand"></td></tr>
  </table>
  </form>
  `;
}

function scriptForHtml() {
  var script = `
  <script>
  var form = document.querySelector("#emmetTestForm");
  var emmetText = document.querySelector("#exp123123123");
  emmetText.addEventListener("keyup",function(){
    form.submit();
  });
  emmetText.focus();
  setTimeout(function(){ emmetText.selectionStart = emmetText.selectionEnd = 10000; }, 0);
  </script>
  `;
  return script;
}

function styleForHTML() {
  return `
  <style>
  #emmetTestForm{
    background-color:black;
    color:green;
    width:390px;
  }
  #emmetTestForm td{
    color:yellow;
    font-size:12px;
    text-align:center;
  }
  #emmetExpTitle{
    font-size:12px;
  }
  #emmetTestForm input[type='submit']{
   width:385px;
   color:white;
   background-color:blue;
  }
  #exp123123123{
    width:260px;
   }
   #loremOutput{
     background-color:rgb(20,30,40);
     color:green;
   }
  </style>
  `;
}

var http;
var url;
function run(PORT) {
  if (PORT == undefined) {
    PORT = 8888;
  }
  http = require("http");
  url = require('url');
  var server = http.createServer(serverFunction);
  server.listen(PORT, function () {
    console.log("started listening on: http://localhost:" + PORT);
  });
}

module.exports = { "run": run };