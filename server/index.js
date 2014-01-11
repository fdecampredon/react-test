/*jslint vars: true, plusplus: true, node: true */

'use strict';


require('observe-shim');
global.nativeObjetObserve = false;

var connect = require('connect'),
	fs = require('fs'),
	React = require('react'),
	http = require('http'),
	TodoApp = require('../commons/components'),
	model = require('../commons/model'),
	TodoList = model.TodoList,
	Todo = model.Todo;

var todos = new TodoList([
	new Todo('Say Hello world')
]);


function main(req, res, next) {
	
	if (req.url === "/") {
		fs.readFile('./client/index.html', 'UTF-8', function (err, fileContent) {
			React.renderComponentToString(TodoApp({todos: todos}), function (componentString) {
				res.writeHeader(200,  {'content-type': 'text/html'});
				res.end(fileContent
							.replace('{{content}}', componentString)
							.replace('{{data}}', JSON.stringify(todos.toArray())));
			});
		});
	} else {
		next();
	}
}


var app = connect()
		.use(main)
		.use(connect['static']('./public'));

http.createServer(app).listen(3000);