const vscode = require('vscode');
const fs = require('fs');
const beautify = require('js-beautify').html;

const initGenerator = (fsPath) => {
    const svgFiles = [];
    const symbolList = [];
    const SEPARATOR = '__';
    const curDir = fsPath.replace(/\\/g, '/');
    const filesInDir = fs.readdirSync(curDir);
    const FILE_NAME = vscode.workspace
        .getConfiguration('svgSpriteGenerator')
        ['output']['fileName'].replace(/[^-_.A-Za-z0-9]/g, '');
    const REMOVE_COMMENTS = vscode.workspace.getConfiguration('svgSpriteGenerator')['output']['removeComments'];
    const REMOVE_METADATA = vscode.workspace.getConfiguration('svgSpriteGenerator')['output']['removeMetadata'];
    const REMOVE_TITLE = vscode.workspace.getConfiguration('svgSpriteGenerator')['output']['removeTitle'];
    const REMOVE_DESC = vscode.workspace.getConfiguration('svgSpriteGenerator')['output']['removeDesc'];
    const MAX_COMPRES = vscode.workspace.getConfiguration('svgSpriteGenerator')['output']['maximumCompression'];
    const SHOW_INFO_MESSAGE = vscode.workspace.getConfiguration('svgSpriteGenerator')['output']['showInfoMessage'];

    // если фалы лежат в 'node_modules' - не обрабатываем и выходим
    if (fsPath.indexOf('node_modules') > -1) return;

    filesInDir.forEach((file) => {
        if (file.endsWith('.svg')) svgFiles.push(curDir + '/' + file);
    });

    if (!svgFiles.length) {
        vscode.window.showInformationMessage('SVG files not found!');
        return false;
    }

    svgFiles.forEach((path) => {
        let fileName = path.replace(/.+[\\/](.*)\.svg/gi, '$1').replace(/\s/gi, '-');
        let svgString = fs.readFileSync(path).toString();
        let svgHTML = svgString.match(/<svg.+<\/svg>/gis) ? svgString.match(/<svg.+<\/svg>/gis)[0] : '';
        let header = svgString.match(/<svg[^>]+>/gi) ? svgString.match(/<svg[^>]+>/gi)[0] : '<symbol>';
        let close = '</symbol>';

        let style = svgString.match(/<style[^>]*>.+<\/style>/gis)
            ? svgString.match(/<style[^>]*>.+<\/style>/gis)[0]
            : '';

        if (!svgHTML.length) return false;

        if (svgString.toLowerCase().indexOf('symbol'.toLowerCase()) > -1) return false;

        header = header
            .replace(/[\r\n\t\s]+/g, ' ')
            .replace(/\s?(version|id|xmlns.xlink)="[^"]+"\s?/gi, ' ')
            .replace(/\s+/g, ' ')
            .replace(/<svg /, `<symbol id="${fileName}" `);

        // обрабатываем все css-классы данного SVG
        if (style.length && style.match(/(\.[\w_-]+)(\s*{)/gis).length) {
            let classList = style.match(/(\.[\w_-]+)(\s*{)/gis).map((item) => {
                return item.replace(/\s*{/gi, '').replace(/^\./, '');
            });

            if (classList.length) {
                classList.forEach((item) => {
                    let newClass = item + SEPARATOR + fileName;
                    svgHTML = svgHTML
                        .replace(`${item}{`, `${newClass}{`)
                        .replace(`${item} {`, `${newClass}{`)
                        .replace(new RegExp(`class="${item}"`, 'gis'), `class="${newClass}"`);
                });
            }
        } else {
            svgHTML = svgHTML.replace(/(\s?class=")([^"]+)("\s?)/gi, `$1$2${SEPARATOR}${fileName}$3`);
        }

        // обрабатываем все css-ID данного SVG
        // например тут: <rect id="SVGID_1_" x="3.5" y="1" width="17" height="22"></rect>
        // и тут: <use xlink:href="#SVGID_1_" style="overflow:visible;"></use>
        // и тут: <path d="M2000 0H-3V503H2000V0Z" fill="url(#paint0_linear)"/>
        if (!!svgHTML.match(/\bid="[^"]+"/gis)) {
            let idList = svgHTML.match(/\bid="[^"]+"/gis).map((item) => item.replace(/id="|"/gi, ''));
            if (idList.length) {
                idList.forEach((item) => {
                    let newID = item + SEPARATOR + fileName;
                    svgHTML = svgHTML
                        .replace(new RegExp('id="' + item + '"', 'g'), `id="${newID}"`)
                        .replace(new RegExp('"#' + item + '"', 'g'), `"#${newID}"`)
                        .replace(new RegExp('url[(]#' + item + '[)]', 'g'), `url(#${newID})`);
                });
            }
        }

        let body = svgHTML.replace(/.*<svg[^>]+>(.+)<\/svg>/gis, '$1');

        if (REMOVE_COMMENTS) body = body.replace(/<!--.*?-->/gis, '');
        if (REMOVE_METADATA) body = body.replace(/<metadata>.*?<\/metadata>/gis, '');
        if (REMOVE_TITLE) body = body.replace(/<title>.*?<\/title>/gis, '');
        if (REMOVE_DESC) body = body.replace(/<desc>.*?<\/desc>/gis, '');

        body = body
            // заменить <style type="text/css"> на <style>
            .replace(/<style\s+type="text\/css">/gi, '<style>')
            // убрать разрывы строки внутри path
            .replace(/[\r\n]+\s*(\w)/g, ' $1')
            .replace(/[\r\n]+\s*"/g, ' "')
            .replace(/"[\r\n]+\s*\/>/g, '"/>')
            // убрать лишние переводы строки
            .replace(/([\r\n])+/g, ' ')
            // заменить внутри строк несколько пробелов на один
            .replace(/(["\d\w])[\s\t]+(["\d\w])/gi, '$1 $2');

        symbolList.push(`${header}${body}${close}`);
    });

    let sprite = `<svg width="0" height="0" fill="none" style="visibility: hidden; position: absolute;" aria-hidden="true">
                     ${symbolList.join('\n')}
                  </svg>`;

    if (MAX_COMPRES) {
        sprite = sprite
            .replace(/([\r\n])\s*/gs, '$1')
            .replace(/[\r\n]+/gs, '')
            .replace(/\s+/gs, ' ')
            .replace(/" >/gs, '">');
    } else {
        sprite = beautify(sprite, {
            indent_size: 4,
        });
        sprite = sprite.replace(/}([\r\n])+/gm, '}$1');
    }

    fs.writeFile(curDir + '/' + FILE_NAME + '.svg', sprite, function (err) {
        if (err) throw err;

        if (SHOW_INFO_MESSAGE) {
            vscode.window.showInformationMessage(`File "${FILE_NAME}.svg" saved to the current folder`);
        }
    });
};

module.exports = initGenerator;
