'use strict';

function HTMLArray (id, data) {
	this.template = document.getElementById(id);
	this.display = this.template.style.display;
	this.data  = data || [];
	this.nodes = [];
	this.pagination = {};
	this.pagination.isEnabled = false;
	this.pagination.pageSize = null;
	this.pagination.currIndex = -1;
	this.listeners = [];
	this.template.style.display = "none";
	data && this.set(data);
}

HTMLArray.prototype = (function() {

  function refresh() {
		var start = 0, end = this.nodes.length;

		if (this.pagination.isEnabled) {
			start = this.pagination.currIndex * this.pagination.pageSize;
			end = start + this.pagination.pageSize;
		}

		for (var i = 0; i < this.nodes.length; i++) {
			if (i >= start && i < end) {
				this.nodes[i].style.display = this.display;
			} else {
				this.nodes[i].style.display = "none";
			}
		}
		return this;
	}

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
			var attr = node.getAttribute("x-class").split(".");
			getValue(obj, attr) && node.classList.add(getValue(obj, attr));
		}
		if (node.getAttribute("x-href")) {
			var attr = node.getAttribute("x-href").split(".");
			node.href = getValue(obj, attr);
		}
		if (node.getAttribute("x-src")) {
			var attr = node.getAttribute("x-src").split(".");
			node.src = getValue(obj, attr);
		}

		// Interpolate {{key}}
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

	function insertNode(obj, index) {

		if (index === undefined) 
			index = this.data.length;

		var clone = this.template.cloneNode(true);
		clone.removeAttribute("id");
		setupChild(clone, obj);

		this.template.parentNode.insertBefore(clone, this.nodes[index]);
		this.nodes.splice(index, 0, clone);
		this.data.splice(index, 0, obj);

		if (this.listeners.length > 0) {
			for (var i = 0; i < this.listeners.length; i++) {
				addListener.call(this, this.listeners[i].on, this.listeners[i].callback, index);
			}
		}
		return this;
	}

	function addListener(on, callback, index) {
		var obj = this.data[index], self = this;
		this.nodes[index].addEventListener(on, function(e) {
			index = self.data.indexOf(obj);
			callback(e, obj, index);
		});
	}

	function showCurrentPage(makeVisible) {
		var	start = this.pagination.currIndex * this.pagination.pageSize,
				end   = start + this.pagination.pageSize;
		if (end > this.nodes.length) 
			end = this.nodes.length;
		for (var i = start; i < end; i++) 
			this.nodes[i].style.display = makeVisible ? this.display : "none";
	}

	function isArray() {
		return Object.prototype.toString.call(this) === '[object Array]';
	}

  return {
    constructor: HTMLArray,
    set: function(newData) {
    	if (!isArray.call(newData)) 
    		throw "Set requires array.";

			var parent = this.template.parentNode;
			for (var i = 0; i < this.nodes.length; i++)
				parent.removeChild(this.nodes[i]);

			this.nodes = [];
			this.data = [];

			for (var i = 0; i < newData.length; i++) {
				insertNode.call(this,newData[i]);
			}
			return refresh.call(this);
		},
		push: function(obj) {
			obj && insertNode.call(this,obj);
			return refresh.call(this);
		},
		splice: function(index, num, obj) {
			index = parseInt(index), num = parseInt(num);
			if (isNaN(index) || isNaN(num))
				throw "Splice requires minimum of index, and number to remove";

			// Remove nodes
			while (--num >= 0) {
				this.template.parentNode.removeChild(this.nodes[index]);
				this.nodes.splice(index,1);
				this.data.splice(index,1);
			}
			
			(obj) && insertNode.call(this, obj, index);
			return refresh.call(this);
		},
		concat: function(array) {
			if (!isArray.call(newData)) 
    		throw "Concat requires array.";

			for (var i = 0; i < array.length; i++) {
				insertNode.call(this, array[i]);
			}
			return refresh.call(this);
		},
		move: function(from, to) {
			from = parseInt(from), to = parseInt(to);
			if (isNaN(from) || isNaN(to))
				throw "Move requires 2 indexes";

			var fromNode = this.nodes.splice(from, 1)[0],
					toNode   = this.nodes[to];

	    this.data.splice(to, 0, this.data.splice(from, 1)[0]);
	    this.nodes.splice(to, 0, fromNode);
	    
	    this.template.parentNode.removeChild(fromNode);
			this.template.parentNode.insertBefore(fromNode, toNode);
	    
	    return refresh.call(this);
		},
		swap: function(index1, index2) {
			index1 = parseInt(index1), index2 = parseInt(index2);
			if (isNaN(index1) || isNaN(index2))
				throw "Swap requires 2 indexes";

			var obj1  = this.data[index1],
					obj2  = this.data[index2];

			this.splice(index1, 1, obj2);
			this.splice(index2, 1, obj1);

			return refresh.call(this);
		},
		slice: function(begin, end) {
			begin = parseInt(begin), end = parseInt(end) || this.data.length;
			if (isNaN(begin))
				throw "Slice requires a starting index";

			var data = [], nodes = [];
			for (var i = 0; i < this.data.length; i++) {
				if (i >= begin && i < end) {
					data.push(this.data[i]);
					nodes.push(this.nodes[i]);
				} else {
					this.template.parentNode.removeChild(this.nodes[i]);
				}
			}

			this.data = data;
			this.nodes = nodes;

			return refresh.call(this);
		},
		clear: function() {
			this.pagination.isEnabled && (this.pagination.index = 0);
			return this.set([]);
		},
		addEventListener: function(on, callback) {
			this.listeners.push({on: on, callback: callback});
			for (var i = 0; i < this.nodes.length; i++) {
				addListener.call(this, on, callback, i);
			}
			return this;
		},
		initPagination: function(pageSize_, pageIndex_, refresh_) {
			this.pagination.isEnabled = true;
			this.pagination.currIndex = pageIndex_ || 0;
			this.pagination.pageSize = pageSize_ || 10;

			refresh_ && refresh.call(this);
			return this;
		},
		setPageIndex: function(pageIndex_) {
			pageIndex_ = parseInt(pageIndex_);
			if (isNaN(pageIndex_))
				throw "setPageIndex requires an integer";

			if (this.pagination.currIndex !== pageIndex_) {
				showCurrentPage.call(this, false);
				this.pagination.currIndex = pageIndex_;
				showCurrentPage.call(this, true);
			}
			return this;
		},
		setPageSize: function(pageSize_) {
			pageSize_ = parseInt(pageSize_);
			if (isNaN(pageSize_))
				throw "setPageSize requires an integer";

			if (this.pagination.pageSize !== pageSize_) {
				if (this.pagination.pageSize > pageSize_) {
					showCurrentPage.call(this, false);
				}
				this.pagination.pageSize = pageSize_;
				showCurrentPage.call(this, true);
			}
			return this;
		},
		nextPage: function() {
			if (!this.isLastPage()) {
				showCurrentPage.call(this, false);
				this.pagination.currIndex++;
				showCurrentPage.call(this, true);
			}
			return this;
		},
		prevPage: function() {
			if (!this.isFirstPage()) {
				showCurrentPage.call(this, false);
				this.pagination.currIndex--;
				showCurrentPage.call(this, true);
			}
			return this;
		},
		isLastPage: function() {
			if (this.data.length > 0)
				return this.pagination.currIndex === Math.ceil(this.data.length / this.pagination.pageSize) - 1;
			else
				return true;
		},
		isFirstPage: function() {
			return this.pagination.currIndex === 0;
		},
		getPageIndex: function() {
			return this.pagination.currIndex;
		}
	}
    
})();
