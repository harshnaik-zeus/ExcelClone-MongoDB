import { data } from './data.js';

class ExcelSheet {
    constructor() {
        this.id = document.getElementById("canvas1");
        this.header = document.getElementById("canvas2");
        this.excel = document.getElementById("canvas3");
        this.container = document.getElementById("container");
        this.infinitediv = document.getElementById("mainbig");
        this.selectdiv = document.getElementById("selection");
        this.scale = window.devicePixelRatio;
        this.fixheight = 20;
        this.fixwidth = 100;
        this.excelheight = 740;
        this.excelwidth = 2000;
        this.cellHeight = this.fixheight;
        this.cellWidth = this.fixwidth;
        this.rows = 20;
        this.cols = 50;
        this.startX = 1;
        this.startY = 1;

        this.data = data;

        this.cellWidths = Array(1000).fill(this.cellWidth);
        this.rowHeights = Array(1000).fill(this.cellHeight);

        this.initializeCanvas();
        this.addEventListeners();
        this.drawTable(this.startY, this.startX);
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
    }

    drawHeaders(x) {
        let start = 0.5 - x + 1;
        this.b.textAlign = "center";
        this.b.textBaseline = "middle";
        this.b.font = "12px Calibri";
        for (let i = 0; i < 26; i++) {
            let char = String.fromCharCode(65 + i + Math.ceil(x / 100) - 1);
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

    drawIds(y) {
        this.a.textAlign = "center";
        this.a.textBaseline = "middle";
        this.a.font = "10px Calibri";
        let start = 0.5 - y + 1;
        for (let i = 0; i < 50; i++) {
            this.a.save();
            this.a.beginPath();
            this.a.lineWidth = 0.2;
            this.a.moveTo(0, start);
            this.a.lineTo(this.fixheight, start);
            start += this.rowHeights[i];
            this.a.fillText(
                y++,
                this.fixheight / 2,
                start - this.rowHeights[i] / 2
            );
            this.a.stroke();
            this.a.restore();
        }
    }

    drawExcel(x, y) {
        y = y - 1;
        this.c.textAlign = "left";
        this.c.textBaseline = "middle";
        this.c.font = "14px Calibri";
        this.c.fontWeight = "600";
        let space = 0.5 - x;

        for (let index = 0; index <= this.cellWidths.length; index++) {
            this.c.save();
            this.c.beginPath();
            this.c.moveTo(space, 0);
            this.c.lineTo(space, this.excelheight);
            this.c.lineWidth = 0.3;
            this.c.fillStyle = "#e3e3e3";
            space += this.cellWidths[index];
            this.c.stroke();
            this.c.restore();
        }
        space = 0.5 - y;
        for (let index = 0; index <= this.rowHeights.length; index++) {
            this.c.save();
            this.c.beginPath();
            this.c.fillStyle = "#e3e3e3";
            this.c.moveTo(0, space);
            this.c.lineTo(this.excelwidth, space);
            this.c.lineWidth = 0.3;
            space += this.rowHeights[index];
            this.c.stroke();
            this.c.restore();
        }
        let b = 15 - y;
        for (let i = y; i <= y + 40; i++) {
            let a = 5 - x;
            for (let j = x; j <= x + 20; j++) {
                this.c.fillText(this.data[i][j], a, b);
                a += this.cellWidths[j];
            }
            b += this.rowHeights[i];
        }
    }

    drawTable(x, y) {
        this.a.clearRect(0, 0, this.id.width, this.id.height);
        this.b.clearRect(0, 0, this.header.width, this.header.height);
        this.c.clearRect(0, 0, this.excel.width, this.excel.height);
        this.drawSelection(x, y);
        this.drawHeaders(x);
        this.drawIds(y);
        this.drawExcel(x, y);
    }

    drawSelection(x, y) {
        this.selectdiv.style.display = 'block';
        this.selectdiv.style.left = `${x}px`;
        this.selectdiv.style.top = `${y}px`;
    }

    drawants(left, top, width, height) {

    }

    handleExcelPointerDown(event) {
        let x = event.clientX;
        let y = event.clientY;
        this.drawSelection(x, y);

    }

    handleHeaderPointerDown(event) { }

    handleIdPointerDown(event) { }

    handlePointerMove(event) { }

    handlePointerUp(event) { }

    handleKeyDown(event) { }

    handleKeyUp(event) { }

    handleHeaderDoubleClick(event) { }

    handleExcelDoubleClick(event) { }

    handleDevicePixelRatio(event) { }

    handleViewPort(event) {
        let change = this.infinitediv.scrollTop;
        this.startY = change;
        change = this.infinitediv.scrollLeft;
        this.startX = change;
        this.drawTable(this.startX, this.startY);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    new ExcelSheet();
});
