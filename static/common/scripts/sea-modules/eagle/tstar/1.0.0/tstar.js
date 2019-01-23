define("eagle/tstar/1.0.0/tstar",["$"],function(t,a,s){var e=t("$"),i={hoverclass:"star-for",score:0,tagattr:{scorename:"data-star-score"},readonly:!1,onlyonce:!1,complete:function(){},change:function(){},close:function(){},open:function(){},disable:function(){},enable:function(){}};e.fn.tstar=function(t,a){var s=["score","change","close","open","disable","enable","cancelOnce"],i=["score"],c=function(t,a){var s=this["_"+t];return e.isFunction(s)?s.call(this,a||null):null};if(0!=arguments.length&&-1!=e.inArray(t,s))return-1!=e.inArray(t,i)&&e(this).length>0?c.call(e(this)[0],t,a):e(this).each(function(){c.call(this,t,a)});var o=e(this),h=e.isPlainObject(arguments[0])?arguments[0]:null;return n(o,h)};var n=function(t,a){return e(t).each(function(){var t=e.extend({},i,a||{}),s=e(this);if(!e.isNumeric(s.data("data-star"))){var n=s.find("a").length,c=Math.floor(parseInt(s.width())/n),o=[];if(e.isArray(t.hoverclass))o=t.hoverclass;else for(var h=0;n>h;h++)o[h]=t.hoverclass+(h+1);jQuery.extend(this,{_index:0,_hasclick:!1,_childlength:n,_childwidth:c,_hoverclassnames:o,_settings:t,_getHoverElem:function(){return e(this).find("a")},_getShowElem:function(){return e(this).find("span").eq(0)},_getDefaultScore:function(t){var a,s=function(t){return e.isNumeric(t)&&t>=0&&this._childlength>=t};return a=e.isFunction(t)?t.call(this):t,s.call(this,a)?a:(a=e(this).attr(this._settings.tagattr.scorename),s.call(this,a)?a:(a=this._settings.score,s.call(this,a)?a:0))},_getData:function(){return e(this).data("data-star")||0},_setData:function(t){e(this).data("data-star",t)},_callBack:function(t){e.isFunction(this._settings[t])&&this._settings[t].call(this)},_callBackWithScore:function(t,a){e.isFunction(this._settings[t])&&this._settings[t].call(this,a)},_ainmate:function(t){var a=this,s=parseFloat(e.isFunction(t)?t.call(this):t)||0,i=Math.floor(s*this._childwidth),n=e(this),c=this._getShowElem();n.removeClass(this._hoverclassnames[this._index]),this._setData(s),Math.floor(c.width())==i?this._callBackWithScore("change",s):c.animate({width:i},800,function(){a._callBackWithScore.call(a,"change",s)})},_offEvent:function(){this._getHoverElem().hide().off(".tstar"),this._getShowElem().css("margin-left",0)},_onEvent:function(){var t=this;this._getHoverElem().show().off(".tstar").on({"mouseover.tstar":function(){t._getShowElem().css("width",0),t._index=e(this).index(),e(t).addClass(t._hoverclassnames[t._index])},"mouseout.tstar":function(){e(t).removeClass(t._hoverclassnames[t._index]);var a=t._getData();a>0&&t._getShowElem().css("width",function(){return Math.floor(a*t._childwidth)})},"click.tstar":function(){t._hasclick=!0,t._index=e(this).index();var a=t._index+1,s=Math.floor(a*t._childwidth);t._getShowElem().stop(!0),t._setData(a),t._getShowElem().css("width",s),t._settings.onlyonce&&t._offEvent(),t._callBackWithScore.call(t,"complete",a),t._callBackWithScore.call(t,"change",a)}})},_score:function(){return this._getData()},_change:function(t){this._ainmate(t)},_close:function(){var t=this._getData();this._getShowElem().stop(!0),e(this).removeClass(this._hoverclassnames[this._index]),e(this).data("data-star-backup",t),this._offEvent(),this._ainmate(0),this._callBack("close")},_open:function(){var t=e(this).data("data-star-backup");this._settings.readonly||this._settings.onlyonce&&this._hasclick||this._onEvent(),this._ainmate(t),e(this).removeData("data-star-backup"),this._callBack("open")},_disable:function(){var t=e(this).data("data-star-backup");void 0===t&&(this._settings.readonly=!0,this._offEvent(),this._callBack("disable"))},_enable:function(){var t=e(this).data("data-star-backup");void 0===t&&(this._settings.readonly=!1,this._onEvent(),this._callBack("enable"))},_cancelOnce:function(){var t=e(this).data("data-star-backup");void 0===t&&this._settings.onlyonce&&(this._settings.onlyonce=!1,this._onEvent())}}),this._ainmate(this._getDefaultScore),this._settings.readonly?this._offEvent():this._onEvent()}})};s.exports=n});