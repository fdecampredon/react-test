/*jslint vars: true, plusplus: true, node: true */
/*global nativeObjectObserve, document*/

'use strict';

if (!nativeObjectObserve) {
	require('observe-shim');
}

var TodoApp = require('../common/components'),
	TodoList = require('../common/model').TodoList,
	React = require('react'),
	data = [],//document.querySelector('script[type="text/json"]').innerHTML,
	TodoList = new TodoList(data);

React.renderComponent(TodoApp({ todos: TodoList }, document.querySelector('#container')));