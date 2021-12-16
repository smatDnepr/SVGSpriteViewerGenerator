## Features

This tool has two parts:

* The **Generator** simply takes a list of SVG files and make a single sprite file from them using \<symbol\> elements.
The sprite will be created in the same folder as the svg files.
The ID for each symbol fit to the name of the file from which it was generated.
So if the file name is "ico-email.svg" then \<symbol\> id="ico-email"

* The **Viewer** allows you to view all elements of the created sprite and copy the desired identifier.

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


## Installing

This extension is available for free in the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=smatDnepr.svg-sprite-viewer-generator)
