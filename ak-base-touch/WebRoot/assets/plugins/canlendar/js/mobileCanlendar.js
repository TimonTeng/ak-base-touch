/*
 * mobileCanlendar是一个移动端日期时间选择插件
 * 有"年/月/日"和"年/月/日 时:分"两种格式.
 * 可自定义开始时间及结束时间
 * 使用方式示例 : $('#id').mobileCanlendar({beginYear:2013,endYear:2016,model:"day-time",callback:function(){console.log("callback");}});
 * 版本:v1.0
 * 最近修改时间 2014/12/16
 * 作者:huangweiduo
 */

$.fn.mobileCanlendar = function(opts){
    var _this = $(this);
    // 初始化参数
    opts = $.extend({
        beginYear: 2000,                 //起始年份
        endYear: 2020,                   //结束年份
        beginMonth: 1,                   //起始月份
        endMonth: 12,                    //结束月份
        beginDay: 1,                     //起始天
        endDay: 31,                      //结束天
        beginHour: 0,                    //起始时
        endHour: 23,                     //结束时
        beginMinute: 0,                  //起始秒
        endMinute: 59,                   //结束秒
        model: "day",                    //控件样式（1：日期(day)，2：日期+时间(day-time)）
        linkChar: "-",                   //年月日中间的连接符
        callback: function(){}           //点击确认按钮之后的回调函数
    }, opts || {});

    var useCancle = false;

    // 初始化滑动距离
    var yearScroll = 0;
    var monthScroll = 0;
    var dayScroll = 0;
    var hourScroll = 0;
    var minuteScroll = 0;
    // 初始化滑动开始的Y坐标
    var touchStartY = 0;
    // 初始化滑动的距离
    var touchMoveY = 0;

    // 触发事件绑定
    _this.on("click",function(){
        _this.blur();
        // 新建UI
        createCanlendarUI();
        //初始化时间
        initNow();
        // 绑定确认/取消按钮事件
        btnBind();
        // 绑定滑动事件
        initScroll();
        // 显示UI
        showCanlendarUI();
        // 显示天的个数
        checkMonth();
        // 显示时间
        initDate();
    });

    // 初始化时间
    var initNow = function(){
        if(_this.val() === ""){
            // 当没有值时初始化为当前时间
            var now = new Date();
            var nowY = now.getFullYear();
            var nowM = now.getMonth() + 1;
            var nowD = now.getDate();
            var nowH = now.getHours();
            var nowMin = now.getMinutes();
            yearScroll = (nowY - opts.beginYear) * 40;
            monthScroll = (nowM - opts.beginMonth) * 40;
            dayScroll = (nowD - opts.beginDay) * 40;
            hourScroll = (nowH - opts.beginHour) * 40;
            minuteScroll = (nowMin - opts.beginMinute) * 40;
        }else if(useCancle){
            // 如果有值且使用了取消按钮,初始化为值所表示的时间
            var val = _this.val();
            var date = val.split(" ")[0];
            var dateDetail = date.split(opts.linkChar);
            yearScroll = (dateDetail[0] - opts.beginYear) * 40;
            monthScroll = (dateDetail[1] - opts.beginMonth) * 40;
            dayScroll = (dateDetail[2] - opts.beginDay) * 40;
            if(opts.model === "day-time"){
                var time = val.split(" ")[1];
                var timeDetail = time.split(":");
                hourScroll = (timeDetail[0] - opts.beginHour) * 40;
                minuteScroll = (timeDetail[1] - opts.beginMinute) * 40;
            }
        }
    };

    // 定位滚动时间
    var initDate = function(){
        $(".year-wrapper ul").css({"-webkit-transition":"-webkit-transform 1000ms","-webkit-transform":"translateY(-"+yearScroll+"px)"});
        $(".month-wrapper ul").css({"-webkit-transition":"-webkit-transform 1000ms","-webkit-transform":"translateY(-"+monthScroll+"px)"});
        $(".date-wrapper ul").css({"-webkit-transition":"-webkit-transform 1000ms","-webkit-transform":"translateY(-"+dayScroll+"px)"});
        // 是否为日期加时间的模式
        if(opts.model === "day-time"){
            $(".hour-wrapper ul").css({"-webkit-transition":"-webkit-transform 1000ms","-webkit-transform":"translateY(-"+hourScroll+"px)" });
            $(".minute-wrapper ul").css({"-webkit-transition":"-webkit-transform 1000ms","-webkit-transform":"translateY(-"+minuteScroll+"px)"});
        }
    };

    // 初始化滑动事件
    var initScroll = function(){
        var yearUl = document.getElementById("year-ul");
        var monthUl = document.getElementById("month-ul");
        var dateUl = document.getElementById("date-ul");
        yearUl.addEventListener("touchstart",touchStart,false);
        yearUl.addEventListener("touchmove",touchMove,false);
        yearUl.addEventListener("touchend",touchEnd,false);
        monthUl.addEventListener("touchstart",touchStart,false);
        monthUl.addEventListener("touchmove",touchMove,false);
        monthUl.addEventListener("touchend",touchEnd,false);
        dateUl.addEventListener("touchstart",touchStart,false);
        dateUl.addEventListener("touchmove",touchMove,false);
        dateUl.addEventListener("touchend",touchEnd,false);
        if(opts.model === "day-time"){
            var hourUl = document.getElementById("hour-ul");
            var minuteUl = document.getElementById("minute-ul");
            hourUl.addEventListener("touchstart",touchStart,false);
            hourUl.addEventListener("touchmove",touchMove,false);
            hourUl.addEventListener("touchend",touchEnd,false);
            minuteUl.addEventListener("touchstart",touchStart,false);
            minuteUl.addEventListener("touchmove",touchMove,false);
            minuteUl.addEventListener("touchend",touchEnd,false);
        }
    };

    // 滑动开始
    var touchStart = function(event){
        var touch = event.touches[0];
        touchStartY = touch.pageY;
        $(".canlendar-bd ul").css({"-webkit-transition":"-webkit-transform 0ms"});
    };

    // 滑动过程
    var touchMove = function(event){
        event.preventDefault();
        var thatId = $(this).attr("id");
        var touch = event.touches[0];
        // 滚动的距离
        touchMoveY = touch.pageY - touchStartY;
        switch(thatId){
            case "year-ul" : $(this).css({"-webkit-transform":"translateY(" + -(yearScroll-touchMoveY) + "px)"}); break;
            case "month-ul" : $(this).css({"-webkit-transform":"translateY(" + -(monthScroll-touchMoveY) + "px)"}); break;
            case "date-ul" : $(this).css({"-webkit-transform":"translateY(" + -(dayScroll-touchMoveY) + "px)"}); break;
            case "hour-ul" : $(this).css({"-webkit-transform":"translateY(" + -(hourScroll-touchMoveY) + "px)"}); break;
            case "minute-ul" : $(this).css({"-webkit-transform":"translateY(" + -(minuteScroll-touchMoveY) + "px)"}); break;
            default : return;
        }
    };

    // 滑动结束
    var touchEnd = function(){
        var thatId = $(this).attr("id");
        $(".canlendar-bd ul").css({"-webkit-transition":"-webkit-transform 100ms"});
        switch(thatId){
            case "year-ul" : yearScroll = yearScroll - touchMoveY; break;
            case "month-ul" : monthScroll = monthScroll - touchMoveY; break;
            case "date-ul" : dayScroll = dayScroll - touchMoveY; break;
            case "hour-ul" : hourScroll = hourScroll - touchMoveY; break;
            case "minute-ul" : minuteScroll = minuteScroll - touchMoveY; break;
            default : return;
        }
        checkScroll(thatId);
        if(thatId === "month-ul"){
            checkMonth();
        }
    };

    // 根据不同月份显示不同的天数
    var checkMonth = function(){
        var year = yearScroll/40 +1;
        var month = monthScroll/40 + 1;
        if("469".indexOf(month)>-1 || month===11){
            $("#date-ul li").show();
            $("#date-ul li:eq(31)").hide();
            opts.endDay = 30;
        }else if(month === 2){
            $("#date-ul li").show();
            $("#date-ul li:eq(31)").hide();
            $("#date-ul li:eq(30)").hide();
            $("#date-ul li:eq(29)").hide();
            opts.endDay = 28;
            if((year%100===0 && year%400===0) || year%4===0){
                $("#date-ul li:eq(29)").show();
                opts.endDay = 29;
            }
        }else{
            $("#date-ul li").show();
            opts.endDay = 31;
        }
    };

    // 检查并校准
    var checkScroll = function(thatId){
        var scroll = 0;
        var begin = 0;
        var end = 0;

        // 获取初始值
        switch(thatId){
            case "year-ul" :
                scroll = yearScroll;
                end = opts.endYear;
                begin = opts.beginYear;
                break;
            case "month-ul" :
                scroll = monthScroll;
                end = opts.endMonth;
                begin = opts.beginMonth;
                break;
            case "date-ul" :
                scroll = dayScroll;
                end = opts.endDay;
                begin = opts.beginDay;
                break;
            case "hour-ul" :
                scroll = hourScroll;
                end = opts.endHour;
                begin = opts.beginHour;
                break;
            case "minute-ul" :
                scroll = minuteScroll;
                end = opts.endMinute;
                begin = opts.beginMinute;
                break;
            default : return;
        }

        // 校准
        if(scroll<0){
            scroll = 0;
        }else if(scroll>(end-begin)*40){
            scroll = (end-begin)*40;
        }else if(scroll%40){
            scroll = scroll - scroll%40;
        }

        // 重新定义当前值
        switch(thatId){
            case "year-ul" : yearScroll = scroll; break;
            case "month-ul" : monthScroll = scroll; break;
            case "date-ul" : dayScroll = scroll; break;
            case "hour-ul" : hourScroll = scroll; break;
            case "minute-ul" : minuteScroll = scroll; break;
            default : return;
        }

        // 重新定位
        initDate();
    };

    // 创建日历插件
    var createCanlendarUI = function(){
        if($(".mobile-canlendar-cover")){
            $(".mobile-canlendar-cover").remove();
        }
        if($(".mobile-canlendar")){
            $(".mobile-canlendar").remove();
        }
        var canlendarCover = '<div class="mobile-canlendar-cover"></div>';
        var canlendar = ''+
            '<div class="mobile-canlendar">'+
                '<div class="canlendar-hd">'+
                    '<h1>请选择日期</h1>'+
                '</div>'+
                '<div class="canlendar-bd">'+
                    '<div class="day-main">'+
                        '<div class="year-wrapper"></div>'+
                        '<div class="month-wrapper"></div>'+
                        '<div class="date-wrapper"></div>'+
                        '<div class="now-cover"></div>'+
                    '</div>'+
                    '<div class="time-main">'+
                        '<div class="hour-wrapper"></div>'+
                        '<div class="minute-wrapper"></div>'+
                        '<div class="now-cover"></div>'+
                    '</div>'+
                '</div>'+
                '<div class="canlendar-fd">'+
                    '<div class="btn-sure">确定</div>'+
                    '<div class="btn-cancle">取消</div>'+
                '</div>'+
            '</div>';
        $('body').append(canlendarCover);
        $('body').append(canlendar);

        createCanlendarYear();
        createCanlendarMonth();
        createCanlendarDate();
        if(opts.model === "day-time"){
            createCanlendarHour();
            createCanlendarMinute();
        }
    };

    // 显示日历插件
    var showCanlendarUI = function(){
        if(opts.model === "day-time"){
            $(".time-main").show();
        }
        $(".mobile-canlendar-cover").show();
        $(".mobile-canlendar").show();
    };

    // 确认及删除按钮事件绑定
    var btnBind = function(){
        $(".btn-cancle").on("click",function(){
            $(".mobile-canlendar-cover").hide();
            $(".mobile-canlendar").hide();
            useCancle = true;
        });
        $(".btn-sure").on("click",function(){
            $(".mobile-canlendar-cover").hide();
            $(".mobile-canlendar").hide();
            var year = opts.beginYear + yearScroll/40;
            var month = opts.beginMonth + monthScroll/40;
            var day = opts.beginDay + dayScroll/40;
            if(month < 10){
                month = "0" + month;
            }
            if(day < 10){
                day = "0" +day;
            }
            var time = "" + year + opts.linkChar + month + opts.linkChar + day;
            if(opts.model === "day-time"){
                var hour= opts.beginHour + hourScroll/40;
                var minute = opts.beginMinute + minuteScroll/40;
                if(hour < 10){
                    hour = "0" + hour;
                }
                if(minute < 10){
                    minute = "0" + minute;
                }
                time = time + " " + hour + ":" + minute + ":00";
            }
            // 赋值
            _this.val(time);

            // 回调
            opts.callback();
        });
    };

    // 创建年列表
    var createCanlendarYear = function(){
        var yearUl = '<ul id="year-ul"><li>&nbsp;</li>';
        for(var i=opts.beginYear;i<=opts.endYear;i++){
            yearUl += '<li>'+ i +'年</li>';
        }
        yearUl += '<li>&nbsp;</li></ul>';
        $('.year-wrapper').append(yearUl);
    };

    // 创建月列表
    var createCanlendarMonth = function(){
        var monthUl = '<ul id="month-ul"><li>&nbsp;</li>';
        for(var i=opts.beginMonth;i<=opts.endMonth;i++){
            monthUl += '<li>'+ i +'月</li>';
        }
        monthUl += '<li>&nbsp;</li></ul>';
        $('.month-wrapper').append(monthUl);
    };

    // 创建日列表
    var createCanlendarDate = function(){
        var dateUl = '<ul id="date-ul"><li>&nbsp;</li>';
        for(var i=opts.beginDay;i<=opts.endDay;i++){
            dateUl += '<li>'+ i +'日</li>';
        }
        dateUl += '<li>&nbsp;</li></ul>';
        $('.date-wrapper').append(dateUl);
    };

    // 创建时列表
    var createCanlendarHour = function(){
        var hourUl = '<ul id="hour-ul"><li>&nbsp;</li>';
        for(var i=opts.beginHour;i<=opts.endHour;i++){
            hourUl += '<li>'+ i +'时</li>';
        }
        hourUl += '<li>&nbsp;</li></ul>';
        $('.hour-wrapper').append(hourUl);
    };

    // 创建分列表
    var createCanlendarMinute = function(){
        var minuteUl = '<ul id="minute-ul"><li>&nbsp;</li>';
        for(var i=opts.beginMinute;i<=opts.endMinute;i++){
            minuteUl += '<li>'+ i +'分</li>';
        }
        minuteUl += '<li>&nbsp;</li></ul>';
        $('.minute-wrapper').append(minuteUl);
    };
};