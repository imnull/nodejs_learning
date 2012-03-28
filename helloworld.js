var http = require('http');
var url = require("url");
var fs = require('fs');

//define the web site root
var _root = __filename.substr(0, __filename.lastIndexOf('/')) + '/www';
//define listening port
var _port = 8000;

//Read file & folder list
function getFileList(dir, callback){

	function loop(dir, names, callback, index, obj){
		index = index || 0;
		obj = obj || {};
		if(index >= names.length){
			callback(obj);
			return;
		}
		var n = dir + '/' + names[index];
		fs.stat(n, function(err, stat){
			obj[names[index]] = { 
				'stat' : stat,
				'local' : n
			}
			loop(dir, names, callback, index + 1, obj)
		});
	}

	fs.readdir(dir, function(err, names){
		loop(dir, names, callback);
	});
}

getFileList(_root, function(list){
	console.log(list);
})

//read local file.
//if the file does not exists, print 404 message.
function readFile(name, callback){
	//default document
	if(name == '/') name = '/index.html';
	var ext = name.split('.').pop().toLowerCase();

	var ct = 'text/plain';
	//switch extension of the filename to get the content-type
	//other file-typies will not response
	switch(ext){
		case 'html':
			ct = 'text/html';
			read(_root + name, callback, ct);
			break;
		case 'htm':
			ct = 'text/html';
			read(_root + name, callback, ct);
			break;
		case 'txt':
			read(_root + name, callback, ct);
			break;
	}

	function read(fullname, callback, contentType){
		fs.readFile(fullname, "utf-8", function(err, file) {
			if(err) {
				callback('<h1>Wow~ 404~~!</h1>', 'text/html');
				return;
			}
			callback(file, contentType);
		});
	}
	
}

http.createServer(function (req, res) {
	var pathname = url.parse(req.url).pathname;
	readFile(pathname, function(content, contentType){
		res.writeHead(200, {'Content-Type': contentType });
		res.end(content);
	});
    
}).listen(_port, "127.0.0.1");

console.log('Server running at http://127.0.0.1:' + _port + '/');