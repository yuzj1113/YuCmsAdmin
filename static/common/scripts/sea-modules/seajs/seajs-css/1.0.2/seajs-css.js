!function(){function a(a){return"[object Function]"=={}.toString.call(a)}function b(b,d,j){var k=i.test(b),l=f.createElement(k?"link":"script");if(j){var m=a(j)?j(b):j;m&&(l.charset=m)}c(l,d,k,b),k?(l.rel="stylesheet",l.href=b):(l.async=!0,l.src=b),e=l,h?g.insertBefore(l,h):g.appendChild(l),e=null}function c(a,b,c,e){function f(){a.onload=a.onerror=a.onreadystatechange=null,c||seajs.data.debug||g.removeChild(a),a=null,b()}var h="onload"in a;return!c||!j&&h?(h?(a.onload=f,a.onerror=function(){seajs.emit("error",{uri:e,node:a}),f()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&f()},void 0):(setTimeout(function(){d(a,b)},1),void 0)}function d(a,b){var c,e=a.sheet;if(j)e&&(c=!0);else if(e)try{e.cssRules&&(c=!0)}catch(f){"NS_ERROR_DOM_SECURITY_ERR"===f.name&&(c=!0)}setTimeout(function(){c?b():d(a,b)},20)}var e,f=document,g=f.head||f.getElementsByTagName("head")[0]||f.documentElement,h=g.getElementsByTagName("base")[0],i=/\.css(?:\?|$)/i,j=+navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/,"$1")<536;seajs.request=b,define("seajs/seajs-css/1.0.2/seajs-css",[],{})}();