kastagoo = @kastagoo = @kastagoo || require("kastagoo.utils.coffee").kastagoo

update = kastagoo.utils.update
mkclass = kastagoo.utils.mkclass

window = @
storage = null
    
localStorage = window.localStorage
if localStorage?
    storage =
        getItem : (key) -> localStorage.getItem(key)
        setItem : (key,data) -> localStorage.setItem(key,data)
        removeItem : (key) -> localStorage.removeItem(key)
        length : () -> localStorage.length
        key : (index) -> localStorage.key(index)
        log : () -> return
else
    Storage = () ->
        localStorage = {}
        keys = []
        update @,
            getItem : (key) -> localStorage[key]
            setItem : (key,data) ->
                if keys.indexOf(key) == -1
                    keys.push(key)
                localStorage[key] = ""+data
                return
            removeItem : (key) ->
                i = keys.indexOf(key)
                if i != -1
                    keys.splice(i,1)
                    delete localStorage[key]
                return
            length : () -> keys.length
            key : (index) -> localStorage[keys[index]]
            log : () -> console.log(localStorage)
        return @
    storage = new Storage()


update kastagoo,
    dao :
        WSRepository : mkclass
            __name__ : 'WSRepository'
                
            __init__ : (name) ->
                @name = name
                @classRegistry = {}
                nextid = storage.getItem(@name+".count")
                unless nextid?
                    storage.setItem(@name+".count",1)
            clear : () ->
                items_to_delete = []
                len = storage.length
                index = 0
                while index < len
                    key = storage.key(index)
                    if key.substr(0,@name.length+1) == @name + "."
                        items_to_delete.push(key)
                for item in items_to_delete
                    storage.removeItem(item)
            save : (obj,regtype,name) ->
                if !(@classRegistry[regtype]?)
                    return false
                if !(obj.id?)
                    count_str = @name+".count"
                    nextId = parseInt(storage.getItem(count_str))
                    obj.id = nextId
                    storage.setItem(count_str, nextId+1)
                register_params = @classRegistry[regtype]
                storage.setItem(@name+"."+obj["id"], regtype)
                if register_params.keys?
                    @save_object(obj.id, obj, register_params.keys)
                if register_params.savekeys?
                    @save_object(obj.id, obj, register_params.savekeys)
                else if register_params.getProperties?
                    @save_dict(obj.id, register_params.getProperties(obj))
                if name?
                    storage.setItem(@name+".labels."+name,obj.id)
                return true
            get : (id,obj) ->
                if typeof(id) != typeof(0)
                    id = parseInt(storage.getItem(@name+".labels."+id))
                regtype = storage.getItem(@name+"."+id)
                register_params = @classRegistry[regtype]
                if obj?
                    if register_params.keys?
                        return @get_object(id, obj, register_params.keys)
                    if register_params.getkeys?
                        return @get_object(id, obj, register_params.getkeys)
                dict = {}
                if register_params.keys?
                    dict = @get_dict(id, register_params.keys)
                else if register_params.getkeys?
                    dict = @get_dict(id, register_params.getkeys)
                return register_params.createObject(id,dict)
            save_dict : (id,dict) ->
                for key of dict
                    storage.setItem(@name+"."+id+"."+key, dict[key])
            get_dict : (id,keys) ->
                result = {}
                for key in keys
                    result[key] = storage.getItem(@name+"."+id+"."+key)
                return result
            save_object : (id, obj, keys) ->
                for key in keys 
                    storage.setItem(@name+"."+id+"."+key, obj[key])
            get_object : (id, obj, keys) ->
                for key in keys
                    obj[key] = storage.getItem(@name+"."+id+"."+key)
                return obj
            save_prop : (id,key,value) -> storage.setItem(@name+"."+id+"."+key, value)
            get_prop : (id,key) -> storage.getItem(@name+"."+id+"."+key)
            getName : () -> @name
            register : (params) ->
                name = params.name
                @classRegistry[name] = params
            log : () -> storage.log()
            
                    
        
