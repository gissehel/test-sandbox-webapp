(function() {
  var kastagoo, testlib, update, window;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  kastagoo = this.kastagoo = this.kastagoo || {};
  testlib = this.testlib = this.testlib || {};
  update = kastagoo.utils.update;
  window = this;
  this.jQuery(function() {
    var $;
    $ = kastagoo.view.jQuery;
    update(testlib, {
      page: {
        init: function() {
          var $tag1, $tag2, bindingManager, vmvtools;
          this.builder = kastagoo.view.builder;
          vmvtools = kastagoo.view.vmvtools;
          bindingManager = kastagoo.view.vmvtools.bindingManager;
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
          $tag1 = this.create_tag({
            text: 'Tag1'
          });
          $tag2 = this.create_tag({
            text: 'Tag2'
          });
          $tag1.change_text('praf');
          window.grut = new testlib.viewmodel.GrutVM();
          window.grut.add("first line");
          this.$workspace.bind_datacontext(window.grut);
          $tag2.$text_element.bind_content('XData');
          this.$newinfo.bind_input('XData');
          this.$newinfozone.bind_submit('Validate');
          this.$newinfo_go.bind_click('Validate');
          return window.binding5 = bindingManager.collection(this.$infozonecontent, 'ItemList', __bind(function(item) {
            var $item_close, $item_element;
            $item_element = this.create_info({
              text: '',
              noparent: true
            });
            $item_element.bind_datacontext(item);
            $item_close = $item_element.find('.item-close');
            $item_element.$text_element.bind_content('Value');
            $item_close.bind_click('Close');
            return $item_element.outter_element();
          }, this));
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
          $tag.$text_element = $tag_content;
          return $tag;
        },
        create_info: function(args) {
          var $info, $info_close, $info_content, $info_fold, $info_outter, $info_unfold;
          if (args.text == null) {
            args.text = '';
          }
          if ((args.noparent != null) && args.noparent) {
            $info = this.builder.mkobj('info', {
              outter: true,
              classes: ['item']
            });
          } else {
            $info = this.builder.mkobj('info', {
              parent: this.$infozonecontent,
              outter: true,
              classes: ['item']
            });
          }
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
          $info_outter = $($info.outter_element());
          $info_fold.click(__bind(function(e) {
            return $info_outter.removeClass('unfolded');
          }, this));
          $info_unfold.click(__bind(function(e) {
            return $info_outter.addClass('unfolded');
          }, this));
          $info.change_text = __bind(function(text) {
            return $info_content.text(text);
          }, this);
          $info.$text_element = $info_content;
          return $info;
        }
      }
    });
    return testlib.page.init();
  });
}).call(this);
