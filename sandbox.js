(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.jQuery(__bind(function($) {
    this.testlib = {
      page: {
        window: this,
        init: function() {
          var $info1, $info2, $tag1, $tag2, newinfo_click, newtag_click;
          this.builder = this.window.testlib.builder;
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
          newinfo_click = __bind(function(e) {
            var val;
            val = this.$newinfo.val();
            if (val !== '') {
              this.create_info({
                text: val
              });
              this.$newinfo.val('');
            }
            return e.preventDefault();
          }, this);
          this.$newinfo_go.click(newinfo_click);
          this.$newinfozone.submit(newinfo_click);
          $tag1 = this.create_tag({
            text: 'Tag1'
          });
          $tag2 = this.create_tag({
            text: 'Tag2'
          });
          $info1 = this.create_info({
            text: 'Info1'
          });
          $info2 = this.create_info({
            text: 'Info2'
          });
          $info2 = this.create_info({
            text: 'Info2'
          });
          $info2 = this.create_info({
            text: 'Info2'
          });
          $info2 = this.create_info({
            text: 'Info2'
          });
          $info2 = this.create_info({
            text: 'Info2'
          });
          $info2 = this.create_info({
            text: 'Info2'
          });
          return $tag1.change_text('praf');
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
          return $tag;
        },
        create_info: function(args) {
          var $info, $info_close, $info_content, $info_fold, $info_outter, $info_unfold;
          if (args.text == null) {
            args.text = '';
          }
          $info = this.builder.mkobj('info', {
            parent: this.$infozonecontent,
            outter: true,
            classes: ['item']
          });
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
          return $info;
        }
      },
      builder: {
        window: this,
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
          if (type === 'canvas' && (this.window.G_vmlCanvasManager != null)) {
            $obj = $(G_vmlCanvasManager.initElement($obj[0]));
          }
          return $obj;
        }
      }
    };
    return this.testlib.page.init();
  }, this));
}).call(this);
