## Features

Easy generation and view of svg sprite from a group of svg files.
The sprite will be created in the same folder as the svg files.
The ID for each symbol fit to the name of the file from which it was generated.
So if the file name is "ico-email.svg" then symbol id="ico-email".

## Installing

This extension is available for free in the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=smatDnepr.svg-sprite-viewer-generator)

## Screenshots

### Generator:

![Screenshot](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/capture-generator-v2.gif)

### Viewer:

![Screenshot](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/capture-viewer-v23.gif)

### Settings:

![Image](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/settings2.png)

## Recommendation

In layout, you can use sprite it like this:

```
<svg class="ico">
    <use xlink:href="/images/_sprite.svg#ico-email"></use>
</svg>
```

For compatibility with old browsers it is recommended to include svg4everybody
https://github.com/jonathantneal/svg4everybody

## Buy coffee for the author 🙂

<a href="https://www.buymeacoffee.com/smatdnepr" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
