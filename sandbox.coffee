kastagoo = @kastagoo = @kastagoo || {}

kastagoo.utils = {}

mkclass = kastagoo.utils.mkclass = (parent, dict) ->
      [parent,dict] = [null, parent] if not(dict?)
      dict.__init__ = (()->return) unless dict.__init__?
      dict.__proto__ = parent if parent?
      dict.__init__.__proto__ = dict
      dict.__init__.prototype = dict.__init__  
      dict.__init__.__class__ = dict
      return dict.__init__
    
kastagoo.utils.Event = mkclass 
        __name__ : 'Event'
        __init__ : () ->
            @_callbacks = []
            return
        add : (callback) ->
            @_callbacks.push(callback)
            return
        remove : (callback) ->
            index = @_callbacks.indexOf(callback)
            @_callbacks.splice(index,1) if index >= 0
            return
        execute : (params) ->
            for callback in @_callbacks
                callback(params)
            return
    
kastagoo.utils.Collection = mkclass
        __name__ : 'Colletion'
        __init__ : (iterable) ->
            @_innerarray = []
            @pushed = new kastagoo.utils.Event()
            @spliced = new kastagoo.utils.Event()
            if iterable?
                for item in iterable
                    @push(item)
            return
        isObservable : true
        at : (index) ->
            return @_innerarray[index]
        splice : (index,size) ->
            @_innerarray.splice(index,size)
            @spliced.execute collection:@, index:index, size:size
        removeat : (index) ->
            @splice(index,1) if index >= 0
        remove : (item) -> 
            index = -1
            current_index = 0
            for current_item in @_innerarray
                if item == current_item
                    index = current_index
                current_index++
            if index >= 0
                @removeat index
        push : (item) ->
            @_innerarray.push(item)
            @pushed.execute collection:@, item:item
            
            return 

window = this    
# window.Collection = kastagoo.utils.Collection

