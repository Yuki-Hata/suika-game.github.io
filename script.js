// Matter.js のモジュールを取り込む
const {Engine, Render, World, Bodies, Body, Events} = Matter;

let total_score = 0

// Web Audio APIの準備
const audioContext = new AudioContext();
let bgmSource;
// BGMのパス
const bgmPath = [
    null, // slime, hoimi_slime, arumiraji, minidemon, bakudan_iwa, baberu_boburu にはBGMなし
    null,
    null,
    null,
    null,
    null,
    './sound/don_mogura.mp3',
    './sound/dorumagesu.mp3',
    './sound/rapuso-n.mp3',
    './sound/dekkachan.mp3',
    './sound/sonshi.mp3',
];

let firstTouch = true;

// touchstart イベントリスナーを追加
document.addEventListener('touchstart', () => {
    if (firstTouch) {
        // AudioContext を再開し、BGM を再生
        audioContext.resume().then(() => {
            if (bgmSource && !bgmSource.isStarted) {
                bgmSource.start();
                bgmSource.isStarted = true;
            }
        });
        firstTouch = false;
    }
});

// ボタン要素を取得
const leftButton = document.getElementById('leftButton');
const dropButton = document.getElementById('dropButton');
const rightButton = document.getElementById('rightButton');

// ボタンが押されているかどうかのフラグ
let isLeftButtonPressed = false;
let isRightButtonPressed = false;

// インターバルIDを格納する変数
let moveLeftInterval;
let moveRightInterval;

// ボタンのイベントリスナーを設定 (touchstart, touchend イベントに変更)
leftButton.addEventListener('touchstart', () => {
    event.preventDefault();
    isLeftButtonPressed = true;
    moveLeftInterval = setInterval(() => {
        if (isLeftButtonPressed && !isFalling) {
            Body.translate(nextObject, {x: -20, y: 0});
        }
    }, 100); // 100ミリ秒ごとに移動
});

leftButton.addEventListener('touchend', () => { // touchend に修正
    event.preventDefault();
    isLeftButtonPressed = false;
    clearInterval(moveLeftInterval); // インターバルをクリア
});

// 右ボタンも同様に設定 (touchstart, touchend イベントに変更)
rightButton.addEventListener('touchstart', () => {
    event.preventDefault();
    isRightButtonPressed = true;
    moveRightInterval = setInterval(() => {
        if (isRightButtonPressed && !isFalling) {
            Body.translate(nextObject, {x: 20, y: 0});
        }
    }, 100); // 100ミリ秒ごとに移動
});

rightButton.addEventListener('touchend', () => { // touchend に修正
    event.preventDefault();
    isRightButtonPressed = false;
    clearInterval(moveRightInterval); // インターバルをクリア
});

// Drop ボタンも touchstart イベントに変更
dropButton.addEventListener('touchstart', () => {
    event.preventDefault();
    if (!isFalling) {
        isFalling = true;
        Body.setStatic(nextObject, false);

        // BGM再生 (初回のみ)
        if (bgmSource && !bgmSource.isStarted) {
            audioContext.resume().then(() => {
                bgmSource.start();
                bgmSource.isStarted = true;
            });
        }

        setTimeout(() => {
            nextObject = createRandomFallingObject(width / 2, 30);
            World.add(engine.world, nextObject); // nextObject を World に追加
            isFalling = false; // 落下完了後にフラグを戻す (追加処理の後)
        }, 2000);
    }
});
// 画面スクロール禁止
document.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, {passive: false}); // passive: false を指定

// BGMファイルの読み込み
fetch('./sound/DQ8_casino.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        bgmSource = audioContext.createBufferSource();
        bgmSource.buffer = audioBuffer;
        bgmSource.connect(audioContext.destination);
        bgmSource.loop = true; // ループ再生
        bgmSource.isStarted = false; // 再生開始済みフラグを初期化

        // bgmSource が初期化された後に再生を開始
        if (document.readyState === 'complete') {
            bgmSource.start();
            bgmSource.isStarted = true; // 再生済みフラグをtrueに
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                bgmSource.start(); // ページ読み込み時に再生
                bgmSource.isStarted = true; // 再生済みフラグをtrueに
            });
        }
    });

