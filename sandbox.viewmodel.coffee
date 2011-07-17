kastagoo = @kastagoo = @kastagoo || require('kastagoo.coffee').kastagoo
testlib = @testlib = @testlib || {}

update = kastagoo.utils.update
mkclass = kastagoo.utils.mkclass

# window = @

update testlib,
    viewmodel : 
        ItemVM : 
            mkclass kastagoo.viewmodel.BaseVM,
                __name__ : 'ItemVM',
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
                
        GrutVM : 
            mkclass kastagoo.viewmodel.BaseVM,
                __name__ : 'GrutVM',
                __basic_properties__ :
                    XData : 'poide'
                    ItemList : null
                __init__ : () -> 
                    # @ItemList(new kastagoo.utils.Collection())
                    @_ItemList = new kastagoo.utils.Collection()
                    return
                Validate : () ->
                    @add('[--'+@XData()+'--]')
                    @XData('new value')
                add : (name) ->
                    item = new testlib.viewmodel.ItemVM parent:@, collection:@ItemList() 
                    item.Value(name)
                    @ItemList().push(item)

