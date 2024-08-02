    class Canvas {
      constructor(id, width, height) {
        this.element = document.getElementById(id);
        this.element.width = width;
        this.element.height = height;
        this.context = this.element.getContext("2d");
      }
  
      clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
      }
    }
  
    class Table {
      constructor() {
        this.idCanvas = new Canvas("canvas1", 20, 1000);
        this.headerCanvas = new Canvas("canvas2", 2000, 20);
        this.excelCanvas = new Canvas("canvas3", 2000, 1000);
        this.scale = window.devicePixelRatio;
        this.cellHeight = 20;
        this.cellWidth = 100;
        this.rows = 20;
        this.cols = 50;
        this.topics = [
          "Email", "Name", "Country", "State", "City", "Phone", "Add1", "Add2", "DOB",
          "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", " ", " ", " ", " ", " ", " "
        ];
        this.data = [
          "ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland",
          "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15",
          "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00", " ", " ", " ", " ", " ", " "
        ];
        this.cellWidths = new Array(this.topics.length).fill(this.cellWidth);
        this.rowHeights = new Array(this.cols).fill(this.cellHeight);
        this.startCell = null;
        this.endCell = null;
        this.lastStart = null;
        this.lastEnd = null;
        this.prevCell = null;
        this.isSelected = false;
        this.widthResize = false;
        this.heightResize = false;
        this.headSelection = false;
        this.headTarget = -1;
        this.isHeadMoving = false;
        this.surplus = 0;
        this.rowTarget = -1;
        this.isIdMoving = false;
        this.idSelection = false;
        this.idTarget = -1;
        this.idSurplus = 0;
  
        this.bindEvents();
        this.drawTable();
      }
  
      bindEvents() {
        this.excelCanvas.element.addEventListener("pointerdown", this.onExcelPointerDown.bind(this));
        this.headerCanvas.element.addEventListener("pointerdown", this.onHeaderPointerDown.bind(this));
        this.idCanvas.element.addEventListener("pointerdown", this.onIdPointerDown.bind(this));
        document.addEventListener("pointermove", this.onPointerMove.bind(this));
        document.addEventListener("pointerup", this.onPointerUp.bind(this));
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
        this.headerCanvas.element.addEventListener("dblclick", this.onHeaderDblClick.bind(this));
      }
  
      drawHeaders() {
        let start = 0.5;
        this.headerCanvas.context.textAlign = "center";
        this.headerCanvas.context.textBaseline = "middle";
        this.headerCanvas.context.font = "12px Calibri";
        for (let i = 0; i < 26; i++) {
          let char = String.fromCharCode(65 + i); // A to Z header
          this.headerCanvas.context.save();
          this.headerCanvas.context.beginPath();
          this.headerCanvas.context.lineWidth = 0.2;
          this.headerCanvas.context.moveTo(start, 0);
          this.headerCanvas.context.lineTo(start, this.cellHeight);
          this.headerCanvas.context.fillText(char, start + this.cellWidths[i] / 2, this.cellHeight / 2);
          start += this.cellWidths[i];
          this.headerCanvas.context.stroke();
          this.headerCanvas.context.restore();
        }
      }
  
      drawIds() {
        let start = 0.5;
        this.idCanvas.context.textAlign = "center";
        this.idCanvas.context.textBaseline = "middle";
        this.idCanvas.context.font = "10px Calibri";
        for (let i = 0; i < 50; i++) {
          this.idCanvas.context.save();
          this.idCanvas.context.beginPath();
          this.idCanvas.context.lineWidth = 0.2;
          this.idCanvas.context.moveTo(0, start);
          this.idCanvas.context.lineTo(this.cellHeight, start);
          start += this.rowHeights[i];
          this.idCanvas.context.fillText(i + 1, this.cellHeight / 2, start - this.rowHeights[i] / 2);
          this.idCanvas.context.stroke();
          this.idCanvas.context.restore();
        }
      }
  
      drawExcel() {
        this.excelCanvas.context.textAlign = "left";
        this.excelCanvas.context.textBaseline = "middle";
        this.excelCanvas.context.font = "14px Calibri";
        this.excelCanvas.context.fontWeight = "600"; // Table data filling
        let startX = 0.5;
        let startY = 0.5;
  
        for (let index = 0; index <= this.cellWidths.length; index++) {
          this.excelCanvas.context.save();
          this.excelCanvas.context.beginPath();
          this.excelCanvas.context.moveTo(startX, 0);
          this.excelCanvas.context.lineTo(startX, this.excelCanvas.element.height);
          this.excelCanvas.context.lineWidth = 0.3;
          this.excelCanvas.context.fillStyle = "#e3e3e3";
          startX += this.cellWidths[index];
          this.excelCanvas.context.stroke();
          this.excelCanvas.context.restore();
        }
  
        for (let index = 0; index <= this.rowHeights.length; index++) {
          this.excelCanvas.context.save();
          this.excelCanvas.context.beginPath();
          this.excelCanvas.context.moveTo(0, startY);
          this.excelCanvas.context.lineTo(this.excelCanvas.element.width, startY);
          this.excelCanvas.context.lineWidth = 0.3;
          this.excelCanvas.context.fillStyle = "#e3e3e3";
          startY += this.rowHeights[index];
          this.excelCanvas.context.stroke();
          this.excelCanvas.context.restore();
        }
      }
  
      drawTable() {
        this.idCanvas.clear();
        this.headerCanvas.clear();
        this.excelCanvas.clear();
        this.drawSelection();
        this.drawHeaders();
        this.drawIds();
        this.drawExcel();
      }
  
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
          this.excelCanvas.context.save();
          this.excelCanvas.context.beginPath();
          for (let row = startY; row <= endY; row++) {
            widthSum = 0.5;
            for (let col = 0; col < startX; col++) {
              widthSum += this.cellWidths[col];
            }
            startWidth = widthSum;
            for (let col = startX; col <= endX; col++) {
              this.excelCanvas.context.fillStyle = "#e6ffe6";
              this.excelCanvas.context.fillRect(widthSum, heightSum, this.cellWidths[col], this.rowHeights[row]);
              widthSum += this.cellWidths[col];
            }
            heightSum += this.rowHeights[row];
          }
          this.excelCanvas.context.stroke();
          this.excelCanvas.context.restore();
          this.headerCanvas.context.save();
          this.headerCanvas.context.beginPath();
          if (this.headSelection) {
            this.headerCanvas.context.fillStyle = "#107c41";
          } else {
            this.headerCanvas.context.fillStyle = "#caead8";
          }
          this.headerCanvas.context.fillRect(startWidth + 0.5, 0.5, widthSum - startWidth, this.cellHeight);
          this.headerCanvas.context.stroke();
          this.headerCanvas.context.restore();
          this.idCanvas.context.save();
          this.idCanvas.context.beginPath();
          if (this.idSelection) {
            this.idCanvas.context.fillStyle = "#107c41";
          } else {
            this.idCanvas.context.fillStyle = "#caead8";
          }
          this.idCanvas.context.fillRect(0.5, startHeight + 0.5, this.cellHeight, heightSum - startHeight);
          this.idCanvas.context.stroke();
          this.idCanvas.context.restore();
        }
      }
  
      onExcelPointerDown(event) {
        this.lastStart = this.startCell;
        this.lastEnd = this.endCell;
        this.startCell = this.getCellAtPosition(event.offsetX, event.offsetY);
        this.prevCell = this.startCell;
        this.isSelected = true;
        this.drawTable();
      }
  
      onHeaderPointerDown(event) {
        let x = event.offsetX;
        this.headTarget = this.cellWidths.length - 1;
        let sum = 0;
        for (let index = 0; index < this.cellWidths.length - 1; index++) {
          sum += this.cellWidths[index];
          if (Math.abs(sum - x) <= 5) {
            this.headTarget = index;
            this.isHeadMoving = true;
            this.surplus = x - sum;
            break;
          }
        }
        this.lastStart = this.startCell;
        this.lastEnd = this.endCell;
        this.headSelection = true;
        this.startCell = { col: this.headTarget, row: 0 };
        this.endCell = { col: this.headTarget, row: this.rowHeights.length - 1 };
        this.prevCell = this.startCell;
        this.drawTable();
      }
  
      onIdPointerDown(event) {
        let y = event.offsetY;
        this.rowTarget = this.rowHeights.length - 1;
        let sum = 0;
        for (let index = 0; index < this.rowHeights.length - 1; index++) {
          sum += this.rowHeights[index];
          if (Math.abs(sum - y) <= 5) {
            this.rowTarget = index;
            this.isIdMoving = true;
            this.idSurplus = y - sum;
            break;
          }
        }
        this.lastStart = this.startCell;
        this.lastEnd = this.endCell;
        this.idSelection = true;
        this.startCell = { col: 0, row: this.rowTarget };
        this.endCell = { col: this.cellWidths.length - 1, row: this.rowTarget };
        this.prevCell = this.startCell;
        this.drawTable();
      }
  
      onPointerMove(event) {
        if (this.isSelected) {
          let cell = this.getCellAtPosition(event.offsetX, event.offsetY);
          if (cell.col != this.prevCell.col || cell.row != this.prevCell.row) {
            this.prevCell = cell;
            this.endCell = cell;
            this.drawTable();
          }
        }
        if (this.isHeadMoving) {
          let x = event.offsetX;
          let diff = x - this.surplus;
          if (diff > 20) {
            this.cellWidths[this.headTarget] = diff;
            this.drawTable();
          }
        }
        if (this.isIdMoving) {
          let y = event.offsetY;
          let diff = y - this.idSurplus;
          if (diff > 10) {
            this.rowHeights[this.rowTarget] = diff;
            this.drawTable();
          }
        }
      }
  
      onPointerUp(event) {
        this.isSelected = false;
        this.isHeadMoving = false;
        this.isIdMoving = false;
      }
  
      onKeyDown(event) {
        if (event.key === "Shift") {
          this.headSelection = true;
          this.idSelection = true;
          this.endCell = this.prevCell;
          this.drawTable();
        }
      }
  
      onKeyUp(event) {
        if (event.key === "Shift") {
          this.headSelection = false;
          this.idSelection = false;
          this.drawTable();
        }
      }
  
      onHeaderDblClick(event) {
        let x = event.offsetX;
        let sum = 0;
        for (let index = 0; index < this.cellWidths.length - 1; index++) {
          sum += this.cellWidths[index];
          if (Math.abs(sum - x) <= 5) {
            this.cellWidths[index] = this.cellWidth;
            break;
          }
        }
        this.drawTable();
      }
    }
  
    const table = new Table();

  