import { newE2EPage } from '@stencil/core/testing';

// Since we are currently using a pre-release of Stencil to get access
// to Puppeteer, documentation is lacking.
//
// Methods and properties for E2EElement (v0.13.0-9):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/testing/puppeteer/puppeteer-declarations.ts#L78
//
// Matchers (expect-methods) for E2EElement (v0.13.0-9):
// https://github.com/ionic-team/stencil/blob/a0250ffcbf5a2c657475a05052eac3a4690809d2/src/declarations/testing.ts#L5

describe('limel-button', () => {
    let page;
    describe('with a label', () => {
        let limelButton;
        let innerButton;
        beforeEach(async () => {
            page = await createPage(`
                <limel-button label="Save"></limel-button>
            `);
            limelButton = await page.find('limel-button');
            innerButton = await page.find('limel-button>>>button');
        });
        it('displays the correct label', () => {
            expect(innerButton).toEqualText('Save');
        });

        describe('when changing the label', () => {
            beforeEach(async () => {
                limelButton.setProperty('label', 'new label');
                await page.waitForChanges();
            });
            it('displays the new label', async () => {
                expect(innerButton).toEqualText('new label');
            });
        });
    });

    describe('when the attribute `primary`', () => {
        describe('is not set', () => {
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save"></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('is non-primary', () => {
                expect(innerButton).toHaveClass('mdc-button');
                expect(innerButton).not.toHaveClass('mdc-button--unelevated');
            });
            it('the property is falsy', async () => {
                const propValue = await limelButton.getProperty('primary');
                expect(propValue).toBeFalsy();
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('primary', true);
                    await page.waitForChanges();
                });

                it('is primary', () => {
                    expect(innerButton).toHaveClasses([
                        'mdc-button',
                        'mdc-button--unelevated',
                    ]);
                });
                it('the property is `true`', async () => {
                    const propValue = await limelButton.getProperty('primary');
                    expect(propValue).toBe(true);
                });
            });
        });

        describe('is set', () => {
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save" primary></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('is primary', () => {
                expect(innerButton).toHaveClasses([
                    'mdc-button',
                    'mdc-button--unelevated',
                ]);
            });
            it('the property is `true`', async () => {
                const propValue = await limelButton.getProperty('primary');
                expect(propValue).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('primary', false);
                    await page.waitForChanges();
                });

                it('is non-primary', () => {
                    expect(innerButton).toHaveClass('mdc-button');
                    expect(innerButton).not.toHaveClass(
                        'mdc-button--unelevated'
                    );
                });
                it('the property is falsy', async () => {
                    const propValue = await limelButton.getProperty('primary');
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });

    describe('when the attribute `disabled`', () => {
        describe('is not set', () => {
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save"></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('is enabled', async () => {
                const propValue = await innerButton.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });
            it('the property is falsy', async () => {
                const propValue = await limelButton.getProperty('disabled');
                expect(propValue).toBeFalsy();
            });

            describe('when setting the property to `true`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('disabled', true);
                    await page.waitForChanges();
                });

                it('is disabled', async () => {
                    const propValue = await innerButton.getProperty('disabled');
                    expect(propValue).toBe(true);
                });
                it('the property is `true`', async () => {
                    const propValue = await limelButton.getProperty('disabled');
                    expect(propValue).toBe(true);
                });
            });
        });

        describe('is set', () => {
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                page = await createPage(`
                    <limel-button label="Save" disabled></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('is disabled', async () => {
                const propValue = await innerButton.getProperty('disabled');
                expect(propValue).toBe(true);
            });
            it('the property is `true`', async () => {
                const propValue = await limelButton.getProperty('disabled');
                expect(propValue).toBe(true);
            });

            describe('when setting the property to `false`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('disabled', false);
                    await page.waitForChanges();
                });

                it('is enabled', async () => {
                    const propValue = await innerButton.getProperty('disabled');
                    expect(propValue).toBeFalsy();
                });
                it('the property is falsy', async () => {
                    const propValue = await limelButton.getProperty('disabled');
                    expect(propValue).toBeFalsy();
                });
            });
        });
    });

    describe('when the attribute `loading`', () => {
        describe('is not set', () => {
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                page = await createPageWithFakeTimers(`
                    <limel-button label="Save"></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it('the state is "not loading"', () => {
                expect(innerButton).not.toHaveClass('loading');
                expect(innerButton).not.toHaveClass('just-loaded');
            });
            it('the property is falsy', async () => {
                const propValue = await limelButton.getProperty('loading');
                expect(propValue).toBeFalsy();
            });

            describe.skip('when setting the property to `true`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('loading', true);
                    await page.waitForChanges();
                });
                it('the state is "loading"', () => {
                    expect(innerButton).toHaveClass('loading');
                    expect(innerButton).not.toHaveClass('just-loaded');
                });
                it('the property is `true`', async () => {
                    const propValue = await limelButton.getProperty('loading');
                    expect(propValue).toBe(true);
                });

                describe('and then setting the property to `false`', () => {
                    beforeEach(async () => {
                        limelButton.setProperty('loading', false);
                        await page.waitForChanges();
                    });
                    it('the visual state becomes "just-loaded"', () => {
                        expect(innerButton).not.toHaveClass('loading');
                        expect(innerButton).toHaveClass('just-loaded');
                    });
                    it('the property is falsy', async () => {
                        const propValue = await limelButton.getProperty(
                            'loading'
                        );
                        expect(propValue).toBeFalsy();
                    });
                    describe('after 2 seconds', () => {
                        beforeEach(async () => {
                            await page.evaluate(() => {
                                window['clock'].tick(2000);
                            });
                            await page.waitForChanges();
                        });
                        it('the visual state becomes "not loading" after 2 seconds', () => {
                            expect(innerButton).not.toHaveClass('loading');
                            expect(innerButton).not.toHaveClass('just-loaded');
                        });
                    });
                });
            });
        });
        describe('is set', () => {
            let limelButton;
            let innerButton;
            beforeEach(async () => {
                page = await createPageWithFakeTimers(`
                    <limel-button label="Save" loading></limel-button>
                `);
                limelButton = await page.find('limel-button');
                innerButton = await page.find('limel-button>>>button');
            });
            it.skip('the state is "loading"', () => {
                expect(innerButton).toHaveClass('loading');
                expect(innerButton).not.toHaveClass('just-loaded');
            });
            it('the property is `true`', async () => {
                const propValue = await limelButton.getProperty('loading');
                expect(propValue).toBe(true);
            });

            describe.skip('when setting the property to `false`', () => {
                beforeEach(async () => {
                    limelButton.setProperty('loading', false);
                    await page.waitForChanges();
                });
                it('the visual state becomes "just-loaded"', () => {
                    expect(innerButton).not.toHaveClass('loading');
                    expect(innerButton).toHaveClass('just-loaded');
                });
                it('the property is falsy', async () => {
                    const propValue = await limelButton.getProperty('loading');
                    expect(propValue).toBeFalsy();
                });

                describe('after 2 seconds', () => {
                    beforeEach(async () => {
                        await page.evaluate(() => {
                            window['clock'].tick(2000);
                        });
                        await page.waitForChanges();
                    });
                    it('the visual state becomes "not loading" after 2 seconds', () => {
                        expect(innerButton).not.toHaveClass('loading');
                        expect(innerButton).not.toHaveClass('just-loaded');
                    });
                });

                describe('and then setting the property to `true`', () => {
                    beforeEach(async () => {
                        limelButton.setProperty('loading', true);
                        await page.waitForChanges();
                    });
                    it.skip('the visual state becomes "loading"', () => {
                        expect(innerButton).toHaveClass('loading');
                        expect(innerButton).not.toHaveClass('just-loaded');
                    });
                    it('the property is `true`', async () => {
                        const propValue = await limelButton.getProperty(
                            'loading'
                        );
                        expect(propValue).toBe(true);
                    });
                });
            });
        });
    });
});

