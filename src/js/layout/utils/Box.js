/**
 * Layout utility class for positioning HTMLElements in a boxed/flexed layout
 * position.
 */
Blend.defineClass('Blend.layout.utils.Box', {
    extend: 'Blend.layout.utils.Util',
    singleton: true,
    /**
     * @internal
     * Arranges given elements in to a horizontal box layout. This function
     * needs a layoutContext and a list of item layout context configuration for
     * each item.
     * @param {type} parent
     * @param {type} children
     * @param {type} ilctx
     * @param {type} lctx
     * @returns {undefined}
     */
    hflex: function (parent, children, ilctx, lctx) {
        var me = this, needtotals, nextleft = -1, margin, proccessors = {
            pack: {
                start: function (bounds) {
                    var r;
                    if (nextleft === -1) {
                        nextleft = margin;
                    }
                    r = nextleft;
                    nextleft += (bounds.width + margin)
                    bounds.left = r;
                },
                center: function (bounds) {
                    var r;
                    if (nextleft === -1) {
                        nextleft = ((lctx.bounds.width / 2) - (lctx.total_width / 2)) + margin;
                    }
                    r = nextleft;
                    nextleft += (bounds.width + margin);
                    bounds.left = r;
                },
                end: function (bounds) {
                    var r;
                    if (nextleft === -1) {
                        nextleft = (lctx.bounds.width - (lctx.total_width)) + margin;
                    }
                    r = nextleft;
                    nextleft += (bounds.width + margin);
                    bounds.left = r;
                }
            },
            align: {
                start: function (bounds) {
                    bounds.top = margin;
                },
                stretch: function (bounds) {
                    bounds.top = margin;
                    bounds.height = lctx.bounds.height - (bounds.top * 2);
                },
                center: function (bounds) {
                    bounds.top = (lctx.bounds.height / 2) - (bounds.height / 2); // no margins
                },
                end: function (bounds) {
                    bounds.top = lctx.bounds.height - (bounds.height + margin);
                }
            }, bounds: function (el, ctx) {
                var b = Blend.Element.getBounds(el);
                if (Blend.Environment.isIE) {
                    b.width = ctx.width;
                }
                return b;
            }
        };
        lctx.pack = lctx.margin === true ? 'center' : lctx.pack;
        needtotals = (lctx.pack === 'center' || lctx.pack === 'end');
        parent = me.getEl(parent);
        children = me.getEl(children);
        me.calculateSetBounds(parent, children, ilctx, lctx, 'width', needtotals);
        margin = lctx.margin;
        me.flex(parent, children, ilctx, lctx, proccessors);
    },
    /**
     * @internal
     * Arranges given elements in to a vertical box layout. This function
     * needs a layoutContext and a list of item layout context configuration for
     * each item.
     * @param {type} parent
     * @param {type} children
     * @param {type} ilctx
     * @param {type} lctx
     * @returns {undefined}
     */
    vflex: function (parent, children, ilctx, lctx) {
        var me = this, needtotals, nexttop = -1, margin, proccessors = {
            pack: {
                start: function (bounds) {
                    var r;
                    if (nexttop === -1) {
                        nexttop = margin; // the first item with its margins
                    }
                    r = nexttop;
                    nexttop += (bounds.height + margin);
                    bounds.top = r;
                },
                center: function (bounds) {
                    var r;
                    if (nexttop === -1) {
                        nexttop = ((lctx.bounds.height / 2) - (lctx.total_height / 2)) + margin;
                    }
                    r = nexttop;
                    nexttop += (bounds.height + margin);
                    bounds.top = r;
                },
                end: function (bounds) {
                    var r;
                    if (nexttop === -1) {
                        nexttop = (lctx.bounds.height - (lctx.total_height)) + margin;
                    }
                    r = nexttop;
                    nexttop += (bounds.height + margin);
                    bounds.top = r;
                }
            },
            align: {
                start: function (bounds) {
                    bounds.left = margin;
                },
                stretch: function (bounds) {
                    bounds.left = margin;
                    bounds.width = lctx.bounds.width - (bounds.left * 2);
                },
                center: function (bounds) {
                    bounds.left = (lctx.bounds.width / 2) - (bounds.width / 2); // no margins
                },
                end: function (bounds) {
                    bounds.left = lctx.bounds.width - (bounds.width + margin);
                }
            },
            bounds: function (el, ctx) {
                var b = Blend.Element.getBounds(el);
                if (Blend.Environment.isIE) {
                    b.height = ctx.height;
                }
                return b;
            }
        };
        lctx.pack = lctx.margin === true ? 'center' : lctx.pack;
        needtotals = (lctx.pack === 'center' || lctx.pack === 'end');
        parent = me.getEl(parent);
        children = me.getEl(children);
        me.calculateSetBounds(parent, children, ilctx, lctx, 'height', needtotals);
        margin = lctx.margin;
        me.flex(parent, children, ilctx, lctx, proccessors);
    },
    /**
     * Common processor for both vflex and hflex layout utilities
     * @param {type} parent
     * @param {type} children
     * @param {type} ilctx
     * @param {type} lctx
     * @param {type} proccessors
     * @returns {undefined}
     */
    flex: function (parent, children, ilctx, lctx, proccessors) {
        var me = this, alignFn, packFn, ctx, a, len, el, bounds;
        len = children.length;
        for (a = 0; a !== len; a++) {
            el = children[a];
            ctx = ilctx[a];
            bounds = proccessors.bounds.apply(me, [el, ctx]);
            alignFn = proccessors.align[lctx.align];
            packFn = proccessors.pack[lctx.pack];
            packFn.apply(me, [bounds]);
            alignFn.apply(me, [bounds]);
            Blend.Style.set(el, bounds);
        }
    },
    /**
     * @internal
     * Update/Set the given layoutContext with:
     * [1] Maximum flex units of elements that are flexed
     * [2] Total width/height of fixed elements
     * @param {type} children
     * @param {type} lctx
     * @param {type} ilctx
     * @param {type} flexed_prop
     * @returns {undefined}
     */
    updateLayoutContext: function (children, lctx, ilctx, flexed_prop) {
        var me = this, maxFlex = 0, itm, total = 0, bounds;
        Blend.foreach(ilctx, function (ctx, idx) {
            itm = children[idx];
            bounds = Blend.Element.getBounds(itm);
            if (ctx.flex) {
                maxFlex++;
            } else {
                total += bounds[flexed_prop];
            }
        });
        lctx.maxFlex = maxFlex;
        lctx[flexed_prop] = total;
    },
    /**
     * @internal
     * Calculates and sets the bounds of flexed elements. This function also
     * sets the total units of widths/heights of all the elements to be used
     * later in the width/height calculations
     * @param {type} parent
     * @param {type} children
     * @param {type} ilctx
     * @param {type} lctx
     * @param {type} flexed_prop
     * @param {type} need_all_totals
     * @returns {undefined}
     */
    calculateSetBounds: function (parent, children, ilctx, lctx, flexed_prop, need_all_totals) {
        var me = this, alltotals = 0,
                ctx, unit,
                mrg = lctx.margin, omrg = mrg, avail, totalMargin = 0;


        need_all_totals = need_all_totals || false;

        //Update the layout context to get maxFlex and total width/height that is taken
        me.updateLayoutContext(children, lctx, ilctx, flexed_prop);

        if (lctx.maxFlex !== 0) {
            //omrg is the original margin
            mrg = Blend.isNumeric(omrg) ? mrg : 0;
            totalMargin = (children.length + 1) * mrg;
            var pbounds = Blend.Element.getBounds(parent);
            avail = (pbounds[flexed_prop] - totalMargin) - lctx[flexed_prop];
        }

        Blend.foreach(children, function (itm, idx) {
            ctx = ilctx[idx];
            if (ctx.flex) {
                unit = (avail * ctx.flex) / lctx.maxFlex;
                var o = {};
                o[flexed_prop] = unit;
                Blend.Style.set(itm, o);
            }
            if (need_all_totals) {
                if (unit) {
                    alltotals += unit;
                    ctx[flexed_prop] = unit; // For F** IE that does not return the
                    unit = null;
                } else {
                    var b = Blend.Element.getBounds(itm);
                    ctx[flexed_prop] = b[flexed_prop];
                    alltotals += b[flexed_prop];
                }
            }
        });
        if (need_all_totals) {
            if (!Blend.isNumeric(omrg) && omrg === true) {
                /*
                 * Calculate the distributed margin value
                 */
                mrg = (lctx.bounds[flexed_prop] - alltotals) / children.length;
                lctx.margin = mrg;
            }
            totalMargin = (children.length + 1) * mrg; // +1 is for the margin before the first element
            alltotals += totalMargin;
            lctx['total_' + flexed_prop] = alltotals;
        }

    }
});