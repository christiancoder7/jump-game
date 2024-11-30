const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");

//設定変数
const FRAME = 1000 / 30;
let frame = 0;
let scene = 0;
let score = 0;
let startFlag = false;
let jumpFlag = false;

//プレイヤー
let px = 70;
let py = 50;
let ps = 20;
let vy = 8;

//ブロック変数
let bx = [0, 0, 0];
let by = [100, 150, 200];
let bw = 50;
let bs = 140;

//影描写
let shadowGap = 8;
let shadowColor = "hsla(240deg, 50%, 60%, 50%)";

//キーイベント
window.addEventListener("keydown", event => {
    if (event.key === " ") {
        event.preventDefault();


        switch (scene) {
            case 0:
                startFlag = true;
                break;
                case 1:

                if (vy > 6) {
                    jumpFlag = true;
                }
                break;
                    
        }
    }
});

//初期化処理
function init() {
    ctx.lineWidth = 2;

    py = 50;
    vy = 8;

    for (let i = 0; i < bx.length; i++) {
        bx[i] = 450 + i * 200;
        by[i] = Math.floor(Math.random() * 60) + 120;
    }
    score = 0;

}


//プレイヤー更新
function updatePlayer() {
    if(jumpFlag) {
        jumpFlag = false;
        vy = -15;
    }

    if(vy < 8) {
        vy += 1.5; 
    } else if (vy > 8) {
        vy = 8;
    }
    
    py += vy;

    for (let i = 0; i < bx.length; i++) {
        let dx = Math.abs(ps - bx[i]);
        let lx = ps / 2 + bw / 2;

        let uby = (by[i] - bs / 2) / 2;
        let udy = Math.abs(py - uby);
        let uly = ps / 2 + uby;

        let lby = ((by[i] + bs / 2) + cvs.height) / 2;
        let ldy = Math.abs(py - lby);
        let lly = ps / 2 + (cvs.height - (by[i] + bs /2)) / 2;

        if ((dx < lx && udy < uly) || (dx < lx && ldy < lly)) {
            frame = 0;
            scene = 2;
        }
    }

    if (py < ps / 2 || py > cvs.height - ps / 2) {
       
        frame = 0;
        scene = 2;
    }
}

//ブロック更新
function updateBlock() {
    for (let i = 0; i < bx.length; i++) {
        bx[i] -= 2;

        if (bx[i] === -50) {
            bx[i] = 550;
            by[i] = Math.floor(Math.random() * 60) + 120;
        }
    }
}

//背景
function drawBack() {
    ctx.fillStyle = "hsl(200deg, 100%, 70%)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
}

//プレイヤー描写
function drawPlayer() {
    ctx.fillStyle = shadowColor;
    ctx.fillRect(px - ps / 2 - shadowGap, py - ps / 2 + shadowGap, ps, ps);

    ctx.strokeStyle = "hsl(0deg, 0%, 100%)";
    ctx.strokeRect(px - ps / 2, py - ps / 2, ps, ps);

    ctx.fillStyle = "hsl(0deg, 100%, 60%)";
    ctx.fillRect(px - ps / 2, py - ps / 2, ps, ps);
}

//ブロック描画
function drawBlock()  {

    for (let i = 0; i < bx.length; i++){
    ctx.fillStyle = shadowColor;
    ctx.fillRect(bx[i] - bw / 2 - shadowGap, 0, bw, by[i] - bs / 2 + shadowGap);
    ctx.fillRect(bx[i] - bw / 2 - shadowGap, by[i] + bs / 2 + shadowGap, bw, cvs.height - by[i] - bs / 2 );

    ctx.strokeStyle = "hsl(0deg, 0%, 0%)";
    ctx.strokeRect(bx[i] - bw / 2, 0, bw, by[i] - bs / 2);
    ctx.strokeRect(bx[i] - bw / 2, by[i] + bs / 2, bw, cvs.height - by[i] - bs / 2);

    ctx.fillStyle = "hsl(230deg, 100%, 70%)";
    ctx.fillRect(bx[i] - bw / 2, 0, bw, by[i] - bs / 2);
    ctx.fillRect(bx[i] - bw / 2, by[i] + bs / 2, bw, cvs.height - by[i] - bs / 2);
}
}

//エンドテキスト描画
function drawEndText () {
    ctx.fillStyle = "hsl(0deg, 0%, 100%)";
    ctx.font = "40px monospace";
    ctx.fillText("Game Over", 110, 170);
}

//スタートテキスト描写
function drawStartText () {
    ctx.fillStyle = "hsl(0deg, 0%, 100%)";
    ctx.font = "24px monospace";
    ctx.fillText("[Space] to start", 100, 150);
}

//スコア描写
function drawScore () {
    ctx.fillStyle ="hsl(0deg, 0%, 100%)";
    ctx.font = "16px monospace";
    ctx.fillText("score: " + score, 10, 20);
}

//消滅エフェクト
function drawDeathEffect () {
    ctx.beginPath();
    ctx.strokeStyle = shadowColor;
    ctx.arc(px - shadowGap, py + shadowGap, frame * 8, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "hsl(0deg, 0%, 100%)";
    ctx.arc(px, py, frame * 8, 0, 2 * Math.PI);
}

function update () {
    frame++;

    switch (scene){
        case 0:
            updateBlock();

            if (startFlag) {
                init();
                frame = 0;
                scene = 1;
            }
            break;
        case 1:
        score++;

        updateBlock();
        updatePlayer();
        break;

        case 2:
        updateBlock();

        if (frame === 90){
            startFlag = flase;
            frame = 0;
            score = 0;
        }
        break;
    }

}

function draw() {
    switch (scene) {
        case 0:
        drawBack();
        drawBlock();
        drawStartText();
        break;

        case 1:
        drawBack ();
        drawBlock();
        drawPlayer ();
        drawScore();
        break;

        case 2:
        drawBack();
        drawBlock();
        drawEndText();

        if(frame < 10){
            drawDeathEffect();
        }
        break;
    }


}

function main() {
    update();
    draw();
    
    setTimeout(main, FRAME); //直接1000 / 30を入れてもいいが、可読性を考慮してFRAMEに入れる
}

init() ;
main ();