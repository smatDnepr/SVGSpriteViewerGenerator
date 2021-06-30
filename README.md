## Features

Fast generation of svg symbol sprite from a group of svg files.
The sprite will be created in the same folder as the svg files.
The ID for each symbol fit to the name of the file from which it was generated.
For example, if the file name is "ico-email.svg", then symbol id="ico-email".

You can use it like this:
```
<svg class="ico">
    <use xlink:href="/images/_sprite.svg#ico-email"></use>
</svg>
```


## Screenshots

![Image](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/feature-1.png)

![Image](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/feature-2.png)



## Extension Settings

In settings you can:
* set output file name
* set maximum compression for output file

![Image](https://raw.githubusercontent.com/smatDnepr/SVG-Sprite-Generator/master/images/feature-3.png)



## Recommendation

For compatibility with old browsers it is recommended to include svg4everybody
https://github.com/jonathantneal/svg4everybody

To view the sprite in VSCode, I recommend using this plugin
https://marketplace.visualstudio.com/items?itemName=DevEscalus.svg-sprites-viewer




