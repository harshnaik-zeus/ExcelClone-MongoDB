document.addEventListener("DOMContentLoaded", function () {
  const id = document.getElementById("canvas1");
  const header = document.getElementById("canvas2");
  const excel = document.getElementById("canvas3");
  const container = document.getElementById("container");
  let scale = window.devicePixelRatio;
  let fixheight = 20;
  let fixwidth = 100;
  let excelheight = 1000;
  let excelwidth = 2000;
  id.width = fixheight;
  id.height = excelheight;
  header.width = excelwidth;
  header.height = fixheight; // Sizing Table
  excel.height = excelheight;
  excel.width = excelwidth;
  // ctx.scale(scale, scale);
  const a = id.getContext("2d");
  const b = header.getContext("2d");
  const c = excel.getContext("2d");
  let cellHeight = fixheight;
  let cellWidth = fixwidth; // cell dimensions
 
  const rows = 20;
  const cols = 50;
  let startCell =  null;
  let endCell = null;
  let laststart = null;
  let lastend = null;
  const topics = [
    "Email",
    "Name",
    "Country",
    "State",
    "City",
    "Phone",
    "Add1",
    "Add2",
    "DOB",
    "2019-20",
    "2020-21",
    "2021-22",
    "2022-23",
    "2023-24",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
  ];
  const data = [
    "ncooper@hotmail.com",
    "Kristen Robinson",
    "Jordan",
    "North Dakota",
    "West Valerieland",
    "(187)741-6224x24308",
    "2002 Seth Roads Suite 553",
    "Apt. 132",
    "1973-07-15",
    "92,890.00",
    "128,252.00",
    "123,602.00",
    "148,513.00",
    "78,362.00",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
  ];
  let cellWidths = [];
  let rowHeights = Array(cols).fill(cellHeight);
  for (let index = 0; index < topics.length; index++) {
    cellWidths[index] = cellWidth;
  }

  // const UpdateDevicePixelRatio = () => {
  //   const scale = window.devicePixelRatio || 1;

  //   fixheight *= scale;
  //   fixwidth *= scale
  //   excelheight *= scale;
  //   excelwidth *= scale;

  //   a.scale(scale,scale);
  //   a.scale(scale,scale);
  //   b.scale(scale,scale);
  // };

  const drawHeaders = () => {
    let start = 0.5;
    b.textAlign = "center";
    b.textBaseline = "middle";
    b.font = "12px Calibri";
    for (let i = 0; i < 26; i++) {
      let char = String.fromCharCode(65 + i); // A to Z header
      b.save();
      b.beginPath();
      b.lineWidth = 0.2;
      b.moveTo(start , 0);
      b.lineTo(start, fixheight);
      b.fillText(char , start + cellWidths[i]/2 , fixheight/2);
      start += cellWidths[i];
      b.stroke();
      b.restore();
    }
  };
  const drawIds = () => {
    a.textAlign = "center";
    a.textBaseline = "middle";
    a.font = "10px Calibri";
    let start = 0.5;
    for (let i = 0; i < 50; i++) {
      a.save();
      a.beginPath();
      a.lineWidth = 0.2;
      a.moveTo(0 , start);
      a.lineTo(fixheight , start);
      start += rowHeights[i];
      a.fillText( i + 1, fixheight/2, start - rowHeights[i]/2);
      a.stroke();
      a.restore();
    }
  };
  const drawExcel = () => {
    c.textAlign = "left";
    c.textBaseline = "middle";
    c.font = "14px Calibri";
    c.fontWeight = "600"; // Table data filling
    let startX = 0.5;
    let startY = 0.5;

    for (let index = 0; index <= cellWidths.length; index++) {
     c.save();
     c.beginPath();
     c.moveTo(startX , 0);
     c.lineTo(startX, excelheight);
     c.lineWidth = 0.3;
     c.fillStyle = "#e3e3e3";
     startX += cellWidths[index]; 
     c.stroke();
     c.restore();
    }

    for (let index = 0; index <= rowHeights.length; index++) {
      c.save();
      c.beginPath();
      c.moveTo(0 , startY);
      c.lineTo(excelwidth, startY);
      c.lineWidth = 0.3;
      c.fillStyle = "#e3e3e3";
      startY += rowHeights[index]; 
      c.stroke();
      c.restore();
     }
  };
  
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

  let marchingants = false;
  let marchingx = -1;
  let marchingy = -1;
  let marchingwidth = -1;
  let marchingheight = -1;
  const drawSelection = () => {
    if (startCell && endCell) {
      let startX = Math.min(startCell.col, endCell.col);
      let endX = Math.max(startCell.col, endCell.col);
      let startY = Math.min(startCell.row, endCell.row);
      let endY = Math.max(startCell.row, endCell.row);
      let heightSum = 0.5,
        widthSum = 0.5;
      let startHeight = 0.5,
        startWidth = 0.5;
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
          c.fillStyle = "#e6ffe6";
          c.fillRect(widthSum, heightSum, cellWidths[col], rowHeights[row]);
          widthSum += cellWidths[col];
        }
        heightSum += rowHeights[row];
      }
      c.stroke();
      c.restore();
      // c.save();
      // c.beginPath();
      // c.fillStyle = "white";
      // c.fillRect(widthSum, heightSum, cellWidths[startX], rowHeights[startY]);
      // c.stroke();
      // c.restore();
      b.save();
      b.beginPath();
      if (headselection) {
        b.fillStyle = "#107c41";
      }
      else{
        b.fillStyle = "#caead8";
      }
      b.fillRect(startWidth + 0.5, 0.5, widthSum - startWidth, cellHeight);
      // b.beginPath();
      b.stroke();
      b.restore();
      a.save();
      a.beginPath();
      if (idselection) {
        a.fillStyle = "#107c41";
      }
      else{
        a.fillStyle = "#caead8";
      }
      a.fillRect(0.5, startHeight + 0.5, cellWidth, heightSum - startHeight);
      a.stroke();
      a.restore();
      c.save();
      c.beginPath();
      // c.lineWidth = 2;
      c.strokeStyle = "rgb(16,124,65)";
      c.strokeRect(
        startWidth - 0.5,
        startHeight - 0.5,
        widthSum - startWidth + 1,
        heightSum - startHeight + 1
      );
      // console.log("border");
      c.stroke();
      c.restore();
      laststart = startCell;
      lastend = endCell;
      // marchingants = true;
      marchingx = startWidth - 0.5;
      marchingy = startHeight - 0.5;
      marchingwidth = widthSum - startWidth + 1;
      marchingheight = heightSum - startHeight + 1;
    }
    if (marchingants) {
      
    drawants();
    }
  };

  function drawants(){
    ants.style.display = 'block';
    console.log(marchingx , marchingy , marchingwidth, marchingheight);
    ants.style.left = `${marchingx + 20}px`;
    ants.style.top = `${marchingy + 20}px`;
    ants.style.width = `${marchingwidth - 14}px`;
    ants.style.height = `${marchingheight - 14}px`;
  }



  let isSelected = false,
    widthresize = false,
    heightresize = false;
  let prevcell = null;


  excel.addEventListener("pointerdown", (event) => {
    isSelected = true;
    widthresize = false;
    heightresize = false;
    const rect = excel.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    startCell = getCellAtPosition(x, y);
    endCell = startCell;
    drawTable();
    // let txtbox = this.getElementById('ipbox');
    // txtbox.style.display = 'block';
    
  });

  let startpoint = null;
  let endpoint = null;
  let target = -1;
  let isHeadMoving = false;
  let headselection = false;
  let headtarget = -1;
  let surplus = 0;

  header.addEventListener("pointerdown", (event) => {
    isSelected = false;
    widthresize = true;
    heightresize = false;
    let dotline = document.getElementById('dottedline');
    dotline.style.display = 'none';
    startpoint = event.offsetX;
    let sum = 0;
    for (let index = 0; index < cellWidths.length; index++) {
      sum += cellWidths[index];
      if (Math.abs(sum - startpoint) <= 10) {
        isHeadMoving = true;
        surplus = sum - startpoint;
        target = index;
        // header.style.cursor = "col-resize";
        return;
      }
      else if (startpoint <= sum){
        headselection = true;
        headtarget = index;  
        return;
      }
    }
  });

  let rowStartPoint = null;
  let rowEndPoint = null;
  let rowTarget = -1;
  let isIdMoving = false;
  let idselection = false;
  let idtarget = false;
  let idsurplus = 0;

  id.addEventListener("pointerdown", (event) => {
    isSelected = false;
    widthresize = false;
    heightresize = true;
    let dotline = document.getElementById('dottedline');
    dotline.style.display = 'none';
    const rect = excel.getBoundingClientRect();
    rowStartPoint = event.clientY - rect.top;
    let sum = 0;
    for (let index = 0; index < rowHeights.length; index++) {
      sum += rowHeights[index];
      if (Math.abs(sum - rowStartPoint) <= 5) {
        rowTarget = index;
        idsurplus = sum - rowStartPoint;
        isIdMoving = true;
        // console.log("yes");
        return;
      }
      else if(rowStartPoint <= sum){
         idselection = true;
         idtarget = index;
        //  console.log("no");
         return;
      }
    }
  });

  document.addEventListener("pointermove", (event) => {
    if (isSelected) {
      if (startCell) {
        const rect = excel.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        endCell = getCellAtPosition(x, y);
        drawTable();
      }
    }

    if (widthresize && isHeadMoving) {
      let org = cellWidths[target];
      const rect = excel.getBoundingClientRect();
      let currpoint = event.clientX - rect.left;
      let currdiff = currpoint - startpoint;
      cellWidths[target] += currdiff;
      b.clearRect(0, 0, header.width, header.height);
      startCell = laststart;
      endCell = lastend;
      // headselection = true;
      // drawTable();
      // drawSelection();
      drawHeaders();
      // headselection = false;
      cellWidths[target] = org;
      let dotline = document.getElementById('dottedline');
      dotline.style.display = 'block';
      dotline.style.left = `${event.clientX - rect.x + 20 + surplus}px`;
      dotline.style.top = '20px';
      dotline.style.borderTop = 'none';
      dotline.style.borderLeft = '2px  dotted #999';
      // console.log(target);
    }

    if (heightresize && isIdMoving) {
        const rect = excel.getBoundingClientRect();
        let org = rowHeights[rowTarget];
        let currpoint = event.clientY - rect.top;
        let currdiff = currpoint - rowStartPoint;
        rowHeights[rowTarget] += currdiff;
        a.clearRect(0, 0, id.width, id.height);
        startCell = laststart;
        endCell = lastend;
        // drawTable();
        // drawSelection();
        drawIds();
        rowHeights[rowTarget] = org;
        let dotline = document.getElementById('dottedline');
        dotline.style.display = 'block';
        dotline.style.left = '20px';
        dotline.style.top = `${event.clientY - rect.y + 20 + idsurplus}px`
        dotline.style.borderTop = '2px dotted #999';
        dotline.style.borderLeft = 'none';
    }

    if (headselection && !isHeadMoving) {
      startCell = { col: headtarget, row:0 };
      let x = event.offsetX;
      let y = 0;
      endCell = getCellAtPosition(x,y);
      endCell.row = cols - 1;
      drawTable();
      // console.log(startCell , endCell);

    }

    if (idselection && !isIdMoving) {
      startCell = {col:0 , row: idtarget};
      let x = 0;
      let y = event.offsetY;
      endCell = getCellAtPosition(x,y);
      endCell.col = rows - 1;
      drawTable();
    }
  });
