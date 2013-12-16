/** utilities */

dmp.util = {

	getCursorPosition: function(e) {
		e = e || window.event;
		var cursor = { x: 0, y: 0 };

		if (e.pageX || e.pageY) {
			cursor.x = e.pageX;
			cursor.y = e.pageY;
		} else {
			var de = document.documentElement;
			var b = document.body;
			cursor.x = e.clientX + (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
			cursor.y = e.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
		}

		return cursor;
	},

	getAbsolutePosition: function(obj) {
		var curleft = 0;
		var curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			} while (obj === obj.offsetParent);
		}

		return { 'x': curleft, 'y': curtop };
	},

	makeElement: function(htmlTag, attrs) {
		var el = document.createElement(htmlTag);

		for(var key in attrs) {
			if (attrs.hasOwnProperty(key)) {
				el.setAttribute(key, attrs[key]);
			}
		}

		return el;
	},

	getPxNum: function(val) {
		return val.slice(0, val.length - 2);
	},

	ieDisableSelect: function(trueFalse) {
		document.onselectstart = function() {
			return trueFalse;
		}
	},

	hasClass: function(elem, className) {
		return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	},

	addClass: function(elem, className) {
		if (!dmp.util.hasClass(elem, className)) {
			elem.className += ' ' + className;
		}
	},

	removeClass: function(elem, className) {
		var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';

		if (dmp.util.hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace(' ' + className + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	},

	swapClass: function(elem, oldClass, newClass) {
		if (dmp.util.hasClass(elem, oldClass)) {
			var classStr = elem.getAttribute('class');
			classStr = classStr.replace(oldClass, newClass);

			elem.setAttribute('class', classStr);
		}
	},

};


/** feature detection */

dmp.detect = {
	transforms: function() {
		var s = document.body.style;
		if (s.transform !== undefined || s.WebkitTransform !== undefined || s.MozTransform !== undefined || s.OTransform !== undefined) {
			return true;
		} else {
			return false;
		}
	}
};


var log = function(msg) {
	console.log(msg);
};


// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());