'use strict';

function Xenon (id, data) {

	var element = document.getElementById(id),
			parent  = element.parentNode,
			display = element.style.display,
			nodes  = [], this_ = this;

	element.style.display = "none";

	function getValue(obj, attrs) {
		for (var i = 0; i < attrs.length; i++) {
			obj = obj[attrs[i]];
		}
		return obj;
	}

	function setupChild(node, obj) {
		if (node.getAttribute("x-value")) {
			var attr = node.getAttribute("x-value").split(".");
			if (node.nodeName === "INPUT") {
				node.value = getValue(obj, attr);
			} else {
				node.innerHTML = getValue(obj, attr) + node.innerHTML;
			}
		}
		if (node.getAttribute("x-class")) {
			var attr = node.getAttribute("x-value").split(".");
			node.className += getValue(obj, attr).toLowerCase();
		}
		if (node.getAttribute("x-href")) {
			var attr = node.getAttribute("x-href").split(".");
			node.href = getValue(obj, attr);
		}
		if (node.getAttribute("x-src")) {
			var attr = node.getAttribute("x-src").split(".");
			node.src = getValue(obj, attr);
		}
		for (var i = 0; i < node.children.length; i++) {
			setupChild(node.children[i], obj);
		}
	}

	function insert(obj, index) {
		if (index === undefined) 
			index = data.length;

		var clone = element.cloneNode(true);
		clone.removeAttribute("id");
		setupChild(clone, obj);
		clone.style.display = display;

		parent.insertBefore(clone, nodes[index]);
		nodes.splice(index, 0, clone);
		data.splice(index, 0, obj);
		return this_;
	}

	function remove(index) {
		parent.removeChild(nodes[index]);
		nodes.splice(index,1);
		return data.splice(index,1)[0];
	}

	this.set = function(updatedData) {
		for (var i = 0; i < nodes.length; i++)
			parent.removeChild(nodes[i]);
		nodes = [], data = [];
		for (var i = 0; i < updatedData.length; i++)
			insert(updatedData[i]);
		return this;
	}

	this.push = function(obj) {
		return insert(obj);
	}

	this.splice = function(index, num, obj) {
		while (num-- > 0) {
			remove(index);
		}
		if (obj) return insert(obj, index);
		else return this;
	}

	this.slice = function(begin, end) {
		return this.set(data.slice(begin, end));
	}

	this.move = function(from, to) {
		var obj = remove(from);
		if (from > to)
			return insert(obj, to);
		else
			return insert(obj, to-1);
	}

	this.clear = function() {
		return this.set([]);
	}

	this.data = function() {
		return data;
	}

	this.set(data || []);
}