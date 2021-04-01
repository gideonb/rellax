# RELLAX

[![NPM Package](https://img.shields.io/npm/v/rellax.svg)](https://www.npmjs.org/package/rellax)
[![Minified Size](https://img.shields.io/bundlephobia/min/rellax.svg?label=minified)](https://bundlephobia.com/result?p=rellax)
[![Gzipped Size](https://img.shields.io/bundlephobia/minzip/rellax.svg?label=gzipped)](https://bundlephobia.com/result?p=rellax)
[![Twitter Follow](https://img.shields.io/twitter/follow/dixonandmoe.svg?label=%40dixonandmoe&style=social)](https://twitter.com/dixonandmoe)

Rellax is a buttery smooth, super lightweight, vanilla javascript parallax library. **Update:** Rellax now works on mobile (v1.0.0).

* [Demo Website](https://dixonandmoe.com/rellax/)

Have any suggestions or feedback? Reach out [@dixonandmoe](https://twitter.com/dixonandmoe)

## Getting Started
`npm install rellax --save` or if you're old school like us download and insert `rellax.min.js`

```html
<div class="rellax">
  I’m an auto-calculated speed based on the frame and image sizes
</div>

<script src="rellax.min.js"></script>
<script>
  // Accepts any class name
  var rellax = new Rellax('.rellax');
</script>
```
```html
<script>
  // Also can pass in optional settings block
  var rellax = new Rellax('.rellax', {
    center: false,
    round: true,
    frame: frameSelector
  });
</script>
```
## Features

### Speed
This is automatically calculated and the option is removed from the light version.

### Centering
This is removed from the light version.

### Z-index
If you want to sort your elements properly in the Z space, you can use the data-rellax-zindex property
```html
<div class="rellax">
  I’m that default chill speed of "-2" and default z-index of 0
</div>
<div class="rellax" data-rellax-zindex="5">
  I’m on top of the previous element, I'm z-index 5!!
</div>
```

### Refresh
```html
<script>
  // Start Rellax
  var rellax = new Rellax('.rellax');

  // Destroy and create again parallax with previous settings
  rellax.refresh();
</script>
```

### Destroy
```html
<script>
  // Start Rellax
  var rellax = new Rellax('.rellax');

  // End Rellax and reset parallax elements to their original positions
  rellax.destroy();
</script>
```

### Callback
```html
<script>
  // Start Rellax
  var rellax = new Rellax('.rellax-blur-card', {
    callback: function(positions) {
      // callback every position change
      console.log(positions);
    }
  });
</script>
```

### Target node
Instead of using a className you can use a node, handy when using React and you want to use `refs` instead of `className`.
```jsx
<div ref={ref => { this.rellaxRef = ref }}>
  I’m an auto-calculated speed based on the frame and image sizes
</div>

var rellax = new Rellax(this.rellaxRef)
```

## In the Wild
If you're using Rellax in production, we'd love to list you here! Let us know: moe@dixonandmoe.com
- [Microsoft Fluent](https://fluent.microsoft.com/)
- [Gucci Gift](http://gift.gucci.com/)
- [Bowmore Scotch](https://www.bowmore.com/)
- [How Much Does a Website Cost](https://designagency.io/)
- [Laws of UX](https://lawsofux.com/)
- [Finch](https://finch.io/)
- [Product Designer in San Francisco](https://moeamaya.com/)
- [Cool Backgrounds](https://coolbackgrounds.io/)
- [EthWorks](http://ethworks.io/)
- [Unlimited Designs](https://servicelist.io/)
- [Airgora](https://www.airgora.com/competition)
- [Lorem Ipsum Generator](https://loremipsumgenerator.com/)
- [Terry Design](http://terrydesign.co.uk/)
- [Deeson](https://www.deeson.co.uk/)
- [Alex Bailon Portfolio](http://www.iambailon.com/)

## Development
In the spirit of lightweight javascript, the build processes (thus far) is lightweight also.

1. Open demo.html
2. Make code changes and refresh browser
3. Once feature is finished or bug fixed, use [jshint](http://jshint.com/) to lint code
4. Fix lint issues then use [Google Closure Compiler](https://closure-compiler.appspot.com/home) to minify
5. 🍻

## Changelog
- 1.7.1: Remove animation on destory [PR](https://github.com/dixonandmoe/rellax/pull/132)
- 1.7.0: Scroll position set relative to the wrapper [PR](https://github.com/dixonandmoe/rellax/pull/125)
