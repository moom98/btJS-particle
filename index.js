// 長方形
// パスを初期化
// ctx.beginPath();
// // (x, y, width, height)
// ctx.rect(0, 0, 100, 200);
// // 塗りつぶし
// ctx.fillStyle = "#987390";
// ctx.fill();
// // パスを閉じる
// ctx.closePath();

// 円を描画
// パスを初期化
// ctx.beginPath();
// // (円の中心x, 円の中心y, 円の半径radius, 円お始まりの角度startAngle（ラジアン）, 円の終わりの角度endAngle, 描く向きanticlockwise)
// ctx.arc(100, 100, 50, 0, Math.PI * 2, false);
// // 塗りつぶし
// ctx.fillStyle = "#987390";
// ctx.fill();
// // パスを閉じる
// ctx.closePath();


window.requestAnimationFrame =
window.requestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function (cb) { setTimeout(cb, 17); };

let canvas = document.getElementById( "canvas" );
let ctx = canvas.getContext( "2d" );
let num = 50;
let particles = [];

canvas.width = canvas.height = 500;

for ( let i = 0; i < num; i++ ) {
    positionX = Math.random() * 120; // 0~120の間でランダムに
    positionY = Math.random() * 20; // 0~20の間でランダムに
    particle = new Particle(ctx, positionX, positionY);
    particles.push(particle);
}

function Particle(ctx, x, y) {
    this.ctx = ctx;
    this.x = x || 0;
    this.y = y || 0;

    // 速度用のオブジェクト
    this.v = {
        x: Math.random() * 10 - 5, // -5~5の間でランダムに
        y: Math.random() * 10 - 5 // -5~5の間でランダムに
    }

    // 色のオブジェクト
    this.color = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
        a: Math.random() + 0.5
    };

    // 円の大きさ
    this.radius = Math.random() * 100 + 100; // 100~300の間でランダムに

    // 消え始める大きさ
    this.startLife = Math.floor(Math.random() * 100) + 50; // 50~150の間でランダムに
    this.life = this.startLife;
}

Particle.prototype.render = function () {
    this.updatePosition();
    this.wrapPosition(); // 画面の端に到達したら、反対側から出現する
    this.draw();
}

Particle.prototype.draw = function() {
    // 4. 位置に図形を描画する
    ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.gradient();
    ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    ctx.closePath();
}

Particle.prototype.updatePosition = function() {
    // 3. 位置をずらす
    this.x += this.v.x;
    this.y += this.v.y;
}

Particle.prototype.wrapPosition = function () {
    // 範囲に収める
    // 左端に消えた点が右からあらわれ、上端に消えた点が下からあらわれる
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
}

Particle.prototype.gradient = function () {
    // グラデーションを作成する
    let col = this.color.r + "," + this.color.g + "," + this.color.b;
    let g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    g.addColorStop(0, "rgba(" + col + "," + (this.color.a *0.8) +")");
    g.addColorStop(0.5, "rgba(" + col + "," + (this.color.a * 0.2) + ")");
    g.addColorStop(1, "rgba(" + col + "," + (this.color.a * 0) + ")");
    return g;
}

Particle.prototype.updateParams = function () {
    // 寿命の残りを計算
    let ratio = this.life / this.startLife;
    // ratioは１から０まで変化する
    this.color.a = 1 - ratio;
    // 寿命に応じて半径も変化させる
    this.radius = this.startLife * ratio;
    // lifeを減らす
    this.life -= 1;
    // 寿命が尽きたら復活させる（初期化する）
    if (this.life === 0) this.initialize();
}

// 1. 描画
render();

function render() {
    // 図形を消去する
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 配列各要素のrenderを実行して図形を描画
    particles.forEach(function(e) { e.render(); });

    // 5. 一定時間を区切って描画する
    requestAnimationFrame(render);
}