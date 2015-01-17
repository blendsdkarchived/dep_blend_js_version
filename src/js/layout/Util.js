Blend.defineClass('Blend.layout.Util', {
    singleton: true,
    /**
     * Fits the source element into the parent element
     * @param {Blend.ui.View/HTMLElement} parent
     * @param {Blend.ui.View/HTMLElement} child
     */
    fit: function (parent, child) {
        var me = this,
                parentElement = me.getEl(parent),
                childElement = me.getEl(child);
        Blend.CSS.set(childElement, Blend.cssPrefix('fitable'));
        Blend.Style.set(childElement, Blend.Element.getSize(parentElement));
    },
    /**
     * Center a HTMLElement only on the horizontal axis of its parent element
     * @param {HTMLElement} parent
     * @param {HTMLElement} child
     */
    centerX: function (parent, child) {
        var me = this;
        me.center(parent, child, false, true);
    },
    /**
     * Center a HTMLElement only on the vertical axis of its parent element
     * @param {HTMLElement} parent
     * @param {HTMLElement} child
     */
    centerY: function (parent, child) {
        var me = this;
        me.center(parent, child, true, false);
    },
    /**
     * Center a HTMLElement both on horizontal and vertical axis of its parent element
     * @param {HTMLElement} parent
     * @param {HTMLElement} child
     * @param {boolean} doTop
     * @param {boolean} doLeft
     */
    center: function (parent, child, doTop, doLeft) {
        if (Blend.isNullOrUndef(doTop)) {
            doTop = true;
        }
        if (Blend.isNullOrUndef(doLeft)) {
            doLeft = true;
        }
        var me = this,
                parentElement = me.getEl(parent),
                childElement = me.getEl(child),
                pb = Blend.Element.getBounds(parentElement),
                cb = Blend.Element.getBounds(childElement),
                left = doLeft ? (pb.width / 2) - (cb.width / 2) : cb.left,
                top = doTop ? (pb.height / 2) - (cb.height / 2) : cb.top;
        Blend.Element.setPosition(childElement, top, left);
    },
    vflex: function (parent, children, contexts, lctx) {
        var me = this, nexttop = -1, totalh = 0, toffset, elb, procs = {
            align: {
                stretch: function (bounds, el) {
                    bounds.left = 0;
                    bounds.width = lctx.bounds.width;
                },
                start: function (bounds, el) {
                    bounds.left = 0;
                },
                center: function (bounds, el) {
                    bounds.left = (lctx.bounds.width / 2) - (el.width / 2);
                },
                end: function (bounds, el) {
                    bounds.left = lctx.bounds.width - el.width;
                }
            },
            pack: {
                start: function (bounds, el) {
                    if (nexttop === -1) {
                        bounds.top = (el.top || 0);
                    } else {
                        bounds.top = nexttop;
                    }
                    nexttop += el.height;

                    bounds.top += lctx.margin;
                    nexttop += lctx.margin;

                },
                center: function (bounds, el) {
                    if (nexttop === -1) {
                        bounds.top = toffset;
                    } else {
                        bounds.top = nexttop + toffset;
                    }
                    nexttop += el.height;

                    bounds.top += lctx.margin;
                    nexttop += lctx.margin;

                },
                end: function (bounds, el) {
                    if (nexttop === -1) {
                        bounds.top = lctx.bounds.height - el.height;
                    } else {
                        bounds.top = nexttop - el.height;
                    }
                    nexttop = bounds.top

                    bounds.top -= lctx.margin;
                    nexttop -= lctx.margin;
                }
            }
        }, parentElement = me.getEl(parent),
                childElements = me.getEl(children)
        Blend.foreach(childElements, function (el) {
            elb = Blend.Element.getSize(el);
            totalh += (elb.height + lctx.margin);
        });
        toffset = (lctx.bounds.height / 2) - (totalh / 2) - lctx.margin;
        me.flex(parentElement, childElements, contexts, lctx, procs);
    },
    flex: function (parent, children, contexts, lctx, proccessors) {
        var me = this, alignFn, packFn, ctx, bounds, elbounds, a, len, el, i;
        len = children.length;
        for (a = 0; a !== len; a++) {
            el = children[a]
            i = lctx.pack === 'end' ? (len - a) - 1 : a;
            el = children[i];
            ctx = contexts[i];
            bounds = {};
            elbounds = Blend.Element.getSize(el);
            alignFn = proccessors.align[lctx.align];
            packFn = proccessors.pack[lctx.pack];
            alignFn.apply(me, [bounds, elbounds]);
            packFn.apply(me, [bounds, elbounds]);
            Blend.Style.set(el, bounds);
        }
    },
    /**
     * @private
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
}, function (clazz) {
    Blend.LayoutUtil = clazz;
});
