'use strict';

function Xenon (id, array, options) {

	/* POSSIBLE OPTIONS
		- filtering
		- sorting
		- limitTo
		- startFrom
		- paging
	*/

	var element = document.getElementById(id),
			parent  = element.parentNode,
			display = element.style.display,
			clones  = [];

	function getValue(obj, array) {
		for (var i = 0; i < array.length; i++) {
			obj = obj[array[i]];
		}
		return obj;
	}

	function setupChild(node, obj) {
		if (node.getAttribute("x-value")) {
			var attr = node.getAttribute("x-value").split(".");
			if (node.nodeName === "INPUT") {
				node.value = getValue(obj, attr);
			} else {
				node.innerHTML = getValue(obj, attr);
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

	function addChild (val) {
		var clone = element.cloneNode(true);
		clone.removeAttribute("id");
		setupChild(clone, val);
		clones.push(clone);
		parent.appendChild(clone);
	}

	this.update = function(updatedArray) {
		array = updatedArray;
		for (var i = 0; i < clones.length; i++) {
			parent.removeChild(clones[i]);
		}
		element.style.display = display;
		clones = [];
		for (var i = 0; i < array.length; i++) {
			addChild(array[i]);
		}
		element.style.display = "none";
	}

	this.push = function(obj) {
		element.style.display = display;
		addChild(obj);
		element.style.display = "none";
	}

	if (array) this.update(array);
}

// (function() {
// 	var array = [{test1:"Test1.1", test2: "Test1.2"},{test1:"Test2.1", test2:"Test2.2"}];
// 	var test = new X("repeat", array);
// 	test.push({test1:"Test3.1", test2:"Test3.2"});
// })();