webpackJsonp([3],{207:function(t,e,o){(function(t,e,i,n){var a=o(7),c=o(27),r=o(29),d=o(26),s=o(30),g=(o(10),o(9)),f=o(25);t.get("id")?t.get("projectId")||(location.href="../project/project.html"):location.href="../login/login.html",e.component("itemauto",f);var p=new e({el:"#app",data:{session:i.clone(t.raw()),type:0},components:{mainnav:a,interface:c,setting:r,global:d,test:s},created:function(){Promise.all([n.get("/project/interface",{id:t.get("projectId")}),n.get("/project/info",{id:t.get("projectId")}),n.get("/status/list",{id:t.get("projectId")}),n.get("/test/list",{project:t.get("projectId")})]).then(function(t){i.stopLoading();var e=t[0],o=t[1],n=t[2],a=t[3];if(200!=e.code)throw e.msg;if(g.$emit("initInterface",e.data),200!=o.code)throw o.msg;if(g.$emit("initInfo",o.data),200!=n.code)throw n.msg;if(g.$emit("initStatus",n.data),200!=a.code)throw a.msg;g.$emit("initTest",a.data)}).catch(function(t){i.stopLoading(),"string"==typeof t?i.notify(t,0):i.notify("获取失败",0)})}});window.vueObj=p,i.ready(function(){i.startLoading()})}).call(e,o(3),o(2),o(0),o(5))}},[207]);