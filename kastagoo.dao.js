(function() {
  var Storage, kastagoo, localStorage, mkclass, storage, update, window;
  kastagoo = this.kastagoo = this.kastagoo || require("kastagoo.utils.coffee").kastagoo;
  update = kastagoo.utils.update;
  mkclass = kastagoo.utils.mkclass;
  window = this;
  storage = null;
  localStorage = window.localStorage;
  if (localStorage != null) {
    storage = {
      getItem: function(key) {
        return localStorage.getItem(key);
      },
      setItem: function(key, data) {
        return localStorage.setItem(key, data);
      },
      removeItem: function(key) {
        return localStorage.removeItem(key);
      },
      length: function() {
        return localStorage.length;
      },
      key: function(index) {
        return localStorage.key(index);
      },
      log: function() {}
    };
  } else {
    Storage = function() {
      var keys;
      localStorage = {};
      keys = [];
      update(this, {
        getItem: function(key) {
          return localStorage[key];
        },
        setItem: function(key, data) {
          if (keys.indexOf(key) === -1) {
            keys.push(key);
          }
          localStorage[key] = "" + data;
        },
        removeItem: function(key) {
          var i;
          i = keys.indexOf(key);
          if (i !== -1) {
            keys.splice(i, 1);
            delete localStorage[key];
          }
        },
        length: function() {
          return keys.length;
        },
        key: function(index) {
          return localStorage[keys[index]];
        },
        log: function() {
          return console.log(localStorage);
        }
      });
      return this;
    };
    storage = new Storage();
  }
  update(kastagoo, {
    dao: {
      WSRepository: mkclass({
        __name__: 'WSRepository',
        __init__: function(name) {
          var nextid;
          this.name = name;
          this.classRegistry = {};
          nextid = storage.getItem(this.name + ".count");
          if (nextid == null) {
            return storage.setItem(this.name + ".count", 1);
          }
        },
        clear: function() {
          var index, item, items_to_delete, key, len, _i, _len, _results;
          items_to_delete = [];
          len = storage.length;
          index = 0;
          while (index < len) {
            key = storage.key(index);
            if (key.substr(0, this.name.length + 1) === this.name + ".") {
              items_to_delete.push(key);
            }
          }
          _results = [];
          for (_i = 0, _len = items_to_delete.length; _i < _len; _i++) {
            item = items_to_delete[_i];
            _results.push(storage.removeItem(item));
          }
          return _results;
        },
        save: function(obj, regtype, name) {
          var count_str, nextId, register_params;
          if (!(this.classRegistry[regtype] != null)) {
            return false;
          }
          if (!(obj.id != null)) {
            count_str = this.name + ".count";
            nextId = parseInt(storage.getItem(count_str));
            obj.id = nextId;
            storage.setItem(count_str, nextId + 1);
          }
          register_params = this.classRegistry[regtype];
          storage.setItem(this.name + "." + obj["id"], regtype);
          if (register_params.keys != null) {
            this.save_object(obj.id, obj, register_params.keys);
          }
          if (register_params.savekeys != null) {
            this.save_object(obj.id, obj, register_params.savekeys);
          } else if (register_params.getProperties != null) {
            this.save_dict(obj.id, register_params.getProperties(obj));
          }
          if (name != null) {
            storage.setItem(this.name + ".labels." + name, obj.id);
          }
          return true;
        },
        get: function(id, obj) {
          var dict, register_params, regtype;
          if (typeof id !== typeof 0) {
            id = parseInt(storage.getItem(this.name + ".labels." + id));
          }
          regtype = storage.getItem(this.name + "." + id);
          register_params = this.classRegistry[regtype];
          if (obj != null) {
            if (register_params.keys != null) {
              return this.get_object(id, obj, register_params.keys);
            }
            if (register_params.getkeys != null) {
              return this.get_object(id, obj, register_params.getkeys);
            }
          }
          dict = {};
          if (register_params.keys != null) {
            dict = this.get_dict(id, register_params.keys);
          } else if (register_params.getkeys != null) {
            dict = this.get_dict(id, register_params.getkeys);
          }
          return register_params.createObject(id, dict);
        },
        save_dict: function(id, dict) {
          var key, _results;
          _results = [];
          for (key in dict) {
            _results.push(storage.setItem(this.name + "." + id + "." + key, dict[key]));
          }
          return _results;
        },
        get_dict: function(id, keys) {
          var key, result, _i, _len;
          result = {};
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            result[key] = storage.getItem(this.name + "." + id + "." + key);
          }
          return result;
        },
        save_object: function(id, obj, keys) {
          var key, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            _results.push(storage.setItem(this.name + "." + id + "." + key, obj[key]));
          }
          return _results;
        },
        get_object: function(id, obj, keys) {
          var key, _i, _len;
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            obj[key] = storage.getItem(this.name + "." + id + "." + key);
          }
          return obj;
        },
        save_prop: function(id, key, value) {
          return storage.setItem(this.name + "." + id + "." + key, value);
        },
        get_prop: function(id, key) {
          return storage.getItem(this.name + "." + id + "." + key);
        },
        getName: function() {
          return this.name;
        },
        register: function(params) {
          var name;
          name = params.name;
          return this.classRegistry[name] = params;
        },
        log: function() {
          return storage.log();
        }
      })
    }
  });
}).call(this);
