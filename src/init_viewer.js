const vscode = require('vscode');
const fs = require('fs');
const setWebviewContent = require('./set_webview_content');

const initViewer = (fsPath) => {
    const spriteContent = fs.readFileSync(fsPath, 'utf8');

    if (spriteContent.toLowerCase().indexOf('<symbol') == -1) {
        vscode.window.showInformationMessage('This is not a svg sprite!');
        return;
    }

    const currentPanel = vscode.window.createWebviewPanel('svg_sprite_viewer', 'SVG Sprite', vscode.ViewColumn.One, {
        enableScripts: true,
    });

    const svgString = [
        ...spriteContent
            .replace(/[\r\n]+\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .matchAll(/<symbol .+?<\/symbol>/gis)
        ]
        .map((item) => {
            return item
                    .toString()
                    .replaceAll('symbol', 'svg')
                    .replaceAll('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
        })
        .join('|||');

    currentPanel.webview.html = setWebviewContent(svgString);

}


module.exports = initViewer;