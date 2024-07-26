class Table {
    constructor() {
        this.id = document.getElementById('canvas1');
        this.header = document.getElementById('canvas2');
        this.excel = document.getElementById('canvas3');
        this.container = document.getElementById('container');
        this.fixheight = 40;
        this.fixwidth = 150;
        this.cellHeight = this.fixheight;
        this.cellWidth = this.fixwidth;
        this.rows = 19;
        this.cols = 20;
        this.startCell = null;
        this.endCell = null;
        this.laststart = null;
        this.lastend = null;
        this.topics = ["Email", "Name", "Country", "State", "City", "Phone", "Add1", "Add2", "DOB", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24", " ", " ", " ", " ", " ", " "];
        this.data = ["ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland", "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15", "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00", " ", " ", " ", " ", " "];
        this.cellWidths = Array(this.topics.length).fill(this.cellWidth);
        this.rowHeights = Array(this.cols).fill(this.cellHeight);
        this.prevcell = null;
        this.isMoving = false;
        this.target = -1;
        this.rowTarget = -1;
        this.startpoint = null;
        this.endpoint = null;
        this.rowStartPoint = null;
        this.rowEndPoint = null;

        this.setupCanvas();
        this.drawTable();
        this.addEventListeners();
    }

    setupCanvas() {
        this.id.width = this.fixheight;
        this.id.height = 2000;
        this.header.width = 7000;
        this.header.height = this.fixheight;
        this.excel.height = 2000;
        this.excel.width = 7000;
        this.a = this.id.getContext('2d');
        this.b = this.header.getContext('2d');
        this.c = this.excel.getContext('2d');
    }

    drawTable() {
        this.clearCanvas();
        this.drawSelection();
        this.drawHeaders();
        this.drawIds();
        this.drawExcel();
    }

    clearCanvas() {
        this.a.clearRect(0, 0, this.id.width, this.id.height);
        this.b.clearRect(0, 0, this.header.width, this.header.height);
        this.c.clearRect(0, 0, this.excel.width, this.excel.height);
    }

    drawHeaders() {
        let total = 0.5;
        this.b.textAlign = "center";
        this.b.textBaseline = "middle";
        this.b.font = "16px Quicksand";
        for (let i = 0; i < this.topics.length; i++) {
            this.b.strokeRect(total, 0.5, this.cellWidths[i], this.cellHeight);
            this.b.fillText(this.topics[i], total + this.cellWidths[i] / 2, this.cellHeight / 2);
            total += this.cellWidths[i];
        }
    }

    drawIds() {
        this.a.textAlign = "center";
        this.a.textBaseline = "middle";
        this.a.font = "14px Quicksand";
        let y = 0.5;
        for (let i = 1; i <= this.rows; i++) {
            this.a.strokeRect(0.5, y, this.cellHeight, this.rowHeights[i - 1]);
            this.a.fillText(i, this.cellHeight / 2, y + this.rowHeights[i - 1] / 2);
            y += this.rowHeights[i - 1];
        }
    }

    drawExcel() {
        this.c.textAlign = "left";
        this.c.textBaseline = "middle";
        this.c.font = "20px Quicksand";
        this.c.fontWeight = "600";
        let newTotal = 0.5;
        for (let i = 0; i < this.rows; i++) {
            let heightSum = 0.5;
            for (let j = 0; j < this.cols; j++) {
                this.c.save();
                this.c.beginPath();
                this.c.rect(newTotal, heightSum, this.cellWidths[i], this.rowHeights[j]);
                this.c.clip();
                this.c.fillStyle = "black";
                if (j == 0) {
                    this.c.fillText(this.topics[i], newTotal + 10, heightSum + this.rowHeights[j] / 2);
                } else {
                    this.c.fillText(this.data[i], newTotal + 10, heightSum + this.rowHeights[j] / 2);
                }
                this.c.stroke();
                this.c.restore();
                heightSum += this.rowHeights[j];
            }
            newTotal += this.cellWidths[i];
        }
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
            this.b.fillStyle = "rgb(16,124,65)";
            this.b.fillRect(startWidth + 0.5, 0.5, widthSum - startWidth, this.cellHeight);
            this.b.stroke();
            this.b.restore();
            this.a.save();
            this.a.beginPath();
            this.a.fillStyle = "rgb(16,124,65)";
            this.a.fillRect(0.5, startHeight + 0.5, this.cellWidth, heightSum - startHeight);
            this.a.stroke();
            this.a.restore();
            this.c.save();
            this.c.beginPath();
            this.c.lineWidth = 2;
            this.c.strokeStyle = "rgb(16,124,65)";
            this.c.strokeRect(
                startWidth - 0.5,
                startHeight - 0.5,
                widthSum - startWidth + 1,
                heightSum - startHeight + 1
            );
            this.c.stroke();
            this.c.restore();
        }
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

    addEventListeners() {
        this.excel.addEventListener('pointerdown', (event) => this.onExcelPointerDown(event));
        this.header.addEventListener('pointerdown', (event) => this.onHeaderPointerDown(event));
        this.id.addEventListener('pointerdown', (event) => this.onIdPointerDown(event));
        document.addEventListener('pointermove', (event) => this.onPointerMove(event));
        document.addEventListener('pointerup', (event) => this.onPointerUp(event));
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('keyup', (event) => this.onKeyUp(event));
        this.header.addEventListener('click', (event) => this.onHeaderClick(event));
        this.id.addEventListener('click', (event) => this.onIdClick(event));
        this.header.addEventListener('dblclick', (event) => this.onHeaderDoubleClick(event));
    }

    onExcelPointerDown(event) {
        this.isSelected = true;
        this.widthResize = false;
        this.heightResize = false;
        const rect = this.excel.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        this.startCell = this.getCellAtPosition(x, y);
        this.endCell = this.startCell;
        this.drawTable();
    }

    onHeaderPointerDown(event) {
        this.isSelected = false;
        this.widthResize = true;
        this.heightResize = false;
        this.startPoint = event.offsetX;
        let sum = 0;
        for (let index = 0; index < this.cellWidths.length; index++) {
            sum += this.cellWidths[index];
            if (Math.abs(sum - this.startPoint) <= 10) {
                this.isHeadMoving = true;
                this.target = index;
            }
        }
    }

    onIdPointerDown(event) {
        this.isSelected = false;
        this.widthResize = false;
        this.heightResize = true;
        this.isIdMoving = true;
        this.rowStartPoint = event.offsetY;
        let sum = 0;
        for (let index = 0; index < this.rowHeights.length; index++) {
            sum += this.rowHeights[index];
            if (Math.abs(sum - this.rowStartPoint) <= 10) {
                this.rowTarget = index;
            }
        }
    }

    onPointerMove(event) {
        if (this.isSelected) {
            if (this.startCell) {
                const rect = this.excel.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                this.endCell = this.getCellAtPosition(x, y);
                this.drawTable();
            }
        }

        if (this.widthResize && this.isHeadMoving) {
            let originalWidth = this.cellWidths[this.target];
            let currentPoint = event.offsetX;
            let currentDiff = currentPoint - this.startPoint;
            this.cellWidths[this.target] += currentDiff;
            this.b.clearRect(0, 0, this.header.width, this.header.height);
            this.drawSelection();
            this.drawHeaders();
            this.cellWidths[this.target] = originalWidth;
        }

        if (this.heightResize && this.isIdMoving) {
            let originalHeight = this.rowHeights[this.rowTarget];
            let currentPoint = event.offsetY;
            let currentDiff = currentPoint - this.rowStartPoint;
            this.rowHeights[this.rowTarget] += currentDiff;
            this.a.clearRect(0, 0, this.id.width, this.id.height);
            this.drawSelection();
            this.drawIds();
            this.rowHeights[this.rowTarget] = originalHeight;
        }
    }

    onPointerUp(event) {
        if (this.isSelected) {
            this.prevCell = this.endCell;
            this.startCell = null;
            this.endCell = null;
        }

        if (this.widthResize && this.isHeadMoving) {
            this.endPoint = event.offsetX;
            let diff = this.endPoint - this.startPoint;
            if (this.cellWidths[this.target] + diff <= 40) diff = 0;
            this.cellWidths[this.target] += diff;
            this.isHeadMoving = false;
            this.drawTable();
        }

        if (this.heightResize && this.isIdMoving) {
            this.rowEndPoint = event.offsetY;
            let diff = this.rowEndPoint - this.rowStartPoint;
            if (this.rowHeights[this.rowTarget] + diff <= 20) diff = 0;
            this.rowHeights[this.rowTarget] += diff;
            this.isIdMoving = false;
            this.drawTable();
        }
    }

    onKeyDown(event) {
        event.preventDefault();
        if (event.shiftKey) {
            if (!this.startCell) {
                this.startCell = { col: this.prevCell.col, row: this.prevCell.row };
            }
            if (event.key == "ArrowUp") {
                this.prevCell.row = Math.max(0, this.prevCell.row - 1);
            } else if (event.key == "ArrowDown") {
                this.prevCell.row += 1;
            } else if (event.key == "ArrowLeft") {
                this.prevCell.col = Math.max(0, this.prevCell.col - 1);
            } else if (event.key == "ArrowRight") {
                this.prevCell.col += 1;
            }
            this.endCell = this.prevCell;
            this.drawTable();
        } else {
            if (event.key == "ArrowUp") {
                this.prevCell.row = Math.max(0, this.prevCell.row - 1);
            } else if (event.key == "ArrowDown") {
                this.prevCell.row += 1;
            } else if (event.key == "ArrowLeft") {
                this.prevCell.col = Math.max(0, this.prevCell.col - 1);
            } else if (event.key == "ArrowRight") {
                this.prevCell.col += 1;
            }
            this.startCell = this.prevCell;
            this.endCell = this.prevCell;
            this.drawTable();
            this.startCell = null;
            this.endCell = null;
        }
    }

    onKeyUp(event) {
        if (!event.shiftKey) {
            this.startCell = null;
            this.endCell = null;
        }
    }

    onHeaderClick(event) {
        const rect = this.header.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cell = this.getCellAtPosition(x, y);
        const clickedCol = cell.col;
        this.startCell = { row: 0, col: clickedCol };
        this.endCell = { row: this.cols - 1, col: clickedCol };
        this.drawTable();
        this.startCell = null;
        this.endCell = null;
    }

    onIdClick(event) {
        const rect = this.id.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const cell = this.getCellAtPosition(x, y);
        const clickedRow = cell.row;
        this.startCell = { row: clickedRow, col: 0 };
        this.endCell = { row: clickedRow, col: 14 };
        this.drawTable();
        this.startCell = null;
        this.endCell = null;
    }

    onHeaderDoubleClick(event) {
        let headerX = event.clientX;
        let col = 0;
        let widthSum = 0;
        while (headerX > widthSum + this.cellWidths[col] && col < this.cellWidths.length - 1) {
            widthSum += this.cellWidths[col];
            col++;
        }
        this.cellWidths[col] = Math.max(
            this.b.measureText(this.topics[col]).width + 70,
            this.b.measureText(this.data[col]).width + 70,
            150
        );
        this.drawTable();
    }
}

const table = new Table();
