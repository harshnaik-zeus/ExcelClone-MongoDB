class Table {
    constructor() {
        this.id = document.getElementById('canvas1');
        this.header = document.getElementById('canvas2');
        this.excel = document.getElementById('canvas3');
        this.container = document.getElementById('container');
        this.fixheight = 40;
        this.fixwidth = 150;
        this.cellHeight = this.fixheight;
        this.cellWidth = 150;
        this.rows = 50;
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
        this.b.textAlign = 'center';
        this.b.textBaseline = 'middle';
        this.b.font = '16px Quicksand';

        this.b.beginPath();
        for (let i = 0; i < this.cols; i++) {
            let char = String.fromCharCode(65 + i % 26); // A to Z header, wrap around
            this.b.moveTo(total, 0);
            this.b.lineTo(total, this.fixheight);
            this.b.strokeText(char, total + this.cellWidths[i] / 2, this.fixheight / 2);
            total += this.cellWidths[i];
        }
        this.b.moveTo(total, 0);
        this.b.lineTo(total, this.fixheight);
        this.b.moveTo(0, 0);
        this.b.lineTo(total, 0);
        this.b.lineTo(total, this.fixheight);
        this.b.stroke();
    }

    drawIds() {
        this.a.textAlign = 'center';
        this.a.textBaseline = 'middle';
        this.a.font = '14px Quicksand';
        let y = 0.5;

        this.a.beginPath();
        for (let i = 1; i <= this.rows; i++) {
            this.a.moveTo(0, y);
            this.a.lineTo(this.fixheight, y);
            this.a.strokeText(i, this.fixheight / 2, y + this.rowHeights[i - 1] / 2);
            y += this.rowHeights[i - 1];
        }
        this.a.moveTo(0, y);
        this.a.lineTo(this.fixheight, y);
        this.a.moveTo(0, 0);
        this.a.lineTo(0, y);
        this.a.lineTo(this.fixheight, y);
        this.a.stroke();
    }

    drawExcel() {
        this.c.textAlign = 'left';
        this.c.textBaseline = 'middle';
        this.c.font = '20px Quicksand';
        this.c.fontWeight = '600';

        let newtot = 0.5;
        let heightSum = 0.5;

        for (let i = 0; i < this.rows; i++) {
            heightSum = 0.5;
            for (let j = 0; j < this.cols; j++) {
                this.c.save();
                this.c.beginPath();
                this.c.rect(newtot, heightSum, this.cellWidths[j], this.rowHeights[i]);
                this.c.clip();
                this.c.fillStyle = 'black';
                if (j == 0) {
                    this.c.fillText(this.topics[i], newtot + 10, heightSum + this.rowHeights[i] / 2);
                } else {
                    this.c.fillText(this.data[i], newtot + 10, heightSum + this.rowHeights[i] / 2);
                }
                this.c.stroke();
                this.c.restore();
                heightSum += this.rowHeights[i];
            }
            newtot += this.cellWidths[i];
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
                    this.c.fillStyle = '#e6ffe6';
                    this.c.fillRect(widthSum, heightSum, this.cellWidths[col], this.rowHeights[row]);
                    widthSum += this.cellWidths[col];
                }
                heightSum += this.rowHeights[row];
            }
            this.c.stroke();
            this.c.restore();

            this.b.save();
            this.b.beginPath();
            this.b.fillStyle = 'rgb(16,124,65)';
            this.b.fillRect(startWidth + 0.5, 0.5, widthSum - startWidth, this.cellHeight);
            this.b.stroke();
            this.b.restore();

            this.a.save();
            this.a.beginPath();
            this.a.fillStyle = 'rgb(16,124,65)';
            this.a.fillRect(0.5, startHeight + 0.5, this.cellWidth, heightSum - startHeight);
            this.a.stroke();
            this.a.restore();

            this.c.save();
            this.c.beginPath();
            this.c.lineWidth = 2;
            this.c.strokeStyle = 'rgb(16,124,65)';
            this.c.strokeRect(startWidth - 0.5, startHeight - 0.5, widthSum - startWidth + 1, heightSum - startHeight + 1);
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
        this.excel.addEventListener('pointerdown', (event) => {
            const rect = this.excel.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            this.startCell = this.getCellAtPosition(x, y);
            this.endCell = this.startCell;
            this.drawTable();
        });

        this.excel.addEventListener('pointermove', (event) => {
            if (this.startCell) {
                const rect = this.excel.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                this.endCell = this.getCellAtPosition(x, y);
                this.drawTable();
            }
        });

        this.excel.addEventListener('pointerup', (event) => {
            this.prevcell = this.endCell;
            this.startCell = null;
            this.endCell = null;
        });

        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            if (event.shiftKey) {
                if (!this.startCell) {
                    this.startCell = { col: this.prevcell.col, row: this.prevcell.row };
                }
                if (event.key == 'ArrowUp') {
                    this.prevcell.row = Math.max(0, this.prevcell.row - 1);
                } else if (event.key == 'ArrowDown') {
                    this.prevcell.row += 1;
                } else if (event.key == 'ArrowLeft') {
                    this.prevcell.col = Math.max(0, this.prevcell.col - 1);
                } else if (event.key == 'ArrowRight') {
                    this.prevcell.col += 1;
                }
                this.endCell = this.prevcell;
                this.drawTable();
            } else {
                if (event.key == 'ArrowUp') {
                    this.prevcell.row = Math.max(0, this.prevcell.row - 1);
                } else if (event.key == 'ArrowDown') {
                    this.prevcell.row += 1;
                } else if (event.key == 'ArrowLeft') {
                    this.prevcell.col = Math.max(0, this.prevcell.col - 1);
                } else if (event.key == 'ArrowRight') {
                    this.prevcell.col += 1;
                }
                this.endCell = this.prevcell;
                this.drawTable();
            }
        });
    }
}

// document.addEventListener('DOMContentLoaded', () => {
    const table = new Table();
// });
