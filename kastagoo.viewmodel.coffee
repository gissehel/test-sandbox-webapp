kastagoo = @kastagoo = @kastagoo || {}

update = kastagoo.utils.update
mkclass = kastagoo.utils.mkclass

update kastagoo,
    viewmodel :
        BaseVM : mkclass
            __name__ : 'BaseVM'
            __basic_properties__ : {}
            
                
            __classinit__ : () ->
                set_basic_property = (dict,property_name) ->
                    dict[property_name] = (data) -> dict._basic_property_.call(@,'_'+property_name,property_name,data)
                for property_name of @__class__.__basic_properties__
                    set_basic_property(@__class__,property_name)
                return
            __init__ : () ->
                # console.log(['basevm __init__',this])
                for property_name of @__basic_properties__
                    @['_'+property_name] = @__basic_properties__[property_name]
                @PropertyChanged = new kastagoo.utils.Event()
            OnPropertyChanged : (name) ->
                @PropertyChanged.execute name: name
            _basic_property_ : (subattrname,attrname,data) ->
                if data == undefined 
                    return @[subattrname]
                else
                    if @[subattrname] != data
                        @[subattrname] = data
                        @OnPropertyChanged attrname
