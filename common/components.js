/*jslint vars: true, plusplus: true, node: true */

'use strict';

var React = require('React'),
	model = require('./model'),
	Todo = model.Todo;

var Utils = {
	pluralize: function (count, word) {
		return count === 1 ? word : word + 's';
	},

	stringifyObjKeys: function (obj) {
		var s = '', key;
		for (key in obj) {
			if (obj.hasOwnProperty(key) && obj[key]) {
				s += key + ' ';
			}
		}
		return s;
	}
};

var html = React.DOM;

var ObserveMixin = {
	componentDidMount: function () {
		var self = this;
		this.objectObserver = function (changes) {
			self.forceUpdate();
		};
		Object.observe(this.getModel(), this.objectObserver);
	},
	componentWillUnmount: function () {
		Object.unobserve(this.getModel(), this.objectObserver);
	}
};

// Begin React stuff

var TodoItem = React.createClass({
	mixins: [ObserveMixin],
	handleSubmit: function (event) {
		var val = this.refs.editField.getDOMNode().value.trim();
		if (val) {
			this.props.onSave(val);
		} else {
			this.props.onDestroy();
		}
		return false;
	},

	onEdit: function () {
		this.props.onEdit();
		this.refs.editField.getDOMNode().focus();
	},
	
	getModel: function () {
		return this.props.todo;
	},

	render: function () {
		var classes = Utils.stringifyObjKeys({
			completed: this.props.todo.completed,
			editing: this.props.editing
		});
		return html.li(
			{className : classes},
			html.div(
				{className: 'view'},
				html.input({
					className: 'toggle',
					type: 'checkbox',
					checked : this.props.todo.completed,
					onChange: this.props.onToggle,
					key: this.props.key
				}),
				html.label({onDoubleClick: this.onEdit}, this.props.todo.title),
				html.button({className: 'destroy', onClick: this.props.onDestroy})
			),
			html.form(
				{onSubmit: this.handleSubmit},
				html.input({
					ref: 'editField',
					className: 'edit',
					defaultValue: this.props.todo.title,
					onBlur: this.handleSubmit,
					autoFocus: 'autofocus'
				})
			)
		);
	}
});



var TodoFooter = React.createClass({
	render: function () {
		var activeTodoWord = Utils.pluralize(this.props.count, 'todo'),
			clearButton = null;
		
		if (this.props.completedCount > 0) {
			clearButton = html.button(
				{ id: 'clear-completed', onClick: this.props.onClearCompleted},
				'Clear completed' + this.props.completedCount
			);
		}
		
		return html.footer(
			{id: 'footer'},
			html.span(
				{id: 'todo-count'},
				html.strong(null, this.props.count),
				' ' + activeTodoWord + ' left'
			),
			clearButton
		);
	}
});



var TodoApp = React.createClass({
	mixins: [ObserveMixin],
	getInitialState: function () {
		return {editing: null};
	},

	componentDidMount: function () {
		// Additional functionality for todomvc: fetch() the collection on init
		this.refs.newField.getDOMNode().focus();
	},

	componentDidUpdate: function () {
		// If saving were expensive we'd listen for mutation events on Backbone and
		// do this manually. however, since saving isn't expensive this is an
		// elegant way to keep it reactively up-to-date.
		/*this.props.todos.forEach(function(todo) {
		  todo.save();
		});*/
	},

	getModel: function () {
		return this.props.todos;
	},

	handleSubmit: function (event) {
		event.preventDefault();
		var val = this.refs.newField.getDOMNode().value.trim();
		if (val) {
			this.props.todos.push(new Todo(val));
			this.refs.newField.getDOMNode().value = '';
		}
	},

	toggleAll: function (event) {
		var checked = event.nativeEvent.target.checked;
		this.props.todos.forEach(function (todo) {
			todo.completed = true;
		});
		this.forceUpdate();
	},

	edit: function (todo) {
		this.setState({editing: todo.id});
	},

	save: function (todo, text) {
		todo.title = text;
		this.setState({editing: null});
	},
	
	remove: function (todo) {
		var index = this.props.todos.indexOf(todo);
		if (index !== -1) {
			this.props.todos.splice(index, 1);
		}
		this.forceUpdate();
	},
	
	toggle: function (todo) {
		todo.completed = !todo.completed;
		this.forceUpdate();
	},

	clearCompleted: function () {
		this.props.todos.completed().forEach(function (todo) {
			this.remove(todo);
		}, this);
	},

	render: function () {
		try {
			var footer = null,
				main = null,
				todoItems = this.props.todos.map(function (todo) {
					return TodoItem({
						key: Math.random(),
						todo: todo,
						onToggle: this.toggle.bind(this, todo),
						onDestroy: this.remove.bind(this, todo),
						onEdit: this.edit.bind(this, todo),
						editing: (this.state.editing === todo.id),
						onSave: this.save.bind(this, todo)
					});
				}, this);

			var activeTodoCount = this.props.todos.remaining().length,
				completedCount = todoItems.length - activeTodoCount;
			if (activeTodoCount || completedCount) {
				footer = TodoFooter({
					count:  activeTodoCount,
					completedCount: completedCount,
					onClearCompleted: this.clearCompleted
				});
			}
		
			if (todoItems.length) {
				main = html.section(
					{id: 'main'},
					html.input({id: 'toggle-all', type: 'checkbox', onChange: this.toggleAll}),
					html.ul({id: 'todo-list'}, todoItems)
				);
			}
		
			return html.div(
				null,
				html.section(
					{id: 'todoapp'},
					html.header(
						{id: 'header'},
						html.h1(null, 'todos'),
						html.form(
							{onSubmit: this.handleSubmit},
							html.input({
								ref: 'newField',
								id: 'new-todo',
								placeholder: 'What needs to be done?'
							})
						)
					),
					main,
					footer
				),
				html.footer(
					{id: 'info'},
					html.p(null, 'Double-click to edit a todo'),
					html.p(
						' ',
						html.a({href: 'http://github.com/petehunt/'}, 'petehunt')
					),
					html.p(null, 'Part of ', html.a({href: 'http://todomvc.com'}, 'TodoMVC'))
				)
			);
		} catch (e) {
			console.log(e.stack);
		}
	}
		
});

module.exports = TodoApp;
