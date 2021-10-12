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
        let svgHeader = svgString.match(/<svg[^>]+>/gi) ? svgString.match(/<svg[^>]+>/gi)[0] : '';
        let svgHTML = svgString.match(/<svg.+<\/svg>/gis) ? svgString.match(/<svg.+<\/svg>/gis)[0] : '';

        let style = svgString.match(/<style[^>]*>.+<\/style>/gis)
            ? svgString.match(/<style[^>]*>.+<\/style>/gis)[0]
            : '';

        let viewBox = svgString.replace(/.*viewBox\s?=["]([^"]+)["].*/gis, '$1');
        let symbol = '';

        if (!svgHTML.length || !viewBox.length) return false;

        // если в текущем файле есть symbol - значит это уже спрайт и мы его пропускаем
        if (svgString.toLowerCase().indexOf('symbol'.toLowerCase()) > -1) return false;

        svgHeader = svgHeader.replace(/[\r\n\t\s]+/g, ' ');

        svgHeaderX = svgHeader.match(/( x=")([^"]+)(")/i)
            ? 'x="' + svgString.match(/( x=")([^"]+)(")/i)[2] + '"'
            : 'x="0px"';

        svgHeaderY = svgHeader.match(/( y=")([^"]+)(")/i)
            ? 'y="' + svgString.match(/( y=")([^"]+)(")/i)[2] + '"'
            : 'y="0px"';

        svgHeaderXmlSpace = svgHeader.match(/( xml:space=")([^"]+)(")/i)
            ? 'xml:space="' + svgString.match(/( xml:space=")([^"]+)(")/i)[2] + '"'
            : '';

        // обрабатываем все css-классы данного SVG
        if (style.length && style.match(/(\.[\w_-]+)(\s*{)/gis).length) {
            let classList = style.match(/(\.[\w_-]+)(\s*{)/gis).map((item) => {
                return item.replace(/\s*{/gi, '').replace(/^\./, '');
            });

            if (classList.length) {
                classList.forEach((item) => {
                    let newClass = item + SEPARATOR + fileName;
                    svgHTML = svgHTML.replace(`${item}{`, `${newClass}{`);
                    svgHTML = svgHTML.replace(`${item} {`, `${newClass}{`);
                    svgHTML = svgHTML.replace(new RegExp(`class="${item}"`, 'gis'), `class="${newClass}"`);
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
                    svgHTML = svgHTML.replace(new RegExp('id="' + item + '"', 'g'), `id="${newID}"`);
                    svgHTML = svgHTML.replace(new RegExp('"#' + item + '"', 'g'), `"#${newID}"`);
                    svgHTML = svgHTML.replace(new RegExp('url[(]#' + item + '[)]', 'g'), `url(#${newID})`);
                });
            }
        }

        let symbolInnerHtml = svgHTML.replace(/.*<svg[^>]+>(.+)<\/svg>/gis, '$1');

        // убрать разрывы строки внутри path
        symbolInnerHtml = symbolInnerHtml.replace(/[\r\n]+\s*(\w)/g, ' $1');
        symbolInnerHtml = symbolInnerHtml.replace(/[\r\n]+\s*"/g, ' "');
        symbolInnerHtml = symbolInnerHtml.replace(/"[\r\n]+\s*\/>/g, '"/>');

        // убрать лишние переводы строки
        symbolInnerHtml = symbolInnerHtml.replace(/>([\r\n])+\s*</g, '>$1<').trim();

        // заменить внутри строк несколько пробелов на один
        symbolInnerHtml = symbolInnerHtml.replace(/(["\d\w])[\s\t]+(["\d\w])/gi, '$1 $2');

        // формируем symbol
        symbol = `<symbol id="${fileName}" xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${svgHeaderX}  ${svgHeaderY} ${svgHeaderXmlSpace}>
                      ${symbolInnerHtml}
                  </symbol>`;

        symbolList.push(symbol);
    });

    let sprite =
        '<svg width="0" height="0" fill="none" style="visibility: hidden; position: absolute;" aria-hidden="true">' +
        '\n' +
        symbolList.join('\n') +
        '\n' +
        '</svg>';

    if (MAX_COMPRES) {
        sprite = sprite.replace(/([\r\n])\s*/gs, '$1');
        sprite = sprite.replace(/[\r\n]+/gs, '');
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
