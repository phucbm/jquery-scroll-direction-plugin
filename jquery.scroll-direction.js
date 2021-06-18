/**
 * jQuery Scroll Direction Plugin 1.1.0
 * https://github.com/phucbm/jquery-scroll-direction-plugin
 *
 * MIT License | Copyright (c) 2020 Minh-Phuc Bui
 */

(function ($) {
    "use strict";

    let obj = {},
        pluginActive = false,
        $w = $(window),
        settings = {
            topOffset: () => 0,
            bottomOffset: () => 0,
            atBottomIsAtMiddle: true,
            indicator: true,
            indicatorElement: $("body"),
            scrollUpClass: "scroll-up",
            scrollDownClass: "scroll-down",
            scrollAtTopClass: "scroll-top",
            scrollAtMiddleClass: "scroll-middle",
            scrollAtBottomClass: "scroll-bottom",
            extraIndicators: {},
            scrollAmount: () => $w.scrollTop(),
            maxScrollAmount: () => $(document).height() - $w.height(),
            hijacking: false, // turn this on to run update() in custom event
        },
        lastScrollAmount = false;

    // Method: init()
    obj.init = function (options) {
        pluginActive = true;
        settings = $.extend(settings, options);
        console.log(settings);
    };

    // Method: update() for custom hijacking event
    obj.update = function (options) {
        settings = $.extend(settings, options);

        // on hijacking
        if (settings.hijacking) {
            update();
        }
    };

    // APIs
    obj.isScrollUp = false;
    obj.isScrollDown = false;
    obj.isScrollAtTop = false;
    obj.isScrollAtMiddle = false;
    obj.isScrollAtBottom = false;

    // Events
    let scrollDirection = $.Event("scrollDirection"),
        scrollDown = $.Event("scrollDown"),
        scrollUp = $.Event("scrollUp"),
        scrollAtTop = $.Event("scrollAtTop"),
        scrollAtMiddle = $.Event("scrollAtMiddle"),
        scrollAtBottom = $.Event("scrollAtBottom");

    // Indicator: add class to indicate the scrolling status
    function indicator(options) {
        if (settings.indicator) {
            let indicators = $.extend({
                    "values": [
                        obj.isScrollUp,
                        obj.isScrollDown,
                        obj.isScrollAtTop,
                        obj.isScrollAtMiddle,
                        obj.isScrollAtBottom
                    ],
                    "classes": [
                        settings.scrollUpClass,
                        settings.scrollDownClass,
                        settings.scrollAtTopClass,
                        settings.scrollAtMiddleClass,
                        settings.scrollAtBottomClass
                    ]
                }, options),
                i = 0,
                l = indicators.values.length;

            for (i; i < l; i++) {
                if (indicators.values[i]) {
                    settings.indicatorElement.addClass(indicators.classes[i]);
                } else {
                    settings.indicatorElement.removeClass(indicators.classes[i]);
                }
            }
        }
    }

    // update
    function update() {
        if (pluginActive) {
            // check scroll directions
            if (settings.scrollAmount() > lastScrollAmount && lastScrollAmount >= 0) {
                // scroll down
                obj.isScrollUp = false;
                obj.isScrollDown = true;

                $w.trigger(scrollDown);
            } else if (settings.scrollAmount() < lastScrollAmount && lastScrollAmount >= 0) {
                // scroll up
                obj.isScrollUp = true;
                obj.isScrollDown = false;

                $w.trigger(scrollUp);
            } else if (settings.scrollAmount() < 0) {
                // scroll up (elastic scroll with negative value)
                obj.isScrollUp = true;
                obj.isScrollDown = false;

                $w.trigger(scrollUp);
            } else if (settings.scrollAmount() > settings.maxScrollAmount()) {
                // scroll down (elastic scroll with positive value)
                obj.isScrollUp = false;
                obj.isScrollDown = true;

                $w.trigger(scrollDown);
            }

            // update the last position
            lastScrollAmount = settings.scrollAmount();

            // check scroll positions
            if (settings.scrollAmount() <= settings.topOffset()) {
                // at top
                obj.isScrollAtTop = true;
                obj.isScrollAtMiddle = false;
                obj.isScrollAtBottom = false;

                $w.trigger(scrollAtTop);
            } else if (
                settings.scrollAmount() >= settings.maxScrollAmount() - settings.bottomOffset() &&
                settings.scrollAmount() <= settings.maxScrollAmount()
            ) {
                // at bottom
                obj.isScrollAtTop = false;
                obj.isScrollAtMiddle = false;
                obj.isScrollAtBottom = true;

                $w.trigger(scrollAtBottom);

                if (settings.atBottomIsAtMiddle) {
                    obj.isScrollAtMiddle = true;
                    $w.trigger(scrollAtMiddle);
                }
            } else {
                // at middle
                obj.isScrollAtTop = false;
                obj.isScrollAtMiddle = true;
                obj.isScrollAtBottom = false;

                $w.trigger(scrollAtMiddle);
            }

            // Indicator
            indicator();

            // Extra indicators
            let i = 0,
                l = settings.extraIndicators.length;
            for (i; i < l; i++) {
                indicator({
                    "values": [settings.scrollAmount() >= settings.extraIndicators[i]["element"].offset().top],
                    "classes": [settings.extraIndicators[i]["class"]]
                });
            }

            $w.trigger(scrollDirection);
        }
    }

    // update on window events
    if (!settings.hijacking) {
        $w.on("load scroll resize", function () {
            // update values
            update();
        });
    }

    // Only assign to jQuery.scrollDirection if jQuery is loaded
    if (jQuery) {
        jQuery.scrollDirection = obj;
    }
})(jQuery);