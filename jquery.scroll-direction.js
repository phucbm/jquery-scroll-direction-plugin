/**
 * jQuery Scroll Direction Plugin 1.0.0
 * https://github.com/phucbm/jquery-scroll-direction-plugin
 *
 * MIT License | Copyright (c) 2020 Minh-Phuc Bui
 */

(function ($) {
    "use strict";

    let obj = {},
        pluginActive = false,
        settings = {
            topOffset: 0,
            bottomOffset: 0,
            atBottomIsAtMiddle: true,
            indicator: true,
            indicatorElement: $("body"),
            scrollUpClass: "scroll-up",
            scrollDownClass: "scroll-down",
            scrollAtTopClass: "scroll-top",
            scrollAtMiddleClass: "scroll-middle",
            scrollAtBottomClass: "scroll-bottom",
            extraIndicators: {}
        };

    // Method: init()
    obj.init = function (options) {
        pluginActive = true;
        // update settings
        settings = $.extend(settings, options);
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

    // Main process
    let $w = $(window),
        lasScrollAmount = false,
        scrollAmount = $w.scrollTop(),
        maxScrollAmount = $(document).height() - $w.height();
    $w.on("load scroll resize", function () {
        if (pluginActive) {
            // update values
            scrollAmount = $w.scrollTop();

            // check scroll directions
            if (scrollAmount > lasScrollAmount && lasScrollAmount >= 0) {
                // scroll down
                obj.isScrollUp = false;
                obj.isScrollDown = true;

                $w.trigger(scrollDown);
            } else if (scrollAmount < lasScrollAmount && lasScrollAmount >= 0) {
                // scroll up
                obj.isScrollUp = true;
                obj.isScrollDown = false;

                $w.trigger(scrollUp);
            } else if (scrollAmount < 0) {
                // elastic scroll: negative value
                obj.isScrollUp = true;
                obj.isScrollDown = false;

                $w.trigger(scrollUp);
            } else if (scrollAmount > maxScrollAmount) {
                // elastic scroll: position value
                obj.isScrollUp = false;
                obj.isScrollDown = true;

                $w.trigger(scrollDown);
            }

            // update the last position
            lasScrollAmount = scrollAmount;

            // check scroll positions
            if (scrollAmount <= settings.topOffset) {
                // at top
                obj.isScrollAtTop = true;
                obj.isScrollAtMiddle = false;
                obj.isScrollAtBottom = false;

                $w.trigger(scrollAtTop);
            } else if (
                scrollAmount >= maxScrollAmount - settings.bottomOffset &&
                scrollAmount <= maxScrollAmount
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
                    "values": [scrollAmount >= settings.extraIndicators[i]["element"].offset().top],
                    "classes": [settings.extraIndicators[i]["class"]]
                });
            }

            $w.trigger(scrollDirection);
        }
    });

    // Only assign to jQuery.scrollDirection if jQuery is loaded
    if (jQuery) {
        jQuery.scrollDirection = obj;
    }
})(jQuery);
