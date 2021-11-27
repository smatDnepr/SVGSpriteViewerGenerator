# SVG Sprite Generator and Viewer for VS Code

## Features

Fast generation of svg symbol sprite from a group of svg files.
The sprite will be created in the same folder as the svg files.
The ID for each symbol fit to the name of the file from which it was generated.
For example, if the file name is "ico-email.svg", then symbol id="ico-email".

In version 2.0 added sprite viewer and copy icon id.

You can use it like this:

```
<svg class="ico">
    <use xlink:href="/images/_sprite.svg#ico-email"></use>
</svg>
```

## Installing

This extension is available for free in the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=smatDnepr.svg-sprite-generator)

## Screenshots

### Generator:

![Screenshot](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/capture-generator-v2.gif)

### Viewer:

![Screenshot](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/capture-viewer-v23.gif)

### Settings:

![Image](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/settings2.png)

## Recommendation

For compatibility with old browsers it is recommended to include svg4everybody
https://github.com/jonathantneal/svg4everybody

## Buy coffee for the author 🙂

<a href="https://www.buymeacoffee.com/smatdnepr" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
