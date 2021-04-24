var H = 0, W = 0, rows = 0, cols = 0, visited;

        H = window.innerHeight - 100;
        W = window.innerWidth;
        let p = 0.5, w = 40, pt = 0.5, h = 40;
        let d1 = Math.floor((W + 2 * p) / (2 * p + w));
        let d2 = Math.floor((H + 2 * pt) / (2 * pt + h));
        console.log(d1, d2);
        rows = d2
        cols = d1;
        console.log(rows,cols);
        console.log(H, W);
        visited = Array(rows).fill().map(() => Array(cols).fill(false));
        const obj = document.getElementById("container");
        container.style.setProperty('--grid-rows', rows);
        container.style.setProperty('--grid-cols', cols);
        for (let c = 0; c < (rows * cols); c++) {
            let cell = document.createElement("button");
            cell.setAttribute("id", "button"+(c + 1));
            cell.innerText = (c + 1);
            cell.setAttribute("draggable",true);
            cell.addEventListener("ondrop",function() {
                console.log(document.getElementById("button" + (c + 1)).style.backgroundColor);
                if (document.getElementById("button" + (c + 1)).style.backgroundColor == 'blue') {
                    document.getElementById("button" + (c + 1)).style.backgroundColor = '#EFEFEF';
                   // document.getElementById("button" + (c + 1)).setAttribute("style", "background-color:#EFEFEF");
                } else {
                    document.getElementById("button" + (c + 1)).style.backgroundColor = 'blue';
                }
            });
            container.appendChild(cell).className = "grid-item";
            
        };


var dx = [0, 1, -1, 0];
var dy = [1, 0, 0, -1];
bfs(0, 0);
var flag = false;
function dfs(row, col) {
    if (row == 10 && col == 8) {
        return true;
    }
    document.getElementById("button" + (row * cols + col + 1)).style.backgroundColor = 'green';
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


function bfs(row, col) {
    class queue_ {
        constructor() {
            console.log("Nikhil");
            this.arr = new Array(1000), this.front = -1, this.rear = -1;
        }
        push(x) {
                if (this.front == -1) {
                    this.front = 0;
                }
                this.arr[++this.rear] = x;
        }
        pop() {
            var ret = this.arr[this.front++];
            if (this.rear < this.front) {
                this.front = this.rear = -1;
            }
        }
        front_() {
            return this.arr[this.front];
        }
        isEmpty() {
            return this.rear == -1
        }
        size() {
            return this.isEmpty() ? 0 : this.rear - this.front + 1;
        }
    
    }
    var q = new queue_();
    q.push([row, col]);
    visited[0][0] = true;
    while (!q.isEmpty()) {
        let sz = q.size();
        for (let i = 0; i < sz; i++) {
            let top = q.front_();
            document.getElementById("button" + (top[0] * cols + top[1] + 1)).style.backgroundColor = 'green';
            q.pop();
            if (top[0] == 10 && top[1] == 8) {
                return;
            }
            for (let j = 0; j < 4; j++) {
                let new_row = top[0] + dx[j];
                let new_col = top[1] + dy[j];
                if (new_row < rows && new_row >= 0 && new_col < cols && new_col >= 0 && !visited[new_row][new_col]) {
                    visited[new_row][new_col] = true;
                    q.push([new_row, new_col]);
                }
            }
        }
    }
}