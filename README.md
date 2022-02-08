<div align="center">
 <img width="100px" src="https://raw.githubusercontent.com/phucbm/scroll-direction/main/logo.svg" align="center" alt="Scroll Direction" />
 <h1 align="center">Scroll Direction</h1>
 <p align="center">A lightweight jQuery plugin to detect scroll direction on your website. </p>
</div>

<div align="center">
   <a href="https://github.com/phucbm/https://badgen.net/github/release/phucbm/jquery-scroll-direction-plugin/?cache=600/releases/latest">
   <img src="https://badgen.net/github/release/phucbm/jquery-scroll-direction-plugin/?cache=600/?cache=600">
   </a>
    <a href="https://www.jsdelivr.com/package/gh/phucbm/jquery-scroll-direction-plugin">
   <img src="https://data.jsdelivr.com/v1/package/gh/phucbm/jquery-scroll-direction-plugin/badge">
   </a>
 </div>

> **Update**: Scroll Direction now works with other libraries that hijack the native scrollbar (like Locomotive Scroll).

**[View demo on CodePen &rarr;](https://codepen.io/phucbui/pen/yLaeqBw)**

## Getting started

### Download locally

You
can [download the plugin directly from Github](https://raw.githubusercontent.com/phucbm/jquery-scroll-direction-plugin/main/jquery.scroll-direction.js)
.

```html

<script src="your-path/jquery.scroll-direction.js"></script>
```

### Using CDN

You can also browse for the latest version by
visiting [Scroll Direction on jsDelivr](https://cdn.jsdelivr.net/gh/phucbm/jquery-scroll-direction-plugin/)

```html
<!-- Scroll Direction - v1.1.0 -->
<script src="https://cdn.jsdelivr.net/gh/phucbm/jquery-scroll-direction-plugin@1.1.0/jquery.scroll-direction.js"></script>
```

or minified version

```html
<!-- Scroll Direction - v1.1.0 -->
<script src="https://cdn.jsdelivr.net/gh/phucbm/jquery-scroll-direction-plugin@1.1.0/jquery.scroll-direction.min.js"></script>
```

### Initialize Scroll Direction

After init, you will have some classes on your body tag to indicate the scroll direction and position.

```js
// init Scroll Direction
$.scrollDirection.init();
```

```html

<body class="scroll-top scroll-up"></body>
```

### Integrate with Locomotive

Set the `hijacking:true` so the plugin will let you use custom event to calculate scrolling info.

```js
// init Locomotive
let scroller = new LocomotiveScroll();

// init Scroll Direction
$.scrollDirection.init({
    hijacking: true
});

// update Scroll Direction on Locomotive scroll event
scroller.on('scroll', function(obj){
    $.scrollDirection.update({
        scrollAmount: () => obj.scroll.y,
        maxScrollAmount: () => obj.limit.y,
    });
});
```

## Usage

### Init

```js
$.scrollDirection.init({
    // options
});
```

|Option|Type|Default|Description|
|---|---|---|---|
|`topOffset`|function return `number`|`() => 0`|Height of top zone in pixel.|
|`bottomOffset`|function return `number`|`() => 0`|Height of bottom zone in pixel.|
|`atBottomIsAtMiddle`|`boolean`|`true`|Consider bottom zone is also middle zone.|
|`indicator`|`boolean`|`true`|Turn indicator on/off.|
|`indicatorElement`|`jQuery element`|`$("body")`|Add indicator classes to this element.|
|`scrollUpClass`|`string`|`"scroll-up"`|Class when scrolling up.|
|`scrollDownClass`|`string`|`"scroll-down"`|Class when scrolling down.|
|`scrollAtTopClass`|`string`|`"scroll-top"`|Class when at top zone.|
|`scrollAtMiddleClass`|`string`|`"scroll-middle"`|Class when at middle zone.|
|`scrollAtBottomClass`|`string`|`"scroll-bottom"`|Class when at bottom zone.|
|`extraIndicators`|`object`|`{"element": $("#element"),"class": "element-is-viewed",}`|Add a class to indicatorElement when scroll pass the element|
|`scrollAmount`|function return `number`|`() => $(window).scrollTop()`|The instance scroll amount of window.|
|`maxScrollAmount`|function return `number`|`() => $(document).height() - $(window).height()`|Maximum scroll amount.|
|`hijacking`|`boolean`|`false`|Disable update on window scroll event to use custom event.|

### Update

```js
// jQuery
$.scrollDirection.update({
    // update new options
});

// Pure JS
window.scrollDirection.update({
    // update new options
});
```

### Events

```js
// jQuery
// this event runs whenever you load, resize and scroll
$(window).on("scrollDirection", function(){
    // do your job here
});

// when you scroll up
$(window).on("scrollUp", function(){
});

// when you scroll down
$(window).on("scrollDown", function(){
});

// when you at the beginning of the page, you can increase the top zone using topOffset
$(window).on("scrollAtTop", function(){
});

// when you in the middle of the page 
// this means the top and bottom zone are not visible in view port
$(window).on("scrollAtMiddle", function(){
});

// when you touch the end of the page
$(window).on("scrollAtBottom", function(){
});

// Pure JS
document.addEventListener("scrollDirection", () => {
});
```

### APIs

You can also check the current scroll direction/position using these provided APIs.

- `$.scrollDirection.isScrollUp`
- `$.scrollDirection.isScrollDown`
- `$.scrollDirection.isScrollAtTop`
- `$.scrollDirection.isScrollAtMiddle`
- `$.scrollDirection.isScrollAtBottom`

```js
// jQuery
if($.scrollDirection.isScrollUp){
    // do something
}

// Pure JS
if(window.scrollDirection.isScrollUp){
    // do something
}
```

## Deployment

Install gulp

```shell
npm install
```

And start test server

```shell
gulp serve
```