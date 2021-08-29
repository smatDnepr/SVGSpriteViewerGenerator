const vscode = require('vscode');
const initGenerator = require('./init_generator');
const initViewer = require('./init_viewer');

function activate(context) {
    const disposableSvgGenerator = vscode.commands.registerCommand('smat.svgSpriteGenerate', (e) => {
        initGenerator(e.fsPath);
    });

    const disposableSvgViever = vscode.commands.registerCommand('smat.svgSpriteViewer', (e) => {
        initViewer(e.fsPath);
    });

    context.subscriptions.push(disposableSvgGenerator);
    context.subscriptions.push(disposableSvgViever);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
