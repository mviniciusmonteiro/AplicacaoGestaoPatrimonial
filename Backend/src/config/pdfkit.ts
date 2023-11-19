const PDFDocument = require('pdfkit');
const fs = require('fs');

const moment = require('moment');
const blockSizeItemDic : {[key: number]: number}  = {
	0: 90,
	1: 285,
	2: 65,
	3: 65,
	4: 50
}

export function createTable(title: String, path: String, data: String[][]) {
	const margin = 20;
	const pdfDoc = new PDFDocument({size: 'A4', printing: 'highResolution', copying: true, margin: margin });
	pdfDoc.pipe(fs.createWriteStream(path));

    let startY = pdfDoc.y,
    startX = pdfDoc.x,
    distanceY = 40,
    distanceX = 0,
	distanceYHeader = 20;

    pdfDoc.fontSize(12);
    pdfDoc.font('Times-Roman');

    let currentY = startY;

	pdfDoc.text(title, 0, currentY, { align: 'center', underline: true });
	currentY += distanceY;

	data.forEach((itemsStrList: String[], i) => {
		let currentX = startX;
		// Verificando se a próxima linha cabe na página atual. Se não, adiciona nova página
		if (currentY + distanceY > pdfDoc.page.height - margin) {
			currentX = margin,
			currentY = margin,
			pdfDoc.addPage();
		}

		itemsStrList.forEach((itemData, j) => {
			// Write text
			pdfDoc.text(itemData, currentX + distanceX, currentY, { width: blockSizeItemDic[j], align: 'center', height: distanceY, ellipsis: '...', baseline: 'top' });

			// Create rectangles
			pdfDoc
				.lineJoin('miter')
				.rect(currentX, currentY-4, blockSizeItemDic[j], i == 0 ? distanceYHeader : distanceY)
				.stroke();

			currentX += blockSizeItemDic[j];
		});
		currentY += i == 0 ? distanceYHeader : distanceY;
	});
	pdfDoc.text('Relatório gerado em ' + moment().format(`DD/MM/YYYY - HH:mm`).replace('-', 'às'), 0, pdfDoc.page.height - 35, { align: 'center' });
	pdfDoc.end();
}

export { PDFDocument }