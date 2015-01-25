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
     * @param {type} ilctx
     * @param {type} lctx
     * @returns {undefined}
     */
    hflex: function (ilctx, lctx) {
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
            }
        };
        lctx.pack = lctx.margin === true ? 'center' : lctx.pack;
        lctx.align = lctx.margin === true ? 'center' : lctx.align;
        needtotals = (lctx.pack === 'center' || lctx.pack === 'end');
        me.calculateBounds(ilctx, lctx, 'width', needtotals);
        margin = lctx.margin;
        me.flex(ilctx, lctx, proccessors);
    },
    /**
     * @internal
     * Arranges given elements in to a vertical box layout. This function
     * needs a layoutContext and a list of item layout context configuration for
     * each item.
     * @param {type} ilctx
     * @param {type} lctx
     * @returns {undefined}
     */
    vflex: function (ilctx, lctx) {
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
            }
        };
        lctx.pack = lctx.margin === true ? 'center' : lctx.pack;
        needtotals = (lctx.pack === 'center' || lctx.pack === 'end');
        me.calculateBounds(ilctx, lctx, 'height', needtotals);
        margin = lctx.margin;
        me.flex(ilctx, lctx, proccessors);
    },
    /**
     * Common processor for both vflex and hflex layout utilities
     * @param {type} ilctx
     * @param {type} lctx
     * @param {type} proccessors
     * @returns {undefined}
     */
    flex: function (ilctx, lctx, proccessors) {
        var me = this, alignFn, packFn, ctx, a, bounds;
        for (a = 0; a !== ilctx.length; a++) {
            ctx = ilctx[a];
            alignFn = proccessors.align[lctx.align];
            packFn = proccessors.pack[lctx.pack];
            packFn.apply(me, [ctx]);
            alignFn.apply(me, [ctx]);
            if (lctx.layoutHandler) {
                lctx.layoutHandler(ctx, a);
            }
        }
    },
    /**
     * @internal
     * Update/Set the given layoutContext with:
     * [1] Maximum flex units of elements that are flexed
     * [2] Total width/height of fixed elements
     * @param {type} lctx
     * @param {type} ilctx
     * @param {type} flexed_prop
     * @returns {undefined}
     */
    updateLayoutContext: function (lctx, ilctx, flexed_prop) {
        var me = this, maxFlex = 0, total = 0;
        Blend.foreach(ilctx, function (ctx, idx) {
            if (ctx.flex === true) {
                maxFlex += ctx[flexed_prop];
            } else {
                total += ctx[flexed_prop];
            }
        });
        lctx.maxFlex = maxFlex;
        lctx.pixelsPerFlex = (lctx.bounds[flexed_prop] - total) / maxFlex;
        lctx[flexed_prop] = total;
    },
    /**
     * @internal
     * Calculates and sets the bounds of flexed elements. This function also
     * sets the total units of widths/heights of all the elements to be used
     * later in the width/height calculations
     * @param {type} ilctx
     * @param {type} lctx
     * @param {type} flexed_prop
     * @param {type} need_all_totals
     * @returns {undefined}
     */
    calculateBounds: function (ilctx, lctx, flexed_prop, need_all_totals) {
        var me = this, alltotals = 0, unit,
                mrg = lctx.margin, omrg = mrg, avail, totalMargin = 0;
        need_all_totals = need_all_totals || false;
        //Update the layout context to get maxFlex and total width/height that is taken
        me.updateLayoutContext(lctx, ilctx, flexed_prop);
        if (lctx.maxFlex !== 0) {
            //omrg is the original margin
            mrg = Blend.isNumeric(omrg) ? mrg : 0;
            totalMargin = (ilctx.length + 1) * mrg;
            avail = (lctx.bounds[flexed_prop] - totalMargin) - lctx[flexed_prop];
        }

        Blend.foreach(ilctx, function (ctx, idx) {
            if (ctx.flex === true) {
                unit = (avail * ctx[flexed_prop]) / lctx.maxFlex;
                // save the calculated flex property for later to be set
                // on the element
                ctx[flexed_prop] = unit;
                ctx.calculated = true;
            }
            if (need_all_totals) {
                if (unit) {
                    alltotals += unit;
                    unit = null;
                } else {
                    alltotals += ctx[flexed_prop];
                }
            }
        });
        if (need_all_totals) {
            if (!Blend.isNumeric(omrg) && omrg === true) {
                /*
                 * Calculate the distributed margin value
                 */
                mrg = (lctx.bounds[flexed_prop] - alltotals) / ilctx.length;
                lctx.margin = mrg;
            }
            totalMargin = (ilctx.length + 1) * mrg; // +1 is for the margin before the first element
            alltotals += totalMargin;
            lctx['total_' + flexed_prop] = alltotals;
        }
    }
});