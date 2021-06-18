const vscode = require('vscode');
const fs = require('fs');
const cheerio = require('cheerio');


const main = (fsPath) => {
	const svgFiles = [];
	const symbolList = [];
	const SAPARATOR = '__';

	const curDir = fsPath.replace(/\\/g, '/');
	const filesInDir = fs.readdirSync(curDir);

	// если фалы лежат в 'node_modules' - не обрабатываем и выходим
	if (fsPath.indexOf('node_modules') > -1) return;

	filesInDir.forEach(file => {
		if ( file.endsWith('.svg') )
		svgFiles.push( curDir + '/' + file);
	});

	if ( ! svgFiles.length ) {
		vscode.window.showInformationMessage('SVG files not found!');
	}

	svgFiles.forEach((path, idx) => {
		let fileName  = path.replace(/.+[\\/](.*)\.svg/gi, '$1').replace(/\s/gi, '-');
		let svgString = fs.readFileSync(path).toString();
		let svgTag    = svgString.replace(/.*(<svg.+<\/svg>).*/gis, '$1');
		let viewBox   = svgTag.replace(/.*viewBox\s?=["]([^"]+)["].*/gis, '$1');
		let $         = cheerio.load(svgTag);

		// если в текущем файле есть symbol - значит это уже спрайт и мы его пропускаем
		if ( svgString.toLowerCase().indexOf("symbol".toLowerCase()) > -1 ) return false;

		// обрабатываем все css-классы данного SVG
		if ( !!$('svg').find('style').length && !!$('svg').find('style').html().match(/([.\w]+)(\s*{)/isg).length ) {
			$('svg').find('style').each(function() {
				let svgHTML = $('svg').html();

				let classList = $(this).html().match(/([.\w]+)(\s*{)/isg).map(item => {
					return item.replace(/\s*{/gi, '');
				});

				if ( classList.length ) {
					classList.forEach(item => {
						let newClass = item + SAPARATOR + idx;
						svgHTML = svgHTML.replace(`${item}{`, `${newClass}{`);
						svgHTML = svgHTML.replace(`${item} {`, `${newClass}{`);
						svgHTML = svgHTML.replace(new RegExp('class="' + item.slice(1) + '"', 'gis'), `class="${newClass.slice(1)}"`);
					});
					$('svg').html( svgHTML );
				}
			});
		}

		// обрабатываем все css-ID данного SVG
		// например тут: <rect id="SVGID_1_" x="3.5" y="1" width="17" height="22"></rect>
		// и тут: <use xlink:href="#SVGID_1_" style="overflow:visible;"></use>
		// и тут: <path d="M2000 0H-3V503H2000V0Z" fill="url(#paint0_linear)"/>
		if ( !! $('svg').html().match(/\bid="[^"]+"/isg) ) {
			let svgHTML = $('svg').html();

			let idList = $('svg').html().match(/\bid="[^"]+"/isg).map(item =>
				item.replace(/id="|"/gi, '')
			);

			if ( idList.length ) {
				idList.forEach(item => {
					let newID = item + SAPARATOR + idx;
					svgHTML = svgHTML.replace(new RegExp('id="' + item + '"', 'g'), `id="${newID}"`);
					svgHTML = svgHTML.replace(new RegExp('"#' + item + '"', 'g'), `"#${newID}"`)
					svgHTML = svgHTML.replace(new RegExp('url[(]#' + item + '[)]', 'g'), `url(#${newID})`);
				});
				$('svg').html( svgHTML );
			}
		}

		// формируем отступы для symbol
		let symbolInnerHtml = $('svg').html();

		// убрать разрывы строки внутри path
		symbolInnerHtml = symbolInnerHtml.replace(/\n\s*(\w)/g, ' $1');
		symbolInnerHtml = symbolInnerHtml.replace(/\n\s*"/gm, ' "');

		// подпгнать все теги к левому краю
		symbolInnerHtml = symbolInnerHtml.replace(/\n\s*</gs, '\n<');

		// формируем symbol
		let symbol = '<symbol id="' + fileName + '" viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg">'
					+ symbolInnerHtml
					+ '</symbol>';

		symbolList.push(symbol);
	});

	let sprite = '<svg width="0" height="0" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="visibility: hidden; position: absolute;" aria-hidden="true">'
				+ '\n\n'
				+ symbolList.join("\n\n")
				+ '\n\n'
				+ '</svg>';

	fs.writeFile(curDir + '/_sprite.svg', sprite, function (err) {
		if (err) throw err;
		vscode.window.showInformationMessage('File "_sprite.svg" saved to the current folder');
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
