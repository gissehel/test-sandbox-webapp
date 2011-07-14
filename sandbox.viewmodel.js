(function() {
  var kastagoo, mkclass, testlib, update, window;
  kastagoo = this.kastagoo = this.kastagoo || {};
  testlib = this.testlib = this.testlib || {};
  update = kastagoo.utils.update;
  mkclass = kastagoo.utils.mkclass;
  window = this;
  update(testlib, {
    viewmodel: {
      ItemVM: mkclass(kastagoo.viewmodel.BaseVM, {
        __init__: function(params) {
          this._value = '';
          if (params != null) {
            if (params.parent != null) {
              this.parent = params.parent;
            }
            if (params.collection != null) {
              this.collection = params.collection;
            }
          }
        },
        Value: function(data) {
          return this._basic_property_('_value', 'Value', data);
        },
        Close: function() {
          this.Value("== Closed ==");
          return this.collection.remove(this);
        }
      }),
      GrutVM: mkclass(kastagoo.viewmodel.BaseVM, {
        __basic_properties__: {
          XData: 'poide',
          ItemList: null
        },
        __init__: function() {
          this.ItemList(new kastagoo.utils.Collection());
        },
        Validate: function() {
          this.add('[--' + this.XData() + '--]');
          return this.XData('new value');
        },
        add: function(name) {
          var item;
          item = new testlib.viewmodel.ItemVM({
            parent: this,
            collection: this.ItemList()
          });
          item.Value(name);
          return this.ItemList().push(item);
        }
      })
    }
  });
}).call(this);
