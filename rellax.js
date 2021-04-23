// ------------------------------------------
// Rellax.js
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Rellax = factory();
  }
})(typeof window !== 'undefined' ? window : global, function () {
  var Rellax = function (el, options) {
    'use strict';

    var self = Object.create(Rellax.prototype);

    var posY = 0;
    var screenY = 0;
    var posX = 0;
    var screenX = 0;
    var blocks = [];
    var pause = true;

    // check what requestAnimationFrame to use, and if
    // it's not supported, use the onscroll event
    var loop =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function (callback) {
        return setTimeout(callback, 1000 / 60);
      };

    // store the id for later use
    var loopId = null;

    // Test via a getter in the options object to see if the passive property is accessed
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true;
        },
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {}

    // check what cancelAnimation method to use
    var clearLoop = window.cancelAnimationFrame || window.mozCancelAnimationFrame || clearTimeout;

    // check which transform property to use
    var transformProp =
      window.transformProp ||
      (function () {
        var testEl = document.createElement('div');
        if (testEl.style.transform === null) {
          var vendors = ['Webkit', 'Moz', 'ms'];
          for (var vendor in vendors) {
            if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
              return vendors[vendor] + 'Transform';
            }
          }
        }
        return 'transform';
      })();

    // Default Settings
    self.options = {
      round: true,
      frame: null,
      callback: function () {},
    };

    // User defined options (might have more in the future)
    if (options) {
      Object.keys(options).forEach(function (key) {
        self.options[key] = options[key];
      });
    }

    // By default, rellax class
    if (!el) {
      el = '.rellax';
    }

    // check if el is a className or a node
    var elements = typeof el === 'string' ? document.querySelectorAll(el) : [el];

    // Now query selector
    if (elements.length > 0) {
      self.elems = elements;
    }

    // The elements don't exist
    else {
      console.warn("Rellax: The elements you're trying to select don't exist.");
      return;
    }

    // Has a frame and it exists
    if (self.options.frame) {
      if (!self.options.frame.nodeType) {
        var frame = document.querySelector(self.options.frame);

        if (frame) {
          self.options.frame = frame;
        } else {
          console.warn("Rellax: The frame you're trying to use doesn't exist.");
          return;
        }
      }
    }

    // Get and cache initial position of all elements
    var cacheBlocks = function () {
      for (var i = 0; i < self.elems.length; i++) {
        var block = createBlock(self.elems[i]);
        blocks.push(block);
      }
    };

    // Let's kick this script off
    // Build array for cached element values
    var init = function () {
      for (var i = 0; i < blocks.length; i++) {
        self.elems[i].style.cssText = blocks[i].style;
      }

      blocks = [];

      screenY = window.innerHeight;
      screenX = window.innerWidth;

      setPosition();

      cacheBlocks();

      animate();

      // If paused, unpause and set listener for window resizing events
      if (pause) {
        window.addEventListener('resize', init);
        pause = false;
        // Start the loop
        update();
      }
    };

    // We want to cache the parallax blocks'
    // values: base, top, height, speed
    // el: is dom object, return: el cache values
    var createBlock = function (el) {
      var dataZindex = el.getAttribute('data-rellax-zindex') || 0;

      // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
      // ensures elements are positioned based on HTML layout.

      var posY = 0;
      var posX = 0;

      var blockTop = posY + el.getBoundingClientRect().top;
      var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

      var blockLeft = posX + el.getBoundingClientRect().left;
      var blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

      // ~~Store non-translate3d transforms~~
      // Store inline styles and extract transforms
      var style = el.style.cssText;
      var transform = '';

      // Check if there's an inline styled transform
      var searchResult = /transform\s*:/i.exec(style);
      if (searchResult) {
        // Get the index of the transform
        var index = searchResult.index;

        // Trim the style to the transform point and get the following semi-colon index
        var trimmedStyle = style.slice(index);
        var delimiter = trimmedStyle.indexOf(';');

        // Remove "transform" string and save the attribute
        if (delimiter) {
          transform = ' ' + trimmedStyle.slice(11, delimiter).replace(/\s/g, '');
        } else {
          transform = ' ' + trimmedStyle.slice(11).replace(/\s/g, '');
        }
      }

      return {
        top: blockTop,
        left: blockLeft,
        height: blockHeight,
        width: blockWidth,
        style: style,
        transform: transform,
        zindex: dataZindex,
      };
    };

    // set scroll position (posY)
    // returns true if the scroll changed, false if nothing happened
    var setPosition = function () {
      var oldY = posY;

      posY = (document.documentElement || document.body.parentNode || document.body).scrollTop || window.pageYOffset;

      if (oldY != posY) {
        // scroll changed, return true
        return true;
      }

      // scroll did not change
      return false;
    };

    // Remove event listeners and loop again
    var deferredUpdate = function () {
      window.removeEventListener('resize', deferredUpdate);
      window.removeEventListener('orientationchange', deferredUpdate);
      window.removeEventListener('scroll', deferredUpdate);
      document.removeEventListener('touchmove', deferredUpdate);

      // loop again
      loopId = loop(update);
    };

    // Loop
    var update = function () {
      if (setPosition() && pause === false) {
        animate();

        // loop again
        loopId = loop(update);
      } else {
        loopId = null;

        // Don't animate until we get a position updating event
        window.addEventListener('resize', deferredUpdate);
        window.addEventListener('orientationchange', deferredUpdate);
        window.addEventListener('scroll', deferredUpdate, supportsPassive ? {passive: true} : false);
        document.addEventListener('touchmove', deferredUpdate, supportsPassive ? {passive: true} : false);
      }
    };

    // Transform3d on parallax element
    var animate = function () {
      for (var i = 0; i < self.elems.length; i++) {
        var frame = self.elems[i].parentNode;
        var frameHeight = frame.clientHeight || frame.offsetHeight || frame.scrollHeight;
        var frameTop = frame.getBoundingClientRect().top + posY;
        var frameBottom = frameHeight + frameTop;
        var overlap = blocks[i].height - frameHeight;

        // Stop animating when scroll past the element
        if (frameBottom < posY || frameTop > posY + screenY) return;

        var body = document.body;
        var html = document.documentElement;
        var pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        var maxScreenY = screenY;
        var minScreenY = screenY;
        var limitTop = frameTop < screenY;
        var limitBottom = pageHeight - frameBottom < screenY;
        var positionY = 0;

        if (limitTop) {
          maxScreenY = frameTop;
          positionY = -(posY + maxScreenY - frameTop) * (overlap / (frameHeight + maxScreenY)) + overlap / 2;
        } else if (limitBottom) {
          minScreenY = pageHeight - frameBottom;
          positionY = -(posY + screenY - frameTop) * (overlap / (frameHeight + minScreenY)) + overlap / 2;
        } else {
          positionY = -(posY + screenY - frameTop) * (overlap / (frameHeight + screenY)) + overlap / 2;
        }

        var zindex = blocks[i].zindex;

        // Move that element
        // (Set the new translation and append initial inline transforms.)
        var translate = 'translate3d(0px,' + positionY + 'px,' + zindex + 'px) ' + blocks[i].transform;
        self.elems[i].style[transformProp] = translate;
      }
    };

    self.destroy = function () {
      for (var i = 0; i < self.elems.length; i++) {
        self.elems[i].style.cssText = blocks[i].style;
      }

      // Remove resize event listener if not pause, and pause
      if (!pause) {
        window.removeEventListener('resize', init);
        pause = true;
      }

      // Clear the animation loop to prevent possible memory leak
      clearLoop(loopId);
      loopId = null;
    };

    // Init
    init();

    // Allow to recalculate the initial values whenever we want
    self.refresh = init;

    return self;
  };
  return Rellax;
});
