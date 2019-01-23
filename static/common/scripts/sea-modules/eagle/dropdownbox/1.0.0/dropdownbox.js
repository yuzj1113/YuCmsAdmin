define("eagle/dropdownbox/1.0.0/dropdownbox",["$","juicer","mousewheel"],function(a,b,c){var d=a("$"),e=a("juicer"),f=(a("mousewheel"),100),g="dropdownbox-focus",h="dropdownbox-expand-down",i="dropdownbox-expand-up",j=0,k="data-ddb-tabindex",l="data-ddb-value",m="current",n={className:"",width:150,wheelScrolling:!0,autoUseSelecting:!1,dependOnSelecting:!0,updateLinkage:!0},o=function(a,b){var b=d.extend(!0,{},n,b||{}),c=d(a).filter("select");return 0==c.length?null:c.map(function(){return new p(d(this),b)}).get()},p=function(a,b){return this.options=d.extend(!0,{},b||{}),this.dom={select:a,box:this._convertToBox(a)},this._correlative(),this._drawing(),this._simulation(),this};p.prototype={_convertToBox:function(a){var b=d("option",a),c=b.filter(":selected"),f=a.prop("tabIndex")||a.data(k)||(j+=1),g=p._templates,h={ddbValue:d.trim(c.attr("value"))||"",ddbText:d.trim(c.text())||"",tabIndex:f,width:Number(this.options.width||0)||0,className:this.options.className||"",list:b.map(function(){return{value:d.trim(d(this).attr("value"))||"",text:d.trim(d(this).text())||""}}).get()},i=d(e(g,h));if("undefined"!=typeof this.dom&&this.dom.box.length>0)this.dom.box.replaceWith(i);else{a.data(k,f);var l=a.next('div[data-dependon="select"]');l.length>0?l.replaceWith(i):a.addClass("none").after(i)}return i},_correlative:function(){var a=this,b=this.dom;b.select.off(".ddb-oc"),b.select.on("ddb-update.ddb-oc",function(){a.options.updateLinkage&&(b.box=a._convertToBox(d(this)),a._correlative(),a._drawing(),a._simulation(),b.box.focus(),a._boxFocus())})},_drawing:function(){var a=this.dom,b=this._dom,c=Number(this.options.width||0)||0;c&&c>12&&(a.box.css("width",c),b.getCaption.call(this).css("width",c-12),b.getList.call(this).css("width",c-2))},_simulation:function(){var a=this,b=this.dom,c=a._dom.getCaption.call(this),e=a._dom.getList.call(this);e.undelegate("li",".ddb-ds").delegate("li","click.ddb-ds",function(b){a._selected(d(this)),a._pullUp(),a._boxExtend(),b.stopPropagation(),b.cancelbubble=!0}).delegate("li","mouseenter.ddb-ds",function(){d(this).siblings("li").removeClass(m),d(this).addClass(m)}).delegate("li","mouseleave.ddb-ds",function(){d(this).removeClass(m)}),b.box.off(".ddb-os").on("focus.ddb-os",function(){a._pullUp(),a._boxFocus()}).on("click.ddb-os",function(f){if(e.is(":visible"))return a._pullUp(),a._boxExtend(),!1;var g=d(window),h=g.scrollTop()+document.documentElement.clientHeight-d(this).offset().top,i=e.outerHeight(!0)+1,j=c.outerHeight(!0),k=d(this).offset().top-g.scrollTop()-i,l=i>h&&k>0,m=l?-i:j;e.css("top",m),a._pullDown(),a._boxExpand(l),g.off(".ddb-win").on("scroll.ddb-win resize.ddb-win",function(){h=g.scrollTop()+document.documentElement.clientHeight-b.box.offset().top,l=i>h,m=l?-i:j,e.css("top",m),a._boxExpand(l)}),f.stopPropagation()}).on("mousewheel.ddb-os",function(b,c){a.options.wheelScrolling||b.preventDefault(),c>0?a._movePrev(null):a._moveNext(null)}).on("dblclick.ddb-os",function(){return a._pullUp(),!1}).on("blur.ddb-os",function(){return a._pullUp(),a._boxExtend(),!1}).on("selectstart.ddb-os",function(){return!1}).on("keydown.ddb-os",function(a){return 35==a.keyCode||36==a.keyCode||38==a.keyCode||40==a.keyCode?!1:void 0}).on("keydown.ddb-os",function(b){var c=a._dom.getActiveItem.call(a);switch(b.keyCode){case 9:case 13:a._selected(c),a._pullUp(),a._boxExtend();break;case 27:a._pullUp(),a._boxExtend();break;case 33:case 36:return a._movePrev(a._dom.getFirstItem.call(a)),!1;case 34:case 35:return a._moveNext(a._dom.getLastItem.call(a)),!1;case 38:return a._movePrev(null),!1;case 40:return a._moveNext(null),!1;default:b.preventDefault()}})},_pullDown:function(){this.dom.box.css("z-index",f+=1),this._dom.getList.call(this).removeClass("none")},_pullUp:function(){this._dom.getList.call(this).addClass("none")},_boxFocus:function(){this.dom.box.addClass(g)},_boxBlur:function(){this.dom.box.removeClass(g)},_boxExpand:function(a){this.dom.box.addClass(g),a?(this.dom.box.removeClass(h),this.dom.box.addClass(i)):(this.dom.box.removeClass(i),this.dom.box.addClass(h))},_boxExtend:function(){this.dom.box.removeClass(g),this.dom.box.removeClass(h),this.dom.box.removeClass(i)},_selected:function(a){var b=this.dom.select,c=this._dom.getCaption.call(this),e=this._dom.getItems.call(this),f=d.trim(a.attr("value")),g=d.trim(a.text()),h=e.index(a);b.length>0&&(b[0].selectedIndex=h,b.change()),c.attr(l,f),c.text(g)},_movePrev:function(a){var b=this._dom,c=this.options.dependOnSelecting,d=this.options.autoUseSelecting,e=(b.getList.call(this),a||(c&&d?b.getSelectingItem:b.getActiveItem).call(this)),f=e.prev("li"),g=0==f.length,h=g?e:f;g||(f.siblings("li").removeClass(m),f.addClass(m)),d&&this._selected(h)},_moveNext:function(a){var b=this._dom,c=this.options.dependOnSelecting,d=this.options.autoUseSelecting,e=(b.getList.call(this),a||(c&&d?b.getSelectingItem:b.getActiveItem).call(this)),f=e.next("li"),g=0==f.length,h=g?e:f;g||(f.siblings("li").removeClass(m),f.addClass(m)),d&&this._selected(h)},_dom:{getCaption:function(){return d('h4[data-ddb-type="caption"]',this.dom.box)},getList:function(){return d('ul[data-ddb-type="list"]',this.dom.box)},getItems:function(){return d("li",this._dom.getList.call(this))},getActiveItem:function(){var a=this._dom.getList.call(this),b=d("li."+m,a),c=b.length>0;return c||(b=this._dom.getSelectingItem.call(this)),b},getSelectingItem:function(){var a=this._dom.getList.call(this),b=this._dom.getCaption.call(this),c=null,e=d.trim(b.attr(l))||"";return c=e?d('li[value="'+e+'"]',a):this._dom.getFirstItem.call(this)},getFirstItem:function(){return d("li:first",this._dom.getList.call(this))},getLastItem:function(){return d("li:last",this._dom.getList.call(this))}}},p._templates='<div tabIndex="${tabIndex}" class="dropdownbox ${className}"><h4 class="dropdowncaption" data-ddb-value="${ddbValue}" data-ddb-type="caption">${ddbText}</h4><ul data-ddb-type="list" class="dropdownlist none">{@each list as item}<li {@if item.value === ddbValue}class="current"{@/if} value="${item.value}">${item.text}</li>{@/each}</ul></div>',function(a){a.fn.extend({dropDownBox:function(){}})}(jQuery),function(a){var b={},c=["append","prepend"];a.each(c,function(c,d){b[d]=a.fn[d],function(c){a.fn[c]=function(){b[c].apply(this,arguments),a(this).is("select")&&a(this).trigger("ddb-update")}}(d)})}(jQuery),function(a){function b(b){var c=b,d=[].slice.call(arguments,1),e=0,f=0,g=0;return b=a.event.fix(c),b.type="mousewheel",b.originalEvent.wheelDelta&&(e=b.originalEvent.wheelDelta/120),b.originalEvent.detail&&(e=-b.originalEvent.detail/3),g=e,void 0!==c.axis&&c.axis===c.HORIZONTAL_AXIS&&(g=0,f=-1*e),void 0!==c.wheelDeltaY&&(g=c.wheelDeltaY/120),void 0!==c.wheelDeltaX&&(f=-1*c.wheelDeltaX/120),d.unshift(b,e,f,g),a.event.dispatch.apply(this,d)}var c=["DOMMouseScroll","mousewheel"];a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=c.length;a;)this.addEventListener(c[--a],b,!1);else this.onmousewheel=b},teardown:function(){if(this.removeEventListener)for(var a=c.length;a;)this.removeEventListener(c[--a],b,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})}(jQuery),c.exports=o});