async function createPageWithFakeTimers(content) {
    const page = await createPage(content);
    await page.addScriptTag({ content: lolex() });
    await page.evaluate(() => {
        window['clock'] = window['lolex'].install();
    });
    return page;
}

async function createPage(content) {
    return newE2EPage({ html: content });
}

function lolex() {
    /**
     * Minified by jsDelivr using UglifyJS v3.4.4.
     * Original file: https://cdn.jsdelivr.net/npm/lolex@2.7.5/lolex.js
     */
    return `!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).lolex=e()}}(function(){var define,module,exports;return function i(a,l,c){function s(t,e){if(!l[t]){if(!a[t]){var r="function"==typeof require&&require;if(!e&&r)return r(t,!0);if(m)return m(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var o=l[t]={exports:{}};a[t][0].call(o.exports,function(e){return s(a[t][1][e]||e)},o,o.exports,i,a,l,c)}return l[t].exports}for(var m="function"==typeof require&&require,e=0;e<c.length;e++)s(c[e]);return s}({1:[function(require,module,exports){(function(global){"use strict";function withGlobal(_global){var userAgent=_global.navigator&&_global.navigator.userAgent,isRunningInIE=userAgent&&-1<userAgent.indexOf("MSIE "),maxTimeout=Math.pow(2,31)-1;isRunningInIE&&(_global.setTimeout=_global.setTimeout,_global.clearTimeout=_global.clearTimeout,_global.setInterval=_global.setInterval,_global.clearInterval=_global.clearInterval,_global.Date=_global.Date),void 0!==_global.setImmediate&&(_global.setImmediate=_global.setImmediate,_global.clearImmediate=_global.clearImmediate);var NOOP=function(){},timeoutResult=_global.setTimeout(NOOP,0),addTimerReturnsObject="object"==typeof timeoutResult,hrtimePresent=_global.process&&"function"==typeof _global.process.hrtime,nextTickPresent=_global.process&&"function"==typeof _global.process.nextTick,performancePresent=_global.performance&&"function"==typeof _global.performance.now,hasPerformancePrototype=_global.Performance&&(typeof _global.Performance).match(/^(function|object)$/),requestAnimationFramePresent=_global.requestAnimationFrame&&"function"==typeof _global.requestAnimationFrame,cancelAnimationFramePresent=_global.cancelAnimationFrame&&"function"==typeof _global.cancelAnimationFrame;_global.clearTimeout(timeoutResult);var NativeDate=_global.Date,uniqueTimerId=1;function isNumberFinite(e){return Number.isFinite?Number.isFinite(e):"number"==typeof e&&isFinite(e)}function parseTime(e){if(!e)return 0;var t,r=e.split(":"),n=r.length,o=n,i=0;if(3<n||!/^(\d\d:){0,2}\d\d?$/.test(e))throw new Error("tick only understands numbers, 'm:s' and 'h:m:s'. Each part must be two digits");for(;o--;){if(60<=(t=parseInt(r[o],10)))throw new Error("Invalid time "+e);i+=t*Math.pow(60,n-o-1)}return 1e3*i}function fixedFloor(e){return 0<=e?Math.floor(e):Math.ceil(e)}function fixedModulo(e,t){return Math.round((e%t+t)%t)}function getEpoch(e){if(!e)return 0;if("function"==typeof e.getTime)return e.getTime();if("number"==typeof e)return e;throw new TypeError("now should be milliseconds since UNIX epoch")}function inRange(e,t,r){return r&&r.callAt>=e&&r.callAt<=t}function mirrorDateProperties(e,t){var r;for(r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return t.now?e.now=function(){return e.clock.now}:delete e.now,t.toSource?e.toSource=function(){return t.toSource()}:delete e.toSource,e.toString=function(){return t.toString()},e.prototype=t.prototype,e.parse=t.parse,e.UTC=t.UTC,e.prototype.toUTCString=t.prototype.toUTCString,e}function createDate(){return mirrorDateProperties(function e(t,r,n,o,i,a,l){switch(arguments.length){case 0:return new NativeDate(e.clock.now);case 1:return new NativeDate(t);case 2:return new NativeDate(t,r);case 3:return new NativeDate(t,r,n);case 4:return new NativeDate(t,r,n,o);case 5:return new NativeDate(t,r,n,o,i);case 6:return new NativeDate(t,r,n,o,i,a);default:return new NativeDate(t,r,n,o,i,a,l)}},NativeDate)}function enqueueJob(e,t){e.jobs||(e.jobs=[]),e.jobs.push(t)}function runJobs(e){if(e.jobs){for(var t=0;t<e.jobs.length;t++){var r=e.jobs[t];if(r.func.apply(null,r.args),e.loopLimit&&t>e.loopLimit)throw new Error("Aborting after running "+e.loopLimit+" timers, assuming an infinite loop!")}e.jobs=[]}}function addTimer(e,t){if(void 0===t.func)throw new Error("Callback must be provided to timer calls");if(t.type=t.immediate?"Immediate":"Timeout",t.hasOwnProperty("delay")&&(isNumberFinite(t.delay)||(t.delay=0),t.delay=t.delay>maxTimeout?1:t.delay,t.delay=Math.max(0,t.delay)),t.hasOwnProperty("interval")&&(t.type="Interval",t.interval=t.interval>maxTimeout?1:t.interval),t.hasOwnProperty("animation")&&(t.type="AnimationFrame",t.animation=!0),e.timers||(e.timers={}),t.id=uniqueTimerId++,t.createdAt=e.now,t.callAt=e.now+(parseInt(t.delay)||(e.duringTick?1:0)),e.timers[t.id]=t,addTimerReturnsObject){var r={id:t.id,ref:function(){return r},unref:function(){return r},refresh:function(){return r}};return r}return t.id}function compareTimers(e,t){return e.callAt<t.callAt?-1:e.callAt>t.callAt?1:e.immediate&&!t.immediate?-1:!e.immediate&&t.immediate?1:e.createdAt<t.createdAt?-1:e.createdAt>t.createdAt?1:e.id<t.id?-1:e.id>t.id?1:void 0}function firstTimerInRange(e,t,r){var n,o=e.timers,i=null;for(n in o)o.hasOwnProperty(n)&&(!inRange(t,r,o[n])||i&&1!==compareTimers(i,o[n])||(i=o[n]));return i}function firstTimer(e){var t,r=e.timers,n=null;for(t in r)r.hasOwnProperty(t)&&(n&&1!==compareTimers(n,r[t])||(n=r[t]));return n}function lastTimer(e){var t,r=e.timers,n=null;for(t in r)r.hasOwnProperty(t)&&(n&&-1!==compareTimers(n,r[t])||(n=r[t]));return n}function callTimer(clock,timer){"number"==typeof timer.interval?clock.timers[timer.id].callAt+=timer.interval:delete clock.timers[timer.id],"function"==typeof timer.func?timer.func.apply(null,timer.args):eval(timer.func)}function clearTimer(e,t,r){if(t&&(e.timers||(e.timers={}),"object"==typeof t&&(t=t.id),e.timers.hasOwnProperty(t))){var n=e.timers[t];if(n.type!==r){var o="AnimationFrame"===r?"cancelAnimationFrame":"clear"+r,i="AnimationFrame"===n.type?"requestAnimationFrame":"set"+n.type;throw new Error("Cannot clear timer: timer created with "+i+"() but cleared with "+o+"()")}delete e.timers[t]}}function uninstall(t,e,r){var n,o,i;for(o=0,i=t.methods.length;o<i;o++)if("hrtime"===(n=t.methods[o])&&e.process)e.process.hrtime=t._hrtime;else if("nextTick"===n&&e.process)e.process.nextTick=t._nextTick;else if("performance"===n)e[n]=t["_"+n];else if(e[n]&&e[n].hadOwnProperty)e[n]=t["_"+n],"clearInterval"===n&&!0===r.shouldAdvanceTime&&e[n](t.attachedInterval);else try{delete e[n]}catch(e){}return t.methods=[],t.timers?Object.keys(t.timers).map(function(e){return t.timers[e]}):[]}function hijackMethod(e,t,r){var n;if(r[t].hadOwnProperty=Object.prototype.hasOwnProperty.call(e,t),r["_"+t]=e[t],"Date"===t){var o=mirrorDateProperties(r[t],e[t]);e[t]=o}else if("performance"===t)e[t]=r[t];else for(n in e[t]=function(){return r[t].apply(r,arguments)},r[t])r[t].hasOwnProperty(n)&&(e[t][n]=r[t][n]);e[t].clock=r}function doIntervalTick(e,t){e.tick(t)}var timers={setTimeout:_global.setTimeout,clearTimeout:_global.clearTimeout,setImmediate:_global.setImmediate,clearImmediate:_global.clearImmediate,setInterval:_global.setInterval,clearInterval:_global.clearInterval,Date:_global.Date};hrtimePresent&&(timers.hrtime=_global.process.hrtime),nextTickPresent&&(timers.nextTick=_global.process.nextTick),performancePresent&&(timers.performance=_global.performance),requestAnimationFramePresent&&(timers.requestAnimationFrame=_global.requestAnimationFrame),cancelAnimationFramePresent&&(timers.cancelAnimationFrame=_global.cancelAnimationFrame);var keys=Object.keys||function(e){var t,r=[];for(t in e)e.hasOwnProperty(t)&&r.push(t);return r};function createClock(e,t){if(e=e||0,t=t||1e3,void 0===NativeDate)throw new Error("The global scope doesn't have a \`Date\` object (see https://github.com/sinonjs/sinon/issues/1852#issuecomment-419622780)");var l={now:getEpoch(e),hrNow:0,timeouts:{},Date:createDate(),loopLimit:t};function r(){return 16-(l.now-e)%16}function c(e){l.hrNow+=e-l.now}if((l.Date.clock=l).setTimeout=function(e,t){return addTimer(l,{func:e,args:Array.prototype.slice.call(arguments,2),delay:t})},l.clearTimeout=function(e){return clearTimer(l,e,"Timeout")},l.nextTick=function(e){return enqueueJob(l,{func:e,args:Array.prototype.slice.call(arguments,1)})},l.setInterval=function(e,t){return t=parseInt(t,10),addTimer(l,{func:e,args:Array.prototype.slice.call(arguments,2),delay:t,interval:t})},l.clearInterval=function(e){return clearTimer(l,e,"Interval")},l.setImmediate=function(e){return addTimer(l,{func:e,args:Array.prototype.slice.call(arguments,1),immediate:!0})},l.clearImmediate=function(e){return clearTimer(l,e,"Immediate")},l.requestAnimationFrame=function(e){var t=addTimer(l,{func:e,delay:r(),args:[l.now+r()],animation:!0});return t.id||t},l.cancelAnimationFrame=function(e){return clearTimer(l,e,"AnimationFrame")},l.runMicrotasks=function(){runJobs(l)},l.tick=function(e){e="number"==typeof e?e:parseTime(e);var t,r,n,o=l.now,i=l.now+e,a=l.now;for(l.duringTick=!0,n=l.now,runJobs(l),n!==l.now&&(o+=l.now-n,i+=l.now-n),t=firstTimerInRange(l,o,i);t&&o<=i;){if(l.timers[t.id]){c(t.callAt),o=t.callAt,l.now=t.callAt,n=l.now;try{runJobs(l),callTimer(l,t)}catch(e){r=r||e}n!==l.now&&(o+=l.now-n,i+=l.now-n,a+=l.now-n)}t=firstTimerInRange(l,a,i),a=o}if(n=l.now,runJobs(l),n!==l.now&&(o+=l.now-n,i+=l.now-n),l.duringTick=!1,t=firstTimerInRange(l,o,i))try{l.tick(i-l.now)}catch(e){r=r||e}else c(i),l.now=i;if(r)throw r;return l.now},l.next=function(){runJobs(l);var e=firstTimer(l);if(!e)return l.now;l.duringTick=!0;try{return c(e.callAt),l.now=e.callAt,callTimer(l,e),runJobs(l),l.now}finally{l.duringTick=!1}},l.runAll=function(){var e;for(runJobs(l),e=0;e<l.loopLimit;e++){if(!l.timers)return l.now;if(0===keys(l.timers).length)return l.now;l.next()}throw new Error("Aborting after running "+l.loopLimit+" timers, assuming an infinite loop!")},l.runToFrame=function(){return l.tick(r())},l.runToLast=function(){var e=lastTimer(l);return e?l.tick(e.callAt-l.now):(runJobs(l),l.now)},l.reset=function(){l.timers={},l.jobs=[],l.now=getEpoch(e),l.hrNow=0},l.setSystemTime=function(e){var t,r,n=getEpoch(e),o=n-l.now;for(t in l.now=n,l.timers)l.timers.hasOwnProperty(t)&&((r=l.timers[t]).createdAt+=o,r.callAt+=o)},performancePresent){if(l.performance=Object.create(null),hasPerformancePrototype){var n=_global.Performance.prototype;Object.getOwnPropertyNames(n).forEach(function(e){l.performance[e]=NOOP})}l.performance.now=function(){return l.hrNow}}return hrtimePresent&&(l.hrtime=function(e){if(Array.isArray(e)){var t=e[0]+e[1]/1e9,r=l.hrNow/1e3-t;return[fixedFloor(r),fixedModulo(1e9*r,1e9)]}return[fixedFloor(l.hrNow/1e3),fixedModulo(1e6*l.hrNow,1e9)]}),l}function install(e){if(1<arguments.length||e instanceof Date||Array.isArray(e)||"number"==typeof e)throw new TypeError("lolex.install called with "+String(e)+" lolex 2.0+ requires an object parameter - see https://github.com/sinonjs/lolex");var t,r;(e=void 0!==e?e:{}).shouldAdvanceTime=e.shouldAdvanceTime||!1,e.advanceTimeDelta=e.advanceTimeDelta||20;var n=e.target||_global,o=createClock(e.now,e.loopLimit);for(o.uninstall=function(){return uninstall(o,n,e)},o.methods=e.toFake||[],0===o.methods.length&&(o.methods=keys(timers).filter(function(e){return"nextTick"!==e})),t=0,r=o.methods.length;t<r;t++)if("hrtime"===o.methods[t])n.process&&"function"==typeof n.process.hrtime&&hijackMethod(n.process,o.methods[t],o);else if("nextTick"===o.methods[t])n.process&&"function"==typeof n.process.nextTick&&hijackMethod(n.process,o.methods[t],o);else{if("setInterval"===o.methods[t]&&!0===e.shouldAdvanceTime){var i=doIntervalTick.bind(null,o,e.advanceTimeDelta),a=n[o.methods[t]](i,e.advanceTimeDelta);o.attachedInterval=a}hijackMethod(n,o.methods[t],o)}return o}return{timers:timers,createClock:createClock,install:install,withGlobal:withGlobal}}var defaultImplementation=withGlobal(global||window);exports.timers=defaultImplementation.timers,exports.createClock=defaultImplementation.createClock,exports.install=defaultImplementation.install,exports.withGlobal=withGlobal}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1])(1)});`;
}
