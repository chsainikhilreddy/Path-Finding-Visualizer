var dx = [0, 1, -1, 0];
var dy = [1, 0, 0, -1];
var flag = false;
function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
export async function dfs(row, col) {
    console.log("Apple");
    if (row == 7 && col == 18) {
        return true;
    }
    document.getElementById("button" + (row * cols + col + 1)).className = "visited";
    await delay(40);
    visited[row][col] = true;
    for (let i = 0; i < dx.length; i++) {
        let new_row = row + dx[i];
        let new_col = col + dy[i];
        //console.log(new_row, new_col, !visited[new_row][new_col])
        if (new_row < rows && new_row >= 0 && new_col < cols && new_col >= 0 && !visited[new_row][new_col] && dfs(new_row, new_col)) {
            return true;
        }
    }
    document.getElementById("button" + (row * cols + col + 1)).style.backgroundColor = '#EFEFEF';
    return false;
}