@jQuery ($) =>
    @testlib =
        page :
            init : () ->
                @builder = kastagoo.view.builder
                @vmvtools = kastagoo.view.vmvtools
                bindingManager = @vmvtools.bindingManager
                @$workspace = @builder.mkobj 'workspace', parent: 'body'
                
                @$tagzone = @builder.mkobj 'tagzone', parent: @$workspace, outter: true, classes : ['mainzone']
                @$headerzone = @builder.mkobj 'headerzone', parent: @$workspace, outter: true, classes : ['mainzone']
                @$infozone = @builder.mkobj 'infozone', parent: @$workspace, outter: true, classes : ['mainzone']
                
                @$tagzonecontent = @builder.mkobj 'tagzonecontent', parent: @$tagzone, outter: true, classes : ['mainzonecontent']
                
                @$newtagzone = @builder.mkobj 'newtagzone', parent: @$tagzone, outter: true, type: 'form', classes : ['newitemzone']
                @$newtag = @builder.mkobj 'newtag', parent: @$newtagzone, outter: true, type: 'input', classes : ['newitem']
                @$newtag_go = @builder.mkobj 'newtag-go', parent: @$newtagzone, outter: true, text: '\u25b6', classes : ['newitem-go','icon-go','icon']
                
                newtag_click = (e) => 
                    val = @$newtag.val()
                    if val != ''
                        @create_tag text: val
                        @$newtag.val('')
                    e.preventDefault()
                @$newtag_go.click newtag_click
                @$newtagzone.submit newtag_click

                
                @$infozonecontent = @builder.mkobj 'infozonecontent', parent: @$infozone, outter: true, classes : ['mainzonecontent']
                @$newinfozone = @builder.mkobj 'newinfozone', parent: @$infozone, outter: true, type: 'form', classes : ['newitemzone']
                @$newinfo = @builder.mkobj 'newinfo', parent: @$newinfozone, outter: true, type: 'input', classes : ['newitem']
                @$newinfo_go = @builder.mkobj 'newinfo-go', parent: @$newinfozone, outter: true, text: '\u25b6', classes : ['newitem-go','icon-go','icon']

                $tag1 = @create_tag text: 'Tag1'
                $tag2 = @create_tag text: 'Tag2'
                
                $tag1.change_text 'praf'
                
                window.ItemVM = mkclass kastagoo.viewmodel.BaseVM,
                    __init__ : (params) ->
                        @_value = ''
                        if params?
                            @parent = params.parent if params.parent?
                            @collection = params.collection if params.collection?
                        return
                    
                    Value : (data) -> @_basic_property_('_value','Value',data)
                    Close : () -> 
                        @Value("== Closed ==")
                        @collection.remove @
                
                window.GrutVM = mkclass kastagoo.viewmodel.BaseVM,
                    _xdata : 'praf'
                    _itemlist : new kastagoo.utils.Collection()
                    XData : (data) -> @_basic_property_('_xdata','XData',data)
                    ItemList : (data) -> @_basic_property_('_itemlist','ItemList',data)
                    Validate : () ->
                        @add('[--'+@XData()+'--]')
                        @XData('new value')
                    add : (name) ->
                        item = new window.ItemVM parent:@, collection:@ItemList() 
                        item.Value(name)
                        # console.log('item: ['+item+']; item.Value() : ['+item.Value()+']')
                        @ItemList().push(item)

                window.grut = new window.GrutVM()
                window.grut.init()        
                window.grut.add("first line")
                
                @vmvtools.setDataContext @$workspace, window.grut
                window.binding = bindingManager.content 'XData', $tag2.inner_text
                window.binding2 = bindingManager.input 'XData', (@$newinfo)[0]
                window.binding3 = bindingManager.submit 'Validate', (@$newinfozone)[0]
                window.binding4 = bindingManager.click 'Validate', (@$newinfo_go)[0]
                
                window.binding5 = bindingManager.collection 'ItemList', (@$infozonecontent)[0], (item) => 
                    $item_element = @create_info text: '', noparent: true
                    @vmvtools.setDataContext $item_element, item
                    window.ITEMCLOSE = $item_element.find '.item-close'
                    bindingManager.content 'Value', $item_element.inner_text
                    bindingManager.click 'Close', window.ITEMCLOSE
                    
                    ($item_element).parent()
               
                # window.grut.PropertyChanged.add (params) ->
                #     window.binding.vm_to_ui()
                
            create_tag : (args) ->
                args.text = '' unless args.text?
                $tag = @builder.mkobj 'tag', parent: @$tagzonecontent, outter: true, classes : ['item']
                $tag_content = @builder.mkobj 'tag-content', parent: $tag, outter: true, text: args.text, classes : ['item-content']
                $tag_close = @builder.mkobj 'tag-close', parent: $tag, outter: true, text: '\u2716', classes : ['item-close','icon-close','icon']
                $tag.change_text = (text) => $tag_content.text text

                $tag.inner_text = $tag_content[0]
                return $tag

            create_info : (args) ->
                args.text = '' unless args.text?
                if args.noparent? and args.noparent
                    $info = @builder.mkobj 'info', outter: true, classes : ['item']
                else 
                    $info = @builder.mkobj 'info', parent: @$infozonecontent, outter: true, classes : ['item']
                $info_content = @builder.mkobj 'info-content', parent: $info, outter: true, text: args.text, classes : ['item-content']
                $info_fold = @builder.mkobj 'info-fold', parent: $info, outter: true, text: '\u25b2', classes : ['item-fold','icon-fold','icon']
                $info_unfold = @builder.mkobj 'info-unfold', parent: $info, outter: true, text: '\u25bc', classes : ['item-unfold','icon-unfold','icon']
                $info_close = @builder.mkobj 'info-close', parent: $info, outter: true, text: '\u2716', classes : ['item-close','icon-close','icon']
                $info_outter = $info.parent()
                $info_fold.click (e) => $info_outter.removeClass 'unfolded'
                $info_unfold.click (e) => $info_outter.addClass 'unfolded'
                $info.change_text = (text) => $info_content.text text
                $info.inner_text = $info_content[0]
                
                    
                return $info
                
    @kastagoo.viewmodel = 
        BaseVM : mkclass
            __name__ : 'BaseVM'
            init : () ->
                @PropertyChanged = new kastagoo.utils.Event
            OnPropertyChanged : (name) ->
                @PropertyChanged = new kastagoo.utils.Event unless @PropertyChanged?
                @PropertyChanged.execute name: name
            _basic_property_ : (subattrname,attrname,data) ->
                if data == undefined 
                    return @[subattrname]
                else
                    if @[subattrname] != data
                        @[subattrname] = data
                        @OnPropertyChanged attrname
        
    @kastagoo.view =
        builder : 
            mkobj : (name,params) -> 
                type = if params.type? then params.type else 'div'
                $obj = $('<'+type+'/>')
                $obj.addClass(name)
                if params.classes?
                    for classname in params.classes
                        $obj.addClass(classname)
                if params.size?
                    $obj.attr('width',params.size[0])
                    $obj.attr('height',params.size[1])
                if params.outter? and params.outter
                    $toinclude = $('<div/>')
                    $toinclude.addClass(name+'-outter')
                    if params.classes?
                        for classname in params.classes
                            $toinclude.addClass(classname+'-outter')
                    $toinclude.append($obj)
                else
                    $toinclude = $obj
                $(params.parent).append($toinclude) if params.parent?
                if params.text?
                    $obj.text(params.text)
                if type == 'canvas' and window.G_vmlCanvasManager?
                    $obj = $(G_vmlCanvasManager.initElement($obj[0]))
                return $obj
        vmvtools :
            init : () ->
                @vmvtools = kastagoo.view.vmvtools
                @Event = kastagoo.utils.Event
                @vmvtools.bindingManager.init()
            getParent : (element) -> $(element).parent()[0]
            getDataContext : (element, params) ->
                element = $(element)[0]
                return @getVmHelperInstance(element, params).getDataContext()
            setDataContext : (element, dataContext) ->
                element = $(element)[0]
                @getVmHelperInstance(element, {norecurse:true}).setDataContext(dataContext)
                return
            getVmHelperInstance : (element, params) ->
                params = {} unless params?
                if element['__VmHelper__']? 
                    return element['__VmHelper__']
                if params.norecurse? or (element.localName.toLowerCase() == "body") 
                    vmHelperInstance = new @vmvtools.VmHelper()
                    element['__VmHelper__'] = vmHelperInstance
                    return element['__VmHelper__']
                return @getVmHelperInstance(@getParent(element),params)
            VmHelper : mkclass
                __init__ : () ->
                    @datacontext = null
                    @bindings_by_name = {}
                    @onVmChangedEventHandler = ((params)=>@onVmChanged(params))
                    return 
                getDataContext : () ->
                    return @datacontext
                setDataContext : (dataContext) ->
                    if @datacontext != dataContext
                        if @datacontext? and @datacontext.PropertyChanged?
                            @datacontext.PropertyChanged.remove @onVmChangedEventHandler
                        @datacontext = dataContext
                        if @datacontext? and @datacontext.PropertyChanged?
                            @datacontext.PropertyChanged.add @onVmChangedEventHandler
                        @updateBindings()

                updateBindings : () ->
                    for name of @bindings_by_name
                        for binding in @bindings_by_name[name]
                            binding.update()

                addBinding : (binding) ->
                    name = binding.binding_name
                    @bindings_by_name[name] = [] unless @bindings_by_name[name]?
                    @bindings_by_name[name].push(binding)
                    binding.update()
                    return
                removeBinding : (binding) ->
                    if @bindings_by_name[binding.binding_name]?
                        index = -1
                        for local_binding in @bindings_by_name[binding.binding_name]
                            if binding == local_binding 
                                @bindings_by_name[binding.binding_name].splice(index,1)
                            else
                                index += 1
                    return
                onVmChanged : (params) ->
                    if params? and params.name?
                        if @bindings_by_name[params.name]?
                            for binding in @bindings_by_name[params.name]
                                binding.vm_to_ui()
                    return
            Binding : mkclass
                __name__ : 'Binding'
                __init__ : (params) ->
                    # window.binparams = params
                    @binding_name = params.name
                    @fromUi = params.fromUi
                    @toUi = params.toUi
                    @fromVm = params.fromVm
                    @toVm = params.toVm
                    @converter = params.converter
                    @ui_to_vm_only = (e) =>
                        @ui_to_vm()
                        e.preventDefault()
                    @vm_to_ui_only = (e) =>
                        @vm_to_ui()
                        e.preventDefault()
                    @ui_to_vm_event = (e) =>
                        @ui_to_vm()
                    @vm_to_ui_event = (e) =>
                        @vm_to_ui()
                    @clean_actions = [] 
                    @clean_actions = params.clean_actions if params.clean_actions?
                    return
                clean : ->
                    for clean_action in @clean_actions
                        clean_action()
                update : ->
                    @vm_to_ui()
                ui_to_vm : ->
                    arg = @fromUi(@)
                    @toVm(arg)
                    return
                vm_to_ui : ->
                    arg = @fromVm()
                    @toUi(@,arg)
                    return
            bindingManager :
                init : () ->
                    @vmvtools = kastagoo.view.vmvtools
                    @Binding = @vmvtools.Binding
                _getVmParts : (name,helper) ->
                    return {
                        name : name
                        fromVm :  () -> helper.getDataContext()[name]()
                        toVm : (arg) -> helper.getDataContext()[name](arg)
                        }
                _getVmMethodParts : (name,helper) ->
                    return {
                        name : name
                        fromVm : () -> return null
                        toVm : (arg) -> helper.getDataContext()[name](arg)
                        }
                content : (name,element,params) ->
                    $element = $(element)
                    element = $element[0]
                    helper = @vmvtools.getVmHelperInstance element
                    params = {} unless params?
                    binding_params = @_getVmParts(name,helper)
                    binding_params.converter = params.converter if params.converter?
                    binding_params.fromUi = (binding) -> $(element).text()
                    binding_params.toUi = (binding,arg) -> $(element).text(arg)
                    
                    binding = new @Binding binding_params
                    helper.addBinding binding
                    return binding
                    
                input : (name,element,params) ->
                    $element = $(element)
                    element = $element[0]
                    helper = @vmvtools.getVmHelperInstance element
                    params = {} unless params?
                    binding_params = @_getVmParts(name,helper)
                    binding_params.converter = params.converter if params.converter?
                    binding_params.fromUi = (binding) -> $element.val()
                    binding_params.toUi = (binding,arg) -> $element.val(arg)
                    
                    binding = new @Binding binding_params
                    helper.addBinding binding
                    
                    $element.change binding.ui_to_vm_only
                    $element.keyup binding.ui_to_vm_event

                    return binding

                execution : (name,element,params) ->
                    helper = @vmvtools.getVmHelperInstance element
                    params = {} unless params?
                    binding_params = @_getVmMethodParts(name,helper)
                    binding_params.converter = params.converter if params.converter?
                    binding_params.fromUi = (binding) -> return null
                    binding_params.toUi = (binding,arg) -> return
                    
                    binding = new @Binding binding_params
                    helper.addBinding binding
                    return binding

                submit : (name,element,params) ->
                    $element = $(element)
                    element = $element[0]
                    binding = @execution name,element,params
                    $element.submit binding.ui_to_vm_only
                    return binding
                    
                click : (name,element,params) ->
                    $element = $(element)
                    element = $element[0]
                    binding = @execution name,element,params
                    $element.click binding.ui_to_vm_only
                    return binding

                collection : (name, element, createNew) ->
                    $element = $(element)
                    element = $element[0]
                    helper = @vmvtools.getVmHelperInstance element
                    params = {} unless params?
                    
                    binding_params = @_getVmParts(name,helper)
                    binding_params.clean_actions = []
                    binding_params.toVm = (arg) -> return
                    binding_params.converter = params.converter if params.converter?
                    binding_params.fromUi = (binding) -> return
                    binding_params.toUi = (binding,collection) -> 
                        binding.clean()
                        $element.html('')
                        if collection and collection.isObservable
                            for line in collection._innerarray
                                $element.append(createNew(line))
                            if collection.isObservable
                                push_event = (params) =>
                                    $element.append(createNew(params.item))
                                splice_event = (params) =>
                                    for subelement in $element.children().splice(params.index,params.size)
                                        $(subelement).remove()
                                collection.pushed.add push_event
                                collection.spliced.add splice_event
                                binding_params.clean_actions.push ( () -> 
                                    collection.pushed.remove push_event
                                    )
                                binding_params.clean_actions.push ( () -> 
                                    collection.spliced.remove splice_event
                                    )

                    binding = new @Binding binding_params
                    helper.addBinding binding
                    return binding
                    
    @kastagoo.view.vmvtools.bindingManager.init()
    @kastagoo.view.vmvtools.init()
    @testlib.page.init()
