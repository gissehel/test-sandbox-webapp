(function() {
  var dir, kastagoo, mkclass, update;
  kastagoo = this.kastagoo = this.kastagoo || {};
  kastagoo.utils = {};
  update = function(destination, source) {
    var name, _results;
    _results = [];
    for (name in source) {
      _results.push(destination[name] = source[name]);
    }
    return _results;
  };
  mkclass = function(parent, dict) {
    var constructor, new_dict, parent_ctor, _ref;
    if (!(dict != null)) {
      _ref = [null, parent], parent = _ref[0], dict = _ref[1];
    }
    if ((parent != null) && (parent.__class__ != null)) {
      parent = parent.__class__;
    }
    if (parent != null) {
      parent_ctor = (function() {});
      parent_ctor.prototype = parent;
      new_dict = new parent_ctor();
      update(new_dict, dict);
      dict = new_dict;
      dict.__parent__ = parent;
    }
    if (dict.__init__ == null) {
      dict.__init__ = (function() {});
    }
    if (dict.__classinit__ == null) {
      dict.__classinit__ = (function() {});
    }
    dict.__recursive_init__ = function() {
      if ((parent != null) && (parent.__recursive_init__ != null)) {
        parent.__recursive_init__.apply(this, arguments);
      }
      dict.__init__.apply(this, arguments);
    };
    dict.__recursive_classinit__ = function() {
      if ((parent != null) && (parent.__recursive_classinit__ != null)) {
        parent.__recursive_classinit__.apply(this, arguments);
      }
      dict.__classinit__.apply(this, arguments);
    };
    constructor = function() {
      dict.__recursive_init__.apply(this, arguments);
    };
    constructor.prototype = dict;
    constructor.__class__ = dict;
    dict.__ctor__ = constructor;
    dict.__class__ = dict;
    dict.__recursive_classinit__.apply(constructor);
    return constructor;
  };
  dir = function(o) {
    var res, x;
    res = [];
    for (x in o) {
      res.push(x);
    }
    return res;
  };
  update(kastagoo, {
    utils: {
      mkclass: mkclass,
      update: update,
      dir: dir,
      cdir: function(o) {
        var x, _i, _len, _ref;
        _ref = dir(o);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          console.log(x);
        }
      },
      cit: function(i) {
        var x, _i, _len;
        for (_i = 0, _len = i.length; _i < _len; _i++) {
          x = i[_i];
          console.log(x);
        }
      },
      Event: mkclass({
        __name__: 'Event',
        __init__: function() {
          this._callbacks = [];
        },
        add: function(callback) {
          this._callbacks.push(callback);
        },
        remove: function(callback) {
          var index;
          index = this._callbacks.indexOf(callback);
          if (index >= 0) {
            this._callbacks.splice(index, 1);
          }
        },
        execute: function(params) {
          var callback, _i, _len, _ref;
          _ref = this._callbacks;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            callback(params);
          }
        }
      }),
      Collection: mkclass({
        __name__: 'Colletion',
        __init__: function(iterable) {
          var item, _i, _len;
          this._innerarray = [];
          this.pushed = new kastagoo.utils.Event();
          this.spliced = new kastagoo.utils.Event();
          if (iterable != null) {
            for (_i = 0, _len = iterable.length; _i < _len; _i++) {
              item = iterable[_i];
              this.push(item);
            }
          }
        },
        isObservable: true,
        length: function() {
          return this._innerarray.length;
        },
        at: function(index) {
          return this._innerarray[index];
        },
        splice: function(index, size) {
          this._innerarray.splice(index, size);
          return this.spliced.execute({
            collection: this,
            index: index,
            size: size
          });
        },
        removeat: function(index) {
          if (index >= 0) {
            return this.splice(index, 1);
          }
        },
        remove: function(item) {
          var current_index, current_item, index, _i, _len, _ref;
          index = -1;
          current_index = 0;
          _ref = this._innerarray;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            current_item = _ref[_i];
            if (item === current_item) {
              index = current_index;
            }
            current_index++;
          }
          if (index >= 0) {
            return this.removeat(index);
          }
        },
        push: function(item) {
          this._innerarray.push(item);
          this.pushed.execute({
            collection: this,
            item: item
          });
        }
      })
    }
  });
}).call(this);
