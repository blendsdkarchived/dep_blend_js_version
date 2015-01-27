Blend.defineClass('Blend.layout.plugins.Splitter', {
    layout: null,
    init: function () {
        var me = this;
        me.callParent.apply(me, arguments);
        me.view = me.layout.view;

        // override the render function
        var layoutRenderFn = me.layout.render;
        me.layout.render = function () {
            me.removeSplitters();
            return layoutRenderFn.apply(me.layout, arguments);
        };

        //override the performLayout function
        var layoutPerformLayoutFn = me.layout.performLayout;
        me.layout.performLayout = function (force) {
            me.layout.align = 'stretch';
            me.layout.pack = 'center';
            if (me.hasSplitters && !me.didSplitters) {
                me.recreateSplitters.apply(me, []);
            }
            layoutPerformLayoutFn.apply(me.layout, arguments);
        };

        var layoutType = me.layout.alias.replace('layout.', '');
        me.layout.updateLayoutContext = function () {
            me[layoutType + '_updateLayoutContext'].apply(me, arguments);
        }
    },
    /**
     * @private
     * Removes or destroy existing splitters from the views items. Since this
     * function is only called at render time, we also abuse this function
     * to see if the views in this layout are actually set to have splitters!
     */
    removeSplitters: function () {
        var me = this, itm, sp;
        for (var a = 0; a < me.view.items.length; a++) {
            sp = false;
            itm = me.view.items[a];
            if (itm.split && itm.split === true) {
                me.hasSplitters = true;
            }
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
        if (
                (Blend.isString(itm) && itm.indexOf('splitter')) ||
                (Blend.isObject(itm) && itm.type && itm.type === 'ui.splitter')) {
            return true;
        } else {
            return false;
        }
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
        me.layout.containerEl.appendChild(docFrag);
        Blend.foreach(views, function (view, idx) {
            view.itemIndex = idx;
        });
        me.view.items = views;
        me.view.resetVisibleChildrenCache();
        me.bindSplitters();
        me.didSplitters = true;
    },
    createNewSplitter: function () {
        var me = this, splitter;
        splitter = me.layout.createItemView({
            type: 'ui.splitter',
            reference: 'splitter' + (me.splitCnt++)
        });
        return splitter;
    },
    /**
     * @private
     * Binds the splitters to their corresponding components
     */
    bindSplitters: function () {
        var me = this, items = me.view.getVisibleChildren();
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
    vbox_updateLayoutContext: function (ctx) {
        var me = this, delta, displ,
                topCtx = me.layout.itemContext[ctx.top.itemIndex],
                btmCtx = me.layout.itemContext[ctx.bottom.itemIndex];

        ctx.top.disableEvents();
        ctx.bottom.disableEvents();

        if (ctx.delta.top < 0) {

            displ = Math.abs(ctx.delta.top);
            delta = me.unit2Flex(displ);

            //moving splitter to top
            if (topCtx.flex === true) {
                ctx.top.flex = (topCtx.flexSize - delta); //reconfigure
            }

            if (btmCtx.flex === true) {
                ctx.bottom.flex = (btmCtx.flexSize + delta); // reconfigure
            }

            ctx.top.setHeight(ctx.top.height - displ);
            ctx.bottom.setHeight(ctx.bottom.height + displ);

        } else {

            displ = Math.abs(ctx.delta.top);
            delta = me.unit2Flex(displ);

            //moving splitter to bottom
            if (btmCtx.flex === true) {
                ctx.bottom.flex = (btmCtx.flexSize - delta);
            }

            if (topCtx.flex === true) {
                ctx.top.flex = (topCtx.flexSize + delta);
            }

            ctx.top.setHeight(ctx.top.height + displ);
            ctx.bottom.setHeight(ctx.bottom.height - displ);

        }

        me.layout.view.performLayout();
        ctx.top.enableEvents();
        ctx.bottom.enableEvents();

    },
    unit2Flex: function (size) {
        var me = this;
        return size / me.layout.layoutContext.pixelsPerFlex;
    }

});