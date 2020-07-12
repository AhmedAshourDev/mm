/*
* kewo
*/
(function() {

"use strict";

var time = Date.now();
var support = {};
var _global = this;
var doc = _global.document;
var docElem = doc.documentElement;


// return "[object + className +]" like => "[object String]" to String
function type (obj) {
  var className = Object.prototype.toString.call(_class).toLowerCase().split('');
  return className[0].slice(0, -1);
}

function isArray (obj) {
  return Array.isArray(obj) || obj instanceof Array;
}
function isFunc (obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}
function isBool (obj) {
  return typeof obj === "boolean";
}
function isDef (obj) {
  return obj !== undefined;
}
function isUndef (obj) {
  return obj === undefined;
}
function isNum (obj) {
  return typeof obj === "number" && !isNaN(obj);
}
function isNull (obj) {
  return obj === null;
}
function isObject (obj) {
  return typeof obj === "object" && obj !== null;
}
function isString (obj) {
  return typeof obj === "string";
}
function isRegExp (obj) {
  return type(obj) === "regexp" || obj instanceof RegExp;
}



function isLikeArray (obj) {
  return isString(obj) || isArray(obj) || isNum(obj.length);
}

function inArray (array, obj) {
  return array.indexOf(obj) !== -1;
}


function inString (str, oo) {
  return inArray(str, oo);
}



function makeArray (str) {
  return str.split(",");
}


function len (obj) {
  if (isString( obj )) {
    return obj.length;
  } else if (isNum( obj.length )) {
    return obj.length;
  }
}

function once (fn) {
  var called = false;
  return function() {
    var self = this;
    var args = arguments;
    if (!called) {
      called = true;
      fn.apply(self, args);
    }
  };
}


function upper (str) {
  return str.toUpperCase();
}

function lower (str) {
  return str.toLowerCase();
}

function capitalize (str) {
  return upper(str.charAt(0)) + str.slice(1);
}

function trim (str) {
  return str.trim();
}



// default .length = 0
var $$Selector = function $$Selector() {
  this.length = 0;
};

$$Selector.prototype.get = function (index) {
  var el = this[ index || 0 ];
  return el;
};

$$Selector.prototype.$$elem = function () {
  return this.get(0);
};

$$Selector.prototype.$$push = function (selector) {
  this[ this.length ] = selector;
  this.length += 1;
};

// (selector0, selector1, selector2)
// ([ selector0, selector1, selector2 ])
$$Selector.prototype.push = function() {
  var self = this;
  var selectors = null;

  if (len( arguments ) >= 1 && !isLikeArray( arguments[ 0 ] )) {
    selectors = arguments;
  } else if (isLikeArray( arguments[ 0 ] )) {
    selectors = arguments[ 0 ];
  }

  if (selectors) {
    each(selectors, function (_, selector) {
      self.$$push(selector);
    });
  }
};


function createOneSelector (el) {
  var s = new $$Selector();
  s.push(el);
  return s;
}


var TypeNodeElement = Node.ELEMENT_NODE || 1;
var TypeNodeDocument = Node.DOCUMENT_NODE || 9;
var TypeNodeText = Node.TEXT_NODE || 3;




// console type print message
function log() {
  console.log.apply(null, arguments);
}
function error() {
  console.error.apply(null, arguments);
}
function warn() {
  console.warn.apply(null, arguments);
}


function extend (_to, _from) {
  for (var key in _from) {
    _to[ key ] = _from[ key ];
  }
}

// isDocument({}) -> false
function isDocument (node) {
  return node.nodeType === TypeNodeDocument;
}
function isElement (node) {
  return node.nodeType === TypeNodeElement;
}



function createElement (tagName) {
  return doc.createElement(tagName);
}

function appendNode (el, node) {
  el.appendChild(node);
}

function removeNode (node) {
  // document cannot be removed so we will remove `DocumentElement<HTML></HTML>`
  if (isDocument( node ) && node.removeChild) {
    doc.removeChild(docElem);
  } else {
    if (isElement( node )) {
      if (node.parentNode && node.parentNode.removeChild) {
        node.parentNode.removeChild(node);
      } else if (node.remove) {
        node.remove();
      }
    }
  }
}

function setAttr (el, name, value) {
  if (el.setAttribute) {
    el.setAttribute(name, value);
  } else {
    el[ name ] = value;
  }
}

function getAttr (el, name) {
  if (el.getAttribute) {
    return el.getAttribute(name);
  }
}

function hasAttr (el, name) {
  if (el.hasAttribute) {
    el.hasAttribute(name);
  }
  return false;
}

function removeAttr (el, name) {
  //hasAttr( el, name ) && 
  if (el.removeAttribute) {
    el.removeAttribute(name);
  }
}


function getStyles (el) {
  // from `https://stackoverflow.com/questions/9183555/whats-the-point-of-document-defaultview#:~:text=The%20document.,the%20code%20you%20are%20running.`
  var view = (el.ownerDocument && el.ownerDocument.defaultView) ?
              el.ownerDocument.defaultView : _global;

  // get by `window.getComputedStyle`
  if (view.getComputedStyle) {
    return view.getComputedStyle(el);
  } else if (el.currentStyle) {}
}


function hasClass (el, cls) {
}


function getById (id) {
  // id maybe number `<input id="1">`
  // it may work so we will change id to string like => (1 => "1")
  id = id + "";
  if (support.getElementById) {
    return doc.getElementById(id);
  } else if (support.querySelector) {
    return doc.querySelector("#" + id);
  } else {
    // we can also get element by id from `globalView` like => (window["" + element_id + ""])
    return _global[ id ];
  }
}

function getByTag (tag) {
  return doc.getElementsByTagName(tag);
}
function getByClass (cls) {
  return doc.getElementsByClassName(cls);
}

function rand (_from, _to) {
  return Math.floor(Math.random() * _from);
}

// from jQuery
// you not need to remove your children which you created before because we will remove it for you
function assert (fn) {
  var el = createElement("fieldset");
  try {
    return !!fn.call(el);
  } catch (e) {
    return false;
  } finally {
    //after return (True or False)
    removeNode(el);
    // release memory in IE
    el = null;
  }
}

support.querySelector = assert(function() {
  var el_1 = createElement("input");
  var el_2 = createElement("input");
  appendNode(this, el_1);
  appendNode(this, el_2);
  return this.querySelector("input").value === "";
});

support.getElementById = assert(function() {
  var el = createElement("input");
  var id = createUnusedId();
  setAttr(el, "value", "123");
  setAttr(el, "id", id);
  appendNode(this, el);
  var _el = doc.getElementById(id);
  return _el.value === "123";
});

support.getElementsByTagName = assert(function() {
  var el = createElement("input");
  appendNode(this, el);
  return this.getElementsByTagName("input").length;
});

// return "abc" + random number
function createUnusedId() {
  var id;
  do {
    id = "abc" + rand(1000000);
    // (id in _global) -> because we didn't need to make id used as variable
  } while (( id in _global ) || !!getById( id ));
  return id;
}

var ButtonMouse = {};
ButtonMouse["left"] = 0;
ButtonMouse["middle"] = 1;
ButtonMouse["right"] = 2;


function each (array, callback) {
  for (var index in array) {
    if (callback(index, array[ index ]) === true) {
      break;
    }
  }
}



function put() {
  each(arguments[ 0 ], function (name, method) {
    $$Selector.prototype[ name ] = function() {
      var args = arguments;
      var self = this;
      if (isFunc( method )) {
        if (len( self ) === 1) {
          var element = self.$$elem();
          var selector = createOneSelector(element);
          return method.apply(selector, args);
        } else {
          each(self, function (_, el) {
            method.apply(createOneSelector( el ), args);
          });
        }
      }
    }
  });
}


support.fullscreen = "requestFullscreen" in docElem
                  || "webkitRequestFullscreen" in docElem
                  || "mozRequestFullscreen" in docElem
                  || "msRequestFullscreen" in docElem;


function getFullscreenElement() {
  return doc.fullscreenElement ||
  doc.msFullscreenElement ||
  doc.mozFullscreenElement ||
  doc.webkitFullscreenElement;
}

function isFullscreenEnabled() {
  return doc.fullscreenEnabled ||
  doc.mozFullScreenEnabled ||
  doc.msFullscreenEnabled ||
  doc.webkitFullscreenEnabled;
}

put({
  fullscreen: function (enable) {
    var el = this.$$elem();
    if (support.fullscreen) {
      var fullscreenElement = doc.fullscreenElement || doc.msFullscreenElement || doc.mozFullscreenElement || doc.webkitFullscreenElement;
      if (enable) {
        if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.mozRequestFullscreen) {
          el.mozRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        } else {
          error("cannot enter fullscreen.");
        }
      } else {
        if (doc.webkitCancelFullScreen) {
          doc.webkitCancelFullScreen();
        } else if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        } else {
          error("cannot exit fullscreen.");
        }
      }
    }
  },
});



