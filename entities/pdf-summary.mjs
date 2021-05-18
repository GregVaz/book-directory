import { jsPDF } from "jspdf";

export default function pdfSummary(booklist) {
  const WIDTH = 216;
  const MARGIN_LEFT = 20;
  let separate = 60;
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
    separate += 10;
  };
  doc.setTextColor(189, 189, 189);
  doc.text('Av. Imagine #5520 Street. Fall C.P. 01918', (WIDTH / 2) + 5, 260, { align: 'center' });
  doc.text('State, Country Phone. 01 011 212 122.',
    (WIDTH / 2) + 5, 265, { align: 'center' });
  doc.text('email: codertset@gmail.com', (WIDTH / 2) + 5, 270, { align: 'center' });
  
  doc.save('summary-books.pdf');
}