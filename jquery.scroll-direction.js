/**!
 * jQuery Scroll Direction Plugin 2.0.0
 * https://github.com/phucbm/jquery-scroll-direction-plugin
 *
 * Released under the MIT license
 * Date: 2022-02-08
 */

(function($){
    "use strict";

    let obj = {},
        pluginActive = false,
        hasJquery = typeof jQuery !== 'undefined',
        $w = hasJquery ? $(window) : '',
        settings = {
            topOffset: () => 0,
            bottomOffset: () => 0,
            atBottomIsAtMiddle: true,
            indicator: true,
            indicatorElement: document.querySelector('body'),
            scrollUpClass: "scroll-up",
            scrollDownClass: "scroll-down",
            scrollAtTopClass: "scroll-top",
            scrollAtMiddleClass: "scroll-middle",
            scrollAtBottomClass: "scroll-bottom",
            extraIndicators: {},
            scrollAmount: () => (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
            maxScrollAmount: () => $(document).height() - (window.innerHeight || document.documentElement.clientHeight),
            hijacking: false, // turn this on to run update() in custom event
        },
        lastScrollAmount = false;

    // Method: init()
    obj.init = function(options){
        pluginActive = true;
        settings = {...settings, ...options};
    };

    // Method: update() for custom hijacking event
    obj.update = function(options){
        settings = {...settings, ...options};

        // on hijacking
        if(settings.hijacking){
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
    const scrollDirection = new Event("scrollDirection"),
        scrollDown = new Event("scrollDown"),
        scrollUp = new Event("scrollUp"),
        scrollAtTop = new Event("scrollAtTop"),
        scrollAtMiddle = new Event("scrollAtMiddle"),
        scrollAtBottom = new Event("scrollAtBottom");

    // jQuery support
    let scrollDirectionJquery, scrollDownJquery, scrollUpJquery, scrollAtTopJquery, scrollAtMiddleJquery,
        scrollAtBottomJquery;
    if(hasJquery){
        scrollDirectionJquery = $.Event("scrollDirection");
        scrollDownJquery = $.Event("scrollDown");
        scrollUpJquery = $.Event("scrollUp");
        scrollAtTopJquery = $.Event("scrollAtTop");
        scrollAtMiddleJquery = $.Event("scrollAtMiddle");
        scrollAtBottomJquery = $.Event("scrollAtBottom");
    }

    // Indicator: add class to indicate the scrolling status
    function indicator(options){
        if(settings.indicator){
            let indicators = {
                    ...{
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
                    }, ...options
                },
                i = 0,
                l = indicators.values.length;

            for(i; i < l; i++){
                if(indicators.values[i]){
                    settings.indicatorElement.classList.add(indicators.classes[i]);
                }else{
                    settings.indicatorElement.classList.remove(indicators.classes[i]);
                }
            }
        }
    }

    // update
    function update(e){
        if(pluginActive){
            // check scroll directions
            if(settings.scrollAmount() > lastScrollAmount && lastScrollAmount >= 0){
                // scroll down
                obj.isScrollUp = false;
                obj.isScrollDown = true;

                if(hasJquery) $w.trigger(scrollDownJquery);
                document.dispatchEvent(scrollDown);
            }else if(settings.scrollAmount() < lastScrollAmount && lastScrollAmount >= 0){
                // scroll up
                obj.isScrollUp = true;
                obj.isScrollDown = false;

                if(hasJquery) $w.trigger(scrollUpJquery);
                document.dispatchEvent(scrollUp);
            }else if(settings.scrollAmount() < 0){
                // scroll up (elastic scroll with negative value)
                obj.isScrollUp = true;
                obj.isScrollDown = false;

                if(hasJquery) $w.trigger(scrollUpJquery);
                document.dispatchEvent(scrollUp);
            }else if(settings.scrollAmount() > settings.maxScrollAmount()){
                // scroll down (elastic scroll with positive value)
                obj.isScrollUp = false;
                obj.isScrollDown = true;

                if(hasJquery) $w.trigger(scrollDownJquery);
                document.dispatchEvent(scrollDown);
            }

            // update the last position
            lastScrollAmount = settings.scrollAmount();

            // check scroll positions
            if(settings.scrollAmount() <= settings.topOffset()){
                // at top
                obj.isScrollAtTop = true;
                obj.isScrollAtMiddle = false;
                obj.isScrollAtBottom = false;

                if(hasJquery) $w.trigger(scrollAtTopJquery);
                document.dispatchEvent(scrollAtTop);
            }else if(
                settings.scrollAmount() >= settings.maxScrollAmount() - settings.bottomOffset() &&
                settings.scrollAmount() <= settings.maxScrollAmount()
            ){
                // at bottom
                obj.isScrollAtTop = false;
                obj.isScrollAtMiddle = false;
                obj.isScrollAtBottom = true;

                if(hasJquery) $w.trigger(scrollAtBottomJquery);
                document.dispatchEvent(scrollAtBottom);

                if(settings.atBottomIsAtMiddle){
                    obj.isScrollAtMiddle = true;

                    if(hasJquery) $w.trigger(scrollAtMiddleJquery);
                    document.dispatchEvent(scrollAtMiddle);
                }
            }else{
                // at middle
                obj.isScrollAtTop = false;
                obj.isScrollAtMiddle = true;
                obj.isScrollAtBottom = false;

                if(hasJquery) $w.trigger(scrollAtMiddleJquery);
                document.dispatchEvent(scrollAtMiddle);
            }

            // Indicator
            indicator();

            // Extra indicators
            let i = 0,
                l = settings.extraIndicators.length;
            for(i; i < l; i++){
                indicator({
                    "values": [settings.scrollAmount() >= settings.extraIndicators[i]["element"].offset().top],
                    "classes": [settings.extraIndicators[i]["class"]]
                });
            }

            if(hasJquery) $w.trigger(scrollDirectionJquery);
            document.dispatchEvent(scrollDirection);
        }
    }

    // update on window events
    if(!settings.hijacking){
        window.addEventListener('load', e => update(e));
        window.addEventListener('scroll', e => update(e));
        window.addEventListener('resize', e => update(e));
    }

    // for manual, jQuery-free
    window.scrollDirection = obj;

    // Only assign to jQuery.scrollDirection if jQuery is loaded
    if(hasJquery){
        jQuery.scrollDirection = window.scrollDirection;
    }

    return window.scrollDirection;
})(jQuery);