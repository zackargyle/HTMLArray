'use strict';

function HTMLArray (id, data) {

	var element = document.getElementById(id),
			parent  = element.parentNode,
			display = element.style.display,
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
			if (node.nodeName === "INPUT" && node.type === "text") {
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

	this.set = function(updatedData) {
		removeAll();

		for (var i = 0; i < updatedData.length; i++) {
			insertNode(updatedData[i]);
		}
		refresh();
		return this_;
	}

	this.push = function(obj) {
		insertNode(obj);
		refresh();
		return this_;
	}

	this.splice = function(index, num, obj) {
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
		for (var i = 0; i < array.length; i++) {
			insertNode(array[i]);
		}

		refresh();
		return this_;
	}

	this.move = function(from, to) {
		var obj = data[from],
				node = nodes[from];

		parent.removeChild(node);
		parent.insertBefore(node, nodes[to]);
		nodes.splice(to, 0, nodes.splice(from, 1)[0]);
		data.splice(to, 0, data.splice(from, 1)[0]);

		refresh();
		return this_;
	}

	this.slice = function(begin, end) {
		return this.set(data.slice(begin, end));
	}

	this.clear = function() {
		if (paginationEnabled) {
			pageIndex = 0;
		}
		return this.set([]);
	}

	this.data = function() {
		return data;
	}

	/* PAGINATION */
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
		pageIndex = pageIndex_;
		pageSize = pageSize_;

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