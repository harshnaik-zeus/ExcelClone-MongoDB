class ExcelSheet {
  constructor() {
    /**
     * @type {HTMLCanvasElement} Main Body, initializing Excel.
     */
    this.id = document.getElementById("canvas1");
    this.header = document.getElementById("canvas2");
    this.excel = document.getElementById("canvas3");
    this.container = document.getElementById("container");
    this.scale = window.devicePixelRatio;
    this.fixheight = 20;
    this.fixwidth = 100;
    this.excelheight = 1000;
    this.excelwidth = 2000;
    this.cellHeight = this.fixheight;
    this.cellWidth = this.fixwidth;
    this.rows = 20;
    this.cols = 50;
    this.startCell = null;
    this.endCell = null;
    this.laststart = null;
    this.lastend = null;

    /**
     * Data call from database
     */
    this.topics = [
      "Email", "Name", "Country", "State", "City", "Phone", "Add1", "Add2", "DOB",
      "2019-20", "2020-21", "2021-22", "2022-23", "2023-24",
      " ", " ", " ", " ", " ", " "
    ];
    this.data = [
      "ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland",
      "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15",
      "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00",
      " ", " ", " ", " ", " ", " "
    ];
    this.cellWidths = Array(this.topics.length).fill(this.cellWidth);
    this.rowHeights = Array(this.cols).fill(this.cellHeight);
    this.marchingants = false;
    this.marchingx = -1;
    this.marchingy = -1;
    this.marchingwidth = -1;
    this.marchingheight = -1;
    this.isSelected = false;
    this.widthresize = false;
    this.heightresize = false;
    this.prevcell = null;
    this.startpoint = null;
    this.endpoint = null;
    this.target = -1;
    this.isHeadMoving = false;
    this.headselection = false;
    this.headtarget = -1;
    this.surplus = 0;
    this.rowStartPoint = null;
    this.rowEndPoint = null;
    this.rowTarget = -1;
    this.isIdMoving = false;
    this.idselection = false;
    this.idtarget = false;
    this.idsurplus = 0;
    this.prevstart = null;
    this.ants = document.querySelector(".marching-ants");

    this.initializeCanvas();
    this.addEventListeners();
    this.drawTable();
  }


  initializeCanvas() {
    this.id.width = this.fixheight;
    this.id.height = this.excelheight;
    this.header.width = this.excelwidth;
    this.header.height = this.fixheight;
    this.excel.height = this.excelheight;
    this.excel.width = this.excelwidth;
    this.a = this.id.getContext("2d");
    this.b = this.header.getContext("2d");
    this.c = this.excel.getContext("2d");
  }

  addEventListeners() {
    this.excel.addEventListener("pointerdown", this.handleExcelPointerDown.bind(this));
    this.header.addEventListener("pointerdown", this.handleHeaderPointerDown.bind(this));
    this.id.addEventListener("pointerdown", this.handleIdPointerDown.bind(this));
    document.addEventListener("pointermove", this.handlePointerMove.bind(this));
    document.addEventListener("pointerup", this.handlePointerUp.bind(this));
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.header.addEventListener("dblclick", this.handleHeaderDoubleClick.bind(this));
    this.excel.addEventListener("dblclick", this.handleExcelDoubleClick.bind(this));
  }

  drawHeaders() {
    let start = 0.5;
    this.b.textAlign = "center";
    this.b.textBaseline = "middle";
    this.b.font = "12px Calibri";
    for (let i = 0; i < 26; i++) {
      let char = String.fromCharCode(65 + i);
      this.b.save();
      this.b.beginPath();
      this.b.lineWidth = 0.2;
      this.b.moveTo(start, 0);
      this.b.lineTo(start, this.fixheight);
      this.b.fillText(char, start + this.cellWidths[i] / 2, this.fixheight / 2);
      start += this.cellWidths[i];
      this.b.stroke();
      this.b.restore();
    }
  }

  drawIds() {
    this.a.textAlign = "center";
    this.a.textBaseline = "middle";
    this.a.font = "10px Calibri";
    let start = 0.5;
    for (let i = 0; i < 50; i++) {
      this.a.save();
      this.a.beginPath();
      this.a.lineWidth = 0.2;
      this.a.moveTo(0, start);
      this.a.lineTo(this.fixheight, start);
      start += this.rowHeights[i];
      this.a.fillText(i + 1, this.fixheight / 2, start - this.rowHeights[i] / 2);
      this.a.stroke();
      this.a.restore();
    }
  }

  drawExcel() {
    this.c.textAlign = "left";
    this.c.textBaseline = "middle";
    this.c.font = "14px Calibri";
    this.c.fontWeight = "600";
    let startX = 0.5;
    let startY = 0.5;

    for (let index = 0; index <= this.cellWidths.length; index++) {
      this.c.save();
      this.c.beginPath();
      this.c.moveTo(startX, 0);
      this.c.lineTo(startX, this.excelheight);
      this.c.lineWidth = 0.3;
      this.c.fillStyle = "#e3e3e3";
      startX += this.cellWidths[index];
      this.c.stroke();
      this.c.restore();
    }

    for (let index = 0; index <= this.rowHeights.length; index++) {
      this.c.save();
      this.c.beginPath();
      this.c.moveTo(0, startY);
      this.c.lineTo(this.excelwidth, startY);
      this.c.lineWidth = 0.3;
      this.c.fillStyle = "#e3e3e3";
      startY += this.rowHeights[index];
      this.c.stroke();
      this.c.restore();
    }
  }

  drawTable() {
    this.a.clearRect(0, 0, this.id.width, this.id.height);
    this.b.clearRect(0, 0, this.header.width, this.header.height);
    this.c.clearRect(0, 0, this.excel.width, this.excel.height);
    this.drawSelection();
    this.drawHeaders();
    this.drawIds();
    this.drawExcel();
  }

  /**
   * @param {x-position of event} x 
   * @param {y-position of event} y 
   * @returns cell-position
   */

  getCellAtPosition(x, y) {
    let col = 0;
    let row = 0;
    let yPos = y;
    let xPos = x;
    while (yPos > this.rowHeights[row] && row < this.rowHeights.length - 1) {
      yPos -= this.rowHeights[row];
      row++;
    }
    while (xPos > this.cellWidths[col] && col < this.cellWidths.length - 1) {
      xPos -= this.cellWidths[col];
      col++;
    }
    return { col, row };
  }


  /**
   * Draws Big selection green box behind all three canvas and adds rect with a border to give selection effect
   */

  drawSelection() {
    if (this.startCell && this.endCell) {
      let startX = Math.min(this.startCell.col, this.endCell.col);
      let endX = Math.max(this.startCell.col, this.endCell.col);
      let startY = Math.min(this.startCell.row, this.endCell.row);
      let endY = Math.max(this.startCell.row, this.endCell.row);
      let heightSum = 0.5,
        widthSum = 0.5;
      let startHeight = 0.5,
        startWidth = 0.5;
      for (let row = 0; row < startY; row++) {
        heightSum += this.rowHeights[row];
      }
      startHeight = heightSum;
      this.c.save();
      this.c.beginPath();
      for (let row = startY; row <= endY; row++) {
        widthSum = 0.5;
        for (let col = 0; col < startX; col++) {
          widthSum += this.cellWidths[col];
        }
        startWidth = widthSum;
        for (let col = startX; col <= endX; col++) {
          this.c.fillStyle = "#e6ffe6";
          this.c.fillRect(widthSum, heightSum, this.cellWidths[col], this.rowHeights[row]);
          widthSum += this.cellWidths[col];
        }
        heightSum += this.rowHeights[row];
      }
      this.c.stroke();
      this.c.restore();

      this.b.save();
      this.b.beginPath();
      if (this.headselection) {
        this.b.fillStyle = "#107c41";
      } else {
        this.b.fillStyle = "#caead8";
      }
      this.b.fillRect(startWidth + 0.5, 0.5, widthSum - startWidth, this.cellHeight);
      this.b.stroke();
      this.b.restore();

      this.a.save();
      this.a.beginPath();
      if (this.idselection) {
        this.a.fillStyle = "#107c41";
      } else {
        this.a.fillStyle = "#caead8";
      }
      this.a.fillRect(0.5, startHeight + 0.5, this.cellWidth, heightSum - startHeight);
      this.a.stroke();
      this.a.restore();

      this.c.save();
      this.c.beginPath();
      this.c.strokeStyle = "rgb(16,124,65)";
      this.c.strokeRect(
        startWidth - 0.5,
        startHeight - 0.5,
        widthSum - startWidth + 1,
        heightSum - startHeight + 1
      );
      this.c.stroke();
      this.c.restore();

      this.laststart = this.startCell;
      this.lastend = this.endCell;
      this.marchingx = startWidth - 0.5;
      this.marchingy = startHeight - 0.5;
      this.marchingwidth = widthSum - startWidth + 1;
      this.marchingheight = heightSum - startHeight + 1;
    }
    if (this.marchingants) {
      this.drawants();
    }
  }

  drawants() {
    this.ants.style.display = 'block';
    this.ants.style.left = `${this.marchingx + 20}px`;
    this.ants.style.top = `${this.marchingy + 20}px`;
    this.ants.style.width = `${this.marchingwidth - 14}px`;
    this.ants.style.height = `${this.marchingheight - 14}px`;
  }

  handleExcelPointerDown(event) {
    this.isSelected = true;
    this.widthresize = false;
    this.heightresize = false;
    const rect = this.excel.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    this.startCell = this.getCellAtPosition(x, y);
    this.endCell = this.startCell;
    this.drawTable();
  }

  handleHeaderPointerDown(event) {
    this.isSelected = false;
    this.widthresize = true;
    this.heightresize = false;
    let dotline = document.getElementById('dottedline');
    dotline.style.display = 'none';
    this.startpoint = event.offsetX;
    let sum = 0;
    for (let index = 0; index < this.cellWidths.length; index++) {
      sum += this.cellWidths[index];
      if (Math.abs(sum - this.startpoint) <= 10) {
        this.isHeadMoving = true;
        this.surplus = sum - this.startpoint;
        this.target = index;
        return;
      } else if (this.startpoint <= sum) {
        this.headselection = true;
        this.headtarget = index;
        return;
      }
    }
  }

  handleIdPointerDown(event) {
    this.isSelected = false;
    this.widthresize = false;
    this.heightresize = true;
    let dotline = document.getElementById('dottedline');
    dotline.style.display = 'none';
    const rect = this.excel.getBoundingClientRect();
    this.rowStartPoint = event.clientY - rect.top;
    let sum = 0;
    for (let index = 0; index < this.rowHeights.length; index++) {
      sum += this.rowHeights[index];
      if (Math.abs(sum - this.rowStartPoint) <= 5) {
        this.rowTarget = index;
        this.idsurplus = sum - this.rowStartPoint;
        this.isIdMoving = true;
        return;
      } else if (this.rowStartPoint <= sum) {
        this.idselection = true;
        this.idtarget = index;
        return;
      }
    }
  }

  handlePointerMove(event) {
    if (this.isSelected) {
      if (this.startCell) {
        const rect = this.excel.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        this.endCell = this.getCellAtPosition(x, y);
        this.drawTable();
      }
    }

    if (this.widthresize && this.isHeadMoving) {
      let org = this.cellWidths[this.target];
      const rect = this.excel.getBoundingClientRect();
      let currpoint = event.clientX - rect.left;
      let currdiff = currpoint - this.startpoint;
      this.cellWidths[this.target] += currdiff;
      this.b.clearRect(0, 0, this.header.width, this.header.height);
      this.startCell = this.laststart;
      this.endCell = this.lastend;
      this.drawHeaders();
      this.cellWidths[this.target] = org;
      let dotline = document.getElementById('dottedline');
      dotline.style.display = 'block';
      dotline.style.left = `${event.clientX - rect.x + 20 + this.surplus}px`;
      dotline.style.top = '20px';
      dotline.style.borderTop = 'none';
      dotline.style.borderLeft = '2px dotted #999';
    }

    if (this.heightresize && this.isIdMoving) {
      const rect = this.excel.getBoundingClientRect();
      let org = this.rowHeights[this.rowTarget];
      let currpoint = event.clientY - rect.top;
      let currdiff = currpoint - this.rowStartPoint;
      this.rowHeights[this.rowTarget] += currdiff;
      this.a.clearRect(0, 0, this.id.width, this.id.height);
      this.startCell = this.laststart;
      this.endCell = this.lastend;
      this.drawIds();
      this.rowHeights[this.rowTarget] = org;
      let dotline = document.getElementById('dottedline');
      dotline.style.display = 'block';
      dotline.style.left = '20px';
      dotline.style.top = `${event.clientY - rect.y + 20 + this.idsurplus}px`;
      dotline.style.borderTop = '2px dotted #999';
      dotline.style.borderLeft = 'none';
    }

    if (this.headselection && !this.isHeadMoving) {
      this.startCell = { col: this.headtarget, row: 0 };
      let x = event.offsetX;
      let y = 0;
      this.endCell = this.getCellAtPosition(x, y);
      this.endCell.row = this.cols - 1;
      this.drawTable();
    }

    if (this.idselection && !this.isIdMoving) {
      this.startCell = { col: 0, row: this.idtarget };
      let x = 0;
      let y = event.offsetY;
      this.endCell = this.getCellAtPosition(x, y);
      this.endCell.col = this.rows - 1;
      this.drawTable();
    }
  }

  handlePointerUp(event) {
    if (this.isSelected) {
      this.prevcell = this.endCell;
      this.prevstart = this.startCell;
      this.startCell = null;
      this.endCell = null;
    }

    if (this.widthresize && this.isHeadMoving) {
      const rect = this.excel.getBoundingClientRect();
      this.endpoint = event.clientX - rect.left;
      let diff = this.endpoint - this.startpoint;
      if (this.cellWidths[this.target] + diff <= 40) diff = 0;
      this.cellWidths[this.target] += diff;
      this.isHeadMoving = false;
      let dotline = document.getElementById('dottedline');
      dotline.style.display = 'none';
      this.startCell = this.laststart;
      this.endCell = this.lastend;
      this.drawTable();
    }

    if (this.heightresize && this.isIdMoving) {
      const rect = this.excel.getBoundingClientRect();
      this.rowEndPoint = event.clientY - rect.top;
      let diff = this.rowEndPoint - this.rowStartPoint;
      if (this.rowHeights[this.rowTarget] + diff <= 20) diff = 0;
      this.rowHeights[this.rowTarget] += diff;
      this.isIdMoving = false;
      let dotline = document.getElementById('dottedline');
      dotline.style.display = 'none';
      this.startCell = this.laststart;
      this.endCell = this.lastend;
      this.drawTable();
    }

    if (this.headselection && !this.isHeadMoving) {
      this.startCell = { col: this.headtarget, row: 0 };
      let x = event.offsetX;
      let y = 0;
      this.endCell = this.getCellAtPosition(x, y);
      this.endCell.row = this.cols - 1;
      this.drawTable();
      this.prevcell = this.startCell;
      this.startCell = null;
      this.endCell = null;
      this.headselection = false;
    }

    if (this.idselection && !this.isIdMoving) {
      this.startCell = { col: 0, row: this.idtarget };
      let x = 0;
      let y = event.offsetY;
      this.endCell = this.getCellAtPosition(x, y);
      this.endCell.col = this.rows - 1;
      this.laststart = this.startCell;
      this.lastend = this.endCell;
      this.drawTable();
      this.prevcell = this.startCell;
      this.startCell = null;
      this.endCell = null;
      this.idselection = false;
    }
  }

  handleKeyDown(event) {
    event.preventDefault();
    if (event.shiftKey) {
      if (!this.startCell) {
        this.startCell = { col: this.laststart.col, row: this.laststart.row };
        this.endCell = { col: this.lastend.col, row: this.lastend.row };
      }
      if (event.key == "ArrowUp") {
        this.endCell.row = Math.max(0, this.endCell.row - 1);
      } else if (event.key == "ArrowDown") {
        this.endCell.row += 1;
      } else if (event.key == "ArrowLeft") {
        this.endCell.col = Math.max(0, this.endCell.col - 1);
      } else if (event.key == "ArrowRight") {
        this.endCell.col += 1;
      }
      this.drawTable();
    } else if (event.ctrlKey) {
      if (event.key == "c" || event.key == "C") {
        this.startCell = this.laststart;
        this.endCell = this.lastend;
        this.marchingants = true;
        this.drawTable();
        this.marchingants = false;
      } else if (event.key == "V" || event.key == "v") {
        this.ants.style.display = 'none';
      } else if (event.key == "X" || event.key == "x") {
        console.log("cut");
      }
    } else {
      this.startCell = { col: this.laststart.col, row: this.laststart.row };
      this.endCell = { col: this.lastend.col, row: this.lastend.row };
      if (event.key == "ArrowUp") {
        this.prevcell.row = Math.max(0, this.prevcell.row - 1);
      } else if (event.key == "ArrowDown") {
        this.prevcell.row += 1;
      } else if (event.key == "ArrowLeft") {
        this.prevcell.col = Math.max(0, this.prevcell.col - 1);
      } else if (event.key == "ArrowRight") {
        this.prevcell.col += 1;
      }
      this.startCell = this.prevcell;
      this.endCell = this.prevcell;
      this.drawTable();
      this.startCell = null;
      this.endCell = null;
    }
  }

  handleKeyUp(event) {
    if (!event.shiftKey) {
      this.startCell = null;
      this.endCell = null;
    }
  }

  handleHeaderDoubleClick(event) {
    let h = event.clientX;
    let col = 0;
    let widthSum = 0;
    while (h > widthSum + this.cellWidths[col] && col < this.cellWidths.length - 1) {
      widthSum += this.cellWidths[col];
      col++;
    }
    this.cellWidths[col] = Math.max(
      this.b.measureText(this.topics[col]).width + 40,
      this.b.measureText(this.data[col]).width + 40,
      100
    );
    this.drawTable();
  }

  handleExcelDoubleClick(event) {
    this.ants.style.display = 'none';
    this.drawTable();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new ExcelSheet();
});
      