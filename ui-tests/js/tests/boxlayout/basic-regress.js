var layouts = [];

Blend.foreach([10, 0], function (imargin) {
    Blend.foreach(['hbox', 'vbox'], function (itype) {
        Blend.foreach(['start', 'center', 'end', 'stretch'], function (ialign) {
            Blend.foreach(['start', 'center', 'end'], function (ipack) {
                layouts.push({
                    align: ialign,
                    pack: ipack,
                    type: itype,
                    margin: imargin,
                    name: [itype, ialign, ipack, 'margin', imargin].join('_')
                });
            });
        });
    });
});

var boxTests = {
    vbox_align_start: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.left, margin, r0.tname);
        t.equal(r1.left, margin, r1.tname);
        t.equal(r2.left, margin, r2.tname);
    },
    vbox_align_end: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.left, 200 - margin, r0.tname);
        t.equal(r1.left, 200 - margin, r1.tname);
        t.equal(r2.left, 200 - margin, r2.tname);
    },
    vbox_align_stretch: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        boxTests.vbox_align_start(t, r0, r1, r2, margin);
        t.equal(r0.width, 250 - 2 * margin, r0.tname);
        t.equal(r1.width, 250 - 2 * margin, r1.tname);
        t.equal(r2.width, 250 - 2 * margin, r2.tname);
    },
    vbox_align_center: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.left, 100, r0.tname);
        t.equal(r1.left, 100, r1.tname);
        t.equal(r2.left, 100, r2.tname);
    },
    vbox_pack_start: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.top, margin, r0.tname);
        t.equal(r1.top, 50 + 2 * margin, r1.tname);
        t.equal(r2.top, 100 + 3 * margin, r2.tname);
    },
    vbox_pack_end: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.top, 100 - (margin * 3), r0.tname);
        t.equal(r1.top, 150 - (margin * 2), r1.tname);
        t.equal(r2.top, 200 - (margin), r2.tname);
    },
    vbox_pack_center: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.top, 50 - margin, r0.tname);
        t.equal(r1.top, 100, r1.tname);
        t.equal(r2.top, 150 + margin, r2.tname);
    },
    hbox_align_start: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.top, margin, r0.tname);
        t.equal(r1.top, margin, r1.tname);
        t.equal(r2.top, margin, r2.tname);
    },
    hbox_align_center: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.top, 100, r0.tname);
        t.equal(r1.top, 100, r1.tname);
        t.equal(r2.top, 100, r2.tname);
    },
    hbox_align_end: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.top, 200 - margin, r0.tname);
        t.equal(r1.top, 200 - margin, r1.tname);
        t.equal(r2.top, 200 - margin, r2.tname);
    },
    hbox_align_stretch: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        boxTests.hbox_align_start(t, r0, r1, r2, margin);
        t.equal(r0.height, 250 - (2 * margin), r0.tname);
        t.equal(r1.height, 250 - (2 * margin), r1.tname);
        t.equal(r2.height, 250 - (2 * margin), r2.tname);
    },
    hbox_pack_start: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.left, margin, r0.tname);
        t.equal(r1.left, 50 + (2 * margin), r1.tname);
        t.equal(r2.left, 100 + (3 * margin), r2.tname);
    },
    hbox_pack_center: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.left, 50 - margin, r0.tname);
        t.equal(r1.left, 100, r1.tname);
        t.equal(r2.left, 150 + margin, r2.tname);
    },
    hbox_pack_end: function (t, r0, r1, r2, margin) {
        margin = margin || 0;
        t.equal(r0.left, 100 - (3 * margin), r0.tname);
        t.equal(r1.left, 150 - (2 * margin), r1.tname);
        t.equal(r2.left, 200 - margin, r2.tname);
    }
};

Blend.foreach(layouts, function (ilayout, idx) {


    BlendTest.defineTest('box-layout', ilayout.name + '_' + idx, function (t) {

        var cname = t.newName();
        var aname = t.newName();


        Blend.defineClass(cname, {
            extend: 'Blend.mvc.Controller',
            application: {
                ready: function (app) {
                    var me = this, r = 0, c = 0;
                    t.delay(function () {
                        var alignFn = [ilayout.type, 'align', ilayout.align].join('_');
                        var packFn = [ilayout.type, 'pack', ilayout.pack].join('_');
                        alignFn = boxTests[alignFn];
                        packFn = boxTests[packFn];
                        if (Blend.isFunction(alignFn) || Blend.isFunction(packFn)) {
                            if (alignFn) {
                                c++;
                                r += (alignFn(t, me.getR0(), me.getR1(), me.getR2(), ilayout.margin || 0) || 0);
                            }
                            if (packFn) {
                                c++;
                                r += (packFn(t, me.getR0(), me.getR1(), me.getR2(), ilayout.margin || 0) || 0);
                            }
                            if (c !== 2) {
                                t.isTrue(false, ilayout.name);
                            }
                            if (r === 0) {
                                t.done();
                            }
                        } else {
                            t.isTrue(false, ilayout.name);
                            t.done();
                        }
                    });
                }
            }
        });

        Blend.defineClass(aname, {
            extend: 'Blend.mvc.Application',
            controllers: [cname],
            mainView: {
                type: 'ui.container',
                items: [
                    {
                        reference: 'rect0',
                        type: 'ui.container',
                        layout: {
                            align: ilayout.align,
                            pack: ilayout.pack,
                            type: ilayout.type,
                            margin: ilayout.margin
                        },
                        ui: 'graybg',
                        width: 250,
                        height: 250,
                        defaults: {
                            width: 50,
                            height: 50,
                            tname: ilayout.name
                        },
                        items: [
                            {
                                type: 'ui.rect',
                                reference: 'r0'
                            },
                            {
                                type: 'ui.rect',
                                reference: 'r1'
                            },
                            {
                                type: 'ui.rect',
                                reference: 'r2'
                            }
                        ]
                    }
                ]
            }
        });

        Blend.Environment.runApplication(aname);

    });

});
