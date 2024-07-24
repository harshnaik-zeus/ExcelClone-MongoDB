document.addEventListener("DOMContentLoaded", function() {
   const id = document.getElementById('canvas1');
   const header = document.getElementById('canvas2');
   const excel = document.getElementById('canvas3');
   const container = document.getElementById('container');
   const fixheight = 40;
   const fixwidth = 150;
   id.width = fixheight;
   id.height = 2000;
   header.width = 7000;
   header.height = fixheight; // Sizing Table
   excel.height = 2000;
   excel.width = 7000;
   const a = id.getContext('2d');
   const b = header.getContext('2d');
   const c = excel.getContext('2d');
   let cellHeight = fixheight;
   let cellWidth = 150; // cell dimensions
   const rows = 20;
   const cols = 50;
   let startCell = null;
   let endCell = null;
   let laststart = null;
   let lastend = null;
   const topics = ["Email", "Name", "Country", "State", "City", "Phone", "Add1", "Add2", "DOB", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24" , " " , " " , " ", " " , " " , " "];
   const data = ["ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland", "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15", "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00", " " , " " , " ", " " , " " , " "];
   let cellWidths = [];
   let rowHeights = Array(cols).fill(cellHeight);
   for (let index = 0; index < topics.length; index++) {
       cellWidths[index] = cellWidth;
   }
   const drawHeaders = () => {
       let total = 0.5;
       b.textAlign = 'center';
       b.textBaseline = 'middle';
       b.font = '16px Quicksand';
       for (let i = 0; i < 26; i++) {
           let char = String.fromCharCode(65 + i); // A to Z header
           b.strokeRect(total, 0.5, cellWidths[i], cellHeight);
           b.fillText(char, total + cellWidths[i] / 2, cellHeight / 2);
           total += cellWidths[i];
       }
   }
   const drawIds = () => {
       a.textAlign = 'center';
       a.textBaseline = 'middle';
       a.font = '14px Quicksand';
       let y = 0.5;
       for (let i = 1; i < 1000; i++) { // 1 to 1000 id
           a.strokeRect(0.5, y, cellHeight, rowHeights[i-1]);
           a.fillText(i, cellHeight / 2, y + rowHeights[i-1] / 2);
           y += rowHeights[i-1];
       }
   }
   const drawExcel = () => {
       c.textAlign = 'left';
       c.textBaseline = 'middle';
       c.font = '20px Quicksand';
       c.fontWeight = '600'; // Table data filling
       let newtot = 0.5;
       for (let i = 0; i < rows; i++) {
           let heightSum = 0.5;
           for (let j = 0; j < cols; j++) {
               c.save();
               c.beginPath();
               c.rect(newtot, heightSum, cellWidths[i], rowHeights[j]);
               c.clip();
               c.fillStyle = 'black';
               if (j == 0) {
                   c.fillText(topics[i], newtot + 10, heightSum + rowHeights[j] / 2);
               } else {
                   c.fillText(data[i], newtot + 10, heightSum + rowHeights[j] / 2);
               }
               c.stroke();
               c.restore();
               heightSum += rowHeights[j];
           }
           newtot += cellWidths[i];
       }
   }
   function drawTable() {
       a.clearRect(0, 0, id.width, id.height);
       b.clearRect(0, 0, header.width, header.height);
       c.clearRect(0, 0, excel.width, excel.height);
       drawSelection();
       drawHeaders();
       drawIds();
       drawExcel();
   }
   const getCellAtPosition = (x, y) => {
       let col = 0;
       let row = 0;
       let yPos = y;
       let xPos = x;
       while (yPos > rowHeights[row] && row < rowHeights.length - 1) {
           yPos -= rowHeights[row];
           row++;
       }
       while (xPos > cellWidths[col] && col < cellWidths.length - 1) {
           xPos -= cellWidths[col];
           col++;
       }
       return { col, row };
   };
   const drawSelection = () => {
       if (startCell && endCell) {
           let startX = Math.min(startCell.col, endCell.col);
           let endX = Math.max(startCell.col, endCell.col);
           let startY = Math.min(startCell.row, endCell.row);
           let endY = Math.max(startCell.row, endCell.row);
           let heightSum = 0.5, widthSum = 0.5;
           let startHeight = 0.5, startWidth = 0.5;
           for (let row = 0; row < startY; row++) {
               heightSum += rowHeights[row];
           }
           startHeight = heightSum;
           c.save();
           c.beginPath();
           for (let row = startY; row <= endY; row++) {
               widthSum = 0.5;
               for (let col = 0; col < startX; col++) {
                   widthSum += cellWidths[col];
               }
               startWidth = widthSum;
               for (let col = startX; col <= endX; col++) {
                   c.fillStyle = '#e6ffe6';
                   c.fillRect(widthSum, heightSum, cellWidths[col], rowHeights[row]);
                   widthSum += cellWidths[col];
               }
               heightSum += rowHeights[row];
           }
           c.stroke();
           c.restore();
           b.save();
           b.beginPath();
           b.fillStyle = 'rgb(16,124,65)';
           b.fillRect(startWidth + 0.5, 0.5,widthSum - startWidth, cellHeight);
           b.stroke();
           b.restore();
           a.save();
           a.beginPath();
           a.fillStyle = 'rgb(16,124,65)';
           a.fillRect(0.5, startHeight + 0.5,cellWidth, heightSum - startHeight);
           a.stroke();
           a.restore();
           c.save();
           c.beginPath();
           c.lineWidth = 2;
           c.strokeStyle = 'rgb(16,124,65)';
           c.strokeRect(startWidth - 0.5, startHeight - 0.5,widthSum - startWidth + 1, heightSum - startHeight + 1);
           c.stroke();
           c.restore();
       }
   }
   let toggle = false;
   excel.addEventListener('pointerdown', (event) => {
       const rect = excel.getBoundingClientRect();
       let x = event.clientX - rect.left;
       let y = event.clientY - rect.top;
       startCell = getCellAtPosition(x, y);
       endCell = startCell;
    //    toggle = true;
    //    console.log(toggle);
       drawTable();
   });
   excel.addEventListener('pointermove', (event) => {
       if (startCell) {
           const rect = excel.getBoundingClientRect();
           let x = event.clientX - rect.left;
           let y = event.clientY - rect.top;
           endCell = getCellAtPosition(x, y);
           drawTable();
       }
   });
   let prevcell = null;
   excel.addEventListener('pointerup', (event) => {
       prevcell = endCell;
       startCell = null;
       endCell = null;
   });
   
//    let firststart = {col:prevcell.col,row:prevcell.row};
//    startCell = {col:firststart.col,row:firststart.row};

   document.addEventListener('keydown' , (event) => {
    
    event.preventDefault();
      if (event.shiftKey) {
      }
      else{
        if (event.key == 'ArrowUp') {
            prevcell.row = Math.max(0 , prevcell.row - 1);
            startCell = prevcell;
            endCell = prevcell;
            drawTable();
          }
          else if (event.key == 'ArrowDown') {
            prevcell.row += 1;
            startCell = prevcell;
            endCell = prevcell;
            drawTable();
          }
          else if(event.key == 'ArrowLeft'){
            prevcell.col = Math.max(0 , prevcell.col - 1);
            startCell = prevcell;
            endCell = prevcell;
            drawTable();
          }
          else if (event.key == 'ArrowRight') {
            prevcell.col += 1;
            startCell = prevcell;
            endCell = prevcell;
            drawTable();
          }
      }
      startCell = null;
      endCell = null;
    //   event.scrollIntoView();
   });

   header.addEventListener('click', (event) => {
       const rect = header.getBoundingClientRect();
       const x = event.clientX - rect.left;
       const y = event.clientY - rect.top;
       const cell = getCellAtPosition(x, y);
       const clickedCol = cell.col;
       startCell = { row: 0, col: clickedCol };
       endCell = { row: cols - 1, col: clickedCol };
       drawTable();
       startCell = null;
       endCell = null;
   });
   id.addEventListener('click', (event) => {
       const rect = id.getBoundingClientRect();
       const x = event.clientX - rect.left;
       const y = event.clientY - rect.top;
       const cell = getCellAtPosition(x, y);
       const clickedRow = cell.row;
       startCell = { row: clickedRow, col: 0 };
       endCell = { row: clickedRow, col: 14 };
       drawTable();
       startCell = null;
       endCell = null;
   });
   header.addEventListener('dblclick', (event) => {
       let h = event.clientX;
       let col = 0;
       let widthSum = 0;
       while (h > widthSum + cellWidths[col] && col < cellWidths.length - 1) {
           widthSum += cellWidths[col];
           col++;
       }
       cellWidths[col] = Math.max(b.measureText(topics[col]).width + 70, b.measureText(data[col]).width + 70, 150);
       drawTable();
   });
   let startpoint = null;
   let endpoint = null;
   let target = -1;
   let isMoving = false;
   header.addEventListener('pointerdown', (event) => {
       startpoint = event.offsetX;
       let sum = 0;
       for (let index = 0; index < cellWidths.length; index++) {
           sum += cellWidths[index];
           if (Math.abs(sum - startpoint) <= 10) {
               target = index;
               isMoving = true;
           }
       }
   });
//    window.addEventListener('pointermove' ,(event) => {
     
//     let org = cellWidths[target];
//      if (isMoving) {
//         let currpoint = event.offsetX;
//         let currdiff = currpoint - startpoint;
//         cellWidths[target] += currdiff;
//         // drawHeaders();
//         b.clearRect(0, 0, header.width, header.height);
//         drawSelection();
//         drawHeaders();
//         cellWidths[target] = org;
//         console.log("hello");
//      }

//    });

   header.addEventListener('pointerup', (event) => {
       isMoving = false;
       endpoint = event.offsetX;
       let diff = endpoint - startpoint;
       if((cellWidths[target] + diff) <= 40) diff = 0;
       cellWidths[target] += diff;
       drawTable();
   });
   let rowStartPoint = null;
   let rowEndPoint = null;
   let rowTarget = -1;
   id.addEventListener('pointerdown', (event) => {
       rowStartPoint = event.offsetY;
       let sum = 0;
       for (let index = 0; index < rowHeights.length; index++) {
           sum += rowHeights[index];
           if (Math.abs(sum - rowStartPoint) <= 10) {
               rowTarget = index;
           }
       }
   });
   id.addEventListener('pointerup', (event) => {
       rowEndPoint = event.offsetY;
       let diff = rowEndPoint - rowStartPoint;
       if((rowHeights[rowTarget] + diff) <= 20) diff = 0;
       rowHeights[rowTarget] += diff;
       drawTable();
   });
   drawTable();
});                                                                                                                                                                                                                                                                                                                