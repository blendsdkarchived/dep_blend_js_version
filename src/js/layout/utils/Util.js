/**
 * @internal
 */
Blend.defineClass('Blend.layout.utils.Util', {
    /**
     * @protected
     */
    getEl: function (view) {
        var me = this;
        if (Blend.isArray(view)) {
            var res = [];
            Blend.foreach(view, function (itm) {
                res.push(me.getEl(itm));
            });
            return res;
        } else {
            return view.getElement ? view.getElement() : view;
        }
    }
});