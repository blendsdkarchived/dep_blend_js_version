var BlendTest = {};
(function () {

    var me = this,
            allpass = 0,
            allfail = 0,
            tests = [],
            nextTest = 0,
            currentTest,
            started = false,
            testWindow = null,
            statusbar = null,
            last_message = null,
            messages = [];

    // PUBLIC METHODS

    this.done = function () {
        if (currentTest.pass === 0 && currentTest.fail === 0) {
            this.log_warn('Nothing was tested!!!');
        }
        nextTest++;
        runNextTest();
    };

    this.delay = function (fn, amount) {
        setTimeout(fn, amount || 500);
    }

    this.throws_exception = function (actual, expected, message) {
        try {
            actual();
            fail.apply(me, arguments);
        } catch (e) {
            this.equal(e.message.replace("\n", ''), expected, message);
        }
    };

    this.almost = function (actuall, expected, message) {
        if (is_number(actuall) && (get_obj_type(actuall) === get_obj_type(actuall))) {
            var v = Math.abs(actuall - expected);
            if ((v >= 0) && (v < 1)) {
                pass(message || currentTest.testn);
                return;
            }
        }
        fail.apply(me, arguments);
    };

    this.equal = function (actual, expected, message) {
        var check = function (a, b) {
            if (get_obj_type(a) === get_obj_type(b)) {
                if (is_array(a)) {
                    if (a.length === b.length) {
                        for (var i = 0; i !== a.length; i++) {
                            if (!check(a[i], b[i])) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else if (is_object(a)) {
                    var akeys = Object.keys(a),
                            bkeys = Object.keys(a);
                    if (akeys.length === bkeys.length) {
                        for (var k in a) {
                            if (!check(a[k], b[k])) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }

                } else if (is_function(a)) {
                    return a.length === b.length;
                } else if (is_regexp(a)) {
                    throw new Error("Don't know how to compare RegExps!");
                } else {
                    return a === b;
                }
            } else {
                return false;
            }
        };

        if (check(actual, expected)) {
            pass(message || currentTest.testn);
        } else {
            fail.apply(me, arguments);
        }
    };

    this.isTrue = function (actuall, message) {
        if (actuall === true) {
            pass(message || currentTest.testn);
        } else {
            fail.apply(me, [actuall, true, message]);
        }
    }

    this.isFalse = function (actuall, message) {
        if (actuall === false) {
            pass(message || currentTest.testn);
        } else {
            fail.apply(me, [actuall, false, message]);
        }
    }


    this.notOk = function (actuall, message) {
        if (actuall === null || actuall === undefined) {
            pass(message || currentTest.testn);
        } else {
            fail.apply(me, [actuall, 'null/undefined', message]);
        }
    }

    this.ok = function (actuall, message) {
        if (actuall !== null && actuall !== undefined) {
            pass(message || currentTest.testn);
        } else {
            fail.apply(me, [actuall, 'not null/undefined', message]);
        }
    };

    this.defineTest = function (testGroup, testName, testFn) {
        tests.push({
            group: testGroup || 'latest',
            name: testName,
            fn: testFn,
            pass: 0,
            fail: 0,
            testn: 1
        });
    };

    this.run = function () {

        var doCallback = function () {
            if (!started) {
                removeEventListener(document, 'DOMContentLoaded', doCallback);
                removeEventListener(window, 'load', doCallback);
                started = true;
                initialize();
                tests = filter_messages();
                if (tests.length !== 0) {
                    runNextTest();
                } else {
                    log_warn("No tests not run!");
                    show();
                }
            }
        };

        if (document.readyState === "complete") {
            setTimeout(doCallback, 5);
        } else {
            addEventListener(document, 'DOMContentLoaded', doCallback);
            addEventListener(window, 'load', doCallback);
        }

    };

    // PRIVATE METHODS

    var initialize = function () {
        testWindow = document.createElement('DIV');
        testWindow.setAttribute('id', 'blend-test-window');
        statusbar = document.createElement('DIV');
        statusbar.setAttribute('id', 'blend-test-statusbar');
        if (typeof build_version !== 'undefined') {
            statusbar.innerHTML = "<span>" + build_version + "</span>";
        }
        testWindow.appendChild(statusbar);
    };

    var filter_messages = function () {
        var result = [], test;
        var groups = (getQueryParam('group') || "").split(';');
        if (groups.length !== 0 && groups[0] !== '') {
            for (var a = 0; a !== tests.length; a++) {
                test = tests[a];
                if (groups.indexOf(test.group) !== -1) {
                    result.push(test);
                }
            }
            return result;
        }
        return tests;
    };

    var show_messages = function () {
        document.body.appendChild(testWindow);
        for (var a = 0; a !== messages.length; a++) {
            testWindow.appendChild(messages[a]);
        }
    };

    var is_array = function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    };

    var is_function = function (value) {
        return typeof (value) === 'function';
    };

    var is_string = function (value) {
        return typeof value === 'string';
    };

    var is_null = function (value) {
        return value === null || value === undefined;
    };

    var is_object = function (value) {
        return (typeof (value) === "object" &&
                !is_array(value) &&
                !is_function(value) &&
                !is_null(value) &&
                !is_string(value)
                );
    };

    var is_number = function (value) {
        // Original source: JQuery
        return value - parseFloat(value) >= 0;
    };

    var is_regexp = function (value) {
        return (value instanceof RegExp);
    };

    var get_obj_type = function (obj) {
        if (is_string(obj)) {
            return 'string';
        } else if (is_array(obj)) {
            return 'array';
        } else if (is_number(obj)) {
            return 'number';
        } else if (is_object(obj)) {
            return 'object';
        } else if (is_function(obj)) {
            return 'function';
        } else if (is_null(obj)) {
            return 'null';
        } else if (is_regexp(obj)) {
            return 'regexp';
        }
    };

    var pass = function (message) {
        currentTest.pass++;
        allpass++;
        log_pass(message);
        currentTest.testn++;
    };

    var fail = function (actual, expected, message) {
        currentTest.fail++;
        allfail++;
        if (is_object(actual)) {
            actual = JSON.stringify(actual);
        }

        if (is_object(expected)) {
            expected = JSON.stringify(expected);
        }

        log_error((message || currentTest.testn) + ' : got [' + actual + '] expected [' + expected + ']');
        currentTest.testn++;
    };

    var runNextTest = function () {
        currentTest = tests[nextTest];
        if (currentTest) {
            try {
                log_info('Starting');
                currentTest.fn(me);
            } catch (e) {
                log_error(e);
                show();
                if (getQueryParam('break')) {
                    throw e;
                }
            }
        } else {
            show();
            statusbar.innerHTML += "<span class='blend-test-pass-log'>" + allpass + " passed</span>" +
                    "<span class='blend-test-error-log'>" + allfail + " failed</span>";
        }
    };

    var mk_log = function (attrs) {
        if (currentTest && currentTest.name && attrs.text) {
            attrs.text = currentTest.name + " : " + attrs.text;
        }
        var el = document.createElement('DIV'), val;
        for (var attr in attrs) {
            val = attrs[attr];
            if (attr === 'cls') {
                el.setAttribute('class', val);
            } else if (attr === 'style') {
                el.style = val;
            } else if (attr === 'text') {
                el.innerHTML = val;
                last_message = val;
            }
        }
        return el;
    };


    var log_message = function (element) {
        messages.push(element);
    };

    var log_pass = function (message) {
        log_message(mk_log({text: message, cls: 'blend-test-log blend-test-pass-log'}));
    };

    var log_warn = function (message) {
        log_message(mk_log({text: message, cls: 'blend-test-log blend-test-warn-log'}));
    };


    var log_info = function (message) {
        log_message(mk_log({text: message, cls: 'blend-test-log blend-test-info-log'}));
    };

    var log_error = function (message) {
        log_message(mk_log({text: message, cls: 'blend-test-log blend-test-error-log'}));
        statusbar.innerHTML += "<span class='blend-test-error-log'>" + last_message + "</span>";
    };

    var show = function () {
        show_messages();
    };

    var removeEventListener = function (el, eventName, eventHandler) {
        if (el.removeEventListener) {
            el.removeEventListener(eventName, eventHandler, false);
        }
        if (el.detachEvent) {
            el.detachEvent('on' + eventName, eventHandler);
        }
    };

    var addEventListener = function (el, eventName, eventHandler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, eventHandler, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + eventName, eventHandler);
        }
    };

    var getQueryParam = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    return this;

}).apply(BlendTest);