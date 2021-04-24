var dx = [0, 1, -1, 0];
var dy = [1, 0, 0, -1];
function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
export async function bfs(row, col) {
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
            document.getElementById("button" + (top[0] * cols + top[1] + 1)).className = "visited";
            await delay(40);

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
// function bfs_helper() {
//     bfs(0,0);
// }
// module.exports = bfs_helper;