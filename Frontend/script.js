document.addEventListener("DOMContentLoaded", function() {
    const id = document.getElementById('canvas1');
    const header = document.getElementById('canvas2');
    const excel = document.getElementById('canvas3')


   id.width = 40;
   id.height = 2000;
   header.width = 6000;
   header.height = 40;                                                                                    //Sizing Table
   excel.height = 2000;
   excel.width = 6000;



    const a = id.getContext('2d');
    const b = header.getContext('2d');
    const c = excel.getContext('2d');

    let cellHeight = 40;
    let cellWidth = 150;                                                                                   //cell dimentions
    const rows = 14;                                             
    const cols = 30;

    const topics = ["Email", "Name", "Country", "State", "City", "Phone" , "Add1","Add2" , "DOB", "2019-20" , "2020-21" , "2021-22" , "2022-23" , "2023-24"];

    const data = ["ncooper@hotmail.com", "Kristen Robinson", "Jordan", "North Dakota", "West Valerieland", "(187)741-6224x24308", "2002 Seth Roads Suite 553", "Apt. 132", "1973-07-15", "92,890.00", "128,252.00", "123,602.00", "148,513.00", "78,362.00"];

    
    b.textAlign = 'center';
    b.textBaseline = 'middle';
    b.font = '16px Quicksand';
    for (let i = 0; i < 26; i++) {
        let char = String.fromCharCode(65 + i);                                                            //A to Z header
        let x = i * cellWidth;
        b.strokeRect(x, 0, cellWidth, cellHeight);
        b.fillText(char, x + cellWidth / 2, cellHeight / 2);
    }

    a.textAlign = 'center';
    a.textBaseline = 'middle';
    a.font = '14px Quicksand';

    for (let i = 1; i < 100; i++) {                                                                           //1 to 100 id
        let x = i * cellHeight - 40;
        a.strokeRect(0, x, 40, 40);
        a.fillText(i, 20, x + 20);
    }


    c.textAlign = 'flex-start';
    c.textBaseline = 'middle';
    c.font = '20px Quicksand';
    c.fontWeight = '600';                                                                                        //Table data Filling

    for (let i = 0; i < rows; i++) {
       
        for (let j = 0; j < cols; j++) {
           
            c.strokeRect(i*150 , j*40 , cellWidth , cellHeight);
            if (j == 0) {
                c.fillText(topics[i], i*150 + 10, j*40 + 20);
            }
            // else{
            //     c.fillText(data[i], i*150 + 10, j*40 + 20);
            // }
 
        }

    }



    excel.addEventListener('click', (event) => {

        const rect = excel.getBoundingClientRect();
        let x = event.clientX - rect.left;
        x = Math.floor(x/150);
        let y = event.clientY - rect.top;
        y = Math.floor(y/40);
        console.log(x,y);

    });

});


