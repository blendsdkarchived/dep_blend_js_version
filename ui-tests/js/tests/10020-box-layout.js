BlendTest.defineTest('box-layout', 'general', function (t) {

    var apps = [];
    var nextTest = 0;
    var currentTest = -1;

    var tests = [
        {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'center',
                margin: 10
            },
            flex: 1,
            test: function (r1, r2, r3, name) {
                t.almost(r1.height, 120, name + ' flex+m10');
                t.almost(r2.height, 120, name + ' flex+m10');
                t.almost(r3.height, 120, name + ' flex+m10');

                t.almost(r1.top, 10, name + ' flex+1tm10');
                t.almost(r2.top, 140, name + ' flex+2tm10');
                t.almost(r3.top, 270, name + ' flex+3tm10');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'center'
            },
            flex: 1,
            test: function (r1, r2, r3, name) {
                t.almost(r1.height, 133, name + ' flex');
                t.almost(r2.height, 133, name + ' flex');
                t.almost(r3.height, 133, name + ' flex');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'center',
                margin: true
            },
            test: function (r1, r2, r3, name) {
                t.almost(r1.top, 41, name + 'mt1');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'center',
                margin: 10
            },
            test: function (r1, r2, r3, name) {
                t.equal(r1.left, 10, name + 'm1');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'end',
                pack: 'end'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 250, name + ' p1');
                t.equal(r2.top, 300, name + ' p2');
                t.equal(r3.top, 350, name + ' p3');
                //align
                t.equal(r1.left, 350, name + ' a1');
                t.equal(r2.left, 350, name + ' a2');
                t.equal(r3.left, 350, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'end'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 250, name + ' p1');
                t.equal(r2.top, 300, name + ' p2');
                t.equal(r3.top, 350, name + ' p3');
                //align
                t.equal(r1.left, 175, name + ' a1');
                t.equal(r2.left, 175, name + ' a2');
                t.equal(r3.left, 175, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'end'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 250, name + ' p1');
                t.equal(r2.top, 300, name + ' p2');
                t.equal(r3.top, 350, name + ' p3');
                //align
                t.equal(r1.left, 0, name + ' a1');
                t.equal(r2.left, 0, name + ' a2');
                t.equal(r3.left, 0, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'end'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 250, name + ' p1');
                t.equal(r2.top, 300, name + ' p2');
                t.equal(r3.top, 350, name + ' p3');
                //align
                t.equal(r1.width, 400, name + ' a1');
                t.equal(r2.width, 400, name + ' a2');
                t.equal(r3.width, 400, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 125, name + ' p1');
                t.equal(r2.top, 175, name + ' p2');
                t.equal(r3.top, 225, name + ' p3');
                //align
                t.equal(r1.left, 175, name + ' a1');
                t.equal(r2.left, 175, name + ' a2');
                t.equal(r3.left, 175, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'end',
                pack: 'center'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 125, name + ' p1');
                t.equal(r2.top, 175, name + ' p2');
                t.equal(r3.top, 225, name + ' p3');
                //align
                t.equal(r1.left, 350, name + ' a1');
                t.equal(r2.left, 350, name + ' a2');
                t.equal(r3.left, 350, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'center'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 125, name + ' p1');
                t.equal(r2.top, 175, name + ' p2');
                t.equal(r3.top, 225, name + ' p3');
                //align
                t.equal(r1.left, 0, name + ' a1');
                t.equal(r2.left, 0, name + ' a2');
                t.equal(r3.left, 0, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'center'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 125, name + ' p1');
                t.equal(r2.top, 175, name + ' p2');
                t.equal(r3.top, 225, name + ' p3');
                //align
                t.equal(r1.width, 400, name + ' a1');
                t.equal(r2.width, 400, name + ' a2');
                t.equal(r3.width, 400, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'end',
                pack: 'start'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 0, name + ' p1');
                t.equal(r2.top, 50, name + ' p2');
                t.equal(r3.top, 100, name + ' p3');
                //align
                t.equal(r1.left, 350, name + ' a1');
                t.equal(r2.left, 350, name + ' a2');
                t.equal(r3.left, 350, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'start'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 0, name + ' p1');
                t.equal(r2.top, 50, name + ' p2');
                t.equal(r3.top, 100, name + ' p3');
                //align
                t.equal(r1.left, 175, name + ' a1');
                t.equal(r2.left, 175, name + ' a2');
                t.equal(r3.left, 175, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'start',
                pack: 'start'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 0, name + ' p1');
                t.equal(r2.top, 50, name + ' p2');
                t.equal(r3.top, 100, name + ' p3');
                //align
                t.equal(r1.left, 0, name + ' a1');
                t.equal(r2.left, 0, name + ' a2');
                t.equal(r3.left, 0, name + ' a3');
            }
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            test: function (r1, r2, r3, name) {
                //pack
                t.equal(r1.top, 0, name + ' p1');
                t.equal(r2.top, 50, name + ' p2');
                t.equal(r3.top, 100, name + ' p3');
                //align
                t.equal(r1.width, 400, name + ' a1');
                t.equal(r2.width, 400, name + ' a2');
                t.equal(r3.width, 400, name + ' a3');
            }
        }
    ];

    Blend.defineClass('Test.layout.view.Boxed', {
        extend: 'Blend.ui.Container',
        alias: 'ui.boxed',
        width: 400,
        height: 400,
        ui: 'graybg',
        defaults: {
            width: 50,
            height: 50
        },
        items: [
            {
                type: 'ui.rect',
                reference: 'rect1',
            },
            {
                type: 'ui.rect',
                reference: 'rect2',
            },
            {
                type: 'ui.rect',
                reference: 'rect3',
            }
        ],
        init: function () {
            var me = this;
            me.callParent.apply(me, arguments);
            if (me.flex) {
                me.defaults.flex = me.flex;
            }
        }
    });

    Blend.defineClass('Test.boxed.Application', {
        extend: 'Blend.mvc.Application'
    });

    Blend.foreach(tests, function (test, idx) {

        var cname = 'Test.boxed.Controller' + idx;

        Blend.defineClass(cname, {
            extend: 'Blend.mvc.Controller',
            application: {
                ready: function () {
                    var me = this;
                    var bounds = function (view) {
                        return Blend.Element.getBounds(view.getElement());
                    };
                    test.test.apply(me, [
                        bounds(me.getRect1()),
                        bounds(me.getRect2()),
                        bounds(me.getRect3()),
                        JSON.stringify(test.layout)
                    ]);
                    nextTest++;
                }
            }
        });

        var app = Blend.create('Test.boxed.Application', {
            controllers: [cname],
            mainView: {
                type: 'ui.container',
                items: [
                    {
                        type: 'ui.boxed',
                        layout: test.layout,
                        flex: test.flex || null
                    }
                ]
            }
        });

        apps.push(app);
    });


    var timer = setInterval(function () {
        if (nextTest !== null && nextTest !== currentTest && !Blend.isNullOrUndef(apps[nextTest])) {
            currentTest = nextTest;
            apps[nextTest].start();
        }

        if (Blend.isNullOrUndef(apps[nextTest])) {
            clearInterval(timer);
            t.done();
        }
    }, 500);

});
