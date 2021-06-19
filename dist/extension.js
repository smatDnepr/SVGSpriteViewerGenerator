/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/extension.js":
/*!**************************!*\
  !*** ./src/extension.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const vscode = __webpack_require__(/*! vscode */ "vscode");
const fs     = __webpack_require__(/*! fs */ "fs");

const main = (fsPath) => {
	const svgFiles   = [];
	const symbolList = [];
	const SAPARATOR  = '__';
	const curDir     = fsPath.replace(/\\/g, '/');
	const filesInDir = fs.readdirSync(curDir);
	const FILE_NAME  = vscode.workspace.getConfiguration('svgSpriteGenerator')['outputFileName'].replace(/[^-_.A-Za-z0-9]/g, '');

	// если фалы лежат в 'node_modules' - не обрабатываем и выходим
	if (fsPath.indexOf('node_modules') > -1) return;

	filesInDir.forEach(file => {
		if ( file.endsWith('.svg') )
		svgFiles.push( curDir + '/' + file);
	});

	if ( ! svgFiles.length ) {
		vscode.window.showInformationMessage('SVG files not found!');
		return false;
	}

	svgFiles.forEach((path, idx) => {
		let fileName  = path.replace(/.+[\\/](.*)\.svg/gi, '$1').replace(/\s/gi, '-');
		let svgString = fs.readFileSync(path).toString();
		let svgHTML   = svgString.match(/<svg.+<\/svg>/gis) ? svgString.match(/<svg.+<\/svg>/gis)[0] : '';
		let style     = svgString.match(/<style[^>].+<\/style>/gis) ? svgString.match(/<style[^>].+<\/style>/gis)[0] : '';
		let viewBox   = svgString.replace(/.*viewBox\s?=["]([^"]+)["].*/gis, '$1');
		let symbol    = '';

		if ( !svgHTML.length || !viewBox.length ) return false;

		// если в текущем файле есть symbol - значит это уже спрайт и мы его пропускаем
		if ( svgString.toLowerCase().indexOf("symbol".toLowerCase()) > -1 ) return false;

		// обрабатываем все css-классы данного SVG
		if ( style.length && style.match(/([.\w]+)(\s*{)/isg).length ) {
			let classList = style.match(/([.\w]+)(\s*{)/isg).map(item => {
				return item.replace(/\s*{/gi, '');
			});
			if ( classList.length ) {
				classList.forEach(item => {
					let newClass = item + SAPARATOR + idx;
					svgHTML = svgHTML.replace(`${item}{`, `${newClass}{`);
					svgHTML = svgHTML.replace(`${item} {`, `${newClass}{`);
					svgHTML = svgHTML.replace(new RegExp('class="' + item.slice(1) + '"', 'gis'), `class="${newClass.slice(1)}"`);
				});
			}
		}

		// обрабатываем все css-ID данного SVG
		// например тут: <rect id="SVGID_1_" x="3.5" y="1" width="17" height="22"></rect>
		// и тут: <use xlink:href="#SVGID_1_" style="overflow:visible;"></use>
		// и тут: <path d="M2000 0H-3V503H2000V0Z" fill="url(#paint0_linear)"/>
		if ( !! svgHTML.match(/\bid="[^"]+"/isg) ) {
			let idList = svgHTML.match(/\bid="[^"]+"/isg).map(item =>
				item.replace(/id="|"/gi, '')
			);
			if ( idList.length ) {
				idList.forEach(item => {
					let newID = item + SAPARATOR + idx;
					svgHTML = svgHTML.replace(new RegExp('id="' + item + '"', 'g'), `id="${newID}"`);
					svgHTML = svgHTML.replace(new RegExp('"#' + item + '"', 'g'), `"#${newID}"`)
					svgHTML = svgHTML.replace(new RegExp('url[(]#' + item + '[)]', 'g'), `url(#${newID})`);
				});
			}
		}

		let symbolInnerHtml = svgHTML.replace(/.*<svg[^>]+>(.+)<\/svg>/gsi, '$1');

		// убрать разрывы строки внутри path
		symbolInnerHtml = symbolInnerHtml.replace(/[\r\n]+\s*(\w)/g, '$1');
		symbolInnerHtml = symbolInnerHtml.replace(/[\r\n]+\s*"/g, ' "');
		symbolInnerHtml = symbolInnerHtml.replace(/"[\r\n]+\s*\/>/g, '"/>');

		// подогнать все теги к левому краю
		symbolInnerHtml = symbolInnerHtml.replace(/[\r\n]+\s*</gs, '\n<');

		// формируем symbol
		symbol = '<symbol id="' + fileName + '" viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg">'
				+ symbolInnerHtml
				+ '</symbol>';

		symbolList.push(symbol);
	});


	let sprite = '<svg width="0" height="0" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="visibility: hidden; position: absolute;" aria-hidden="true">'
				+ '\n\n'
				+ symbolList.join("\n\n")
				+ '\n\n'
				+ '</svg>';

	fs.writeFile(curDir + '/' + FILE_NAME + '.svg', sprite, function (err) {
		if (err) throw err;
		vscode.window.showInformationMessage(`File "${FILE_NAME}.svg" saved to the current folder`);
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
	const disposable = vscode.commands.registerCommand('smat.svgSpriteGenerate', (e) => {
		main(e.fsPath);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
// vscode.commands.executeCommand('copyFilePath')
function deactivate() {}

module.exports = {
	activate,
	deactivate
}


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("vscode");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/extension.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map