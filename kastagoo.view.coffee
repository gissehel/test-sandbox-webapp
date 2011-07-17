kastagoo = @kastagoo = @kastagoo || require("kastagoo.utils.coffee").kastagoo

update = kastagoo.utils.update
mkclass = kastagoo.utils.mkclass

window = @

@jQuery (jQuery) ->
    $ = jQuery.sub()

    $.fn.inner_element = () ->
        return @[0]._kast_inner_element if @[0]._kast_inner_element?
        return @[0]
    $.fn.outter_element = () ->
        return @[0]._kast_outter_element if @[0]._kast_outter_element?
        return @[0]
        
    update kastagoo,
        view :
            jQuery : $
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
        
                    $toinclude[0]._kast_inner_element = $obj[0]
                    $toinclude[0]._kast_outter_element = $toinclude[0]
                    $obj[0]._kast_inner_element = $obj[0]
                    $obj[0]._kast_outter_element = $toinclude[0]
                    
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
                    content : (element,name,params) ->
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
                        
                    input : (element,name,params) ->
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
        
                    execution : (element,name,params) ->
                        helper = @vmvtools.getVmHelperInstance element
                        params = {} unless params?
                        binding_params = @_getVmMethodParts(name,helper)
                        binding_params.converter = params.converter if params.converter?
                        binding_params.fromUi = (binding) -> return null
                        binding_params.toUi = (binding,arg) -> return
                        
                        binding = new @Binding binding_params
                        helper.addBinding binding
                        return binding
        
                    submit : (element,name,params) ->
                        $element = $(element)
                        element = $element[0]
                        binding = @execution element,name,params
                        $element.submit binding.ui_to_vm_only
                        return binding
                        
                    click : (element,name,params) ->
                        $element = $(element)
                        element = $element[0]
                        binding = @execution element,name,params
                        $element.click binding.ui_to_vm_only
                        return binding
        
                    collection : (element, name, createNew, params) ->
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

    $.fn.bind_datacontext = (datacontext) -> kastagoo.view.vmvtools.setDataContext(this, datacontext)
    $.fn.bind_content = (name,params) -> kastagoo.view.vmvtools.bindingManager.content(this,name,params)
    $.fn.bind_input = (name,params) -> kastagoo.view.vmvtools.bindingManager.input(this,name,params)
    $.fn.bind_submit = (name,params) -> kastagoo.view.vmvtools.bindingManager.submit(this,name,params)
    $.fn.bind_click = (name,params) -> kastagoo.view.vmvtools.bindingManager.click(this,name,params)
    $.fn.bind_colletion = (name,createNew,params) -> kastagoo.view.vmvtools.bindingManager.collection(this,name,createNew,params)

    kastagoo.view.vmvtools.init()
