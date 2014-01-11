
/*jslint vars: true, plusplus: true, node: true */
/*global nativeObjectObserve*/

'use strict';

var ObserveUtils = require('observe-utils');



    
function define(target, base, definitions) {
	if (typeof base !== 'function') {
		definitions = base;
	} else {
		target.prototype = Object.create(base.prototype);
		target.prototype.constructor = target;
	}

	if (definitions) {
		var properties = Object.getOwnPropertyNames(definitions);
		properties.forEach(function (property) {
			Object.defineProperty(target.prototype, property, Object.getOwnPropertyDescriptor(definitions, property));
		});
	}
}


var idHelper = 0;

function Todo(title) {
	this.title = title;
	this.completed = false;
	this.id = 'todo_' + (idHelper++);
}



if (!global.nativeObjectObserve) {
	ObserveUtils.defineObservableProperties(Todo.prototype, 'title', 'completed');
	Todo.prototype.toJSON = function () {
		return {
			title: this.title,
			id: this.id
		};
	};
}

function TodoList(data) {
	ObserveUtils.List.call(this);
	if (data) {
		var i = 0, l = data.length;
		for (i = 0; i < l; i++) {
			this[i] = data[i];
		}
		this._length = data.length;
	}
}

define(TodoList, ObserveUtils.List, {
	completed: function () {
		return this.filter(function (todo) {
			return todo.completed;
		});
	},
	
	remaining: function () {
		return this.filter(function (todo) {
			return !todo.completed;
		});
	}
});

exports.Todo = Todo;
exports.TodoList =  TodoList;