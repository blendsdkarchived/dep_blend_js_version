Blend.defineClass('Blend.layout.container.Box', {
    extend: 'Blend.layout.container.Layout',
    requires: [
        'Blend.layout.utils.Box',
        'Blend.ui.Splitter'
    ],
    align: 'start',
    pack: 'start',
    margin: 0,
    layoutContext: null,
    direction: null,
    handler: null,
    render: function () {
        var me = this;
        /**
         * Remove splitters because we are going to render and include them
         * in the layout phase
         */
        me.removeSplitters();
        return me.callParent.apply(me, arguments);
    },
    performLayout: function (force) {
        var me = this, ctx;
        ctx = me.prepareLayout(force);
        me.createLayoutContext();
        me.handler(me.containerEl, me.getElements(), ctx, me.layoutContext);
        me.callParent.apply(me, arguments);
    },
    createLayoutContext: function (force) {
        var me = this;
        me.layoutContext = force ? null : me.layoutContext;
        if (!me.layoutContext) {
            me.layoutContext = {
                pack: me._hasSplitter ? 'center' : me.pack,
                align: me._hasSplitter ? 'stretch' : me.align,
                margin: me._hasSplitter ? 0 : me.margin,
                direction: me.direction,
                bounds: Blend.Element.getBounds(me.containerEl),
                layoutHandler: function (el, bounds, idx) {
                    /**
                     * Only call the sizeChanged event if the bounds of the
                     * view is changed. This will avoid unnecessary layout flows
                     */
                    var view = me.view.items[idx];
                    var vbounds = Blend.Element.getBounds(view.getElement());
                    Blend.Style.set(el, bounds);
                    if (!me.boundsEqual(vbounds, bounds)) {
                        me.view.items[idx].fireEvent('sizeChanged', bounds.width, bounds.height);
                    }
                }
            };
        }
    },
    prepareLayout: function () {
        var me = this, result = [];
        if (me._hasSplitter && !me._didSplitters) {
            me.recreateSplitters();
        }
        Blend.foreach(me.view.items, function (view) {
            result.push(view.getLayoutContext());
        });
        return result;
    },
    recreateSplitters: function () {
        var me = this,
                splitter,
                isFirst, isLast,
                isLastSplitter, // is the last view a splitter?
                views = [],
                docFrag = Blend.createDocumentFragment(),
                last = me.view.items.length - 1;
        Blend.foreach(me.view.items, function (view, index) {
            if (view.split && view.split === true) {
                isFirst = (index === 0);
                isLast = index === last;
                if (isFirst && !isLast) {
                    splitter = me.createNewSplitter();
                    views.push(view);
                    views.push(splitter);
                    docFrag.appendChild(view.getElement());
                    docFrag.appendChild(splitter.getElement());
                    isLastSplitter = true;
                } else if (!isLastSplitter && !(isFirst && isLast)) {
                    // if the last item is not an splitter and it is not the only item!
                    splitter = me.createNewSplitter();
                    views.push(splitter);
                    views.push(view);
                    docFrag.appendChild(splitter.getElement());
                    docFrag.appendChild(view.getElement());
                    isLastSplitter = false;
                } else {
                    views.push(view);
                    docFrag.appendChild(view.getElement());
                    isLastSplitter = false;
                }
            } else {
                views.push(view);
                docFrag.appendChild(view.getElement());
                isLastSplitter = false;
            }
        });
        me.containerEl.appendChild(docFrag);
        me.view.items = views;
        me._didSplitters = true;
        me.bindSplitters();
        return;
    },
    createNewSplitter: function () {
        var me = this, splitter;
        splitter = me.createItemView({
            type: 'ui.splitter',
            reference: 'splitter' + (me.splitCnt++)
        });
        me.createItemLayoutContext(splitter);
        return splitter;
    },
    /**
     * @private
     * Binds the splitters to their corresponding components
     */
    bindSplitters: function () {
        var me = this, items = me.view.items;
        Blend.foreach(items, function (cmp, index) {
            if (Blend.isInstanceOf(cmp, Blend.ui.Splitter)) {
                cmp.getAComponent = function () {
                    return items[index - 1];
                };
                cmp.getBComponent = function () {
                    return items[index + 1];
                };
            }
        });
    },
    /**
     * @private
     * Removes or destroy existing splitters from the views items. Also
     */
    removeSplitters: function () {
        var me = this, itm, sp;
        for (var a = 0; a < me.view.items.length; a++) {
            sp = false;
            itm = me.view.items[a];
            if (me.isSplitter(itm)) {
                sp = true;
            } else if (Blend.isObject(itm) && Blend.isInstanceOf(itm, Blend.ui.Splitter)) {
                Blend.Element.destroy(itm.getElement());
                sp = true;
            }
            if (sp) {
                me.view.items.splice(a, 1);
                a = 0; // start the loop again
            }
        }
    },
    isSplitter: function (itm) {
        if ((Blend.isString(itm) && itm.indexOf('splitter')) ||
                (Blend.isObject(itm) && itm.type && itm.type === 'ui.splitter')) {
            return true;
        } else {
            return false;
        }
    },
    unit2Flex: function (size) {
        var me = this;
        return size / me.layoutContext.pixelsPerFlex
    }
});