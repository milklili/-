//图片预加载的插件封装，面向对象的写法
//使用闭包来模拟局部作用域
(function ($) {
    function preLoad(imgs, options) {
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;//传进来的可能是单张图片或者数组，写插件就是要将问题尽可能的抽象化，并且考虑兼容多种情况
        this.opts = $.extend({}, preLoad.DEFAULTS, options);//传进来的变量和默认值的融合,如果没有传进来就使用默认,实质是将后一个对象覆盖前一个合并为一个对象

        this._unordered();
    }

    preLoad.DEFAULTS = {//设置默认参数
        each: null,  // 每一张图片加载完毕后执行
        all: null,   // 所有图片加载完后执行
    }
   //写在原型上这样每次实例化的时候，都保持只有一份，减少生成量
    preLoad.prototype._unordered = function () {
        //无序加载
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;

        $.each(imgs, function (i, src) {
            if (typeof src != 'string') {
                return;
            }
            var imgObj = new Image();
            $(imgObj).on('load error', function () {
                opts.each && opts.each(count);//判断 opts存不存在，若不存在执行后续的会报错
                if (count >= len - 1) {
                    opts.all && opts.all();
                }
                count++;
            });
            imgObj.src = src;
        });

    };
    $.extend({
        preload: function (imgs, opts) {
            new preLoad(imgs, opts);
        }
    })


})(jQuery);