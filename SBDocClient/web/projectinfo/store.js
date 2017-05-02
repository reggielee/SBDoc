/**
 * Created by sunxin on 2017/2/23.
 */
module.exports=new Vuex.Store({
    state:{
        interfaceList:[],
        interface:null,
        interfaceEdit:null,
        baseUrls:[],
        query:[{
            name:"",
            must:0,
            remark:""
        }],
        header:[{
            name:"",
            value:"",
            remark:""
        }],
        body:[{
            name:"",
            type:0,
            must:0,
            remark:"",
        }],
        param:[

        ],
        bodyInfo:{
            type:0,
            rawType:0,
            rawTextRemark:"",
            rawFileRemark:"",
            rawText:"",
        },
        outInfo:{
            type:0,
            rawRemark:"",
            rawMock:"",
        },
        result:[
            {
                name:"",
                must:0,
                type:0,
                remark:"",
                show:0,
                mock:"",
                drag:1
            }
        ],
        preview:"",
        drawMix:[],
        objCopy:null
    },
    getters:{
        querySave:function (state,getters) {
            return state.query.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            })
        },
        headerSave:function (state,getters) {
            return state.header.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            });
        },
        bodySave:function (state,getters) {
            return state.body.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            })
        },
        queryCount:function (state,getters) {
            return getters.querySave.length
        },
        headerCount:function (state,getters) {
            return getters.headerSave.length
        },
        bodyCount:function (state,getters) {
            return getters.bodySave.length
        },
        paramCount:function (state,getters) {
            return state.param.length;
        },
        rawMock:function (state) {
            return helper.mock(state.outInfo.rawMock);
        }
    },
    mutations:{
        initInterfaceList:function (state,data) {
            var arr=[]
            for(var i=0;i<data.length;i++)
            {
                data[i].show=0;
                for(var j=0;j<data[i].data.length;j++)
                {
                    data[i].data[j].select=0;
                }
                arr.push(data[i]);
            }
            state.interfaceList=arr;
        },
        setBaseUrls:function (state,data) {
            state.baseUrls=data;
        },
        setPreview:function (state,data) {
            state.preview=data;
        },
        setDrawMix:function (state,data) {
            state.drawMix=data;
        },
        setInterface:function (state,data) {
            state.interface=data;
        },
        setInterfaceEdit:function (state,data) {
            state.interfaceEdit=data;
        },
        setInterfaceList:function (state,data) {
            state.interfaceList=data;
        },
        setObjCopy:function (state,data) {
            state.objCopy=data;
        },
        initParam:function (state,data) {
            state.query.splice(0,state.query.length);
            state.header.splice(0,state.header.length);
            state.body.splice(0,state.body.length);
            state.result.splice(0,state.result.length);
            state.param.splice(0,state.param.length);
            state.query.push({
                name:"",
                must:0,
                remark:""
            });
            state.header.push({
                name:"",
                value:"",
                remark:""
            });
            state.body.push({
                name:"",
                type:0,
                must:0,
                remark:"",
            });
            state.result.push({
                name:"",
                must:1,
                type:0,
                remark:"",
                show:1,
                drag:1,
                mock:""
            })
            state.bodyInfo={
                type:0,
                rawType:0,
                rawTextRemark:"",
                rawFileRemark:"",
                rawText:"",
            };
            state.outInfo={
                type:0,
                rawRemark:"",
                rawMock:"",
            }
        },
        initInterface:function (state,data) {
            if(state.interfaceEdit.queryParam.length>0)
            {
                state.query=state.interfaceEdit.queryParam;
            }
            if(state.interfaceEdit.bodyParam.length>0)
            {
                state.body=state.interfaceEdit.bodyParam;
            }
            if(state.interfaceEdit.header.length>0)
            {
                state.header=state.interfaceEdit.header;
            }
            if(state.interfaceEdit.outParam.length>0)
            {
                helper.initResultShow(state.interfaceEdit.outParam);
                state.result=state.interfaceEdit.outParam;
            }
            if(state.interfaceEdit.restParam.length>0)
            {
                state.param=state.interfaceEdit.restParam;
            }
            if(state.interfaceEdit.bodyInfo)
            {
                state.bodyInfo=state.interfaceEdit.bodyInfo;
                if(state.bodyInfo.rawText===undefined)
                {
                    Vue.set(state.bodyInfo,"rawText","");
                }
                if(state.bodyInfo.rawTextRemark===undefined)
                {
                    Vue.set(state.bodyInfo,"rawTextRemark","");
                }
                if(state.bodyInfo.rawFileRemark===undefined)
                {
                    Vue.set(state.bodyInfo,"rawFileRemark","");
                }
            }
            if(state.interfaceEdit.outInfo)
            {
                state.outInfo=state.interfaceEdit.outInfo;
            }
        },
        moveInterface:function (state,id) {
            if(state.interfaceEdit)
            {
                state.interfaceEdit.group._id=id;
            }
        },
        importResult:function (state,obj) {
            var result=[];
            for(var key in obj)
            {
                helper.handleResultData(key,obj[key],result,null,1)
            }
            state.result=result;
        },
        importBodyJson:function (state,obj) {
            var result=[];
            for(var key in obj)
            {
                helper.handleResultData(key,obj[key],result,null,1)
            }
            state.body=result;
        },
        importQuery:function (state,val) {
            var str=decodeURI($.trim(val));
            var arr=[];
            var param1=str.split("&");
            for(var i=0;i<param1.length;i++)
            {
                var param2=param1[i].split("=");
                if(param2.length>0)
                {
                    arr.push({
                        name:param2[0],
                        must:1,
                        remark:"",
                        value:param2[1]?[decodeURIComponent(param2[1])]:[],
                    })
                }
            }
            state.query=arr;
            state.interfaceEdit.queryParam=arr;
        },
        importHeader:function (state,val) {
            var arr=$.trim(val).split("\n");
            var arrHeader=[];
            for(var i=0;i<arr.length;i++)
            {
                var line=$.trim(arr[i]);
                var index=line.indexOf(":");
                var key="",value="";
                if(index==-1)
                {
                    key=line;
                }
                else
                {
                    key=$.trim(line.substr(0,index));
                    value=$.trim(line.substr(index+1));
                }
                if(key)
                {
                    arrHeader.push({
                        name:key,
                        value:value,
                        remark:"",
                    })
                }
            }
            if(arrHeader.length==0)
            {
                arrHeader.push({
                    name:"",
                    value:"",
                    remark:""
                })
            }
            state.header=arrHeader;
            state.interfaceEdit.header=arrHeader;
        },
        importBody:function (state,val) {
            var str=decodeURI($.trim(val));
            var arr=[];
            var param1=str.split("&");
            for(var i=0;i<param1.length;i++)
            {
                var param2=param1[i].split("=");
                if(param2.length>0)
                {
                    arr.push({
                        name:param2[0],
                        type:param2[1]=="[FILE]"?1:0,
                        must:1,
                        remark:"",
                        value:(param2[1]!="[FILE]")?(param2[1]?[decodeURIComponent(param2[1])]:[]):[],
                    })
                }
            }
            state.body=arr;
            state.interfaceEdit.bodyParam=arr;
        },
        changeMethod:function (state) {
            if(state.interfaceEdit.method=="POST" || state.interfaceEdit.method=="PUT")
            {
                if(state.header.length==1 && !state.header[0].name)
                {
                    state.header[0].name="Content-Type";
                    state.header[0].value="application/x-www-form-urlencoded"
                }
                else
                {
                    var bFind=false;
                    for(var i=0;i<state.header.length;i++)
                    {
                        var obj=state.header[i];
                        if(obj.name=="Content-Type")
                        {
                            bFind=true;
                            break;
                        }
                    }
                    if(!bFind)
                    {
                        state.header.push({
                            name:"Content-Type",
                            value:"application/x-www-form-urlencoded",
                            remark:""
                        })
                    }
                }
            }
            else
            {
                for(var i=0;i<state.header.length;i++)
                {
                    var obj=state.header[i];
                    if(obj.name=="Content-Type")
                    {
                        if(state.header.length>1)
                        {
                            state.header.splice(i,1);
                        }
                        else
                        {
                            state.header[0].name="";
                            state.header[0].value="";
                            state.header[0].remark="";
                        }
                        break;
                    }
                }
            }
        },
        changeUrl:function (state,val) {
            if(val)
            {
                var arrParam=[];
                var arr=val.match(/\{([^\s]+?)\}/g);
                if(arr)
                {
                    for(var i=0;i<arr.length;i++)
                    {
                        var str=arr[i].substr(1,arr[i].length-2);
                        var bFind=false;
                        for(var j=0;j<state.param.length;j++)
                        {
                            if(str==state.param[j].name)
                            {
                                bFind=true;
                                arrParam.push(state.param[j]);
                                break;
                            }
                        }
                        if(!bFind)
                        {
                            arrParam.push({
                                name:str,
                                remark:"",
                                value:[]
                            })
                        }
                    }
                }
                state.param=arrParam;
                state.interfaceEdit.restParam=state.param;
            }
        },
        changePreview:function (state,val) {
            if(val==1 && session.get("role")==0)
            {
                var obj={};
                var result=helper.resultSave(state.result);
                helper.convertToJSON(result,obj);
                state.drawMix=helper.format(JSON.stringify(obj),1,result).draw;
            }
        }
    },
    actions:{
        add:function (context,data) {
            if(context.state.interface && (data.id || (data.item && !data.item._id)))
            {
                context.state.interface.select=0;
                context.commit("setInterface",null);
            }
            context.commit("initParam");
            if(data.item)
            {
                context.commit("setInterfaceEdit",data.item);

            }
            else
            {
                context.commit("setInterfaceEdit",{
                    "name": "",
                    "group": {
                        "_id": data.id,
                    },
                    "url": "",
                    "remark": "",
                    "method": "GET",
                    "finish":0,
                    "outParam": [{
                        name:"",
                        must:0,
                        type:0,
                        remark:"",
                        show:0,
                        mock:"",
                        drag:1
                    }],
                    "bodyParam": [{
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                    }],
                    "queryParam": [{
                        name:"",
                        must:0,
                        remark:""
                    }],
                    "header": [{
                        name:"",
                        value:"",
                        remark:""
                    }],
                    "bodyInfo":{
                        type:0,
                        rawType:0,
                        rawTextRemark:"",
                        rawFileRemark:"",
                        rawText:"",
                    },
                    outInfo:{
                        type:0,
                        rawRemark:"",
                        rawMock:""
                    },
                    restParam:[],
                    before:"",
                    after:""
                });
            }
            context.commit("initInterface");
        },
        getAllInterface:function (context) {
            return net.get("/project/interface",{
                id:session.get("projectId")
            }).then(function (data) {
                if(data.code==200)
                {
                    context.commit("initInterfaceList",data.data.data);
                    context.commit("setBaseUrls",data.data.baseUrl);
                }
                else
                {
                    setTimeout(function () {
                        window.close();
                    },1200)
                }
            })
        },
        refreshData:function (context,data) {
            context.commit("setInterfaceList",helper.refreshInterface(context.state.interfaceList,data));
            if(context.state.interface)
            {
                context.state.interface.select=0;
            }
            context.commit("setInterface",null);
            context.commit("setInterfaceEdit",null);
        },
        refresh:function (context) {
            return net.get("/project/interface",{
                id:session.get("projectId")
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data.data);
                    context.commit("setBaseUrls",data.data.baseUrl);
                }
                return data;
            })
        },
        renameGroup:function (context,data) {
            return net.post("/group/create",data,{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        removeGroup:function (context,data) {
            return net.delete("/group/item",data).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        clear:function (context) {
            return net.delete("/project/clear",{
                id:session.get("projectId"),
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        removeInterface:function (context,data) {
            return net.delete("/interface/item",{
                id:data
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        destroyInterface:function (context,data) {
            return net.delete("/interface/destroyitem",{
                id:data
            }).then(function (data) {
                if(data.code==200)
                {
                    context.dispatch("refreshData",data.data);
                }
                return data;
            })
        },
        info:function (context,obj) {
            var itemData;
            return net.get("/interface/item",{
                id:obj.item1._id,
                group:obj.item._id
            }).then(function (data) {
                if(data.code==200)
                {
                    obj.item1.name=data.data.name;
                    obj.item1.method=data.data.method;
                    obj.item1.finish=data.data.finish;
                    itemData=data.data;
                    if(data.data.change)
                    {
                        return net.get("/project/interface",{
                            id:session.get("projectId")
                        }).then(function (data) {
                            if(data.code==200)
                            {
                                context.dispatch("refreshData",data.data.data);
                                context.commit("setBaseUrls",data.data.baseUrl);
                                context.dispatch("showInfo",{
                                    data:itemData._id,
                                    data1:itemData
                                });
                            }
                            return data;
                        })
                    }
                    else
                    {
                       context.dispatch("showInfo",{
                           data:data.data,
                           data1:obj.item1
                       });
                    }
                }
                else
                {
                    item.splice(obj.index,1);
                    context.dispatch("showInfo",{
                        data:null,
                        data1:null
                    });
                }
                return data;
            })
        },
        showInfo:function (context,data) {
            if(context.state.interface)
            {
                context.state.interface.select=0;
            }
            if(data.data==null)
            {
                context.commit("setInterface",null);
            }
            else if(typeof(data.data)=="string")
            {
                for(var i=0;i<context.state.interfaceList.length;i++)
                {
                    var obj=context.state.interfaceList[i];
                    var bBreak=false;
                    for(var j=0;j<obj.data.length;j++)
                    {
                        var obj1=obj.data[j];
                        if(obj1._id==data.data)
                        {
                            obj.show=1;
                            context.commit("setInterface",obj1);
                            obj1.select=1;
                            context.commit("setInterfaceEdit",data.data1);
                            bBreak=true;
                            break;
                        }
                    }
                    if(bBreak)
                    {
                        break;
                    }
                }
            }
            else
            {
                context.commit("setInterface",data.data1);
                context.state.interface.select=1;
                context.commit("setInterfaceEdit",data.data);
            }
            context.commit("initParam");
            if(context.state.interface)
            {
                context.commit("initInterface");
            }
            else
            {
                context.commit("setInterfaceEdit",null);
            }
            if(session.get("role")==0)
            {
                context.commit("setPreview",0);
            }
            else
            {
                context.commit("setPreview",1);
                var obj={};
                var result=helper.resultSave(context.state.result);
                helper.convertToJSON(result,obj);
                context.commit("setDrawMix",helper.format(JSON.stringify(obj),1,result).draw);
            }
        },
        move:function (context,obj) {
            return net.put("/interface/move",{
                id:obj.obj.id,
                group:obj.group._id
            },{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                if(data.code==200)
                {
                    obj.group.show=1;
                    for(var i=0;i<context.state.interfaceList.length;i++)
                    {
                        var o=context.state.interfaceList[i];
                        if(o._id==obj.obj.group)
                        {
                            var objSplice=o.data[obj.obj.index];
                            if(objSplice.select)
                            {
                                context.commit("moveInterface",obj.group._id);
                            }
                            o.data.splice(obj.obj.index,1);
                            obj.group.data.push(objSplice);
                            break;
                        }
                    }
                }
                return data;
            })
        },
        addGroup:function (context,query) {
            return net.post("/group/create",query,{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                if(data.code==200)
                {
                    context.commit("initInterfaceList",data.data);
                }
                return data;
            })
        },
        save:function (context) {
            var obj={
                name:context.state.interfaceEdit.name,
                url:context.state.interfaceEdit.url,
                group:context.state.interfaceEdit.group._id,
                remark:context.state.interfaceEdit.remark,
                project:session.get("projectId"),
                method:context.state.interfaceEdit.method,
                finish:context.state.interfaceEdit.finish,
                before:context.state.interfaceEdit.before,
                after:context.state.interfaceEdit.after,
            }
            if(context.state.interfaceEdit._id)
            {
                obj.id=context.state.interfaceEdit._id
            }
            obj.header=JSON.stringify(context.getters.headerSave);
            obj.queryparam=JSON.stringify(context.getters.querySave);
            if(context.state.interfaceEdit.method=="POST" || context.state.interfaceEdit.method=="PUT")
            {
                obj.bodyparam = JSON.stringify(context.getters.bodySave);
                var bodyInfo = $.clone(context.state.bodyInfo);
                if(bodyInfo.type==1)
                {
                    if(bodyInfo.rawType==0)
                    {
                        bodyInfo.rawFileRemark="";
                    }
                    else
                    {
                        bodyInfo.rawText="";
                        bodyInfo.rawTextRemark="";
                    }
                }
                obj.bodyinfo=JSON.stringify(bodyInfo)
            }
            if(context.state.outInfo.type==0)
            {
                obj.outparam=JSON.stringify(helper.resultSave(context.state.result));
                var outInfo=$.clone(context.state.outInfo);
                outInfo.rawRemark="";
                outInfo.rawMock="";
                obj.outinfo=JSON.stringify(outInfo)
            }
            else
            {
                obj.outparam="[]";
                obj.outinfo=JSON.stringify(context.state.outInfo)
            }
            obj.restparam=JSON.stringify(context.state.param)
            return net.post("/interface/create",obj,{
                "content-type":"application/x-www-form-urlencoded"
            }).then(function (data) {
                if(data.code==200)
                {
                    if(typeof(data.data)=="string")
                    {
                        context.state.interface.name=context.state.interfaceEdit.name;
                        context.state.interface.method=context.state.interfaceEdit.method;
                        context.state.interface.finish=context.state.interfaceEdit.finish;
                        Vue.set(context.state.interfaceEdit,"editor",{name:session.get("name")});
                        Vue.set(context.state.interfaceEdit,"updatedAt",$.getNowFormatDate("yyyy-MM-dd hh:mm:ss"))
                    }
                    else
                    {
                        if(data.data instanceof Array)
                        {
                            Vue.set(context.state.interfaceEdit,"editor",{name:session.get("name")});
                            Vue.set(context.state.interfaceEdit,"updatedAt",$.getNowFormatDate("yyyy-MM-dd hh:mm:ss"))
                            context.state.interfaceList=helper.refreshInterface(context.state.interfaceList,data.data);
                            for(var i=0;i<context.state.interfaceList.length;i++)
                            {
                                var obj=context.state.interfaceList[i];
                                var bBreak=false;
                                for(var j=0;j<obj.data.length;j++)
                                {
                                    var obj1=obj.data[j];
                                    if(obj1._id==context.state.interfaceEdit._id)
                                    {
                                        obj.show=1;
                                        context.state.interface=obj1;
                                        obj1.select=1;
                                        bBreak=true;
                                        break;
                                    }
                                }
                                if(bBreak)
                                {
                                    break;
                                }
                            }
                        }
                        else
                        {
                            context.state.interfaceEdit._id=data.data._id;
                            Vue.set(context.state.interfaceEdit,"owner",{name:session.get("name")});
                            Vue.set(context.state.interfaceEdit,"editor",{name:session.get("name")});
                            Vue.set(context.state.interfaceEdit,"createdAt",data.data.createdAt);
                            Vue.set(context.state.interfaceEdit,"updatedAt",data.data.updatedAt);
                            for(var i=0;i<context.state.interfaceList.length;i++)
                            {
                                var obj=context.state.interfaceList[i];
                                if(obj._id==context.state.interfaceEdit.group._id)
                                {
                                    var o={
                                        _id:data.data._id,
                                        name:data.data.name,
                                        method:data.data.method,
                                        finish:data.data.finish,
                                        select:1
                                    }
                                    obj.data.push(o)
                                    obj.show=1;
                                    context.state.interface=o;
                                    break;
                                }
                            }
                        }
                    }
                }
                return data;
            })
        },
        copy:function (context,data) {
            return net.get("/interface/item",{
                id:data.item1._id,
                group:data.item._id
            }).then(function (data) {
                if(data.code==200)
                {
                    var method=data.data.method;
                    var url=$.trim(data.data.url);
                    var name=$.trim(data.data.name)+"(副本)";
                    var param=data.data.restParam;
                    var query=data.data.queryParam;
                    var header=data.data.header;
                    var body=data.data.bodyParam;
                    var result=data.data.outParam;
                    var outInfo=data.data.outInfo;
                    var obj={
                        method:method,
                        url:url,
                        queryParam:query,
                        header:header,
                        bodyParam:body,
                        outParam:result,
                        restParam:param,
                        group:{
                            _id:data.data.group._id
                        },
                        name:name,
                        remark:data.data.remark,
                        owner:"",
                        editor:"",
                        createdAt:"",
                        updatedAt:"",
                        finish:0,
                        outInfo:outInfo,
                        before:data.data.before,
                        after:data.data.after
                    }
                    if(method=="POST" || method=="PUT")
                    {
                        obj.bodyInfo=data.data.bodyInfo;
                    }
                    context.state.objCopy=obj;
                }
                return data;
            })

        },
        newInterface:function (context) {
            if(session.get("newInterface"))
            {
                var objInterface=JSON.parse(session.get("newInterface"));
                context.dispatch("add",{
                    id:null,
                    item:objInterface
                });
                session.remove("newInterface");
            }
        }
    }
})