if (event.shiftKey) {
    prevcell.row -= 1;
    endCell = {row:prevcell.row, col:prevcell.col};
    drawTable();
}