const fs = require('fs');
const path = require('path');

const docXml = fs.readFileSync(path.join(__dirname, '../public/extracted_docx/word/document.xml'), 'utf8');
const relsXml = fs.readFileSync(path.join(__dirname, '../public/extracted_docx/word/_rels/document.xml.rels'), 'utf8');

// Parse rels
const relMap = {};
const relRegex = /<Relationship[^>]+Id="([^"]+)"[^>]+Target="([^"]+)"/g;
let match;
while ((match = relRegex.exec(relsXml)) !== null) {
  relMap[match[1]] = match[2];
}

const destDir = path.join(__dirname, '../public/students');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 25 students in exact correct format
const students = [
  { id: "std_1", name: "ADEMIR BRAZ", searchKey: "ADEMIR" },
  { id: "std_2", name: "ALEX JUNIOR BAGGIO", searchKey: "BAGGIO" },
  { id: "std_3", name: "ALEXANDRA REBONATTO", searchKey: "REBONATTO" },
  { id: "std_4", name: "AMAURI TOMAZELI", searchKey: "TOMAZELI" },
  { id: "std_5", name: "CESAR AUGUSTO VALDAMERI", searchKey: "VALDAMERI" },
  { id: "std_6", name: "EDERSON RICHARD ANTON", searchKey: "ANTON" },
  { id: "std_7", name: "EDSON LUCAS DE OLIVEIRA", searchKey: "EDSON" },
  { id: "std_8", name: "FABIO CHAGA", searchKey: "CHAGA" },
  { id: "std_9", name: "GUILHERME RADIN", searchKey: "RADIN" },
  { id: "std_10", name: "JOSIMAR LORENZON", searchKey: "LORENZON" },
  { id: "std_11", name: "JULIANO HENRIQUE KOFF", searchKey: "KOFF" },
  { id: "std_12", name: "LEILA CARMEM KOTHE", searchKey: "KOTHE" },
  { id: "std_13", name: "LUCAS AMAURY LAUX", searchKey: "LAUX" },
  { id: "std_14", name: "LUCAS HENRIQUE GALINA ZANATTA", searchKey: "ZANATTA" },
  { id: "std_15", name: "MARCIO BUSKO", searchKey: "BUSKO" },
  { id: "std_16", name: "MARCIO DA ROSA", searchKey: "ROSA" },
  { id: "std_17", name: "MARCOS JOEL BUSANELLO", searchKey: "BUSANELLO" },
  { id: "std_18", name: "MARIZA VICARI ALESSI", searchKey: "VICARI" },
  { id: "std_19", name: "MAURICIO DE MELLO", searchKey: "MAURICIO" },
  { id: "std_20", name: "RENAN RIBEIRO DE MELLO", searchKey: "RIBEIRO" },
  { id: "std_21", name: "RENAN VINICIUS GARCIA", searchKey: "GARCIA" },
  { id: "std_22", name: "RICARDO MOLOSSI PACHECO FERREIRA", searchKey: "MOLOSSI" },
  { id: "std_23", name: "ROGERIO LUIZ FAGUNDES POPPI", searchKey: "POPPI" },
  { id: "std_24", name: "WESLEY IVAN TRISSOLDI", searchKey: "TRISSOLDI" },
  { id: "std_25", name: "WILLYAN FABIO DALACORTE", searchKey: "DALACORTE" }
];

const rows = docXml.split(/<w:tr[\s>]/);
const finalStudentList = [];

for (const student of students) {
  let matchedPhoto = null;
  for (const row of rows) {
    if (row.includes(student.searchKey)) {
      const blipMatch = /r:embed="([^"]+)"/.exec(row);
      const rId = blipMatch ? blipMatch[1] : null;
      const target = rId ? relMap[rId] : null;
      if (target) {
        const origFile = path.basename(target);
        const ext = path.extname(origFile);
        const safeName = student.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_') + ext;
        const srcPath = path.join(__dirname, '../public/extracted_docx/word', target);
        const destPath = path.join(destDir, safeName);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
          matchedPhoto = `/students/${safeName}`;
        }
      }
      break;
    }
  }
  finalStudentList.push({
    id: student.id,
    name: student.name,
    photo: matchedPhoto
  });
}

console.log(`Successfully mapped all ${finalStudentList.length} students:`);
finalStudentList.forEach(s => console.log(`✓ ${s.name} -> ${s.photo}`));

const dataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
fs.writeFileSync(path.join(dataDir, 'studentsData.json'), JSON.stringify(finalStudentList, null, 2));
