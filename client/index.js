/*jslint vars: true, plusplus: true, node: true */
/*global nativeObjectObserve, document*/

'use strict';

if (!nativeObjectObserve) {
	require('observe-shim');
}

Object.assign = function (target, source) {
	return Object.keys(source).reduce(function (target, key) {
		target[key] = source[key];
		return target;
	}, target);
};

var TodoApp = require('../commons/components'),
	TodoList = require('../commons/model').TodoList,
	Todo = require('../commons/model').Todo,
	React = require('react'),
	data = JSON.parse(document.querySelector('script[type="text/json"]').innerHTML),
	todos = new TodoList(data.map(function (data) {
		return Object.assign(new Todo(), data);
	}));

React.renderComponent(TodoApp({ todos: todos }),  document.querySelector('#container'));