let prevstart = null;
  document.addEventListener("pointerup", (event) => {
    if (isSelected) {
      prevcell = endCell;
      prevstart = startCell;
      startCell = null;
      endCell = null;
      // console.log(prevstart, prevcell);
    }

    if (widthresize && isHeadMoving) {
      const rect = excel.getBoundingClientRect();
      endpoint = event.clientX - rect.left;
      let diff = endpoint - startpoint;
      if (cellWidths[target] + diff <= 40) diff = 0;
      cellWidths[target] += diff;
      isHeadMoving = false;
      let dotline = document.getElementById('dottedline');
      dotline.style.display = 'none';
      startCell = laststart;
      endCell = lastend;
      marchingants = true;
      drawTable();
      marchingants = false;
    }

    if (heightresize && isIdMoving) {
      const rect = excel.getBoundingClientRect();
      rowEndPoint = event.clientY - rect.top;
      let diff = rowEndPoint - rowStartPoint;
      if (rowHeights[rowTarget] + diff <= 20) diff = 0;
      rowHeights[rowTarget] += diff;
      isIdMoving = false;
      let dotline = document.getElementById('dottedline');
      dotline.style.display = 'none';
      startCell = laststart;
      endCell = lastend;
      marchingants = true;
      drawTable();
      marchingants = false;
    }

    if(headselection && !isHeadMoving) {
      startCell = { col: headtarget, row:0 };
      let x = event.offsetX;
      let y = 0;
      endCell = getCellAtPosition(x,y);
      endCell.row = cols - 1;
      // marchingants = true;
      drawTable();
      // marchingants = false;
      prevcell = startCell;
      startCell = null;
      endCell = null;
      headselection = false;
    }

    if (idselection && !isIdMoving) {
      startCell = {col:0 , row: idtarget};
      let x = 0;
      let y = event.offsetY;
      endCell = getCellAtPosition(x,y);
      endCell.col = rows - 1;
      laststart = startCell;
      lastend = endCell;
      // marchingants = true;
      drawTable();
      // marchingants = false;
      prevcell = startCell;
      startCell = null;
      endCell = null;
      idselection = false;
    }
  });
  let ants = this.querySelector(".marching-ants");
  document.addEventListener("keydown", (event) => {
  event.preventDefault();
    if (event.shiftKey) {
      if (!startCell) {
        startCell = { col: laststart.col, row: laststart.row };
        endCell = { col: lastend.col, row: lastend.row };
      }
      if (event.key == "ArrowUp") {
        endCell.row = Math.max(0, endCell.row - 1);
      } else if (event.key == "ArrowDown") {
        endCell.row += 1;
      } else if (event.key == "ArrowLeft") {
        endCell.col = Math.max(0, endCell.col - 1);
      } else if (event.key == "ArrowRight") {
        endCell.col += 1;
      }
      // endCell = prevcell;
      drawTable();
    }  
    else if (event.ctrlKey) {
      if (event.key == "c" || event.key == "C") {
        startCell = laststart;
        endCell = lastend;
        marchingants = true;
        drawTable();
        marchingants = false;
      }
      else if (event.key == "V" || event.key == "v") {
        ants.style.display = 'none';
      }
      else if (event.key == "X" || event.key == "x") {
        console.log("cut");
      }
    }
    else {
      startCell = { col: laststart.col, row: laststart.row };
        endCell = { col: lastend.col, row: lastend.row };
      if (event.key == "ArrowUp") {
        prevcell.row = Math.max(0, prevcell.row - 1);
      } else if (event.key == "ArrowDown") {
        prevcell.row += 1;
      } else if (event.key == "ArrowLeft") {
        prevcell.col = Math.max(0, prevcell.col - 1);
      } else if (event.key == "ArrowRight") {
        prevcell.col += 1;
      }
      startCell = prevcell;
      endCell = prevcell;
      // prevstart = endCell;
      drawTable();
      startCell = null;
      endCell = null; 
    }
  });

  document.addEventListener("keyup", (event) => {
    if (!event.shiftKey) {
      startCell = null;
      endCell = null;
    }
  });

  // header.addEventListener("click", (event) => {
  //   const rect = header.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;
  //   const cell = getCellAtPosition(x, y);
  //   const clickedCol = cell.col;
  //   startCell = { row: 0, col: clickedCol };
  //   endCell = { row: cols - 1, col: clickedCol };
  //   drawTable();
  //   startCell = null;
  //   endCell = null;
  // });

  // id.addEventListener("click", (event) => {
  //   const rect = id.getBoundingClientRect();
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;
  //   const cell = getCellAtPosition(x, y);
  //   const clickedRow = cell.row;
  //   startCell = { row: clickedRow, col: 0 };
  //   endCell = { row: clickedRow, col: 20 };
  //   drawTable();
  //   startCell = null;
  //   endCell = null; 
  // });

  header.addEventListener("dblclick", (event) => {
    let h = event.clientX;
    let col = 0;
    let widthSum = 0;
    while (h > widthSum + cellWidths[col] && col < cellWidths.length - 1) {
      widthSum += cellWidths[col];
      col++;
    }
    cellWidths[col] = Math.max(
      b.measureText(topics[col]).width + 40,
      b.measureText(data[col]).width + 40,
      100
    );
    drawTable();
  });
  let prevScale = 1;
  // window.addEventListener("resize" , () => {
  //   scale = window.devicePixelRatio;
  //   // scale = Math.ceil(scale);
  //   fixwidth = Math.ceil(fixwidth/prevScale)*scale;
  //   fixheight  = Math.ceil(fixheight/prevScale)*scale;
  //   id.width  = Math.ceil(id.width/prevScale)*scale;
  //   id.height  = Math.ceil(id.height/prevScale)*scale;
  //   // header.height *= scale;
  //   header.width = Math.ceil( header.width/prevScale)*scale;
  //   excel.width  = Math.ceil(excel.width/prevScale)*scale;
  //   excel.height  = Math.ceil(excel.height/prevScale)*scale;
  //   // a.scale(scale,scale);
  //   // b.scale(scale,scale);
  //   // c.scale(scale,scale);
  //   drawTable();
  //   console.log(id.width);
  //   console.log(scale);
  //   prevScale = scale;
  // });
 

  drawTable();
});