(function(e)
{
   function t(t)
   {
      for(var r,i,s=t[0],c=t[1],d=t[2],u=0,l=[];u<s.length;u++)i=s[u],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&l.push(o[i][0]),o[i]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);p&&p(t);while(l.length)l.shift()();return a.push.apply(a,d||[]),n()
   }
   function n()
   {
      for(var e,t=0;t<a.length;t++)
      {
         for(var n=a[t],r=!0,i=1;i<n.length;i++)
         {
            var s=n[i];0!==o[s]&&(r=!1)
         }
         r&&(a.splice(t--,1),e=c(c.s=n[0]))
      }
      return e
   }
   var r=
   {
   }
   ,i=
   {
      app:0
   }
   ,o=
   {
      app:0
   }
   ,a=[];function s(e)
   {
      return c.p+"js/"+(
      {
         config:"config",edit:"edit",home:"home",new:"new"
      }
      [e]||e)+"."+
      {
         config:"6a229f84",edit:"3dc08a2e",home:"2ef92160",new:"ea5d2cae"
      }
      [e]+".js"
   }
   function c(t)
   {
      if(r[t])return r[t].exports;var n=r[t]=
      {
         i:t,l:!1,exports:
         {
         }
      };
      return e[t].call(n.exports,n,n.exports,c),n.l=!0,n.exports
   }
   c.e=function(e)
   {
      var t=[],n=
      {
         config:1,edit:1,home:1,new:1
      };
      i[e]?t.push(i[e]):0!==i[e]&&n[e]&&t.push(i[e]=new Promise((function(t,n)
      {
         for(var r="css/"+(
         {
            config:"config",edit:"edit",home:"home",new:"new"
         }
         [e]||e)+"."+
         {
            config:"eae1418f",edit:"fa20539f",home:"5c1bb883",new:"0678a40a"
         }
         [e]+".css",o=c.p+r,a=document.getElementsByTagName("link"),s=0;s<a.length;s++)
         {
            var d=a[s],u=d.getAttribute("data-href")||d.getAttribute("href");if("stylesheet"===d.rel&&(u===r||u===o))return t()
         }
         var l=document.getElementsByTagName("style");for(s=0;s<l.length;s++)
         {
            d=l[s],u=d.getAttribute("data-href");if(u===r||u===o)return t()
         }
         var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t)
         {
            var r=t&&t.target&&t.target.src||o,a=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");a.code="CSS_CHUNK_LOAD_FAILED",a.request=r,delete i[e],p.parentNode.removeChild(p),n(a)
         }
         ,p.href=o;var m=document.getElementsByTagName("head")[0];m.appendChild(p)
      }
      )).then((function()
      {
         i[e]=0
      }
      )));var r=o[e];if(0!==r)if(r)t.push(r[2]);else
      {
         var a=new Promise((function(t,n)
         {
            r=o[e]=[t,n]
         }
         ));t.push(r[2]=a);var d,u=document.createElement("script");u.charset="utf-8",u.timeout=120,c.nc&&u.setAttribute("nonce",c.nc),u.src=s(e);var l=new Error;d=function(t)
         {
            u.onerror=u.onload=null,clearTimeout(p);var n=o[e];if(0!==n)
            {
               if(n)
               {
                  var r=t&&("load"===t.type?"missing":t.type),i=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+r+": "+i+")",l.name="ChunkLoadError",l.type=r,l.request=i,n[1](l)
               }
               o[e]=void 0
            }
         };
         var p=setTimeout((function()
         {
            d(
            {
               type:"timeout",target:u
            }
            )
         }
         ),12e4);u.onerror=u.onload=d,document.head.appendChild(u)
      }
      return Promise.all(t)
   }
   ,c.m=e,c.c=r,c.d=function(e,t,n)
   {
      c.o(e,t)||Object.defineProperty(e,t,
      {
         enumerable:!0,get:n
      }
      )
   }
   ,c.r=function(e)
   {
      "undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,
      {
         value:"Module"
      }
      ),Object.defineProperty(e,"__esModule",
      {
         value:!0
      }
      )
   }
   ,c.t=function(e,t)
   {
      if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",
      {
         enumerable:!0,value:e
      }
      ),2&t&&"string"!=typeof e)for(var r in e)c.d(n,r,function(t)
      {
         return e[t]
      }
      .bind(null,r));return n
   }
   ,c.n=function(e)
   {
      var t=e&&e.__esModule?function()
      {
         return e["default"]
      }
      :function()
      {
         return e
      };
      return c.d(t,"a",t),t
   }
   ,c.o=function(e,t)
   {
      return Object.prototype.hasOwnProperty.call(e,t)
   }
   ,c.p="",c.oe=function(e)
   {
      throw console.error(e),e
   };
   var d=window["webpackJsonp"]=window["webpackJsonp"]||[],u=d.push.bind(d);d.push=t,d=d.slice();for(var l=0;l<d.length;l++)t(d[l]);var p=u;a.push([0,"chunk-vendors"]),n()
}

)(
{
   0:function(e,t,n)
   {
      e.exports=n("56d7")
   }
   ,"034f":function(e,t,n)
   {
      "use strict";n("85ec")
   }
   ,"346c":function(e,t,n)
   {
   }
   ,"56d7":function(e,t,n)
   {
      "use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),i=function()
      {
         var e=this,t=e.$createElement,n=e._self._c||t;return n("div",
         {
            staticClass:"app-bg h-100 w-100 p-4"
         }
         ,[n("div",
         {
            staticClass:"h-100 w-100",attrs:
            {
               id:"app"
            }
         }
         ,[n("transition",
         {
            attrs:
            {
               name:"fade",mode:"out-in"
            }
         }
         ,[n("router-view")],1)],1)])
      }
      ,o=[],a=n("1da1"),s=(n("96cf"),
      {
         mounted:function()
         {
            var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t()
            {
               return regeneratorRuntime.wrap((function(t)
               {
                  while(1)switch(t.prev=t.next)
                  {
                     case 0:return document.documentElement.setAttribute("data-theme-color","purple"),console.log("Loading HB"),t.next=4,e.loadHomebridge();case 4:case"end":return t.stop()
                  }
               }
               ),t)
            }
            )))()
         }
      }
      ),c=s,d=(n("034f"),n("2877")),u=Object(d["a"])(c,i,o,!1,null,null,null),l=u.exports,p=(n("d3b7"),n("3ca3"),n("ddb0"),n("8c4f"));r["a"].use(p["a"]);var m=[
      {
         path:"/",name:"Home",component:function()
         {
            return n.e("home").then(n.bind(null,"bb51"))
         }
      }
      ,
      {
         path:"/config",name:"Config",component:function()
         {
            return n.e("config").then(n.bind(null,"1071"))
         }
      }
      ,
      {
         path:"/new",name:"New",component:function()
         {
            return n.e("new").then(n.bind(null,"67bf"))
         }
      }
      ,
      {
         path:"/edit/:name",name:"Edit",component:function()
         {
            return n.e("edit").then(n.bind(null,"10713"))
         }
         ,props:!0
      }
      ],f=new p["a"](
      {
         routes:m
      }
      ),h=f,y=(n("5aea"),n("346c"),n("159b"),n("b0c0"),n("d81d"),n("99af"),n("7db0"),
      {
         schema:
         {
            name:
            {
               title:"Log Name",type:"string",default:"BraviaTVOS",description:"Name for the log."
            }
            ,debug:
            {
               title:"Debug",type:"boolean",description:"Enables additional output in the log."
            }
            ,warn:
            {
               title:"Warn Log",type:"boolean",description:"Enables additional output (warn) in the log.",default:!0
            }
            ,error:
            {
               title:"Error Log",type:"boolean",description:"Enables additional output (error) in the log.",default:!0
            }
            ,extendedError:
            {
               title:"Extended Error Log",type:"boolean",description:"Enables additional output (detailed error) in the log.",default:!0
            }
            ,tvs:
            {
               type:"object",properties:
               {
                  active:
                  {
                     title:"Active",type:"boolean",required:!0,description:"If enabled, the device will be exposed to HomeKit."
                  }
                  ,name:
                  {
                     title:"Name",type:"string",required:!0,description:"Set the device name for display in the Home app."
                  }
                  ,ip:
                  {
                     title:"IP Address",type:"string",placeholder:"192.168.178.1",required:!0,description:"Sony TV IP Address."
                  }
                  ,mac:
                  {
                     title:"MAC Address",type:"string",placeholder:"00:11:22:33:44:55",description:"Sony TV MAC Address.",condition:
                     {
                        functionBody:"try { return model.tvs.active } catch(e){ return false }"
                     }
                  }
                  ,port:
                  {
                     title:"Port",type:"integer",placeholder:80,description:"Sony TV Port.",condition:
                     {
                        functionBody:"try { return model.tvs.active } catch(e){ return false }"
                     }
                  }
                  ,psk:
                  {
                     title:"Pre-Shared Key",type:"string",required:!0,description:"Authentication through PSK. (If no PSK given, the plugin will use authentication through PIN)"
                  }
                  ,appName:
                  {
                     title:"App Name",type:"string",required:!0,description:"Application name used to generate token. (Only required if you want authentication with generated credentials through PIN method)"
                  }
                  ,manufacturer:
                  {
                     name:"Manufacturer",type:"string",placeholder:"Sony",description:"Set the manufacturer name for display in the Home app."
                  }
                  ,model:
                  {
                     name:"Model",type:"string",placeholder:"Television",description:"Set the model for display in the Home app."
                  }
                  ,serialNumber:
                  {
                     name:"Serial Number",type:"string",placeholder:"SerialNumber",description:"Set the serial number for display in the Home app."
                  }
                  ,refreshInputs:
                  {
                     title:"Refresh Inputs",type:"boolean",description:"When this option is enabled, the TV updates all inputs and saves them to disk for further use. (Please turn on the TV before restarting homebridge with this option enabled, otherwise the plugin will turn on the TV to also retrieve CEC inputs)",condition:
                     {
                        functionBody:"try { return model.tvs.active } catch(e){ return false }"
                     }
                  }
                  ,wol:
                  {
                     title:"Wake on LAN",type:"boolean",description:"When this option is enabled, the plugin uses WOL instead of API to turn on the TV. (WOL must be enabled on the TV and a MAC address must be specified)",condition:
                     {
                        functionBody:"try { return model.tvs.active } catch(e){ return false }"
                     }
                  }
                  ,polling:
                  {
                     title:"Polling",type:"integer",default:10,description:"Polling interval in seconds.",condition:
                     {
                        functionBody:"try { return model.tvs.active } catch(e){ return false }"
                     }
                  }
                  ,sheduledRefresh:
                  {
                     title:"Sheduled Refresh",type:"integer",default:12,description:"Sheduled television (inputs) cache refresh in hours (0 = disabled).",condition:
                     {
                        functionBody:"try { return model.tvs.active } catch(e){ return false }"
                     }
                  }
                  ,inputs:
                  {
                     title:"TV Inputs",type:"array",items:
                     {
                        title:"Input",type:"object",properties:
                        {
                           name:
                           {
                              title:"Name",type:"string",description:"Name for the input to display in the tv inputs list",required:!0
                           }
                           ,identifier:
                           {
                              title:"Identifier",type:"string",oneOf:[],description:"Exact name of the Input",required:!0
                           }
                        }
                     }
                  }
                  ,apps:
                  {
                     title:"Applications",type:"array",items:
                     {
                        title:"Application",type:"object",properties:
                        {
                           name:
                           {
                              title:"Name",type:"string",description:"Name for the application to display in the tv inputs list",required:!0
                           }
                           ,identifier:
                           {
                              title:"Identifier",type:"string",oneOf:[],description:"Exact name of the Application",required:!0
                           }
                        }
                     }
                  }
                  ,channels:
                  {
                     title:"Channels",type:"array",items:
                     {
                        title:"Application",type:"object",properties:
                        {
                           name:
                           {
                              title:"Name",type:"string",description:"Name for the channel to display in the tv inputs list",required:!0
                           }
                           ,identifier:
                           {
                              title:"Identifier",type:"string",oneOf:[],description:"Exact name of the Application",required:!0
                           }
                        }
                     }
                  }
                  ,commands:
                  {
                     title:"Commands",type:"array",items:
                     {
                        title:"Command",type:"object",properties:
                        {
                           name:
                           {
                              title:"Name",type:"string",description:"Name for the command to display in the tv inputs list",required:!0
                           }
                           ,value:
                           {
                              title:"Value",required:!0,type:"string",oneOf:[],description:"IRCC code or name of the command. (eg. AAAAAQAAAAEAAABgAw== or PowerOff)"
                           }
                        }
                     }
                  }
                  ,displayOrder:
                  {
                     title:"Display Order",type:"array",items:
                     {
                        title:"Category",type:"string",oneOf:[
                        {
                           title:"Apps",enum:["apps"]
                        }
                        ,
                        {
                           title:"Channels",enum:["channels"]
                        }
                        ,
                        {
                           title:"Commands",enum:["commands"]
                        }
                        ,
                        {
                           title:"Inputs",enum:["inputs"]
                        }
                        ,
                        {
                           title:"Macros",enum:["macros"]
                        }
                        ],description:"Name of the catagory."
                     }
                  }
                  ,speaker:
                  {
                     titel:"Speaker",type:"object",properties:
                     {
                        active:
                        {
                           title:"Active",type:"boolean",required:!0,description:"If enabled, the device will be exposed to HomeKit."
                        }
                        ,output:
                        {
                           title:"Audio Output",required:!0,type:"string",default:"speaker",oneOf:[
                           {
                              title:"Speaker",enum:["speaker"]
                           }
                           ,
                           {
                              title:"Headphone",enum:["headphone"]
                           }
                           ,
                           {
                              title:"Other",enum:["other"]
                           }
                           ],description:"Audio output."
                        }
                        ,increaseBy:
                        {
                           title:"Increase Volume by",type:"integer",minimum:1,maximum:5,default:1,description:"Volume level to increse."
                        }
                        ,reduceBy:
                        {
                           title:"Reduce Volume by",type:"integer",minimum:1,maximum:5,default:1,description:"Volume level to set."
                        }
                        ,accType:
                        {
                           title:"Accessory Type",type:"string",required:!0,default:"lightbulb",oneOf:[
                           {
                              title:"Lightbulb",enum:["lightbulb"]
                           }
                           ,
                           {
                              title:"Switch",enum:["switch"]
                           }
                           ],description:"Accessory type for the speaker."
                        }
                     }
                  }
                  ,macros:
                  {
                     title:"Macros",type:"array",items:
                     {
                        type:"object",properties:
                        {
                           name:
                           {
                              title:"Name",type:"string",required:!0,description:"Name of the macro."
                           }
                           ,delay:
                           {
                              title:"Delay",type:"integer",placeholder:250,description:"Delay between sending commands (in ms). (Default 1000ms)"
                           }
                           ,commands:
                           {
                              title:"Commands",type:"array",items:
                              {
                                 title:"Command",type:"string",oneOf:[],required:!0,description:"IRCC code or name of the command. (eg. AAAAAQAAAAEAAABgAw== or PowerOff)"
                              }
                           }
                        }
                     }
                  }
                  ,remote:
                  {
                     titel:"Remote",type:"array",items:
                     {
                        type:"object",properties:
                        {
                           command:
                           {
                              name:"Command",type:"string",description:"Set custom command for choosen target.",oneOf:[],required:!0
                           }
                           ,target:
                           {
                              title:"Target",required:!0,type:"string",oneOf:[
                              {
                                 title:"Back",enum:["BACK"]
                              }
                              ,
                              {
                                 title:"Down",enum:["ARROW_DOWN"]
                              }
                              ,
                              {
                                 title:"Exit",enum:["EXIT"]
                              }
                              ,
                              {
                                 title:"Fast Forward",enum:["FAST_FORWARD"]
                              }
                              ,
                              {
                                 title:"Information",enum:["INFORMATION"]
                              }
                              ,
                              {
                                 title:"Left",enum:["ARROW_LEFT"]
                              }
                              ,
                              {
                                 title:"Next Track",enum:["NEXT_TRACK"]
                              }
                              ,
                              {
                                 title:"Pause",enum:["PAUSE"]
                              }
                              ,
                              {
                                 title:"Play",enum:["PLAY"]
                              }
                              ,
                              {
                                 title:"Previous Track",enum:["PREVIOUS_TRACK"]
                              }
                              ,
                              {
                                 title:"Rewind",enum:["REWIND"]
                              }
                              ,
                              {
                                 title:"Right",enum:["ARROW_RIGHT"]
                              }
                              ,
                              {
                                 title:"Select",enum:["SELECT"]
                              }
                              ,
                              {
                                 title:"Settings",enum:["SETTINGS"]
                              }
                              ,
                              {
                                 title:"Stop",enum:["STOP"]
                              }
                              ,
                              {
                                 title:"Up",enum:["ARROW_UP"]
                              }
                              ,
                              {
                                 title:"Volume Down",enum:["VOLUME_DOWN"]
                              }
                              ,
                              {
                                 title:"Volume Up",enum:["VOLUME_UP"]
                              }
                              ],description:"Target Apple Remote switch."
                           }
                        }
                     }
                  }
               }
            }
         }
         ,layout:["name",
         {
            title:"Log",orderable:!1,expandable:!0,expanded:!1,type:"section",items:["debug","warn","error","extendedError"]
         }
         ,"tvs.active","tvs.name","tvs.ip","tvs.mac","tvs.port","tvs.polling","tvs.sheduledRefresh","tvs.refreshInputs","tvs.wol",
         {
            key:"tvs",type:"section",title:"Authentication",expandable:!0,expanded:!1,orderable:!1,items:["tvs.psk","tvs.appName"],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs",type:"section",title:"Branding",expandable:!0,expanded:!1,orderable:!1,items:["tvs.manufacturer","tvs.model","tvs.serialNumber"],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs.inputs",type:"section",title:"TV Inputs",expandable:!0,expanded:!1,orderable:!1,buttonText:"Add Input",items:[
            {
               key:"tvs.inputs[]",items:["tvs.inputs[].name","tvs.inputs[].identifier"]
            }
            ],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs.apps",type:"section",title:"Applications",expandable:!0,expanded:!1,orderable:!1,buttonText:"Add Application",items:[
            {
               key:"tvs.apps[]",items:["tvs.apps[].name","tvs.apps[].identifier"]
            }
            ],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs.channels",type:"section",title:"Channels",expandable:!0,expanded:!1,orderable:!1,buttonText:"Add Channel",items:[
            {
               key:"tvs.channels[]",items:["tvs.channels[].name","tvs.channels[].identifier"]
            }
            ],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs.commands",type:"section",title:"Commands",expandable:!0,expanded:!1,orderable:!1,buttonText:"Add Command",items:[
            {
               key:"tvs.commands[]",items:["tvs.commands[].name","tvs.commands[].value"]
            }
            ],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs.macros",type:"section",title:"Macros",expandable:!0,expanded:!1,orderable:!1,buttonText:"Add Macro",items:[
            {
               key:"tvs.macros[]",items:["tvs.macros[].name","tvs.macros[].delay",
               {
                  key:"tvs.macros[].commands",type:"section",title:"Commands",expandable:!0,expanded:!1,orderable:!0,buttonText:"Add Command",items:["tvs.macros[].commands[]"]
               }
               ]
            }
            ],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs.speaker",type:"section",title:"Speaker",expandable:!0,expanded:!1,orderable:!1,items:["tvs.speaker.active","tvs.speaker.output","tvs.speaker.increaseBy","tvs.speaker.reduceBy","tvs.speaker.accType"],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs.remote",type:"section",title:"Remote",expandable:!0,expanded:!1,orderable:!1,buttonText:"Add Custom Command",items:[
            {
               key:"tvs.remote[]",items:["tvs.remote[].target","tvs.remote[].command"]
            }
            ],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ,
         {
            key:"tvs.displayOrder",type:"section",title:"Display Order",expandable:!0,expanded:!1,orderable:!0,buttonText:"Add Catagory",items:["tvs.displayOrder[]"],condition:
            {
               functionBody:"try { return model.tvs.active } catch(e){ return false }"
            }
         }
         ]
      }
      ),v=
      {
         methods:
         {
            loadHomebridge:function()
            {
               new Promise((function(e)
               {
                  window.homebridge.showSpinner(),window.homebridge.addEventListener("ready",Object(a["a"])(regeneratorRuntime.mark((function t()
                  {
                     return regeneratorRuntime.wrap((function(t)
                     {
                        while(1)switch(t.prev=t.next)
                        {
                           case 0:window.document.body.classList.contains("dark-mode")?document.documentElement.setAttribute("data-theme","dark"):document.documentElement.setAttribute("data-theme","light"),window.homebridge.hideSpinner(),e();case 3:case"end":return t.stop()
                        }
                     }
                     ),t)
                  }
                  ))))
               }
               ))
            }
            ,getPluginConfig:function()
            {
               var e=Object(a["a"])(regeneratorRuntime.mark((function e()
               {
                  var t,n;return regeneratorRuntime.wrap((function(e)
                  {
                     while(1)switch(e.prev=e.next)
                     {
                        case 0:return e.next=2,window.homebridge.getPluginConfig();case 2:return t=e.sent,t.length||(n=
                        {
                           name:"BraviaTVOS",platform:"BraviaOSPlatform",debug:!0,warn:!0,error:!0,extendedError:!0,tvs:[]
                        }
                        ,t.push(n),window.homebridge.updatePluginConfig(t)),e.abrupt("return",t[0]);case 5:case"end":return e.stop()
                     }
                  }
                  ),e)
               }
               )));function t()
               {
                  return e.apply(this,arguments)
               }
               return t
            }
            (),generatePluginShema:function()
            {
               var e=Object(a["a"])(regeneratorRuntime.mark((function e(t,n,r)
               {
                  var i;return regeneratorRuntime.wrap((function(e)
                  {
                     while(1)switch(e.prev=e.next)
                     {
                        case 0:return console.log("Generating Custom Schema"),r.apps.length?r.apps.forEach((function(e)
                        {
                           y.schema.tvs.properties.apps.items.properties.identifier.oneOf.push(
                           {
                              enum:[e.name],title:e.name
                           }
                           )
                        }
                        )):delete y.schema.tvs.properties.apps.items.properties.identifier.oneOf,r.channels.length?(r.channels.forEach((function(e)
                        {
                           var t="[".concat(e.source,"] ").concat(e.index+1);y.schema.tvs.properties.channels.items.properties.identifier.oneOf.push(
                           {
                              enum:[t],title:e.name
                           }
                           )
                        }
                        )),n.channels=(n.channels||[]).map((function(e)
                        {
                           return
                           {
                              name:e.name,identifier:"[".concat(e.source,"] ").concat(e.channel)
                           }
                        }
                        ))):(y.schema.tvs.properties.channels=
                        {
                           title:"Channels",type:"array",items:
                           {
                              title:"Channel",type:"object",properties:
                              {
                                 name:
                                 {
                                    title:"Name",type:"string",description:"Name for the channel to display in the tv inputs list",required:!0
                                 }
                                 ,channel:
                                 {
                                    title:"Channel Number",type:"integer",description:"Number of the channel as seen on the TV.",required:!0
                                 }
                                 ,source:
                                 {
                                    title:"Channel Source",type:"string",required:!0,oneOf:[
                                    {
                                       title:"DVBT",enum:["dvbt"]
                                    }
                                    ,
                                    {
                                       title:"DVBC",enum:["dvbc"]
                                    }
                                    ,
                                    {
                                       title:"DVBS",enum:["dvbs"]
                                    }
                                    ,
                                    {
                                       title:"ISDBT",enum:["isdbt"]
                                    }
                                    ,
                                    {
                                       title:"ISDBS",enum:["isdbs"]
                                    }
                                    ,
                                    {
                                       title:"ISDBC",enum:["isdbc"]
                                    }
                                    ,
                                    {
                                       title:"Analog",enum:["analog"]
                                    }
                                    ],description:"Source of the channel."
                                 }
                              }
                           }
                        }
                        ,y.layout=y.layout.map((function(e)
                        {
                           return"tvs.channels"===e.key&&(e=
                           {
                              key:"tvs.channels",type:"section",title:"Channels",expandable:!0,expanded:!1,orderable:!1,buttonText:"Add Channel",items:[
                              {
                                 key:"tvs.channels[]",items:["tvs.channels[].name","tvs.channels[].channel","tvs.channels[].source"]
                              }
                              ],condition:
                              {
                                 functionBody:"try { return model.tvs.active } catch(e){ return false }"
                              }
                           }
                           ),e
                        }
                        ))),r.commands.length?(r.commands.forEach((function(e)
                        {
                           y.schema.tvs.properties.commands.items.properties.value.oneOf.push(
                           {
                              enum:[e.value],title:e.name
                           }
                           ),y.schema.tvs.properties.remote.items.properties.command.oneOf.push(
                           {
                              enum:[e.value],title:e.name
                           }
                           ),y.schema.tvs.properties.macros.items.properties.commands.items.oneOf.push(
                           {
                              enum:[e.value],title:e.name
                           }
                           )
                        }
                        )),n.commands=(n.commands||[]).map((function(e)
                        {
                           var t=r.commands.find((function(t)
                           {
                              return t.name===e.value||t.value===e.value
                           }
                           ));return t?
                           {
                              name:e.name,value:t.value
                           }
                           :
                           {
                              name:e.name,value:e.value
                           }
                        }
                        )),n.macros=(n.macros||[]).map((function(e)
                        {
                           return e.commands=(e.commands||[]).map((function(e)
                           {
                              var t=r.commands.find((function(t)
                              {
                                 return t.name===e||t.value===e
                              }
                              ));return t&&(e=t.value),e
                           }
                           )),e
                        }
                        )),n.remote=(n.remote||[]).map((function(e)
                        {
                           var t=r.commands.find((function(t)
                           {
                              return t.name===e.command||t.value===e.command
                           }
                           ));return t&&(e.command=t.value),e
                        }
                        ))):(delete y.schema.tvs.properties.commands.items.properties.value.oneOf,delete y.schema.tvs.properties.remote.items.properties.command.oneOf,delete y.schema.tvs.properties.macros.items.properties.commands.items.oneOf),r.inputs.length?(r.inputs.forEach((function(e)
                        {
                           var t="[".concat(e.source,"] ").concat(e.name);y.schema.tvs.properties.inputs.items.properties.identifier.oneOf.push(
                           {
                              enum:[t],title:e.name
                           }
                           )
                        }
                        )),n.inputs=(n.inputs||[]).map((function(e)
                        {
                           return
                           {
                              name:e.name,identifier:"[".concat(e.source,"] ").concat(e.identifier)
                           }
                        }
                        ))):(y.schema.tvs.properties.inputs=
                        {
                           title:"TV Inputs",type:"array",items:
                           {
                              title:"Input",type:"object",properties:
                              {
                                 name:
                                 {
                                    title:"Name",type:"string",description:"Name for the channel to display in the tv inputs list",required:!0
                                 }
                                 ,identifier:
                                 {
                                    title:"Identifier",type:"string",description:"Exact name of the input (eg HDMI 1)",required:!0
                                 }
                                 ,source:
                                 {
                                    title:"Input",required:!0,type:"string",oneOf:[
                                    {
                                       title:"CEC",enum:["cec"]
                                    }
                                    ,
                                    {
                                       title:"Component",enum:["component"]
                                    }
                                    ,
                                    {
                                       title:"Composite",enum:["composite"]
                                    }
                                    ,
                                    {
                                       title:"HDMI",enum:["hdmi"]
                                    }
                                    ,
                                    {
                                       title:"Scart",enum:["scart"]
                                    }
                                    ,
                                    {
                                       title:"WIDI",enum:["widi"]
                                    }
                                    ],description:"Type of the tv input."
                                 }
                              }
                           }
                        }
                        ,y.layout=y.layout.map((function(e)
                        {
                           return"tvs.inputs"===e.key&&(e=
                           {
                              key:"tvs.inputs",type:"section",title:"TV Inputs",expandable:!0,expanded:!1,orderable:!1,buttonText:"Add Input",items:[
                              {
                                 key:"tvs.inputs[]",items:["tvs.inputs[].name","tvs.inputs[].identifier","tvs.inputs[].source"]
                              }
                              ],condition:
                              {
                                 functionBody:"try { return model.tvs.active } catch(e){ return false }"
                              }
                           }
                           ),e
                        }
                        ))),i=
                        {
                           name:t.name,debug:t.debug,warn:t.warn,error:t.error,extendedError:t.extendedError,tvs:n||
                           {
                           }
                        }
                        ,console.log("Config created!",i),e.abrupt("return",window.homebridge.createForm(y,i));case 8:case"end":return e.stop()
                     }
                  }
                  ),e)
               }
               )));function t(t,n,r)
               {
                  return e.apply(this,arguments)
               }
               return t
            }
            ()
         }
      }
      ,g=n("7049"),b=n("a7e2"),w=n("331b"),A=n("cbd0"),x=n("3d31"),O=n("c015"),k=n("44d4"),C=n("b1fc"),T=n("1073"),S=n("b720"),E=n("dbbe"),I=(n("ab8b"),n("2dd8"),n("9949")),N=n.n(I);r["a"].config.productionTip=!1,r["a"].mixin(v),r["a"].use(g["a"]),r["a"].use(b["a"]),r["a"].use(w["a"]),r["a"].use(A["a"]),r["a"].use(x["a"]),r["a"].use(O["a"]),r["a"].use(k["a"]),r["a"].use(C["a"]),r["a"].use(T["a"]),r["a"].use(S["a"]),r["a"].use(E["a"]),r["a"].use(N.a),new r["a"](
      {
         router:h,render:function(e)
         {
            return e(l)
         }
      }
      ).$mount("#app")
   }
   ,"5aea":function(e,t,n)
   {
   }
   ,"85ec":function(e,t,n)
   {
   }
});
