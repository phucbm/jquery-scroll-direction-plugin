# Scroll Direction v1.0.1
A lightweight jQuery plugin to detect scroll direction.

**[View the informative Demo on CodePen &rarr;](https://codepen.io/phucbui/pen/yLaeqBw)**

**[A Sticky Menu using Scroll Direction &rarr;](https://codepen.io/phucbui/pen/yLaeqBw)**

## Getting started

### 1. Include Scroll Direction to your site.

**Direct Download**

You can [download the plugin directly from Github](https://raw.githubusercontent.com/phucbm/jquery-scroll-direction-plugin/main/jquery.scroll-direction.js).

```html
<script src="your-path/jquery.scroll-direction.js"></script>
```

**CDN** [![](https://data.jsdelivr.com/v1/package/gh/phucbm/jquery-scroll-direction-plugin/badge)](https://www.jsdelivr.com/package/gh/phucbm/jquery-scroll-direction-plugin)

You can also browse for the latest version by visiting [Scroll Direction on jsDelivr](https://cdn.jsdelivr.net/gh/phucbm/jquery-scroll-direction-plugin/)

```html
<!-- Scroll Direction - v1.0.1 -->
<script src="https://cdn.jsdelivr.net/gh/phucbm/jquery-scroll-direction-plugin@1.0.1/jquery.scroll-direction.js"></script>

<!-- Scroll Direction - v1.0.1 - minified -->
<script src="https://cdn.jsdelivr.net/gh/phucbm/jquery-scroll-direction-plugin@1.0.1/jquery.scroll-direction.min.js"></script>
```

### 2. Initialize Scroll Direction

You have to init the plugin before do anything else.

```js
// init Scroll Direction
$.scrollDirection.init();
```

## Usage

### 1. Methods

- `$.scrollDirection.init()`

```js
// init Scroll Direction with full settings
$.scrollDirection.init({
    // Offset
    topOffset: 0, // Integer. Height of top zone in pixel.
    bottomOffset: 0, // Integer. Height of bottom zone in pixel.
    atBottomIsAtMiddle: true, // Boolean. By default, consider bottom zone is also middle zone.

    // Add class to indicate the scroll direction
    indicator: true, // Boolean. Turn indicator on/off.
    indicatorElement: $("body"), // jQuery element. Add all indicator classes to this element.
    scrollUpClass: "scroll-up", // scrolling up
    scrollDownClass: "scroll-down", // scrolling down
    scrollAtTopClass: "scroll-top",  // at top zone
    scrollAtMiddleClass: "scroll-middle", // at middle zone
    scrollAtBottomClass: "scroll-bottom", // at bottom zone

    // Add a class to indicatorElement when scroll pass the element
    extraIndicators: {
        "element": $("#your-element"), // jQuery element
        "class": "scroll-pass-element", // String.
    }
});
```

### 2. Events

```js
// this event runs whenever you load, resize and scroll
$(window).on("scrollDirection", function () {
  // do your job here
});

// when you scroll up
$(window).on("scrollUp", function () {});

// when you scroll down
$(window).on("scrollDown", function () {});

// when you at the beginning of the page, you can increase the top zone using topOffset
$(window).on("scrollAtTop", function () {});

// when you in the middle of the page 
// this means the top and bottom zone are not visible in view port
$(window).on("scrollAtMiddle", function () {});

// when you touch the end of the page
$(window).on("scrollAtBottom", function () {});
```

### 3. APIs

You can also check the current scroll direction/position using these provided APIs.

- `$.scrollDirection.isScrollUp`
- `$.scrollDirection.isScrollDown`
- `$.scrollDirection.isScrollAtTop`
- `$.scrollDirection.isScrollAtMiddle`
- `$.scrollDirection.isScrollAtBottom`

```js
if($.scrollDirection.isScrollUp){
    // do something
}
```
