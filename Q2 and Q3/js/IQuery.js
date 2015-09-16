/**
 * Created by 谦龙 on 2015/9/14.
 */
/*
* 实现了
*       1 简单的选择器 id  class tag
*       2 事件
*       3 样式修改
*       4 类的添加与删除
*       5 显示隐藏（show hide）
*       6 索引
*       ....
*       注释：需求解答
*       1  通过rotate这个api实现任意tag类型 添加 3D旋转 动画效果(围绕 X or Y or Z轴)
*       2  通过addRotateOnOff 这个api 添加移除动画标志
*
* */
function IQuery(iArg) {

    this.elements=[];//存储元素集合
    //判断$()参数类型 进行不同的操作
    switch(typeof iArg){
        case 'function':
            bind(window,'load',iArg);
            break;
        case 'string'://选择器部分
            switch (iArg.charAt(0)){
                case '#'://id
                    this.elements.push(document.getElementById(iArg.substr(1)))
                    break;
                case '.' ://class
                    this.elements=(getByClass(document,iArg.substr(1)));
                    break;
                default ://tag
                    this.elements=toArray(document.getElementsByTagName(iArg));
                    break
            }
            break;
        case 'object':
            if(Object.prototype.toString.call(iArg) == "[object Array]"){
                this.elements=iArg;
            }else{
                this.elements.push(iArg);
            }
            break;
    }
}
//$() 主要函数  其实就是一个幌子
function $(iArg) {
    return new IQuery(iArg)
}
IQuery.prototype.click= function (fn) {//点击事件
    this.on('click',fn);
    return this;
}

IQuery.prototype.mouseover= function (fn) {//鼠标移入
    this.on('mouseover',fn);
    return this;
}

IQuery.prototype.on= function (eventName,fn) {// on 事件主要作用
    for(var i=0;i<this.elements.length;i++){
        bind(this.elements[i],eventName,fn);//给每一个选择到的元素进行绑定事件
    }
    return this;
}

IQuery.prototype.hide= function () {
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.display='none';
    }
    return this;
}

IQuery.prototype.show= function () {
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.display='block';
    }
    return this;
}
//css函数
IQuery.prototype.css= function (attr,value) {//css函数封装
    if(arguments.length==2){
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].style[attr]=value;
        }
        return this;
    }else if(arguments.length==1){
        if(typeof arguments[0] == 'object'){//处理传入的是json对象形式
            for(var attr2 in arguments[0]){
                for(var i=0;i<this.elements.length;i++){
                    this.elements[i].style[attr2]=arguments[0][attr2];
                }
            }
            return this;
        }else{//返回要回去的元素的某个属性
            return getStyle(this.elements[0],attr);
        }
    }
}
//addClass添加类的方法
IQuery.prototype.addClass= function (className) {
   for(var i=0;i<this.elements.length;i++){
       //原来没有class的情况
       if(this.elements[i].className=='') {
           this.elements[i].className=className;
       }else{

           //原来有class的情况
           var sClassNames=this.elements[i].className.split(' ');
           var index=sClassNames.indexOf(className);
           if(index==-1)
           {
               //原来没有相同class的情况
               this.elements[i].className+=' '+className;
           }
           //原来有相同class的情况 不做处理
       }
   }
    return this;
}
IQuery.prototype.removeClass= function (className) {
        //有class的情况
   // console.log(className)
      for(var i=0;i<this.elements.length;i++){
            if(this.elements[i].className!=''){
                var sClassNames=this.elements[i].className.split(' ');
                var index=sClassNames.indexOf(className);
                if(index!=-1){
                    sClassNames.splice(index,1); //有要删除的class
                    this.elements[i].className=sClassNames.join(' ');
                }
            }
            //没有class的情况  无需做处理
        }
    return this;
}

//find方法  selector 选择器  .  tag
IQuery.prototype.find= function (selector) {
    var reEle=[];
    //.class情况
    if(selector.charAt(0)=='.'){
        for(var i=0;i<this.elements.length;i++){
            reEle=reEle.concat(getByClass(this.elements[i],selector.substr(1)));
        }
    }else{//tag 如果是标签得形式
        for(var i=0;i<this.elements.length;i++){
            reEle=reEle.concat(toArray(document.getElementsByTagName(selector)))
        }
    }
    return $(reEle);
}

//index方法  获得当前元素相对于同胞元素的索引
IQuery.prototype.index= function () {
      var elems=this.elements[0].parentNode.children;//获取所有与当前元素同一辈的元素
      for(var i=0;i<elems.length;i++){
          if(elems[i]==this.elements[0]){
              return i;//返回索引
          }
      }
  }

//eq方法 获取元素中的某个

IQuery.prototype.eq= function (n) {
    //n>=0
    if(n<0){//若小于0  则设置第一个
        return $(this.elements[0]);
    }else{
        return $(this.elements[n]);
    }
 }