var fromParentToChild = true;
var fromChildToParent = false;

function addEventListener (el, eventName, handler, useCapture) {
  useCapture = useCapture || false;
  if (el.addEventListener) {
    el.addEventListener(eventName, handler, useCapture);
  } else if (el.attachEvent) {
    el.attachEvent( "on" + eventName, handler, useCapture);
  } else {
    el[ "on" + eventName ] = function(e) {
      handler.call(this, e);
    };
  }
}

var EventsKeyboard = "keydown|keyup|keypress".split('|');
var EventsMouse = "mousemove|mouseenter|mousedown|mouseup|mouseout|mouseover".split('|');
var KeysNN = "ctrl|alt|shift|meta".split('|');



var SetterGetter = 0;



put({
  value: function (value) {
    var el = this.$$elem();
    if (isDef( value )) {
      el.value = value;
    } else {
      return el.value;
    }
  },
  text: function (value) {
    var el = this.$$elem();
    if (isDef( value )) {
      el.textContent = value;
    } else {
      return el.textContent;
    }
  },
  html: function (value) {
    var el = this.$$elem();
    if (isDef( value )) {
      el.innerHTML = value;
    } else {
      return el.innerHTML;
    }
  }
});


var whitespaceRE = /\s+/;
// class="jjj jjjjsdsd" 


