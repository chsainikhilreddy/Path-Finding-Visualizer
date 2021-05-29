var H = 0,
    W = 0,
    rows = 0,
    cols = 0,
    srcNode = null,
    destNode = null,
    cnt = 0,
    startIcon = null,
    endIcon = null,
    dragFlag = true,
    isMouseDown = false,
    isSrc = false,
    isDest = false,
    doneExecution = false,
    buttons = [],
    visualizeButton,
    delayInms = 100,
    color = "#eefa94",
    visited = "visited",
    themeColor = "#9bd5d9",
    navigationBar;
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.sz = 0;
    }
    push(val) {
        if (this.front == null) {
            this.front = this.rear = new Node(val);
        } else {
            this.rear.next = new Node(val);
            this.rear = this.rear.next;
        }
        this.sz++;
    }
    pop() {
        let ret = this.front.val;
        this.front = this.front.next;
        this.sz--;
        return ret;
    }
    empty() {
        return this.front === null;
    }
    size() {
        return this.sz;
    }
}
function initialize() {
    H = document.getElementById("container").clientHeight;
    W = document.getElementById("container").clientWidth;
    let den = parseInt(Math.sqrt(2 * W));
    cols = Math.floor(W / den);
    rows = Math.floor(H / (cols));
    cols = den;
    srcNode = 1;
    destNode = rows * cols;
    const container = document.getElementById("container");
    navigationBar = document.getElementById("navigationBar");
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    buttons.push([]);
    visualizeButton = document.getElementById("visualize");
    for (let c = 0; c < (rows * cols); c++) {
        let cell = document.createElement("button");
        cell.setAttribute("id", "button" + (c + 1));
        container.appendChild(cell);
    }
    for (let c = 0; c < (rows * cols); c++) {
        const btn = document.getElementById("button" + (c + 1));
        buttons.push(btn);
        btn.className = "unvisited";
        btn.addEventListener("click", function() {
            if (doneExecution) {
                if (c + 1 != srcNode && c + 1 != destNode) {
                    if (btn.className == "wall") {
                        btn.className = "unvisited";
                    }
                    else {
                        btn.className = "wall";
                    }
                }
            }
        });
        btn.addEventListener("mousedown", function() {
            isMouseDown = true;
            if (btn.className == "source") {
                isSrc = true;
            } else if (btn.className == "destination") {
                isDest = true;
            } else {
                btn.className = btn.className === "unvisited" ? "wall" : "unvisited";
            }
        });
        btn.addEventListener("mouseup", function() {
            isMouseDown = isSrc = isDest = false;
            if (doneExecution) {
                clearPath();
                visualizeButton.click();
                // document.getElementById("visualize").click();
            }
        });
        btn.addEventListener("mouseover", function() {
            if (isMouseDown) {
                if (isSrc) {
                    if (btn.className != "destination") {
                        buttons[srcNode].className = "unvisited";
                        // document.getElementById("button" + srcNode).className = "unvisited";
                        btn.className = "source";
                        srcNode = parseInt(btn.id.substring(6));
                        if (doneExecution) {
                            clearPath();
                            visualizeButton.click();
                            // document.getElementById("visualize").click();
                        }

                    }
                } else if (isDest) {
                    if (btn.className != "source") {
                        buttons[destNode].className = "unvisited";
                        // document.getElementById("button" + destNode).className = "unvisited";
                        btn.className = "destination";
                        destNode = parseInt(btn.id.substring(6));
                        if (doneExecution) {
                            clearPath();
                            visualizeButton.click();
                            // document.getElementById("visualize").click();
                        }
                    }
                } else {
                    if (btn.className != "source" && btn.className != "destination") {
                        btn.className = btn.className === "wall" ? "unvisited" : "wall";
                    }
                }
            }
        });

        document.getElementById("button" + srcNode).className = "source";
        document.getElementById("button" + destNode).className = "destination";
    }
    
    visualizeButton.addEventListener("click", async function () {
        // console.log(srcNode, destNode);
        // console.log(doneExecution);
            // let algorithm = document.getElementById("alg").value;
            // console.log("visualize", algorithm);
            // if (srcNode === null || destNode === null) {
            //     alert("Please choose the source and the destination");
            //     return;
            // }
            // if (algorithm == 'dfs') {
            //     dfs_helper(srcNode, destNode); // Make this dfs_helper. This is for Dev purpose.
            // } else if (algorithm == 'bfs') {
                await bfs_helper(srcNode, destNode);
            // } else {
            //     bidirectionalBfsHelper(srcNode, destNode);
            // }
    });
    const rangebar = document.getElementById("customRange1");
    rangebar.setAttribute("min", "0");
    rangebar.setAttribute("max", "60");
    rangebar.addEventListener("change", function() {
        delayInms = (80 - this.value) * 3;
        // console.log(delayInms);
    });

    document.getElementById("viscolor").addEventListener("change", function() {
        color = this.value;
    });

    document.getElementById("themecolor").addEventListener("change", function() {
        themeColor = this.value;
        navigationBar.style.backgroundColor = themeColor;
        let col = parseInt("0x" + themeColor.substring(1)) ^ (0xffffff);
        col = col.toString(16);
        navigationBar.style.color = ("#" + col + ("0".repeat(6 - col.length)));
    });
    document.getElementById("clear-board").addEventListener("click", clearBoard);
    document.getElementById("clear-path").addEventListener("click", clearPath);
}

