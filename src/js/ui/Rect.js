Blend.defineClass('Blend.ui.Rect', {
    extend: 'Blend.ui.Component',
    border: false,
    borderColor: '#000',
    color: 'random',
    width: 150,
    height: 50,
    gray: false,
    alias: 'ui.rect',
    text: null,
    rcnt: 0,
    lcnt: 0,
    initElement: function (el) {
        var me = this, color;
        el = me.callParent.apply(me, [el]);
        if (me.border) {
            el.style.border = "1px solid " + me.borderColor || '#000';
        }
        if (me.color === 'random') {
            color = me.gray ? me.getRandomGrayColor() : me.getRandomColor();
        }
        ///el.id = Blend.id();
        el.style['background-color'] = color;
        el.style.width = me.width;
        el.style.height = me.height;
        el.style.border = '1px dashed blue';
        el.listeners = {
            click: function () {
                Blend.mvc.Context.getContext('b1').layoutMainView(true);
                me.fireEvent("click");
            }
        };
        el.cls = ['rect'];
        return el;
    },
    setText: function (value) {
        var me = this;
        value = value || Blend.id();
        me.element.innerHTML = value;
    },
    getText: function () {
        var me = this;
        return me.element.innerHTML;
    },
    getRandomGrayColor: function () {
        var colors = ['#FFFFFF', '#FEFEFE', '#FDFDFD', '#FCFCFC', '#FBFBFB', '#FAFAFA', '#F9F9F9', '#F8F8F8',
            '#F7F7F7', '#F6F6F6', '#F5F5F5', '#F4F4F4', '#F3F3F3', '#F2F2F2', '#F1F1F1', '#F0F0F0'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    getRandomColor: function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});