(function() {
  var kastagoo, mkclass, update, window;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  kastagoo = this.kastagoo = this.kastagoo || require("kastagoo.utils.coffee").kastagoo;
  update = kastagoo.utils.update;
  mkclass = kastagoo.utils.mkclass;
  window = this;
  this.jQuery(function(jQuery) {
    var $;
    $ = jQuery.sub();
    $.fn.inner_element = function() {
      if (this[0]._kast_inner_element != null) {
        return this[0]._kast_inner_element;
      }
      return this[0];
    };
    $.fn.outter_element = function() {
      if (this[0]._kast_outter_element != null) {
        return this[0]._kast_outter_element;
      }
      return this[0];
    };
    update(kastagoo, {
      view: {
        jQuery: $,
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
            $toinclude[0]._kast_inner_element = $obj[0];
            $toinclude[0]._kast_outter_element = $toinclude[0];
            $obj[0]._kast_inner_element = $obj[0];
            $obj[0]._kast_outter_element = $toinclude[0];
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
            content: function(element, name, params) {
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
            input: function(element, name, params) {
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
            execution: function(element, name, params) {
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
            submit: function(element, name, params) {
              var $element, binding;
              $element = $(element);
              element = $element[0];
              binding = this.execution(element, name, params);
              $element.submit(binding.ui_to_vm_only);
              return binding;
            },
            click: function(element, name, params) {
              var $element, binding;
              $element = $(element);
              element = $element[0];
              binding = this.execution(element, name, params);
              $element.click(binding.ui_to_vm_only);
              return binding;
            },
            collection: function(element, name, createNew, params) {
              var $element, binding, binding_params, helper;
              $element = $(element);
              element = $element[0];
              helper = this.vmvtools.getVmHelperInstance(element);
              if (params == null) {
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
      }
    });
    $.fn.bind_datacontext = function(datacontext) {
      return kastagoo.view.vmvtools.setDataContext(this, datacontext);
    };
    $.fn.bind_content = function(name, params) {
      return kastagoo.view.vmvtools.bindingManager.content(this, name, params);
    };
    $.fn.bind_input = function(name, params) {
      return kastagoo.view.vmvtools.bindingManager.input(this, name, params);
    };
    $.fn.bind_submit = function(name, params) {
      return kastagoo.view.vmvtools.bindingManager.submit(this, name, params);
    };
    $.fn.bind_click = function(name, params) {
      return kastagoo.view.vmvtools.bindingManager.click(this, name, params);
    };
    $.fn.bind_colletion = function(name, createNew, params) {
      return kastagoo.view.vmvtools.bindingManager.collection(this, name, createNew, params);
    };
    return kastagoo.view.vmvtools.init();
  });
}).call(this);
