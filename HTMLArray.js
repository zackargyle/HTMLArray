'use strict';

function HTMLArray (id, data) {

	var element = document.getElementById(id),
			parent  = element.parentNode,
			display = element.style.display,
			listeners = [],
			pageIndex, pageSize,
			firstPage, lastPage,
			paginationEnabled = false,
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
			node.value = getValue(obj, attr);
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

		// Match and Replace {{key}}
		var matches = node.textContent.match(/{{\S*}}/g);
		for (var i = 0; i < matches.length; i++) {
			var str = matches[i].substr(2,matches[i].length-4);
			var val = getValue(obj,str.split("."));
			node.textContent = node.textContent.replace(/{{\S*}}/, val);
		}

		for (var i = 0; i < node.children.length; i++) {
			setupChild(node.children[i], obj);
		}
	}

	function refresh() {
		var start = 0, end = nodes.length;

		if (paginationEnabled) {
			start = pageIndex * pageSize;
			end = start + pageSize;
		}

		for (var i = 0; i < nodes.length; i++) {
			if (i >= start && i < end) {
				nodes[i].style.display = display;
			} else {
				nodes[i].style.display = "none";
			}
		}
	}

	function insertNode(obj, index) {
		if (index === undefined) 
			index = data.length;

		var clone = element.cloneNode(true);
		clone.removeAttribute("id");
		setupChild(clone, obj);

		parent.insertBefore(clone, nodes[index]);
		nodes.splice(index, 0, clone);
		data.splice(index, 0, obj);

		if (listeners.length > 0) {
			for (var i = 0; i < listeners.length; i++) {
				addListener(listeners[i].on, listeners[i].callback, index);
			}
		}
	}

	function remove(index) {
		parent.removeChild(nodes[index]);
		nodes.splice(index,1);
		data.splice(index,1);
	}

	function removeAll() {
		for (var i = 0; i < nodes.length; i++)
			parent.removeChild(nodes[i]);
		nodes = [];
		data = [];
	}

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	this.set = function(updatedData) {
		if (!isArray(updatedData)) {
			throw "HTMLArray.set requires an array";
		}

		removeAll();

		for (var i = 0; i < updatedData.length; i++) {
			insertNode(updatedData[i]);
		}
		refresh();
		return this_;
	}

	this.push = function(obj) {
		if (!obj) throw "HTMLArray.push requires an object.";
		insertNode(obj);
		refresh();
		return this_;
	}

	this.splice = function(index, num, obj) {
		index = parseInt(index), num = parseInt(num);
		if (isNaN(index) || isNaN(num)) {
			throw "HTMLArray.splice requires 2 paramters: index, num.";
		}
		while (--num >= 0) {
			remove(index);
		}
		
		if (obj) {
			insertNode(obj, index);
		}

		refresh();
		return this_;
	}

	this.concat = function(array) {
		if (!isArray(array)) {
			throw "HTMLArray.concat requires an array";
		}

		for (var i = 0; i < array.length; i++) {
			insertNode(array[i]);
		}

		refresh();
		return this_;
	}

	this.move = function(from, to) {
		from = parseInt(from), to = parseInt(to);
		if (isNaN(from) || isNaN(to)) {
			throw "HTMLArray.move requires 2 indexes: from, to.";
		}

		var obj = data[from],
				node = nodes[from];

		parent.removeChild(node);
		parent.insertBefore(node, nodes[to]);
		nodes.splice(to, 0, nodes.splice(from, 1)[0]);
		data.splice(to, 0, data.splice(from, 1)[0]);

		refresh();
		return this_;
	}

	this.swap = function(index1, index2) {
		index1 = parseInt(index1);
		index2 = parseInt(index2);

		var obj1  = data[index1],
				obj2  = data[index2];

		this.splice(index1, 1, obj2);
		this.splice(index2, 1, obj1);
	}

	this.slice = function(begin, end) {
		begin = parseInt(begin), end = parseInt(end);
		if (isNaN(begin) || isNaN(end)) {
			throw "HTMLArray.slice requires 2 indexes: begin, end.";
		}
		return this.set(data.slice(begin, end));
	}

	this.clear = function() {
		if (paginationEnabled) {
			pageIndex = 0;
		}
		return this.set([]);
	}

	this.get = function(index) {
		if (index === undefined) {
			throw "HTMLArray.get requires an index";
		}
		return data[index];
	}

	this.getAll = function() {
		return data;
	}

	/* Add An Event Listener for each node */
	function addListener(on, callback, index) {
		var obj = data[index];
		nodes[index].addEventListener(on, function(e) {
			index = data.indexOf(obj);
			callback(e, obj, index);
		});
	}

	this.addEventListener = function(on, callback) {
		listeners.push({on: on, callback: callback});
		for (var i = 0; i < nodes.length; i++) {
			addListener(on, callback, i);
		}
		return this;
	}

	/* Pagination */
	function showCurrentPage(makeVisible) {
		var	start = pageIndex * pageSize,
				end   = start + pageSize;
		if (end > nodes.length) 
			end = nodes.length;
		for (var i = start; i < end; i++) 
			nodes[i].style.display = makeVisible ? display : "none";
	}

	this.initPagination = function(pageSize_, pageIndex_, refresh_) {
		paginationEnabled = true;
		pageIndex = pageIndex_ || 0;
		pageSize = pageSize_ || 10;

		if (refresh_) refresh();
		return this_;
	}

	this.setPageIndex = function(pageIndex_) {
		if (pageIndex !== pageIndex_) {
			showCurrentPage(false);
			pageIndex = pageIndex_
			showCurrentPage(true);
		}
		return this_;
	}

	this.setPageSize = function(pageSize_) {
		if (pageSize !== pageSize_) {
			if (pageSize > pageSize_) {
				showCurrentPage(false);
			}
			pageSize = pageSize_;
			showCurrentPage(true);
		}
	}

	this.nextPage = function() {
		if (!this.isLastPage()) {
			showCurrentPage(false);
			pageIndex++;
			showCurrentPage(true);
		}
		return this_;
	}

	this.prevPage = function() {
		if (!this.isFirstPage()) {
			showCurrentPage(false);
			pageIndex--;
			showCurrentPage(true);
		}
		return this_;
	}

	this.isLastPage = function() {
		if (data.length > 0)
			return pageIndex === Math.ceil(data.length / pageSize) - 1;
		else
			return true;
	}

	this.isFirstPage = function() {
		return pageIndex === 0;
	}

	this.getPageIndex = function() {
		return pageIndex;
	}

	this.set(data || []);
}