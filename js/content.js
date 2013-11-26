;(function(){

    var postData;
    /**
     * 数据库操作API
     */
    var RestApi = (function(){
        var defaults = {
            dataType:"json"
        };


        var webApi = (window.location.host == "localhost") ? 'http://localhost/cp/api/' :  'http://ecd.oa.com/xdata/api/';

        /***
         * 获取api url
         * @param {Object} api_name
         */
        var getUrl = function(api_path){
            var url = webApi + api_path;
            return url;
        }

        /***
         *
         * @param {Object} params
         * @param {Object} type GET/POST/PUT/DELETE
         */
        var baseRest = function(params,type){
            $.extend(params, defaults);
            params.type = type || "GET";
            var jxhr = $.ajax(params);
            return jxhr;
        };



        return{
            /**
             * 插入背景图片数据
             * @param {Object} params
             */
            postVersion:function(params){
                params.url = getUrl("version");
                return baseRest(params,"POST");
            }
        }
    })();

    /**
     * 显示弹出层信息
     * @param data
     * @returns {string}
     */
    var showPop = function(data){
        var pop="";
        pop += "<div class=\"mod_pop ox_pop\" id=\"ox_pop\">";
        pop += "		<div class=\"mod_pop_hd\">";
        pop += "			<h3 class=\"mod_pop_tit\">保存版本历史<\/h3>";
        pop += "			<button type=\"button\" class=\"mod_pop_close\" data-dismiss=\"model\">关闭<\/button>";
        pop += "		<\/div>";
        pop += "		<div class=\"mod_pop_bd\">";
        pop += "			<div class=\"ox_pop_img\"><a href=\"{1}\" target=\"_blank\" ><img id=\"ox_pop_img\" src=\"{1}\" \/><\/a><\/div>";
        pop += "			<div class=\"ox_pop_cnt\">";
        pop += "				<textarea class=\"ox_pop_textarea\" name=\"ox_pop_desc\" id=\"ox_pop_desc\" cols=\"30\" rows=\"8\" placeholder=\"随便说说\"><\/textarea>";
        pop += "				<p class=\"ox_pop_action\">";
        pop += "					<a href=\"javascript:;\" id=\"ox_pop_save\" class=\"mod_btn mod_btn_bg2 ox_pop_btn\">确认保存<\/a>";
        pop += "					<a href=\"javascript:;\" id=\"ox_pop_cancel\" data-dismiss=\"model\" class=\"mod_btn mod_btn_bg1 ox_pop_btn\">取消<\/a>";
        pop += "				<\/p>";
        pop += "			<\/div>";
        pop += "		<\/div>";
        pop += "	<\/div>";
        pop += "	<div class=\"mod_pop_mask\" id=\"ox_pop_mask\"><\/div>";

        pop = pop.replace(/\{1\}/g, data.imgdata);

        $('body').append(pop);
    };


    var sendMessage = function(data){
        // 默认值
        var defaults = {
            msg:'capture_selected',
            clientWidth:document.documentElement.clientWidth,
            clientHeight:document.documentElement.clientHeight,
            pageHeight:(document.height !== undefined) ? document.height : document.body.offsetHeight,
            x:0,
            y:0,
            width:0,
            height:0,
            href: document.location.href,
            text: document.title || ""
        }

        var setting = $.extend({},defaults,data);
        console.info('setting',setting)
        chrome.extension.sendRequest(setting)
    };

    /**
     * 获取存储数据库及保存图片所需的数据
     * @returns {{data: {version: {version_img: string, version_name: string, version_desc: (*|jQuery)}, imgdata: (*|jQuery)}}}
     */
    var getData = function(){
        //插入数据库的数据
        var _postData,
            dbData;

        dbData = {
            version_img         :   new Date().getTime() + '.png',
            version_desc        :   $('#ox_pop_desc').val()
        };
        //将相关的数据库数据存入dbData
        for(var i in postData){
            if(i.indexOf('version_') !== -1){
                dbData[i] = postData[i]
            }
        }
        //组合数据
        _postData = {
            data:{
                version :dbData,
                imgdata:$('#ox_pop_img').attr('src')
            }
        }
        return _postData;
    };

    /**
     * 获取data-* 属性值 因$.data() 有cache
     * @param $dom
     * @returns {{}}
     */
    var getDataAttrs = function($dom){
        var data = {},
            i = 0,
            attr = $dom[0].attributes;
        for (l = attr.length; i < l; i++) {
            var name = attr[i].name;
            if (name.indexOf("data-") === 0) {
                name = name.substring(5);
                data[name] = attr[i].nodeValue;
            }
        }
        return data;
    }

    /**
     * 事件绑定
     */
    var events = function(){
        var $doc = $(document);

        $doc.on('click.ox','.ox_add_link',function(){
            var data = getDataAttrs($(this)),
                $body = $('body');
            $body.addClass('data_capturing');
            $body.append('<div id="js_capturing_temp" style="width: 100%; height: 1000px;"></div> ');
            $(document).scrollTop(data.y)
            setTimeout(function(){
                sendMessage(data);
            },1000);
            console.info('data',data)

            return false;
        });

        /**
         * 关闭浮层
         * @private
         */
        var _closePop = function(){
            $("#ox_pop,#ox_pop_mask").hide().remove();
            $('body').removeClass('data_capturing');
            $('#js_capturing_temp').remove();
        }

        //保存版本历史
        $doc.on('click.ox','#ox_pop_save',function(){
            var post_data = getData();
            console.info(post_data,"post_data");
            RestApi.postVersion(post_data).success(function(d){
                _closePop();
                alert('保存版本历史成功！');
            })
            return false;
        });

        //关闭弹窗
        $doc.on('click.ox','#ox_pop [data-dismiss="model"]',function(){
            _closePop();
        });

        //黏贴
        $doc.on('paste.ox','#ox_pop',function(e){
            var items = e.originalEvent.clipboardData.items;

            for (var i = 0; i < items.length; ++i) {
                console.log(items[i].type,items[i]);
                if (items[i].type == 'image/png') {
                    var blob = items[i].getAsFile(),
                        reader = new FileReader();
                    reader.onload = function(event){
                        var $img = $('#ox_pop_img');
                        $img.attr('src',event.target.result);
                        $img.closest('a').attr('href',event.target.result);
                    }; // data url!
                    reader.readAsDataURL(blob);
                }
            }
        });

    };



    /**
     * 插件事件监听
     * 监听background js 传来的消息
     */
    var addListener = function(){
        chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
            var data = request;
            switch (data.msg) {
                case "capture_selected":
                    //存入全局对象
                    postData = data.data;
                    showPop(data);
                    break;
            }
        })
    }

    /**
     * 初始化函数
     */
    var init = function(){
        addListener();
        events();
    };


    $(function(){
        init();
    })


})()


