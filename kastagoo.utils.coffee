kastagoo = @kastagoo = @kastagoo || {}

kastagoo.utils = {}

update = (destination, source) ->
    for name of source
        destination[name] = source[name]

mkclass = (parent, dict) ->
    [parent,dict] = [null, parent] if not(dict?)
    if parent? and parent.__class__?
        parent = parent.__class__
    # console.log("parent : ["+parent+"]("+(if dict.__name__? then dict.__name__  else dict)+")")
    
    if parent?
        parent_ctor = (() -> return)
        parent_ctor.prototype = parent
        new_dict = new parent_ctor()
        update new_dict, dict
        dict = new_dict
        dict.__parent__ = parent
    
    dict.__init__ = (()->return) unless dict.__init__?
    dict.__classinit__ = (()->return) unless dict.__classinit__?
    
    dict.__recursive_init__ = () ->
        parent.__recursive_init__.apply(@,arguments) if parent? and parent.__recursive_init__?
        dict.__init__.apply(@,arguments)
        return

    dict.__recursive_classinit__ = () ->
        parent.__recursive_classinit__.apply(@,arguments) if parent? and parent.__recursive_classinit__?
        dict.__classinit__.apply(@,arguments)
        return

    constructor = () ->
        dict.__recursive_init__.apply(@,arguments)
        return

    
    constructor.prototype = dict
    
    constructor.__class__ = dict
    dict.__ctor__ = constructor
    dict.__class__ = dict
    dict.__recursive_classinit__.apply(constructor)

    
    return constructor

dir = (o) -> res=[]; res.push(x) for x of o; return res

update kastagoo,
    utils :
        mkclass : mkclass
        update : update
        dir : dir
        cdir : (o) -> console.log(x) for x in dir(o); return
        cit : (i) -> console.log(x) for x in i; return
        
        Event : mkclass 
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
        Collection : mkclass
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
            length : () ->
                return @_innerarray.length
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
