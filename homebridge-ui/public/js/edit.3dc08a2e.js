(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["edit"],
{
   10713:function(e,n,t)
   {
      "use strict";t.r(n);var r=function()
      {
         var e=this,n=e.$createElement,r=e._self._c||n;return e.loading?r("div",
         {
            staticClass:"lds-ring"
         }
         ,[r("div"),r("div"),r("div"),r("div")]):r("div",
         {
            staticClass:"inner-container"
         }
         ,[r("img",
         {
            attrs:
            {
               src:t("4ffd"),alt:"homebridge-bravia-tvos",width:"150px"
            }
         }
         ),r("div",
         {
            attrs:
            {
               id:"nav"
            }
         }
         ,[r("router-link",
         {
            attrs:
            {
               to:"/"
            }
         }
         ,[e._v("Home")]),r("span",
         {
            staticStyle:
            {
               "font-weight":"bold !important"
            }
         }
         ,[e._v(" · ")]),r("a",
         {
            staticClass:"router-link-exact-active router-link-active",attrs:
            {
               href:"#"
            }
         }
         ,[e._v(e._s(e.newName))]),r("span",
         {
            staticStyle:
            {
               "font-weight":"bold !important"
            }
         }
         ,[e._v(" · ")]),r("router-link",
         {
            attrs:
            {
               to:"/new"
            }
         }
         ,[e._v("New")])],1)])
      }
      ,a=[],i=t("1da1"),o=(t("96cf"),t("b0c0"),t("7db0"),t("d81d"),t("ac1f"),t("1276"),
      {
         name:"Edit",props:
         {
            name:
            {
               type:String,default:"Name"
            }
         }
         ,data:function()
         {
            return
            {
               customSchema:null,loading:!0,newName:null,television:null,waitForChanges:null
            }
         }
         ,mounted:function()
         {
            var e=this;return Object(i["a"])(regeneratorRuntime.mark((function n()
            {
               var t,r;return regeneratorRuntime.wrap((function(n)
               {
                  while(1)switch(n.prev=n.next)
                  {
                     case 0:return n.prev=0,e.newName=e.name,n.next=4,e.getPluginConfig();case 4:if(t=n.sent,e.television=t.tvs.find((function(n)
                     {
                        return n.name===e.newName
                     }
                     )),e.television)
                     {
                        n.next=9;break
                     }
                     return window.homebridge.toast.error("".concat(e.newName," not found in config.json!"),"Error"),n.abrupt("return",e.$router.push(
                     {
                        path:"/"
                     }
                     ));case 9:return n.next=11,window.homebridge.request("/getTV",e.newName);case 11:if(n.t0=n.sent,n.t0)
                     {
                        n.next=14;break
                     }
                     n.t0=
                     {
                        apps:[],channels:[],commands:[],inputs:[],macros:[]
                     };
                     case 14:return r=n.t0,n.next=17,e.generatePluginShema(t,e.television,r);case 17:e.customSchema=n.sent,e.customSchema.onChange(function()
                     {
                        var n=Object(i["a"])(regeneratorRuntime.mark((function n(a)
                        {
                           return regeneratorRuntime.wrap((function(n)
                           {
                              while(1)switch(n.prev=n.next)
                              {
                                 case 0:e.waitForChanges&&(clearTimeout(e.waitForChanges),e.waitForChanges=null),e.waitForChanges=setTimeout(Object(i["a"])(regeneratorRuntime.mark((function n()
                                 {
                                    return regeneratorRuntime.wrap((function(n)
                                    {
                                       while(1)switch(n.prev=n.next)
                                       {
                                          case 0:if(n.prev=0,t.name=a.name,t.debug=a.debug,t.warn=a.warn,t.error=a.error,t.extendedError=a.extendedError,t.tvs=t.tvs.map((function(n)
                                          {
                                             return n.name===e.newName?(r.channels.length&&(a.tvs.channels=(a.tvs.channels||[]).map((function(e)
                                             {
                                                return
                                                {
                                                   name:e.name,channel:e.identifier?parseInt(e.identifier.split("] ")[1]):void 0,source:e.identifier?e.identifier.split("[")[1].split("]")[0]:void 0
                                                }
                                             }
                                             ))),r.commands.length&&(a.tvs.commands=(a.tvs.commands||[]).map((function(n)
                                             {
                                                var t=r.commands.find((function(e)
                                                {
                                                   return e.name===n.value||e.value===n.value
                                                }
                                                ));if(t)
                                                {
                                                   var a=e.television.commands.find((function(e)
                                                   {
                                                      return e.value===t.name||e.value===t.value
                                                   }
                                                   ));return a?
                                                   {
                                                      name:n.name,value:a.value
                                                   }
                                                   :
                                                   {
                                                      name:t.name,value:t.value
                                                   }
                                                }
                                                return
                                                {
                                                   name:n,value:n
                                                }
                                             }
                                             )),a.tvs.macros=(a.tvs.macros||[]).map((function(e)
                                             {
                                                return e.commands=(e.commands||[]).map((function(e)
                                                {
                                                   var n=r.commands.find((function(n)
                                                   {
                                                      return n.name===e||n.value===e
                                                   }
                                                   ));return n&&(e=n.name),e
                                                }
                                                )),e
                                             }
                                             )),a.tvs.remote=(a.tvs.remote||[]).map((function(e)
                                             {
                                                var n=r.commands.find((function(n)
                                                {
                                                   return n.name===e.command||n.value===e.command
                                                }
                                                ));return n&&(e.command=n.name),e
                                             }
                                             ))),r.inputs.length&&(a.tvs.inputs=(a.tvs.inputs||[]).map((function(e)
                                             {
                                                return
                                                {
                                                   name:e.name,identifier:e.identifier?e.identifier.split("] ")[1]:void 0,source:e.identifier?e.identifier.split("[")[1].split("]")[0]:void 0
                                                }
                                             }
                                             ))),a.tvs):n
                                          }
                                          )),!a.tvs.name||a.tvs.name===e.newName)
                                          {
                                             n.next=11;break
                                          }
                                          return n.next=10,window.homebridge.request("/changeTV",
                                          {
                                             oldName:e.newName,newName:a.tvs.name
                                          }
                                          );case 10:e.newName=a.tvs.name;case 11:return console.log("Config updated!",t),n.next=14,window.homebridge.updatePluginConfig([t]);case 14:n.next=20;break;case 16:n.prev=16,n.t0=n["catch"](0),console.log(n.t0),window.homebridge.toast.error(n.t0.message,"Error");case 20:case"end":return n.stop()
                                       }
                                    }
                                    ),n,null,[[0,16]])
                                 }
                                 ))),1e3);case 2:case"end":return n.stop()
                              }
                           }
                           ),n)
                        }
                        )));return function(e)
                        {
                           return n.apply(this,arguments)
                        }
                     }
                     ()),e.loading=!1,n.next=26;break;case 22:n.prev=22,n.t1=n["catch"](0),console.log(n.t1),window.homebridge.toast.error(n.t1.message,"Error");case 26:case"end":return n.stop()
                  }
               }
               ),n,null,[[0,22]])
            }
            )))()
         }
         ,beforeDestroy:function()
         {
            this.customSchema&&this.customSchema.end()
         }
      }
      ),s=o,c=(t("71ab"),t("2877")),u=Object(c["a"])(s,r,a,!1,null,"ebfa56be",null);n["default"]=u.exports
   }
   ,"107c":function(e,n,t)
   {
      var r=t("d039");e.exports=r((function()
      {
         var e=RegExp("(?<a>b)","string".charAt(5));return"b"!==e.exec("b").groups.a||"bc"!=="b".replace(e,"$<a>c")
      }
      ))
   }
   ,1276:function(e,n,t)
   {
      "use strict";var r=t("d784"),a=t("44e7"),i=t("825a"),o=t("1d80"),s=t("4840"),c=t("8aa5"),u=t("50c4"),l=t("14c3"),d=t("9263"),f=t("9f7f"),m=t("d039"),v=f.UNSUPPORTED_Y,p=[].push,g=Math.min,h=4294967295,x=!m((function()
      {
         var e=/(?:)/,n=e.exec;e.exec=function()
         {
            return n.apply(this,arguments)
         };
         var t="ab".split(e);return 2!==t.length||"a"!==t[0]||"b"!==t[1]
      }
      ));r("split",(function(e,n,t)
      {
         var r;return r="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(e,t)
         {
            var r=String(o(this)),i=void 0===t?h:t>>>0;if(0===i)return[];if(void 0===e)return[r];if(!a(e))return n.call(r,e,i);var s,c,u,l=[],f=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),m=0,v=new RegExp(e.source,f+"g");while(s=d.call(v,r))
            {
               if(c=v.lastIndex,c>m&&(l.push(r.slice(m,s.index)),s.length>1&&s.index<r.length&&p.apply(l,s.slice(1)),u=s[0].length,m=c,l.length>=i))break;v.lastIndex===s.index&&v.lastIndex++
            }
            return m===r.length?!u&&v.test("")||l.push(""):l.push(r.slice(m)),l.length>i?l.slice(0,i):l
         }
         :"0".split(void 0,0).length?function(e,t)
         {
            return void 0===e&&0===t?[]:n.call(this,e,t)
         }
         :n,[function(n,t)
         {
            var a=o(this),i=void 0==n?void 0:n[e];return void 0!==i?i.call(n,a,t):r.call(String(a),n,t)
         }
         ,function(e,a)
         {
            var o=t(r,this,e,a,r!==n);if(o.done)return o.value;var d=i(this),f=String(e),m=s(d,RegExp),p=d.unicode,x=(d.ignoreCase?"i":"")+(d.multiline?"m":"")+(d.unicode?"u":"")+(v?"g":"y"),w=new m(v?"^(?:"+d.source+")":d,x),b=void 0===a?h:a>>>0;if(0===b)return[];if(0===f.length)return null===l(w,f)?[f]:[];var E=0,R=0,y=[];while(R<f.length)
            {
               w.lastIndex=v?0:R;var I,N=l(w,v?f.slice(R):f);if(null===N||(I=g(u(w.lastIndex+(v?R:0)),f.length))===E)R=c(f,R,p);else
               {
                  if(y.push(f.slice(E,R)),y.length===b)return y;for(var k=1;k<=N.length-1;k++)if(y.push(N[k]),y.length===b)return y;R=E=I
               }
            }
            return y.push(f.slice(E)),y
         }
         ]
      }
      ),!x,v)
   }
   ,"14c3":function(e,n,t)
   {
      var r=t("c6b6"),a=t("9263");e.exports=function(e,n)
      {
         var t=e.exec;if("function"===typeof t)
         {
            var i=t.call(e,n);if("object"!==typeof i)throw TypeError("RegExp exec method returned something other than an Object or null");return i
         }
         if("RegExp"!==r(e))throw TypeError("RegExp#exec called on incompatible receiver");return a.call(e,n)
      }
   }
   ,3163:function(e,n,t)
   {
   }
   ,"44e7":function(e,n,t)
   {
      var r=t("861d"),a=t("c6b6"),i=t("b622"),o=i("match");e.exports=function(e)
      {
         var n;return r(e)&&(void 0!==(n=e[o])?!!n:"RegExp"==a(e))
      }
   }
   ,"4ffd":function(e,n,t)
   {
      e.exports=t.p+"img/logo.edfd6009.png"
   }
   ,"71ab":function(e,n,t)
   {
      "use strict";t("3163")
   }
   ,"8aa5":function(e,n,t)
   {
      "use strict";var r=t("6547").charAt;e.exports=function(e,n,t)
      {
         return n+(t?r(e,n).length:1)
      }
   }
   ,9263:function(e,n,t)
   {
      "use strict";var r=t("ad6d"),a=t("9f7f"),i=t("5692"),o=t("7c73"),s=t("69f3").get,c=t("fce3"),u=t("107c"),l=RegExp.prototype.exec,d=i("native-string-replace",String.prototype.replace),f=l,m=function()
      {
         var e=/a/,n=/b*/g;return l.call(e,"a"),l.call(n,"a"),0!==e.lastIndex||0!==n.lastIndex
      }
      (),v=a.UNSUPPORTED_Y||a.BROKEN_CARET,p=void 0!==/()??/.exec("")[1],g=m||p||v||c||u;g&&(f=function(e)
      {
         var n,t,a,i,c,u,g,h=this,x=s(h),w=x.raw;if(w)return w.lastIndex=h.lastIndex,n=f.call(w,e),h.lastIndex=w.lastIndex,n;var b=x.groups,E=v&&h.sticky,R=r.call(h),y=h.source,I=0,N=e;if(E&&(R=R.replace("y",""),-1===R.indexOf("g")&&(R+="g"),N=String(e).slice(h.lastIndex),h.lastIndex>0&&(!h.multiline||h.multiline&&"\n"!==e[h.lastIndex-1])&&(y="(?: "+y+")",N=" "+N,I++),t=new RegExp("^(?:"+y+")",R)),p&&(t=new RegExp("^"+y+"$(?!\\s)",R)),m&&(a=h.lastIndex),i=l.call(E?t:h,N),E?i?(i.input=i.input.slice(I),i[0]=i[0].slice(I),i.index=h.lastIndex,h.lastIndex+=i[0].length):h.lastIndex=0:m&&i&&(h.lastIndex=h.global?i.index+i[0].length:a),p&&i&&i.length>1&&d.call(i[0],t,(function()
         {
            for(c=1;c<arguments.length-2;c++)void 0===arguments[c]&&(i[c]=void 0)
         }
         )),i&&b)for(i.groups=u=o(null),c=0;c<b.length;c++)g=b[c],u[g[0]]=i[g[1]];return i
      }
      ),e.exports=f
   }
   ,"9f7f":function(e,n,t)
   {
      var r=t("d039"),a=function(e,n)
      {
         return RegExp(e,n)
      };
      n.UNSUPPORTED_Y=r((function()
      {
         var e=a("a","y");return e.lastIndex=2,null!=e.exec("abcd")
      }
      )),n.BROKEN_CARET=r((function()
      {
         var e=a("^r","gy");return e.lastIndex=2,null!=e.exec("str")
      }
      ))
   }
   ,ac1f:function(e,n,t)
   {
      "use strict";var r=t("23e7"),a=t("9263");r(
      {
         target:"RegExp",proto:!0,forced:/./.exec!==a
      }
      ,
      {
         exec:a
      }
      )
   }
   ,ad6d:function(e,n,t)
   {
      "use strict";var r=t("825a");e.exports=function()
      {
         var e=r(this),n="";return e.global&&(n+="g"),e.ignoreCase&&(n+="i"),e.multiline&&(n+="m"),e.dotAll&&(n+="s"),e.unicode&&(n+="u"),e.sticky&&(n+="y"),n
      }
   }
   ,d784:function(e,n,t)
   {
      "use strict";t("ac1f");var r=t("6eeb"),a=t("9263"),i=t("d039"),o=t("b622"),s=t("9112"),c=o("species"),u=RegExp.prototype;e.exports=function(e,n,t,l)
      {
         var d=o(e),f=!i((function()
         {
            var n=
            {
            };
            return n[d]=function()
            {
               return 7
            }
            ,7!=""[e](n)
         }
         )),m=f&&!i((function()
         {
            var n=!1,t=/a/;return"split"===e&&(t=
            {
            }
            ,t.constructor=
            {
            }
            ,t.constructor[c]=function()
            {
               return t
            }
            ,t.flags="",t[d]=/./[d]),t.exec=function()
            {
               return n=!0,null
            }
            ,t[d](""),!n
         }
         ));if(!f||!m||t)
         {
            var v=/./[d],p=n(d,""[e],(function(e,n,t,r,i)
            {
               var o=n.exec;return o===a||o===u.exec?f&&!i?
               {
                  done:!0,value:v.call(n,t,r)
               }
               :
               {
                  done:!0,value:e.call(t,n,r)
               }
               :
               {
                  done:!1
               }
            }
            ));r(String.prototype,e,p[0]),r(u,d,p[1])
         }
         l&&s(u[d],"sham",!0)
      }
   }
   ,fce3:function(e,n,t)
   {
      var r=t("d039");e.exports=r((function()
      {
         var e=RegExp(".","string".charAt(0));return!(e.dotAll&&e.exec("\n")&&"s"===e.flags)
      }
      ))
   }
}]);
