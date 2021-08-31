(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["config"],
{
   "01c1":function(t,n,e)
   {
      "use strict";e("737c")
   }
   ,1071:function(t,n,e)
   {
      "use strict";e.r(n);var i=function()
      {
         var t=this,n=t.$createElement,i=t._self._c||n;return t.loading?i("div",
         {
            staticClass:"lds-ring"
         }
         ,[i("div"),i("div"),i("div"),i("div")]):i("div",
         {
            staticClass:"inner-container"
         }
         ,[i("img",
         {
            attrs:
            {
               src:e("4ffd"),alt:"homebridge-bravia-tvos",width:"150px"
            }
         }
         ),i("div",
         {
            attrs:
            {
               id:"nav"
            }
         }
         ,[i("router-link",
         {
            attrs:
            {
               to:"/"
            }
         }
         ,[t._v("Home")]),i("span",
         {
            staticStyle:
            {
               "font-weight":"bold !important"
            }
         }
         ,[t._v(" · ")]),i("router-link",
         {
            attrs:
            {
               to:"/config"
            }
         }
         ,[t._v("Configs")]),i("span",
         {
            staticStyle:
            {
               "font-weight":"bold !important"
            }
         }
         ,[t._v(" · ")]),i("router-link",
         {
            attrs:
            {
               to:"/new"
            }
         }
         ,[t._v("New")])],1)])
      }
      ,o=[],r=e("1da1"),a=(e("96cf"),
      {
         name:"Config",data:function()
         {
            return
            {
               loading:!0
            }
         }
         ,mounted:function()
         {
            var t=this;return Object(r["a"])(regeneratorRuntime.mark((function n()
            {
               var e;return regeneratorRuntime.wrap((function(n)
               {
                  while(1)switch(n.prev=n.next)
                  {
                     case 0:return n.next=2,window.homebridge.getPluginConfig();case 2:e=n.sent,e.length||window.homebridge.updatePluginConfig([
                     {
                     }
                     ]),t.loading=!1,window.homebridge.showSchemaForm();case 6:case"end":return n.stop()
                  }
               }
               ),n)
            }
            )))()
         }
         ,beforeDestroy:function()
         {
            window.homebridge.hideSchemaForm()
         }
      }
      ),s=a,c=(e("01c1"),e("2877")),d=Object(c["a"])(s,i,o,!1,null,"6a967e69",null);n["default"]=d.exports
   }
   ,"4ffd":function(t,n,e)
   {
      t.exports=e.p+"img/logo.edfd6009.png"
   }
   ,"737c":function(t,n,e)
   {
   }
}]);
