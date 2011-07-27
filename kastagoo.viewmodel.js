(function() {
  var kastagoo, mkclass, update;
  kastagoo = this.kastagoo = this.kastagoo || require("kastagoo.utils.coffee").kastagoo;
  update = kastagoo.utils.update;
  mkclass = kastagoo.utils.mkclass;
  update(kastagoo, {
    viewmodel: {
      BaseVM: mkclass({
        __name__: 'BaseVM',
        __basic_properties__: {},
        __classinit__: function() {
          var property_name, set_basic_property;
          set_basic_property = function(dict, property_name) {
            return dict[property_name] = function(data) {
              return dict._basic_property_.call(this, '_' + property_name, property_name, data);
            };
          };
          for (property_name in this.__class__.__basic_properties__) {
            set_basic_property(this.__class__, property_name);
          }
        },
        __init__: function() {
          var property_name;
          for (property_name in this.__basic_properties__) {
            this['_' + property_name] = this.__basic_properties__[property_name];
          }
          return this.PropertyChanged = new kastagoo.utils.Event();
        },
        OnPropertyChanged: function(name) {
          return this.PropertyChanged.execute({
            name: name
          });
        },
        _basic_property_: function(subattrname, attrname, data) {
          if (data === void 0) {
            return this[subattrname];
          } else {
            if (this[subattrname] !== data) {
              this[subattrname] = data;
              return this.OnPropertyChanged(attrname);
            }
          }
        }
      })
    }
  });
}).call(this);
