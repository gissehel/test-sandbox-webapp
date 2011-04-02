@jQuery ($) =>
    @testlib =
        page :
            window : @
            init : () ->
                @builder = @window.testlib.builder
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

                newinfo_click = (e) => 
                    val = @$newinfo.val()
                    if val != ''
                        @create_info text: val
                        @$newinfo.val('')
                    e.preventDefault()
                @$newinfo_go.click newinfo_click
                @$newinfozone.submit newinfo_click


                $tag1 = @create_tag text: 'Tag1'
                $tag2 = @create_tag text: 'Tag2'
                
                $info1 = @create_info text: 'Info1'
                $info2 = @create_info text: 'Info2'
                $info2 = @create_info text: 'Info2'
                $info2 = @create_info text: 'Info2'
                $info2 = @create_info text: 'Info2'
                $info2 = @create_info text: 'Info2'
                $info2 = @create_info text: 'Info2'
                
                $tag1.change_text 'praf'
                
                
                
            create_tag : (args) ->
                args.text = '' unless args.text?
                $tag = @builder.mkobj 'tag', parent: @$tagzonecontent, outter: true, classes : ['item']
                $tag_content = @builder.mkobj 'tag-content', parent: $tag, outter: true, text: args.text, classes : ['item-content']
                $tag_close = @builder.mkobj 'tag-close', parent: $tag, outter: true, text: '\u2716', classes : ['item-close','icon-close','icon']
                $tag.change_text = (text) => $tag_content.text text

                return $tag

            create_info : (args) ->
                args.text = '' unless args.text?
                $info = @builder.mkobj 'info', parent: @$infozonecontent, outter: true, classes : ['item']
                $info_content = @builder.mkobj 'info-content', parent: $info, outter: true, text: args.text, classes : ['item-content']
                $info_fold = @builder.mkobj 'info-fold', parent: $info, outter: true, text: '\u25b2', classes : ['item-fold','icon-fold','icon']
                $info_unfold = @builder.mkobj 'info-unfold', parent: $info, outter: true, text: '\u25bc', classes : ['item-unfold','icon-unfold','icon']
                $info_close = @builder.mkobj 'info-close', parent: $info, outter: true, text: '\u2716', classes : ['item-close','icon-close','icon']
                $info_outter = $info.parent()
                $info_fold.click (e) => $info_outter.removeClass 'unfolded'
                $info_unfold.click (e) => $info_outter.addClass 'unfolded'
                $info.change_text = (text) => $info_content.text text
                
                
                return $info
                
        builder : 
            window : @
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
                if type == 'canvas' and @window.G_vmlCanvasManager?
                    $obj = $(G_vmlCanvasManager.initElement($obj[0]))
                return $obj
    @testlib.page.init()