initialize();


function clearBoard() {
    if (doneExecution) {
        buttons[srcNode].className = "source";
        buttons[destNode].className = "destination";
        for (let c = 0; c < (rows * cols); c++) {
            const btn = buttons[c + 1];
            if (btn.className != "source" && btn.className != "destination") {
                btn.className = "unvisited";
            }
        }
    }
}

function clearPath() {
    if (doneExecution) {
        for (let c = 0; c < (rows * cols); c++) {
            const btn = buttons[c + 1];
            if (btn.className != "wall" && btn.className != "source" && btn.className != "destination") {
                btn.className = "unvisited";
            }
        }
    }
}

var dx = [0, 1, -1, 0];
var dy = [1, 0, 0, -1];

async function printPath(key, prev) {
    while (prev[key] != key) {
        if (!doneExecution) {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve("done!"), delayInms);
              });

              await promise; // wait until the promise resolves (*)
        }
        buttons[key + 1].className = "path";
        // document.getElementById("button" + (key + 1)).className = 'path';
        key = prev[key];
    }
}
async function bfs(src_row, src_col) {
    let q = new Queue();
    q.push([src_row, src_col]);
    // console.log(src_row, src_col);
    let prev = [];
    for (let i = 0; i < (rows * cols); i++) {
        prev.push(i);
    }
    while (!q.empty()) {
        let sz = q.size();

        if (!doneExecution) {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve(""), delayInms);
            });

            await promise;
        }
        for (let i = 0; i < sz; i++) {
            let top = q.pop();
            for (let j = 0; j < 4; j++) {
                let new_row = top[0] + dx[j];
                let new_col = top[1] + dy[j];
                if (new_row < rows && new_row >= 0 && new_col < cols && new_col >= 0) {

                    var temp = buttons[new_row * cols + new_col + 1].className;
                    // var temp = document.getElementById("button" + (new_row * cols + new_col + 1)).className;
                    if (temp == 'destination') {
                        prev[new_row * cols + new_col] = top[0] * cols + top[1];

                        await printPath(prev[destNode - 1], prev);
                        return;
                    }
                    if (temp != 'unvisited') {
                        continue;
                    }

                    q.push([new_row, new_col]);
                    prev[new_row * cols + new_col] = top[0] * cols + top[1];
                    // console.log(new_row * cols + new_col, prev[new_row * cols + new_col]);
                    buttons[new_row * cols + new_col + 1].className = visited
                    // document.getElementById("button" + (new_row * cols + new_col + 1)).className = visited;
                }
            }
        }
    }
}
async function bidirectionalBfs(src_row, src_col, dest_row, dest_col) {
    let front = new Queue(),
        back = new Queue();
    front.push([src_row, src_col]);
    back.push([dest_row, dest_col]);
    let prev = [],
        prev2 = [];
    for (let i = 0; i < (rows * cols); i++) {
        prev2.push(i);
        prev.push(i);
    }
    while (front.size() > 0 && back.size() > 0) {
        let sz = front.size();
        if (!doneExecution) {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve(""), delayInms);
              });

              await promise;
        }
        // console.log(front.size(), back.size());
        for (let i = 0; i < sz; i++) {
            let top = front.pop();
            for (let j = 0; j < 4; j++) {
                let new_row = top[0] + dx[j];
                let new_col = top[1] + dy[j];
                if (new_row < rows && new_row >= 0 && new_col < cols && new_col >= 0) {
                    let temp = buttons[new_row * cols + new_col + 1].className;
                    // let temp = document.getElementById("button" + (new_row * cols + new_col + 1)).className;
                    if (temp == "backvisited") {
                        prev[new_row * cols + new_col] = top[0] * cols + top[1];

                            await printPath(new_row * cols + new_col, prev2);

                            await printPath(new_row * cols + new_col, prev);

                        return;
                    }
                    if (temp != "unvisited") {
                        continue;
                    }

                    front.push([new_row, new_col]);
                    prev[new_row * cols + new_col] = top[0] * cols + top[1];
                    buttons[new_row * cols + new_col + 1].className = "frontvisited";
                    // document.getElementById("button" + (new_row * cols + new_col + 1)).className = "frontvisited";
                }
            }
        }
        sz = back.size();
        for (let i = 0; i < sz; i++) {
            let top = back.pop();
            for (let j = 0; j < 4; j++) {
                let new_row = top[0] + dx[j];
                let new_col = top[1] + dy[j];
                if (new_row < rows && new_row >= 0 && new_col < cols && new_col >= 0) {
                    let temp = buttons[new_row * cols + new_col + 1].className;
                    // let temp = document.getElementById("button" + (new_row * cols + new_col + 1)).className;
                    if (temp == "frontvisited") {
                        prev2[new_row * cols + new_col] = top[0] * cols + top[1];
                            await printPath(new_row * cols + new_col, prev);

                            await printPath(new_row * cols + new_col, prev2);
                        return;
                    }
                    if (temp != "unvisited") {
                        continue;
                    }

                    back.push([new_row, new_col]);
                    prev2[new_row * cols + new_col] = top[0] * cols + top[1];
                    buttons[new_row * cols + new_col + 1].className = "backvisited";
                    // document.getElementById("button" + (new_row * cols + new_col + 1)).className = "backvisited";
                }
            }
        }
    }
}
async function dfs(row, col) {
    let stack = [];
    stack.push([row, col, 3]);
    
    // if (!doneExecution) {
    //     let promise = new Promise((resolve, reject) => {
    //         setTimeout(() => resolve(""), delayInms);
    //       });

    //       await promise;
    // }
    
    while (stack) {
        let top = stack.pop();
        // console.log(stack.length, top);
        let i = top[2];
        if (top[2] >= 0) {
            top[2]--;
            stack.push(top)
        } else {
            buttons[top[0] * cols + top[1] + 1].className == "unvisited";
            continue;
        }
        let new_row = top[0] + dx[i], new_col = top[1] + dy[i];
        if (new_row < rows && new_row >= 0 && new_col < cols && new_col >= 0) {
            if (buttons[new_row * cols + new_col + 1].className == "unvisited") {
                buttons[new_row * cols + new_col + 1].className = visited;
                stack.push([new_row, new_col, 3]);
            }
            if (buttons[new_row * cols + new_col + 1].className == "destination") {
                break;
            }
        }
    }
    
    // for (let i = 0; i < dx.length; i++) {
    //     let new_row = row + dx[i];
    //     let new_col = col + dy[i];
    //     console.log(i, new_row, new_col);
    //     if (new_row < rows && new_row >= 0 && new_col < cols && new_col >= 0) {
    //         if (buttons[new_row * cols + new_col + 1].className == "unvisited" && dfs(new_row, new_col)) {
    //             console.log("returned true");
    //             return true;
    //         } 
    //         // if (document.getElementById("button" + ((new_row * cols) + new_col + 1)).className == "unvisited" && dfs(new_row, new_col)) {
    //         //     return true;
    //         // } else if (document.getElementById("button" + ((new_row * cols) + new_col + 1)).className == "destination") {
    //         //     return true;
    //         // }
    //     }
    // }
    // if (buttons[row * cols + col + 1].className != visited) {
    //     buttons[row * cols + col + 1].className = "unvisited";
    // }
    // console.log(row, col);
    return 1;
}

