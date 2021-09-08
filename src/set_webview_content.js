const setWebviewContent = function (svgString) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <style>
            body {
                margin: 10px 0;
            }
            #items_list {
                display: flex;
                width: 100%;
                flex-wrap: wrap;
                gap: 6px;
            }
            #items_list .item {
                display: block;
                position: relative;
                width: 80px;
				height: 80px;
                overflow: hidden;
				background-color: #ddd;
				border-radius: 4px;
				display: flex;
				justify-content: center;
                align-items: center;
				cursor: pointer;
                border-radius: 6px;
            }
            #items_list .item::after {
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
                transition: all 0.1s ease 0s;
            }
            #items_list .item:hover::after {
                opacity: 1;
            }
            #items_list .item:active::after {
                content: 'ID copied!';
            }
            #items_list .item svg {
                display: block;
                width: 70px;
				height: 70px;
            }
        </style>
    </head>
    <body>
        <script>
            const itemsList = document.createElement('div');
            itemsList.setAttribute('id', 'items_list');

            const svgArray = ${svgString};

            for (let i = 0; i < svgArray.length; i++) {
                const svgDiv = document.createElement('div');
                svgDiv.classList.add('item');
                svgDiv.innerHTML = svgArray[i];

                const id = svgDiv.firstElementChild.getAttribute('id');
                svgDiv.setAttribute('title', id);
                svgDiv.setAttribute('data-id', id);

                svgDiv.addEventListener('contextmenu', async function(e) {
                    e.preventDefault();
                    navigator.clipboard.writeText(this.getAttribute('data-id'));
                });

                svgDiv.addEventListener('click', async function() {
                    navigator.clipboard.writeText(this.getAttribute('data-id'));
                });

                itemsList.appendChild(svgDiv);
            }

            document.body.insertBefore(itemsList, document.body.firstChild);
        </script>
    </body>
    </html>`;
};

module.exports = setWebviewContent;
