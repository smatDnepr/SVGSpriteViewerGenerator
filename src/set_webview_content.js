const setWebviewContent = function (svgString) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <style>
            body {
                margin: 20px 0;
                height: calc(100vh - 40px);
            }
            .svg_viewer {
                height: 100%;
                min-height: 100%;
                min-height: fill-available;
                display: flex;
                flex-direction: column;
            }
            .svg_viewer__header {
                flex-shrink: 0;
                width: 100%;
            }
            .svg_viewer__header-inner {
                padding-bottom: 16px;
            }
            .svg-viewer__content {
                display: block;
                position: relative;
                flex-grow: 1;
                flex-shrink: 0;
                flex-basis: auto;
            }
            .svg-viewer__content-inner {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: 0 5px;
                overflow-y: scroll;
            }
            .svg-viewer__list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                gap: 6px;
            }
            .svg-viewer__item {
                display: flex;
                position: relative;
                height: 80px;
                overflow: hidden;
                background-color: #f2f2f2;
                border-radius: 4px;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                border-radius: 6px;
                transition: background-color 0.2s ease 0s;
            }
            .svg-viewer__list.light .svg-viewer__item {
                background-color: #f2f2f2;
            }
            .svg-viewer__list.dark .svg-viewer__item {
                background-color: #262626;
            }
            .svg-viewer__item::after {
                display: flex;
                opacity: 0;
                justify-content: center;
                align-items: center;
                position: absolute;
                background-color: rgba(0, 0, 0, 0.5);
                font-family: Arial, Helvetica, sans-serif;
                font-size: 16px;
                font-weight: normal;
                text-align: center;
                color: #ffffff;
                z-index: 2;
                content: 'Copy ID';
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                transition: all 0.2s ease 0s;
            }
            .svg-viewer__item:hover::after {
                opacity: 1;
            }
            .svg-viewer__item:active::after {
                content: 'ID copied!';
            }
            .svg-viewer__item svg {
                display: block;
                width: 70px;
                height: 70px;
            }
            .svg_viewer__toggle-hint {
                text-align: center;
                margin: 0 0 10px 0;
            }
            .svg_viewer__togglers {
                display: flex;
                justify-content: center;
            }
            .btn-toggle {
                position: relative;
                height: 27px;
                display: inline-flex;
                justify-content: center;
                align-content: center;
                align-items: center;
                padding: 4px 30px 4px 14px;
                margin: 0 3px;
                border-width: 1px;
                border-style: solid;
                border-radius: 6px;
                display: inline-flex;
                justify-content: center;
                box-sizing: border-box;
                outline: none;
                cursor: pointer;
            }
            .btn-toggle::before {
                display: block;
                position: relative;
                top: -1px;
                margin-right: 5px;
                content: '✔';
                opacity: 0;
            }
            .btn-toggle.active::before {
                opacity: 1;
            }
        </style>
    </head>
    <body>
        <div class="svg_viewer">
            <div class="svg_viewer__header">
                <div class="svg_viewer__header-inner">
                    <p class="svg_viewer__toggle-hint">Change background of elements:</p>
                    <div class="svg_viewer__togglers">
                        <button class="btn-toggle active" data-bgr="light">Light</button>
                        <button class="btn-toggle" data-bgr="dark">Dark</button>
                    </div>
                </div>
            </div>
            <div class="svg-viewer__content">
                <div class="svg-viewer__content-inner"></div>
            </div>
        </div>

        <script>
            const itemsList = document.createElement('div');
            itemsList.setAttribute('class', 'svg-viewer__list');

            const svgArray = ${svgString};
            for (let i = 0; i < svgArray.length; i++) {
                const svgDiv = document.createElement('div');
                svgDiv.classList.add('svg-viewer__item');
                svgDiv.innerHTML = svgArray[i];

                const id = svgDiv.firstElementChild.getAttribute('id');
                svgDiv.setAttribute('title', id);
                svgDiv.setAttribute('data-id', id);

                ['click', 'contextmenu'].forEach(function(eName) {
                    svgDiv.addEventListener(eName, (e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(e.target.getAttribute('data-id'));
                    });
                });

                itemsList.appendChild(svgDiv);
            }

            document.querySelector('.svg-viewer__content-inner').insertBefore(itemsList, null);

            document.querySelectorAll('.btn-toggle').forEach(btn => {
                btn.addEventListener('click', function() {
                    [...btn.parentNode.children].forEach((el) => {
                        el === btn
                            ? el.classList.add('active')
                            : el.classList.remove('active');
                    });

                    itemsList.classList.remove('light', 'dark');
                    itemsList.classList.add(btn.dataset.bgr);
                });
            });
        </script>
    </body>
    </html>`;
};

module.exports = setWebviewContent;