// return if element has class name
// arguments[ 0 ]: must be one class
function hasClass (el, cls) {
  cls = trim(cls);
  if (el.classList && el.classList.contain) {
    return el.classList.contains(cls);
  } else {
    var _classes = (getAttr(el, "class") || el.className || "");
    return inString(_classes, cls);
  }
}

function addClass (el, cls) {
  cls = trim(cls);
  if (el.classList && el.classList.add) {
    el.classList.add(cls);
  } else {
  }
}

function removeClass (el, cls) {
  if (el.classList && el.classList.remove) {
    el.classList.remove(cls);
  } else {
  }

  log(getAttr(el, cls))
  if (!getAttr(el, cls)) {
  }
}

function toggleClass (el, cls) {
  if (el.classList && el.classList.toggle) {
    el.classList.toggle(cls);
  } else {
  }
}



/*
* controller attribute of element
*/




put({
  attr: function (name, value) {
    var el = this.$$elem();
    if (isDef( value )) {
      setAttr(el, name, value);
    } else {
      if (isObject( name )) {
        each(name, function (attr, value) {
          setAttr(el, attr, value);
        });
        return;
      }
      return getAttr(el, name);
    }
  },
  removeAttr: function (name) {
    var el = this.$$elem();
    removeAttr(el, name);
  },
  hasAttr: function (name) {
    return hasAttr(this.$$elem(), name);
  },
  data: function (name, value) {
    return this.attr("data-" + name, value);
  },
  hasData: function (name) {
    return this.hasAttr("data-" + name);
  }
});



put({
  hasClass: function (cls) {
    return hasClass(this.$$elem(), cls);
  },
  addClass: function (cls) {
    addClass(this.$$elem(), cls);
  },
  removeClass: function (cls) {
    removeClass(this.$$elem(), cls);
  },
  toggleClass: function (cls) {
    toggleClass(this.$$elem(), cls);
  }
});

/*
* controller style of element
*/


function setStyle (el, name, value) {
  el.style[ name ] = value;
}


put({
  css: function (name, value) {
    var el = this.$$elem();
    setStyle(el, name, value);
  }
});


put({
  scale: function (scaleX, scaleY) {
    var el = this.$$elem();
    if (isDef(y)) { this.css("transform", "scaleX(${x}) scaleY(${x})"); }
    else { this.css("transform", "scale(${x})"); }
  }
});


put({
  tag: function () {
    var el = this.$$elem();
    if (isElement( el )) {
      return lower(el.tagName || el.nodeName);
    }
  },
  id: function (value) {
    return this.attr("id", value);
  },
  clone: function() {
  },
  parent: function() {
    var el = this.$$elem();
    if (el.parentNode) {
      return $(el.parentNode);
    } else { return $(docElem); }
  },
  remove: function() {
    removeNode(this.$$elem());
  },
  empty: function() {
    var el = this.$$elem();
    while (el.firstChild) {
      removeNode(el.lastChild);
    }
    this.html("");
  }
});


put({
  on: function () {
    var el = this.$$elem();

  }
});


var $ = _global.$ = function (selectorAll) {
  var selector = new $$Selector();

  // null or undefined
  if (!selectorAll) {
    return selector;
  }

  // element
  if (isElement( selectorAll )) {
    selector.push( selectorAll );
    return selector;
  }

  if (isString( selectorAll )) {
    if (len( selectorAll ) >= 2) {
      var firstChar = selectorAll.charAt(0);
      var basename = selectorAll.slice(1);
      switch (firstChar) {
        case "#":
          var el = getById(basename);
          selector.push(el);
          return selector;
        case ".":
          var els = getByClass(basename);
          selector.push(els);
          return selector;
        default:
          var els = getByTag(selectorAll);
          selector.push(els);
          return selector;
      }
    }
  }

  selector.push(selectorAll);
  return selector;
};


$.put = put;
$.log = log;
$.error = error;


}).call(typeof window !== "undefined" ? window : this);