async function dfs_helper(src, dest) {
    --src;
    --dest;
    let src_row = Math.floor(src / cols),
        src_col = src % cols;
    let dest_row = Math.floor(dest / cols),
        dest_col = dest % cols;
    // console.log(src_row, src_col, " -> ", dest_row, dest_col);
    await dfs(src_row, src_col, dest_row, dest_col);
    if (!doneExecution) {
        for (let i = 1; i <= rows * cols; i++) {
            buttons[i].style.animationDuration = "0s";
        }
    }
    doneExecution = true;
}

async function bfs_helper(src, dest) {
    --src;
    --dest;
    let src_row = Math.floor(src / cols),
        src_col = src % cols;
    await bfs(src_row, src_col);
    // console.log(buttons[2].style.animationName);
    if (!doneExecution) {
        for (let i = 1; i <= rows * cols; i++) {
            buttons[i].style.animationDuration = "0s";
        }
        
    }

    // console.log(buttons[2].style.animationName);
    doneExecution = true;
    let color_copy = color;
    let cnt_ = 0;
    for (let i = 1; i <= rows * cols; i++) {
        let name = buttons[i].className
        if (name == visited) {
            // cnt_++;
            buttons[i].style.backgroundColor = color_copy;
            // if (cnt_ == 1) {
            //     console.log(buttons[i].style.backgroundColor);
            // }
        }
        else if (name == "unvisited") {
            buttons[i].style.backgroundColor = "white";
        }
        else if (name == "path") {
            buttons[i].style.backgroundColor = themeColor;
        }
        else if (name == "wall") {
            buttons[i].style.backgroundColor = "black";
        }
        else if (name == "source") {
            buttons[i].style.backgroundColor = "green";
        }
        else if (name == "destination") {
            buttons[i].style.backgroundColor = "red";
        }
    }
    visited  = "newVisited";
    // console.log(cnt_, color_copy);
}

async function bidirectionalBfsHelper(src, dest) {
    --src;
    --dest;
    let src_row = Math.floor(src / cols),
        src_col = src % cols;
    let dest_row = Math.floor(dest / cols),
        dest_col = dest % cols;
    await bidirectionalBfs(src_row, src_col, dest_row, dest_col);
    if (!doneExecution) {
        for (let i = 1; i <= rows * cols; i++) {
            buttons[i].style.animationDuration = "0s";
        }
    }
    doneExecution = true;
}