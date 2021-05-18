import { jsPDF } from "jspdf";

export default function pdfSummary(booklist) {
  const WIDTH = 216;
  const MARGIN_LEFT = 20;
  let separate = 50;
  const doc = new jsPDF({
    unit: 'mm',
    format: 'letter'
  });
  doc.setFontSize(14);
  doc.setTextColor(189, 189, 189);
  doc.text('Library book', (WIDTH / 2), 25, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Book library summary', (WIDTH / 2), 40, { align: 'center' });
  for (let book of booklist) {
    doc.setFontSize(10);
    doc.text(`Book title: ${book.title} | Author: ${book.author} | Publication date: ${book.publication_date}`, MARGIN_LEFT, separate, { align: 'left' });
    separate += 5;
    separate = justifyText(doc, book.abstract, {x: MARGIN_LEFT + 10, y: separate}, 160, 3, 8) + 10;
  };
  doc.setTextColor(189, 189, 189);
  doc.text('Av. Imagine #5520 Street. Fall C.P. 01918', (WIDTH / 2) + 5, 260, { align: 'center' });
  doc.text('State, Country Phone. 01 011 212 122.',
    (WIDTH / 2) + 5, 265, { align: 'center' });
  doc.text('email: codertset@gmail.com', (WIDTH / 2) + 5, 270, { align: 'center' });
  
  doc.save('summary-books.pdf');
}

function justifyText(Doc, Text, Point, Size, lineBreak = 5, fontSize, afterParagraph = false) {
  // Texto sin @ (Negritas) para conocer más adelante las filas en las que será dividido
  const tmpText = Text.split('@').join('');
  // Texto original
  const aText = Text.split(/\s+/);
  // Indice global que indicará la palabra a dibujar
  let iWord = 0;
  // Filas en las cuales se dividirá el texto
  Doc.setFontSize(fontSize);
  let rows = Doc.splitTextToSize(tmpText, Size);
  let lastRow = rows.length - 1;
  let lastX = 0, lastY = 0;
  let includedToParagraph = false;
  for (let i = 0, index = 0; i < rows.length; i++ , index++) {

    // Posicion X,Y para poner la palabra
    let tmpIncX = Point.x;
    let tmpIncY = Point.y + (index * lineBreak);

    if (afterParagraph && rows.length > 1 && i > 0 && !includedToParagraph) {
      tmpIncX = 52;
      rows.shift();
      rows = Doc.splitTextToSize(rows.join(' '), 138);
      i = 0;
      lastRow = rows.length - 1;
      includedToParagraph = true;
    }
    let longitud = rows[i].trim().split(/\s+/).length;
    let summation = 0;
    aText.slice(iWord, iWord + longitud).forEach((current) => {
      summation += Doc.getTextWidth(current);
    });
    let space = i === lastRow ? 1.5 : (Size - summation) / (longitud - 1);

    while (longitud > 0) {
      // Se obtiene la palabra del texto original a escribir
      let tmpWord = aText[iWord];

      if (typeof (tmpWord) !== 'undefined') {
        // Impresión de la palabra
        Doc.text(tmpWord, tmpIncX, tmpIncY);
        // Nueva posición
        tmpIncX += Doc.getTextWidth(tmpWord) + space;
        lastX = tmpIncX;
        lastY = tmpIncY;

      }
      // Se prosigue con la otra palabra
      longitud--;
      // Se incrementa el indice global
      iWord++;
    }
  }
  return lastY;
}