//attr方法
IQuery.prototype.attr= function (attr,value) {
    if(arguments.length==2){
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].setAttribute(attr,value);
        }

    }else if(arguments.length==1){
        if(typeof arguments[0] == 'object'){//处理传入的是json对象形式
            for(var attr2 in arguments[0]){
                for(var i=0;i<this.elements.length;i++){
                    this.elements[i].setAttribute(attr2,arguments[0][attr2]);
                }
            }
        }else{
            return this.elements[0].getAttribute(attr);
        }
    }
}

//添加动画标志
//参数 为false 不进行动画  true 进行
IQuery.prototype.addRotateOnOff= function (str) {
    for(var i=0;i<this.elements.length;i++){
        $(this.elements[i]).attr({
            "rotateOff":str
        })
    }
}

//3D旋转动画
/*
*  rotateType  旋转类型  X  Y  Z
*  time 执行动画时间  默认 .35s
*  timingFunction  执行动画类型 默认linear
*  deg  旋转角度  默认-180deg
*  多个参数填写  某项不赋值 则填 ''
*  //参数设置待完善
* */
IQuery.prototype.rotate= function (rotateType,time,timingFunction,deg) {
    var rotateType=rotateType?'rotate'+rotateType:'rotateY';
    var time=time ? time+'s' : '.35s';
    var timingFunction=timingFunction ?timingFunction : 'linear';
    var transition=time+' '+timingFunction;
    var deg=deg?deg+'deg':'-180deg';
    for(var i=0;i<this.elements.length;i++){
        if($(this.elements[i]).attr('rotateOff')=='false'){//表示关闭动画
            return false;
        }else{
            $(this.elements[i]).css({
                "transition":transition,
                "-webkit-transition":transition,
                "-moz-transition":transition,
                "-ms-transition":transition,
                "-o-transition":transition,
                "transform-style":"preserve-3d",
                "-webkit-transform-style":"preserve-3d",
                "-moz-transform-style":"preserve-3d",
                "-ms-transform-style":"preserve-3d",
                "-o-transform-style":"preserve-3d",
                "perspective":"800px",
                "-webkit-perspective":"800px",
                "-moz-perspective":"800px",
                "-ms-perspective":"800px",
                "-o-perspective":"800px",
                "transform":rotateType+"("+deg+")",
                "-webkit-transform":rotateType+"("+deg+")",
                "-moz-transform":rotateType+"("+deg+")",
                "-ms-transform":rotateType+"("+deg+")",
                "-o-transform":rotateType+"("+deg+")"
            })
        }

    }
}

//  hover事件
IQuery.prototype.hover= function (fnOver,fnOut) {
        this.on('mouseover',fnOver);
        this.on('mouseout',fnOut);
        return this;
}

IQuery.prototype.html= function (str) {//html函数 赋值 获取
    if(!str){//获取
        return this.elements[0].innerHTML;//返回第一个元素的innerHTML
    }else{//设置
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].innerHTML=str;
        }
    }
    return this;
}

IQuery.prototype.animate=function (json, fn){
    for(var i=0;i<this.elements.length;i++){
        anim(this.elements[i],json,fn);
    }
    return this;
}

//2D缓冲动画实现
function anim(obj,json,endFn){
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        var bBtn = true;
        for(var attr in json){
            var iCur = 0;
            if(attr == 'opacity'){
                if(Math.round(parseFloat(getStyle(obj,attr))*100)==0){
                    iCur = Math.round(parseFloat(getStyle(obj,attr))*100);
                }
                else{
                    iCur = Math.round(parseFloat(getStyle(obj,attr))*100) || 100;
                }
            }
            else{
                iCur = parseInt(getStyle(obj,attr)) || 0;
            }
            var iSpeed = (json[attr] - iCur)/8;
            iSpeed = iSpeed >0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if(iCur!=json[attr]){
                bBtn = false;
            }
            if(attr == 'opacity'){
                obj.style.filter = 'alpha(opacity=' +(iCur + iSpeed)+ ')';
                obj.style.opacity = (iCur + iSpeed)/100;
            }
            else{
                obj.style[attr] = iCur + iSpeed + 'px';
            }
        }
        if(bBtn){
            clearInterval(obj.timer);

            if(endFn){
                endFn.call(obj);
            }
        }
    },30);

}

//事件绑定
function bind(obj,evenName,fn) {
        if(obj.addEventListener){
            obj.addEventListener(evenName, fn,false);
        }else{
            obj.attachEvent('on'+evenName, function () {
                fn().call(this) //修改this指向  默认指向window
                //fn.call(this,arguments);
            });
        }
    return this;
}
//通过class获取元素
function getByClass(oParent,iClass){
    var reEle=[];
    var elems=oParent.getElementsByTagName('*');
    for(var i=0;i<elems.length;i++){
        if(elems[i].className.split(' ').indexOf(iClass)!=-1 ){//处理多class情况
            reEle.push(elems[i]);
        }
    }
    return reEle;
}
//获取元素的样式
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }
    else{
        return getComputedStyle(obj,false)[attr];
    }
}

//将集合转成数组
function toArray(elems) {
    var reArr=[];
    for(var i=0;i<elems.length;i++){
        reArr.push(elems[i]);
    }
    return reArr;
}

