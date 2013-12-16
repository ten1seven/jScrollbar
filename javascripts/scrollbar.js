/**
 * Scrollbar replacement script
 * Author: Jeremy Fields, Viget
 * Requires: bean.js (https://github.com/fat/bean)
 */


/** collection */

dmp.scrollbars = {
	collection: [],

	add: function(wrapper, scroller) {
		dmp.scrollbars.collection.push(new Scrollbar(wrapper, scroller));
	},

	size: function() {
		dmp.scrollbars.loopCollection('size');
	},

	stopScroll: function() {
		if (window.dmpDragging) {
			dmp.scrollbars.loopCollection('stopScroll');
		}
	},

	doScroll: function(event) {
		if (window.dmpDragging) {
			dmp.scrollbars.loopCollection('doScroll', event);
		}
	},

	loopCollection: function(callback, event) {
		var collection = dmp.scrollbars.collection;

		for (var i = 0; i < collection.length; i++) {
			collection[i][callback](event);
		}
	}
};


/** variables */

window.dmpDragging = false;


/** document/window event handlers */

bean.on(window, 'resize.scroller focus.scroller', dmp.scrollbars.size);
bean.on(document, 'mouseup.scroller', dmp.scrollbars.stopScroll);
bean.on(document, 'mousemove.scroller', dmp.scrollbars.doScroll);


/** scrollbar */

var Scrollbar = function(wrapper, scroller) {
	this.wrapper = document.querySelector(wrapper);
	this.scroller = document.querySelector(scroller);

	this.init();
};


Scrollbar.prototype = {

	/** variables */

	// static vars
	classScrollbar: 'dmp-scrollbar',
	classScrolling: 'dmp--scrolling',
	classScrolltrack: 'dmp-scrolltrack',
	currentClass: null,
	dragging: false,
	opts: {},
	optsHorz: { direction: 'x', dimension: 'width', position: 'left', scrolled: 'scrollLeft' },
	optsNoScroll: { direction: 'none' },
	optsVert: { direction: 'y', dimension: 'height', position: 'top', scrolled: 'scrollTop' },


	/** setup */

	setup: function() {
		this.render();
		this.size();
	},

	render: function() {
		this.track = dmp.util.makeElement('div', { 'class': this.classScrolltrack });
		this.scrollbar = dmp.util.makeElement('div', { 'class': this.classScrollbar });

		this.track.appendChild(this.scrollbar);
		this.wrapper.appendChild(this.track);
	},

	size: function() {
		this.measure();
		this.setScrollbarStyle(this.opts['dimension'], this.scrollbarDimension);
		this.setPosition();
	},

	measure: function() {
		// get the height and width of the container
		var height = this.scroller.clientHeight;
		var width = this.scroller.clientWidth;
		var scrollHeight = this.scroller.scrollHeight;
		var scrollWidth = this.scroller.scrollWidth;

		// set the values of the scroll opts object
		this.setOpts(height, scrollHeight, width, scrollWidth);

		// set/update the class on the wrapper
		this.setScrollClass();

		// assign dimension variables depending on scroll direction
		this.mainDimension = (this.opts.direction === 'y') ? height : width;
		this.mainScrollDimension = (this.opts.direction === 'y') ? scrollHeight : scrollWidth;
		this.trackDimension = (this.opts.direction === 'y') ? this.track.clientHeight : this.track.clientWidth;

		// calculate additional measurements
		this.calculate();
	},

	setOpts: function(height, scrollHeight, width, scrollWidth) {
		if (scrollHeight > height) {
			this.opts = this.optsVert;
		} else if (scrollWidth > width) {
			this.opts = this.optsHorz;
		} else {
			this.opts = this.optsNoScroll;
		}
	},

	setScrollClass: function() {
		var newClass = this.classScrollbar + '--' + this.opts['direction'];

		if (!this.currentClass) {
			dmp.util.addClass(this.wrapper, newClass);
		} else if (this.currentClass !== newClass) {
			dmp.util.swapClass(this.wrapper, this.currentClass, newClass);
		}

		this.currentClass = newClass;
	},

	calculate: function() {
		this.mainScrollableDimension = this.mainScrollDimension - this.mainDimension;
		this.scrollbarDimension = this.calcScrollbarDimension();
		this.trackLeftover = this.trackDimension - this.scrollbarDimension;
		this.trackOffset = dmp.util.getAbsolutePosition(this.track)[this.opts['direction']];
	},

	setPosition: function() {
		if (!this.dragging) {
			this.setScrollbarStyle(this.opts['position'], this.calcPos());
		}
	},


	/** actions */

	bind: function() {

		// cache `this` so the context doesn't get lost within the event bindings
		var _this = this;

		bean.on(this.scrollbar, 'mousedown.scroller', function(event) {
			_this.startScroll(event)
		});

		bean.on(this.scroller, 'scroll.scroller', function() {
			_this.setPosition();
		});
	},

	startScroll: function(event) {
		this.dragging = window.dmpDragging = true;
		dmp.util.disableSelect(false);
		dmp.util.addClass(this.wrapper, this.classScrolling);

		this.cursorOffset = this.calcCursorOffset(event);
	},

	doScroll: function(event) {
		if (this.dragging) {
			var moveTo = 0;
			var scrollberPos = this.calcScrollbarPos(event);

			if (scrollberPos >= this.trackLeftover) {
				moveTo = this.trackLeftover;
			} else if (scrollberPos >= 0) {
				moveTo = scrollberPos;
			}

			this.move(moveTo);
		}
	},

	move: function(px) {
		// move scrollbar
		this.setScrollbarStyle(this.opts['position'], px);

		// move content
		this.scroller[this.opts['scrolled']] = this.calcContainer(px);
	},

	stopScroll: function() {
		this.dragging = window.dmpDragging = false;
		dmp.util.disableSelect(true);
		dmp.util.removeClass(this.wrapper, this.classScrolling);
	},


	/** calculations */

	calcScrollbarDimension: function() {
		return (this.mainScrollableDimension) ? (this.mainDimension / this.mainScrollDimension) * this.trackDimension : 0;
	},

	calcCursorOffset: function(event) {
		return this.calcCursorTrackOffset(event) - dmp.util.getPxNum(this.scrollbar.style[this.opts['position']]);
	},

	calcScrollbarPos: function(event) {
		return this.calcCursorTrackOffset(event) - this.cursorOffset;
	},

	calcCursorTrackOffset: function(event) {
		return dmp.util.getCursorPosition(event)[this.opts['direction']] - this.trackOffset;
	},

	calcPos: function() {
		return (this.scroller[this.opts['scrolled']] / this.mainScrollableDimension) * (this.trackDimension - this.scrollbarDimension);
	},

	calcContainer: function(px) {
		return this.mainScrollableDimension * (px / this.trackLeftover);
	},


	/** helpers */

	setScrollbarStyle: function(rule, px) {
		this.scrollbar.style[rule] = px + 'px';
	},


	/** init */

	init: function() {
		this.setup();
		this.bind();
	}

};