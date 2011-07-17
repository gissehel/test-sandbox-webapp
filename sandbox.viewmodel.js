(function() {
  var kastagoo, mkclass, testlib, update;
  kastagoo = this.kastagoo = this.kastagoo || require('kastagoo.coffee').kastagoo;
  testlib = this.testlib = this.testlib || {};
  update = kastagoo.utils.update;
  mkclass = kastagoo.utils.mkclass;
  update(testlib, {
    viewmodel: {
      ItemVM: mkclass(kastagoo.viewmodel.BaseVM, {
        __name__: 'ItemVM',
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
        __name__: 'GrutVM',
        __basic_properties__: {
          XData: 'poide',
          ItemList: null
        },
        __init__: function() {
          this._ItemList = new kastagoo.utils.Collection();
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
