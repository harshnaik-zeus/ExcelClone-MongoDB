document.addEventListener("DOMContentLoaded", function() {
    const id = document.getElementById('canvas1');
    const header = document.getElementById('canvas2');
    const excel = document.getElementById('canvas3')


   id.width = 40;
   id.height = 2000;
   header.width = 7000;
   header.height = 40;                                                                                    //Sizing Table
   excel.height = 2000;
   excel.width = 7000;



    const a = id.getContext('2d');
    const b = header.getContext('2d');
    const c = excel.getContext('2d');

    let cellHeight = 40;
    let cellWidth = 150;                                                                                   //cell dimentions
    const rows = 14;                                             
    const cols = 30;
    let startCell = null;
    let endCell = null;

    let laststart = null;
    let lastend = null;

    const topics = ["Email", "Name", "Country", "State", "City", "Phone" , "Add1","Add2" , "DOB", "2019-20" , "2020-21" , "2021-22" , "2022-23" , "2023-24"];

    const data = ["ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland", "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15", "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00"];

    let cellWidths = [];
     
    for (let index = 0; index < topics.length; index++) {
        cellWidths[index] = cellWidth;
    }
    // cellWidths[5] = 200;
    // cellWidths[9] = 200;
    console.log(cellWidths);

    const drawHeaders = () => {
    let total = 0;
    b.textAlign = 'center';
    b.textBaseline = 'middle';
    b.font = '16px Quicksand';
    for (let i = 0; i < 26; i++) {
        let char = String.fromCharCode(65 + i);                                                            //A to Z header
        b.strokeRect(total, 0, cellWidths[i], cellHeight);
        b.fillText(char, total + cellWidths[i] / 2, cellHeight / 2);
        total += cellWidths[i];
    }
}
   
    const drawIds = () => {
    a.textAlign = 'center';
    a.textBaseline = 'middle';
    a.font = '14px Quicksand';

    for (let i = 1; i < 100; i++) {                                                                           //1 to 100 id
        let x = i * cellHeight - 40;
        a.strokeRect(0, x, 40, 40);
        a.fillText(i, 20, x + 20);
    }
}

    const drawExcel = () => {
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.font = '20px Quicksand';
    c.fontWeight = '600';                                                                                        //Table data Filling
    let newtot = 0;
    for (let i = 0; i < rows; i++) {
       
        for (let j = 0; j < cols; j++) {
            c.save();
            c.beginPath();
            c.rect(newtot , j*40 , cellWidths[i], cellHeight);
            c.clip();
            if (j == 0) {
                c.fillText(topics[i], newtot + 10, j*40 + 20);
            }
            else{
                c.fillText(data[i], newtot + 10, j*40 + 20);
            }
            c.stroke();
            c.restore();

            // console.log(newtot);
        }
        newtot += cellWidths[i];

    }
}

function DrawTable(){
    a.clearRect(0, 0, id.width, id.height);
    b.clearRect(0, 0, header.width, header.height);
    c.clearRect(0, 0, excel.width, excel.height);
    drawHeaders();
    drawIds();
    drawExcel();
}

DrawTable();


const getCellAtPosition = (x, y) => {

    return { col: Math.floor(x/150), row: Math.floor(y/40)};

};



excel.addEventListener('click', (event) => {
    const rect = excel.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let top = getCellAtPosition(x,y).row;
    let left = getCellAtPosition(x,y).col;
        let txtbox = this.getElementById('ipbox');
        txtbox.style.display = 'block';
        // txtbox.focus();
        // txtbox.style.value = none;
        // txtbox.nodeValue
        // txtbox.style.border = 'solid green';
        txtbox.style.top = `${(top + 1)*40}px`;
        txtbox.style.left = `${((left + 1)*150) - 110}px`;
        txtbox.style.zIndex = 100;
});


header.addEventListener('dblclick', (event) => {
    let h = event.clientX;
    h = Math.floor(h/150);
    cellWidths[h] = Math.max(b.measureText(topics[h]).width + 70 , b.measureText(data[h]).width + 70, 150);
    DrawTable();
    // console.log(cellWidths[h]);
    // console.log(cellWidths);
});















});


