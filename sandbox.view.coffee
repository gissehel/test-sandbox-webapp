kastagoo = @kastagoo = @kastagoo || {}
testlib = @testlib = @testlib || {}

# mkclass = kastagoo.utils.mkclass
update = kastagoo.utils.update

window = @

@jQuery () ->
    $ = kastagoo.view.jQuery
    update testlib,
        page :
            init : () ->
                @builder = kastagoo.view.builder
                vmvtools = kastagoo.view.vmvtools
                bindingManager = kastagoo.view.vmvtools.bindingManager
                
                @$workspace = @builder.mkobj 'workspace', parent: 'body'
                
                @$tagzone = @builder.mkobj 'tagzone', parent: @$workspace, outter: true, classes : ['mainzone']
                @$headerzone = @builder.mkobj 'headerzone', parent: @$workspace, outter: true, classes : ['mainzone']
                @$infozone = @builder.mkobj 'infozone', parent: @$workspace, outter: true, classes : ['mainzone']
                
                @$tagzonecontent = @builder.mkobj 'tagzonecontent', parent: @$tagzone, outter: true, classes : ['mainzonecontent']
                
                @$newtagzone = @builder.mkobj 'newtagzone', parent: @$tagzone, outter: true, type: 'form', classes : ['newitemzone']
                @$newtag = @builder.mkobj 'newtag', parent: @$newtagzone, outter: true, type: 'input', classes : ['newitem']
                @$newtag_go = @builder.mkobj 'newtag-go', parent: @$newtagzone, outter: true, text: '\u25b6', classes : ['newitem-go','icon-go','icon']
                
                @$infozonecontent = @builder.mkobj 'infozonecontent', parent: @$infozone, outter: true, classes : ['mainzonecontent']
                @$newinfozone = @builder.mkobj 'newinfozone', parent: @$infozone, outter: true, type: 'form', classes : ['newitemzone']
                @$newinfo = @builder.mkobj 'newinfo', parent: @$newinfozone, outter: true, type: 'input', classes : ['newitem']
                @$newinfo_go = @builder.mkobj 'newinfo-go', parent: @$newinfozone, outter: true, text: '\u25b6', classes : ['newitem-go','icon-go','icon']

                $tag1 = @create_tag text: 'Tag1'
                $tag2 = @create_tag text: 'Tag2'
                
                $tag1.change_text 'praf'
                
                window.grut = new testlib.viewmodel.GrutVM()
                window.grut.add("first line")
                
                @$workspace.bind_datacontext window.grut

                $tag2.$text_element.bind_content 'XData'
                @$newinfo.bind_input 'XData'
                @$newinfozone.bind_submit 'Validate' 
                @$newinfo_go.bind_click 'Validate'
                
                window.binding5 = bindingManager.collection @$infozonecontent, 'ItemList', (item) => 
                    $item_element = @create_info text: '', noparent: true
                    
                    $item_element.bind_datacontext item
                    $item_close = $item_element.find '.item-close'
                    $item_element.$text_element.bind_content 'Value'
                    $item_close.bind_click 'Close'
                    return $item_element.outter_element()
                
            create_tag : (args) ->
                args.text = '' unless args.text?
                $tag = @builder.mkobj 'tag', parent: @$tagzonecontent, outter: true, classes : ['item']
                $tag_content = @builder.mkobj 'tag-content', parent: $tag, outter: true, text: args.text, classes : ['item-content']
                $tag_close = @builder.mkobj 'tag-close', parent: $tag, outter: true, text: '\u2716', classes : ['item-close','icon-close','icon']
                $tag.change_text = (text) => $tag_content.text text

                $tag.$text_element = $tag_content
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
                $info_outter = $($info.outter_element())
                $info_fold.click (e) => $info_outter.removeClass 'unfolded'
                $info_unfold.click (e) => $info_outter.addClass 'unfolded'
                $info.change_text = (text) => $info_content.text text
                $info.$text_element = $info_content
                    
                return $info

    testlib.page.init()
