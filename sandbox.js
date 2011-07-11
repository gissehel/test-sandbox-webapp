(function() {
  var kastagoo, mkclass, window;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  kastagoo = this.kastagoo = this.kastagoo || {};
  kastagoo.utils = {};
  mkclass = kastagoo.utils.mkclass = function(parent, dict) {
    var _ref;
    if (!(dict != null)) {
      _ref = [null, parent], parent = _ref[0], dict = _ref[1];
    }
    if (dict.__init__ == null) {
      dict.__init__ = (function() {});
    }
    if (parent != null) {
      dict.__proto__ = parent;
    }
    dict.__init__.__proto__ = dict;
    dict.__init__.prototype = dict.__init__;
    dict.__init__.__class__ = dict;
    return dict.__init__;
  };
  kastagoo.utils.Event = mkclass({
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
  });
  kastagoo.utils.Collection = mkclass({
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
  });
  window = this;
  this.jQuery(__bind(function($) {
    this.testlib = {
      page: {
        init: function() {
          var $tag1, $tag2, bindingManager, newtag_click;
          this.builder = kastagoo.view.builder;
          this.vmvtools = kastagoo.view.vmvtools;
          bindingManager = this.vmvtools.bindingManager;
          this.$workspace = this.builder.mkobj('workspace', {
            parent: 'body'
          });
          this.$tagzone = this.builder.mkobj('tagzone', {
            parent: this.$workspace,
            outter: true,
            classes: ['mainzone']
          });
          this.$headerzone = this.builder.mkobj('headerzone', {
            parent: this.$workspace,
            outter: true,
            classes: ['mainzone']
          });
          this.$infozone = this.builder.mkobj('infozone', {
            parent: this.$workspace,
            outter: true,
            classes: ['mainzone']
          });
          this.$tagzonecontent = this.builder.mkobj('tagzonecontent', {
            parent: this.$tagzone,
            outter: true,
            classes: ['mainzonecontent']
          });
          this.$newtagzone = this.builder.mkobj('newtagzone', {
            parent: this.$tagzone,
            outter: true,
            type: 'form',
            classes: ['newitemzone']
          });
          this.$newtag = this.builder.mkobj('newtag', {
            parent: this.$newtagzone,
            outter: true,
            type: 'input',
            classes: ['newitem']
          });
          this.$newtag_go = this.builder.mkobj('newtag-go', {
            parent: this.$newtagzone,
            outter: true,
            text: '\u25b6',
            classes: ['newitem-go', 'icon-go', 'icon']
          });
          newtag_click = __bind(function(e) {
            var val;
            val = this.$newtag.val();
            if (val !== '') {
              this.create_tag({
                text: val
              });
              this.$newtag.val('');
            }
            return e.preventDefault();
          }, this);
          this.$newtag_go.click(newtag_click);
          this.$newtagzone.submit(newtag_click);
          this.$infozonecontent = this.builder.mkobj('infozonecontent', {
            parent: this.$infozone,
            outter: true,
            classes: ['mainzonecontent']
          });
          this.$newinfozone = this.builder.mkobj('newinfozone', {
            parent: this.$infozone,
            outter: true,
            type: 'form',
            classes: ['newitemzone']
          });
          this.$newinfo = this.builder.mkobj('newinfo', {
            parent: this.$newinfozone,
            outter: true,
            type: 'input',
            classes: ['newitem']
          });
          this.$newinfo_go = this.builder.mkobj('newinfo-go', {
            parent: this.$newinfozone,
            outter: true,
            text: '\u25b6',
            classes: ['newitem-go', 'icon-go', 'icon']
          });
          $tag1 = this.create_tag({
            text: 'Tag1'
          });
          $tag2 = this.create_tag({
            text: 'Tag2'
          });
          $tag1.change_text('praf');
          window.ItemVM = mkclass(kastagoo.viewmodel.BaseVM, {
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
          });
          window.GrutVM = mkclass(kastagoo.viewmodel.BaseVM, {
            _xdata: 'praf',
            _itemlist: new kastagoo.utils.Collection(),
            XData: function(data) {
              return this._basic_property_('_xdata', 'XData', data);
            },
            ItemList: function(data) {
              return this._basic_property_('_itemlist', 'ItemList', data);
            },
            Validate: function() {
              this.add('[--' + this.XData() + '--]');
              return this.XData('new value');
            },
            add: function(name) {
              var item;
              item = new window.ItemVM({
                parent: this,
                collection: this.ItemList()
              });
              item.Value(name);
              return this.ItemList().push(item);
            }
          });
          window.grut = new window.GrutVM();
          window.grut.init();
          window.grut.add("first line");
          this.vmvtools.setDataContext(this.$workspace, window.grut);
          window.binding = bindingManager.content('XData', $tag2.inner_text);
          window.binding2 = bindingManager.input('XData', this.$newinfo[0]);
          window.binding3 = bindingManager.submit('Validate', this.$newinfozone[0]);
          window.binding4 = bindingManager.click('Validate', this.$newinfo_go[0]);
          return window.binding5 = bindingManager.collection('ItemList', this.$infozonecontent[0], __bind(function(item) {
            var $item_element;
            $item_element = this.create_info({
              text: '',
              noparent: true
            });
            this.vmvtools.setDataContext($item_element, item);
            window.ITEMCLOSE = $item_element.find('.item-close');
            bindingManager.content('Value', $item_element.inner_text);
            bindingManager.click('Close', window.ITEMCLOSE);
            return $item_element.parent();
          }, this));
        },
        create_tag: function(args) {
          var $tag, $tag_close, $tag_content;
          if (args.text == null) {
            args.text = '';
          }
          $tag = this.builder.mkobj('tag', {
            parent: this.$tagzonecontent,
            outter: true,
            classes: ['item']
          });
          $tag_content = this.builder.mkobj('tag-content', {
            parent: $tag,
            outter: true,
            text: args.text,
            classes: ['item-content']
          });
          $tag_close = this.builder.mkobj('tag-close', {
            parent: $tag,
            outter: true,
            text: '\u2716',
            classes: ['item-close', 'icon-close', 'icon']
          });
          $tag.change_text = __bind(function(text) {
            return $tag_content.text(text);
          }, this);
          $tag.inner_text = $tag_content[0];
          return $tag;
        },
        create_info: function(args) {
          var $info, $info_close, $info_content, $info_fold, $info_outter, $info_unfold;
          if (args.text == null) {
            args.text = '';
          }
          if ((args.noparent != null) && args.noparent) {
            $info = this.builder.mkobj('info', {
              outter: true,
              classes: ['item']
            });
          } else {
            $info = this.builder.mkobj('info', {
              parent: this.$infozonecontent,
              outter: true,
              classes: ['item']
            });
          }
          $info_content = this.builder.mkobj('info-content', {
            parent: $info,
            outter: true,
            text: args.text,
            classes: ['item-content']
          });
          $info_fold = this.builder.mkobj('info-fold', {
            parent: $info,
            outter: true,
            text: '\u25b2',
            classes: ['item-fold', 'icon-fold', 'icon']
          });
          $info_unfold = this.builder.mkobj('info-unfold', {
            parent: $info,
            outter: true,
            text: '\u25bc',
            classes: ['item-unfold', 'icon-unfold', 'icon']
          });
          $info_close = this.builder.mkobj('info-close', {
            parent: $info,
            outter: true,
            text: '\u2716',
            classes: ['item-close', 'icon-close', 'icon']
          });
          $info_outter = $info.parent();
          $info_fold.click(__bind(function(e) {
            return $info_outter.removeClass('unfolded');
          }, this));
          $info_unfold.click(__bind(function(e) {
            return $info_outter.addClass('unfolded');
          }, this));
          $info.change_text = __bind(function(text) {
            return $info_content.text(text);
          }, this);
          $info.inner_text = $info_content[0];
          return $info;
        }
      }
    };
    this.kastagoo.viewmodel = {
      BaseVM: mkclass({
        __name__: 'BaseVM',
        init: function() {
          return this.PropertyChanged = new kastagoo.utils.Event;
        },
        OnPropertyChanged: function(name) {
          if (this.PropertyChanged == null) {
            this.PropertyChanged = new kastagoo.utils.Event;
          }
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
    };
    this.kastagoo.view = {
      builder: {
        mkobj: function(name, params) {
          var $obj, $toinclude, classname, type, _i, _j, _len, _len2, _ref, _ref2;
          type = params.type != null ? params.type : 'div';
          $obj = $('<' + type + '/>');
          $obj.addClass(name);
          if (params.classes != null) {
            _ref = params.classes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              classname = _ref[_i];
              $obj.addClass(classname);
            }
          }
          if (params.size != null) {
            $obj.attr('width', params.size[0]);
            $obj.attr('height', params.size[1]);
          }
          if ((params.outter != null) && params.outter) {
            $toinclude = $('<div/>');
            $toinclude.addClass(name + '-outter');
            if (params.classes != null) {
              _ref2 = params.classes;
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                classname = _ref2[_j];
                $toinclude.addClass(classname + '-outter');
              }
            }
            $toinclude.append($obj);
          } else {
            $toinclude = $obj;
          }
          if (params.parent != null) {
            $(params.parent).append($toinclude);
          }
          if (params.text != null) {
            $obj.text(params.text);
          }
          if (type === 'canvas' && (window.G_vmlCanvasManager != null)) {
            $obj = $(G_vmlCanvasManager.initElement($obj[0]));
          }
          return $obj;
        }
      },
      vmvtools: {
        init: function() {
          this.vmvtools = kastagoo.view.vmvtools;
          this.Event = kastagoo.utils.Event;
          return this.vmvtools.bindingManager.init();
        },
        getParent: function(element) {
          return $(element).parent()[0];
        },
        getDataContext: function(element, params) {
          element = $(element)[0];
          return this.getVmHelperInstance(element, params).getDataContext();
        },
        setDataContext: function(element, dataContext) {
          element = $(element)[0];
          this.getVmHelperInstance(element, {
            norecurse: true
          }).setDataContext(dataContext);
        },
        getVmHelperInstance: function(element, params) {
          var vmHelperInstance;
          if (params == null) {
            params = {};
          }
          if (element['__VmHelper__'] != null) {
            return element['__VmHelper__'];
          }
          if ((params.norecurse != null) || (element.localName.toLowerCase() === "body")) {
            vmHelperInstance = new this.vmvtools.VmHelper();
            element['__VmHelper__'] = vmHelperInstance;
            return element['__VmHelper__'];
          }
          return this.getVmHelperInstance(this.getParent(element), params);
        },
        VmHelper: mkclass({
          __init__: function() {
            this.datacontext = null;
            this.bindings_by_name = {};
            this.onVmChangedEventHandler = (__bind(function(params) {
              return this.onVmChanged(params);
            }, this));
          },
          getDataContext: function() {
            return this.datacontext;
          },
          setDataContext: function(dataContext) {
            if (this.datacontext !== dataContext) {
              if ((this.datacontext != null) && (this.datacontext.PropertyChanged != null)) {
                this.datacontext.PropertyChanged.remove(this.onVmChangedEventHandler);
              }
              this.datacontext = dataContext;
              if ((this.datacontext != null) && (this.datacontext.PropertyChanged != null)) {
                this.datacontext.PropertyChanged.add(this.onVmChangedEventHandler);
              }
              return this.updateBindings();
            }
          },
          updateBindings: function() {
            var binding, name, _results;
            _results = [];
            for (name in this.bindings_by_name) {
              _results.push((function() {
                var _i, _len, _ref, _results;
                _ref = this.bindings_by_name[name];
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  binding = _ref[_i];
                  _results.push(binding.update());
                }
                return _results;
              }).call(this));
            }
            return _results;
          },
          addBinding: function(binding) {
            var name;
            name = binding.binding_name;
            if (this.bindings_by_name[name] == null) {
              this.bindings_by_name[name] = [];
            }
            this.bindings_by_name[name].push(binding);
            binding.update();
          },
          removeBinding: function(binding) {
            var index, local_binding, _i, _len, _ref;
            if (this.bindings_by_name[binding.binding_name] != null) {
              index = -1;
              _ref = this.bindings_by_name[binding.binding_name];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                local_binding = _ref[_i];
                if (binding === local_binding) {
                  this.bindings_by_name[binding.binding_name].splice(index, 1);
                } else {
                  index += 1;
                }
              }
            }
          },
          onVmChanged: function(params) {
            var binding, _i, _len, _ref;
            if ((params != null) && (params.name != null)) {
              if (this.bindings_by_name[params.name] != null) {
                _ref = this.bindings_by_name[params.name];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  binding = _ref[_i];
                  binding.vm_to_ui();
                }
              }
            }
          }
        }),
        Binding: mkclass({
          __name__: 'Binding',
          __init__: function(params) {
            this.binding_name = params.name;
            this.fromUi = params.fromUi;
            this.toUi = params.toUi;
            this.fromVm = params.fromVm;
            this.toVm = params.toVm;
            this.converter = params.converter;
            this.ui_to_vm_only = __bind(function(e) {
              this.ui_to_vm();
              return e.preventDefault();
            }, this);
            this.vm_to_ui_only = __bind(function(e) {
              this.vm_to_ui();
              return e.preventDefault();
            }, this);
            this.ui_to_vm_event = __bind(function(e) {
              return this.ui_to_vm();
            }, this);
            this.vm_to_ui_event = __bind(function(e) {
              return this.vm_to_ui();
            }, this);
            this.clean_actions = [];
            if (params.clean_actions != null) {
              this.clean_actions = params.clean_actions;
            }
          },
          clean: function() {
            var clean_action, _i, _len, _ref, _results;
            _ref = this.clean_actions;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              clean_action = _ref[_i];
              _results.push(clean_action());
            }
            return _results;
          },
          update: function() {
            return this.vm_to_ui();
          },
          ui_to_vm: function() {
            var arg;
            arg = this.fromUi(this);
            this.toVm(arg);
          },
          vm_to_ui: function() {
            var arg;
            arg = this.fromVm();
            this.toUi(this, arg);
          }
        }),
        bindingManager: {
          init: function() {
            this.vmvtools = kastagoo.view.vmvtools;
            return this.Binding = this.vmvtools.Binding;
          },
          _getVmParts: function(name, helper) {
            return {
              name: name,
              fromVm: function() {
                return helper.getDataContext()[name]();
              },
              toVm: function(arg) {
                return helper.getDataContext()[name](arg);
              }
            };
          },
          _getVmMethodParts: function(name, helper) {
            return {
              name: name,
              fromVm: function() {
                return null;
              },
              toVm: function(arg) {
                return helper.getDataContext()[name](arg);
              }
            };
          },
          content: function(name, element, params) {
            var $element, binding, binding_params, helper;
            $element = $(element);
            element = $element[0];
            helper = this.vmvtools.getVmHelperInstance(element);
            if (params == null) {
              params = {};
            }
            binding_params = this._getVmParts(name, helper);
            if (params.converter != null) {
              binding_params.converter = params.converter;
            }
            binding_params.fromUi = function(binding) {
              return $(element).text();
            };
            binding_params.toUi = function(binding, arg) {
              return $(element).text(arg);
            };
            binding = new this.Binding(binding_params);
            helper.addBinding(binding);
            return binding;
          },
          input: function(name, element, params) {
            var $element, binding, binding_params, helper;
            $element = $(element);
            element = $element[0];
            helper = this.vmvtools.getVmHelperInstance(element);
            if (params == null) {
              params = {};
            }
            binding_params = this._getVmParts(name, helper);
            if (params.converter != null) {
              binding_params.converter = params.converter;
            }
            binding_params.fromUi = function(binding) {
              return $element.val();
            };
            binding_params.toUi = function(binding, arg) {
              return $element.val(arg);
            };
            binding = new this.Binding(binding_params);
            helper.addBinding(binding);
            $element.change(binding.ui_to_vm_only);
            $element.keyup(binding.ui_to_vm_event);
            return binding;
          },
          execution: function(name, element, params) {
            var binding, binding_params, helper;
            helper = this.vmvtools.getVmHelperInstance(element);
            if (params == null) {
              params = {};
            }
            binding_params = this._getVmMethodParts(name, helper);
            if (params.converter != null) {
              binding_params.converter = params.converter;
            }
            binding_params.fromUi = function(binding) {
              return null;
            };
            binding_params.toUi = function(binding, arg) {};
            binding = new this.Binding(binding_params);
            helper.addBinding(binding);
            return binding;
          },
          submit: function(name, element, params) {
            var $element, binding;
            $element = $(element);
            element = $element[0];
            binding = this.execution(name, element, params);
            $element.submit(binding.ui_to_vm_only);
            return binding;
          },
          click: function(name, element, params) {
            var $element, binding;
            $element = $(element);
            element = $element[0];
            binding = this.execution(name, element, params);
            $element.click(binding.ui_to_vm_only);
            return binding;
          },
          collection: function(name, element, createNew) {
            var $element, binding, binding_params, helper, params;
            $element = $(element);
            element = $element[0];
            helper = this.vmvtools.getVmHelperInstance(element);
            if (typeof params == "undefined" || params === null) {
              params = {};
            }
            binding_params = this._getVmParts(name, helper);
            binding_params.clean_actions = [];
            binding_params.toVm = function(arg) {};
            if (params.converter != null) {
              binding_params.converter = params.converter;
            }
            binding_params.fromUi = function(binding) {};
            binding_params.toUi = function(binding, collection) {
              var line, push_event, splice_event, _i, _len, _ref;
              binding.clean();
              $element.html('');
              if (collection && collection.isObservable) {
                _ref = collection._innerarray;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  line = _ref[_i];
                  $element.append(createNew(line));
                }
                if (collection.isObservable) {
                  push_event = __bind(function(params) {
                    return $element.append(createNew(params.item));
                  }, this);
                  splice_event = __bind(function(params) {
                    var subelement, _i, _len, _ref, _results;
                    _ref = $element.children().splice(params.index, params.size);
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      subelement = _ref[_i];
                      _results.push($(subelement).remove());
                    }
                    return _results;
                  }, this);
                  collection.pushed.add(push_event);
                  collection.spliced.add(splice_event);
                  binding_params.clean_actions.push((function() {
                    return collection.pushed.remove(push_event);
                  }));
                  return binding_params.clean_actions.push((function() {
                    return collection.spliced.remove(splice_event);
                  }));
                }
              }
            };
            binding = new this.Binding(binding_params);
            helper.addBinding(binding);
            return binding;
          }
        }
      }
    };
    this.kastagoo.view.vmvtools.bindingManager.init();
    this.kastagoo.view.vmvtools.init();
    return this.testlib.page.init();
  }, this));
}).call(this);