// オブジェクトの定義の配列
const objectDefinitions = [
    {
        texture: "./img/1_slime.png",
        size: 50,
        label: "slime",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 50
    },
    {
        texture: "./img/2_hoimi_slime.png",
        size: 60,
        label: "hoimi_slime",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 60
    },
    {
        texture: "./img/3_arumiraji.png",
        size: 80,
        label: "arumiraji",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
    {
        texture: "./img/4_minidemon.png",
        size: 100,
        label: "minidemon",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
    {
        texture: "./img/5_bakudan_iwa.png",
        size: 120,
        label: "bakudan_iwa",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
    {
        texture: "./img/6_baberu_boburu.png",
        size: 150,
        label: "baberu_boburu",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
    {
        texture: "./img/7_don_mogura.png",
        size: 160,
        label: "don_mogura",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
    {
        texture: "./img/8_dorumagesu.png",
        size: 170,
        label: "dorumagesu",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
    {
        texture: "./img/9_rapuso-n.png",
        size: 180,
        label: "rapuso-n",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
    {
        texture: "./img/10_dekkachan.png",
        size: 200,
        label: "dekkachan200",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
    {
        texture: "./img/11_sonshi.png",
        size: 300,
        label: "sonshi",
        originalWidth: 637, // 画像の元の幅
        originalHeight: 637, // 画像の元の高さ
        score: 70
    },
];

// 次に落とすオブジェクトをランダムに選択して作成する関数
function createRandomFallingObject(x, y) {
    const randomIndex = Math.floor(Math.random() * 6);
    const objectDef = objectDefinitions[randomIndex];

    // スケールを計算（オブジェクトのサイズに合わせる）
    const scale = objectDef.size * 2 / Math.max(objectDef.originalWidth, objectDef.originalHeight);

    return Bodies.circle(x, y, objectDef.size, {
        label: objectDef.label,
        isStatic: true,
        render: {
            sprite: {
                texture: objectDef.texture,
                xScale: scale,
                yScale: scale
            }
        }
    });
}

// 次のオブジェクトを取得する関数
function getNextObjectDefinition(label) {
    for (let i = 0; i < objectDefinitions.length; i++) {
        if (objectDefinitions[i].label === label) {
            // 次のオブジェクトを配列から取得
            if (i === objectDefinitions.length - 1) {
                return null;
            }
            return objectDefinitions[(i + 1) % objectDefinitions.length];
        }
    }
    return null;
}

// エンジンとレンダラーを作成
const engine = Engine.create();
const render = Render.create({
    element: document.body,
    canvas: document.getElementById('matter-canvas'),
    engine: engine,
    options: {
        wireframes: false,
        background: 'rgba(0,0,0,0)',
        width: window.innerWidth * 0.99,
        height: window.innerHeight * 0.75,
    }
});

// 画面の幅と高さを取得
const width = render.options.width;
const height = render.options.height;

// 床と壁を作成
const ground = Bodies.rectangle(width / 2, height, width, 20, {isStatic: true});
const leftWall = Bodies.rectangle(0, height / 2, 20, height, {isStatic: true});
const rightWall = Bodies.rectangle(width, height / 2, 20, height, {isStatic: true});

// 床と壁をワールドに追加
World.add(engine.world, [ground, leftWall, rightWall]);

// BGM再生済みフラグの配列
const isBgmPlayed = Array(bgmPath.length).fill(false); // 全てのBGMを未再生に初期化

// images 要素を取得
const imagesElement = document.getElementById('images2');
const imageElements = imagesElement.querySelectorAll('img');


// 2つのオブジェクトが衝突した時に呼ばれる関数
function mergeBodies(pair) {
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;

    // 同じラベルのオブジェクトが衝突した場合
    if (bodyA.label === bodyB.label) {
        const nextObjectDef = getNextObjectDefinition(bodyA.label);

        if (nextObjectDef) {
            // BGM再生処理を追加
            const bgmIndex = objectDefinitions.findIndex(obj => obj.label === nextObjectDef.label);
            if (bgmIndex >= 6 && bgmIndex <= 10 && !isBgmPlayed[bgmIndex]) { // 7~11のオブジェクトで、まだ再生されていない場合
                playBgm(bgmIndex);
                isBgmPlayed[bgmIndex] = true; // 再生済みフラグを立てる
            }
            // 画像差し替え処理を追加
            if (bgmIndex >= 6 && bgmIndex <= 10) { // 7~11のオブジェクトの場合
                if (imageElements[bgmIndex - 5].src.endsWith('hatena.png')) { // まだhatena.pngの場合
                    imageElements[bgmIndex - 5].src = nextObjectDef.texture; // 画像を差し替え
                }
            }

            total_score += nextObjectDef.score;
            $('#score').html(total_score.toString())
            const newX = (bodyA.position.x + bodyB.position.x) / 2;
            const newY = (bodyA.position.y + bodyB.position.y) / 2;

            // スケールを計算（オブジェクトのサイズに合わせる）
            const scale = nextObjectDef.size * 2 / Math.max(nextObjectDef.originalWidth, nextObjectDef.originalHeight);

            const newBody = Bodies.circle(newX, newY, nextObjectDef.size, {
                label: nextObjectDef.label,
                render: {
                    sprite: {
                        texture: nextObjectDef.texture,
                        xScale: scale,
                        yScale: scale
                    }
                }
            });

            World.remove(engine.world, [bodyA, bodyB]);
            World.add(engine.world, newBody);
        }
    }
}

// BGMを再生する関数
async function playBgm(index) {
    if (!bgmPath[index]) return; // BGMパスがnullの場合は再生しない
    if (bgmSource) {
        bgmSource.stop(); // 現在のBGMを停止
    }

    const response = await fetch(bgmPath[index]);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    bgmSource = audioContext.createBufferSource(); // 新しいAudioBufferSourceNodeを作成
    bgmSource.buffer = audioBuffer;
    bgmSource.connect(audioContext.destination);
    bgmSource.loop = true;
    bgmSource.start();
}

// オブジェクトが衝突した時にイベントリスナーを設定
Events.on(engine, 'collisionStart', event => {
    const pairs = event.pairs;
    pairs.forEach(pair => {
        if (pair.bodyA.label === pair.bodyB.label) {
            mergeBodies(pair);
        }
    });
});

// 初期の落下オブジェクトを作成
let nextObject = createRandomFallingObject(width / 2, 30);
// オブジェクトが落下中かどうか
let isFalling = false;
World.add(engine.world, nextObject);

// キーボード入力に応じてオブジェクトを操作
window.addEventListener('keydown', event => {
    if (event.code === 'Space' && !isFalling) { // 落下中でない場合のみ処理
        // スペースキーでオブジェクトを落下
        isFalling = true; // 落下中フラグを立てる
        Body.setStatic(nextObject, false);

        setTimeout(() => {
            nextObject = createRandomFallingObject(width / 2, 30);
            World.add(engine.world, nextObject);
            isFalling = false; // 落下完了後にフラグを戻す
        }, 2000);
    } else if (event.code === 'ArrowLeft' && !isFalling) {
        // 左矢印キーでオブジェクトを左に移動
        Body.translate(nextObject, {x: -20, y: 0});
    } else if (event.code === 'ArrowRight' && !isFalling) {
        // 右矢印キーでオブジェクトを右に移動
        Body.translate(nextObject, {x: 20, y: 0});
    }
});

// レンダラーとエンジンを実行
Render.run(render);
Engine.run(engine);

