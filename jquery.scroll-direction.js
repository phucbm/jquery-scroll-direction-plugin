/**
 * jQuery Scroll Direction Plugin 1.0.0
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
      extraTopOffset: {}
    };

  // Events
  let scrollIndicator = $.Event("scrollIndicator"),
    scrollDown = $.Event("scrollDown"),
    scrollUp = $.Event("scrollUp"),
    scrollAtTop = $.Event("scrollAtTop"),
    scrollAtMiddle = $.Event("scrollAtMiddle"),
    scrollAtBottom = $.Event("scrollAtBottom");

  // Method: init()
  obj.init = function (options) {
    pluginActive = true;
    // update settings
    settings = $.extend(settings, options);
  };

  // Method: destroy()
  obj.destroy = function () {
    pluginActive = false;
  };

  // APIs
  obj.isScrollingUp = false;
  obj.isScrollingDown = false;
  obj.isScrollAtTop = false;
  obj.isScrollAtMiddle = false;
  obj.isScrollAtBottom = false;

  // Indicator: add class to indicate the scrolling status
  function indicator(groupIndicators, classIndicators) {
    if (settings.indicator) {
      let i = 0,
        l = groupIndicators.length;
      for (i; i < l; i++) {
        if (groupIndicators[i]) {
          settings.indicatorElement.addClass(classIndicators[i]);
        } else {
          settings.indicatorElement.removeClass(classIndicators[i]);
        }
      }
    }
  }

  // Main process
  let $w = $(window),
    lastPosition = false,
    scrollAmount = $w.scrollTop(),
    maxScrollAmount = $(document).height() - $w.height();
  $w.on("load scroll resize", function () {
    if (pluginActive) {
      // update values
      scrollAmount = $w.scrollTop();

      // check scroll directions
      if (scrollAmount > lastPosition && lastPosition >= 0) {
        // scroll down
        obj.isScrollingUp = false;
        obj.isScrollingDown = true;

        $w.trigger(scrollDown);
      } else if (scrollAmount < lastPosition && lastPosition >= 0) {
        // scroll up
        obj.isScrollingUp = true;
        obj.isScrollingDown = false;

        $w.trigger(scrollUp);
      } else if (scrollAmount < 0) {
        // elastic scroll: negative value
        obj.isScrollingUp = true;
        obj.isScrollingDown = false;

        $w.trigger(scrollUp);
      } else if (scrollAmount > maxScrollAmount) {
        // elastic scroll: position value
        obj.isScrollingUp = false;
        obj.isScrollingDown = true;

        $w.trigger(scrollDown);
      }

      // update the last position
      lastPosition = scrollAmount;

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
      indicator(
        [
          obj.isScrollingUp,
          obj.isScrollingDown,
          obj.isScrollAtTop,
          obj.isScrollAtMiddle,
          obj.isScrollAtBottom
        ],
        [
          settings.scrollUpClass,
          settings.scrollDownClass,
          settings.scrollAtTopClass,
          settings.scrollAtMiddleClass,
          settings.scrollAtBottomClass
        ]
      );

      // extra top offset
      let i = 0,
        l = settings.extraTopOffset.length;
      for (i; i < l; i++) {
        if (
          scrollAmount >= settings.extraTopOffset[i]["element"].offset().top
        ) {
          settings.indicatorElement.addClass(
            settings.extraTopOffset[i]["indicator"]
          );
        } else {
          settings.indicatorElement.removeClass(
            settings.extraTopOffset[i]["indicator"]
          );
        }
      }

      $w.trigger(scrollIndicator);
    }
  });

  // Only assign to jQuery.scrollIndicator if jQuery is loaded
  if (jQuery) {
    jQuery.scrollIndicator = obj;
  }
})(jQuery);
