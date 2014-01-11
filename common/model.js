
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

function Todo(title, order) {
	this.title = title;
	this.completed = false;
	this.id = 'todo_' + (idHelper++);
	this.order = order;
}



if (!nativeObjectObserve) {
	ObserveUtils.defineObservableProperties(Todo.prototype, 'title', 'completed');
}

function TodoList(data) {
	ObserveUtils.List.call(this);
	if (data) {
		for (var i = 0, l = data.length; i < l; i++) {
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
	},
	
	nextOrder: function () {
		if (!this.length) {
			return 1;
		}
		return this[this.length - 1].order;
	},
	
	  // Todos are sorted by their original insertion order.
	comparator: function (todo) {
		return null;
	}
});

exports.Todo = Todo;
exports.TodoList =  TodoList;