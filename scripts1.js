
//第一部分代码
(function() {
    const xA = document.getElementById('xA');
    const n = document.getElementById('n');
    const n0 = document.getElementById('n0');
    const theta = document.getElementById('theta');
    const viewX = document.getElementById('viewX');
    const viewY = document.getElementById('viewY');
    const viewSize = document.getElementById('viewSize');
    const canvas = document.getElementById('lightPathCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.height = Math.min(canvas.width, canvas.height);
    let scale = 1;

    function realToCanvas(realX, realY) {
        const centerX = parseFloat(viewX.value);
        const centerY = parseFloat(viewY.value);
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const translatedX = realX - centerX;
        const translatedY = realY - centerY;

        const canvasX = translatedX * scale + canvasWidth / 2;
        const canvasY = canvasHeight / 2 - translatedY * scale;

        return { x: canvasX, y: canvasY };
    }

    function updateScale() {
        const viewSizeValue = parseFloat(viewSize.value);
        scale = canvas.width / viewSizeValue;
    }

    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function h(x) {
        return x * Math.tan(degreesToRadians(theta.value));
    }

    function K_N(x) {
        return -1 / Math.tan(degreesToRadians(theta.value));
    }

    function calculateOpticalPath(X_A, n0, n) {
        let Y_A = h(X_A);
        let theta0 = Math.atan(Y_A / X_A);
        let K_AP = Math.tan(Math.PI * 0.5 + 2 * theta0);
        let theta1 = Math.asin(Math.sin(theta0) * n0 / n);
        let theta2 = theta1 - theta0;
        let K_AB = 1 / Math.tan(theta2);
        let K_BC = -K_AB;
        let X_B = X_A - Math.tan(theta2) * Y_A;
        let Y_B = 0;
        let X_C = X_B / (1 + Math.tan(theta0) * Math.tan(theta2));
        let Y_C = h(X_C);
        let K_N_C = K_N(X_C);
        let K_CP = K_N_C;
        let theta3 = Math.abs(Math.atan(K_N_C) - Math.atan(K_BC));
        let theta4 = Math.asin(Math.sin(theta3) * n / n0);
        K_CP = (K_N_C > K_BC) ? Math.tan(Math.atan(K_N_C) + Math.PI + theta4) : Math.tan(Math.atan(K_N_C) + Math.PI - theta4);
        let X_P = (K_AP * X_A - K_CP * X_C) / (K_AP - K_CP);
        let Y_P = K_AP * (X_P - X_A) + Y_A;

        return {
            O: { x: 0, y: 0 },
            A: { x: X_A, y: Y_A },
            B: { x: X_B, y: Y_B },
            C: { x: X_C, y: Y_C },
            P: { x: X_P, y: Y_P },
        };
    }

    function centerOpticalPath(results) {
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        let pointsArray = [results.A, results.B, results.C, results.P];

        for (let i = 0; i < pointsArray.length; i++) {
            const point = pointsArray[i];
            minX = Math.min(minX, point.x);
            maxX = Math.max
            (maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
            }
                const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const sizeX = maxX - minX;
    const sizeY = maxY - minY;
    const viewSizeValue = Math.max(sizeX, sizeY) / 0.9;

    viewX.value = centerX;
    viewY.value = centerY;
    viewSize.value = viewSizeValue;

    updateScale();
    updateCanvas();
}

function drawLine(x1, y1, x2, y2, color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth || 1;
    ctx.stroke();
}

function drawText(text, x, y, color) {
    ctx.font = '12px Arial';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function drawOpticalPath(results) {
    const O = realToCanvas(0, 0);
    const A = realToCanvas(results.A.x, results.A.y);
    drawLine(O.x, O.y, A.x, A.y, 'black');
    drawText('A', A.x, A.y - 10, 'black');

    const B = realToCanvas(results.B.x, results.B.y);
    drawLine(O.x, O.y, B.x, B.y, 'black');
    drawText('B', B.x, B.y + 10, 'black');

    drawLine(A.x, A.y, B.x, B.y, 'blue');

    const C = realToCanvas(results.C.x, results.C.y);
    drawLine(B.x, B.y, C.x, C.y, 'blue');
    drawText('C', C.x, C.y + 10, 'black');

    const P = realToCanvas(results.P.x, results.P.y);
    drawLine(A.x, A.y, P.x, P.y, 'red');
    drawText('P', P.x, P.y - 10, 'blue');

    drawLine(C.x, C.y, P.x, P.y, 'red');
}

function updatePointCoordinates(results) {
    const ax = parseFloat(results.A.x);
    const ay = parseFloat(results.A.y);
    const bx = parseFloat(results.B.x);
    const by = parseFloat(results.B.y);
    const cx = parseFloat(results.C.x);
    const cy = parseFloat(results.C.y);
    const px = parseFloat(results.P.x);
    const py = parseFloat(results.P.y);
    const AB = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    const BC = Math.sqrt(Math.pow(cx - bx, 2) + Math.pow(cy - by, 2));
    const AP = Math.sqrt(Math.pow(ax - px, 2) + Math.pow(ay - py, 2));
    const CP = Math.sqrt(Math.pow(cx - px, 2) + Math.pow(cy - py, 2));
    console.log(`AB: ${AB}, BC: ${BC}, AP: ${AP}, CP: ${CP}`);
    const dert_actrual = n.value * (AB + BC ) - n0.value * (AP - CP);
    const dert_estimated = 2 * n.value * ay;
    document.getElementById('A-coordinates').textContent = `A: (${ax.toFixed(2)}, ${ay.toFixed(2)})`;
    document.getElementById('B-coordinates').textContent = `B: (${bx.toFixed(2)}, ${by.toFixed(2)})`;
    document.getElementById('C-coordinates').textContent = `C: (${cx.toFixed(2)}, ${cy.toFixed(2)})`;
    document.getElementById('P-coordinates').textContent = `P: (${px.toFixed(2)}, ${py.toFixed(2)})`;
    document.getElementById('dert_actrual-coordinates').textContent = `dert_actrual (n(|AB|+|BC|)-n0(|AP|-|CP|)): ${dert_actrual.toFixed(2)}`;
    document.getElementById('dert_estimated-coordinates').textContent = `dert_estimated (2nh)): ${dert_estimated.toFixed(2)}`;
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const results = calculateOpticalPath(xA.value, n0.value, n.value);
    drawOpticalPath(results);
    updatePointCoordinates(results);
}

[xA, n, n0, theta, viewX, viewY, viewSize].forEach(input => {
    input.addEventListener('input', updateCanvas);
});

document.getElementById('centerOpticalPath').addEventListener('click', () => {
    const results = calculateOpticalPath(xA.value, n0.value, n.value);
    centerOpticalPath(results);
});

document.addEventListener('DOMContentLoaded', updateCanvas);
viewSize.addEventListener('input', updateScale);
document.addEventListener('DOMContentLoaded', () => {
    const initialResults = calculateOpticalPath(xA.value, n0.value, n.value);
    updateScale();
    updateCanvas();
});
})();

function calculateCombinedAmplitude(A1, A2, phaseDifference) {
    return math.sqrt(math.pow(A1, 2) + math.pow(A2, 2) + 2 * A1 * A2 * math.cos(phaseDifference));
}


class ThinFilm {
    constructor(thickness, refractiveIndex, wavelength) {
        this.h = thickness;
        this.n = refractiveIndex;
        this.lambda_ = wavelength;
    }

    phaseShiftFunction(zFunc) {
        return (x, y) => {
            const z = zFunc(x, y);
            const opd = this.n * (2 * (this.h - z));
            return (2 * Math.PI * opd / this.lambda_) + Math.PI;
        };
    }
}

// 观测窗口类，用于定义观测窗口的尺寸
class ObservationWindow {
    constructor(sideLengthM) {
        this.sideLengthM = sideLengthM;
    }
}

// 楔形类，用于模拟楔形的几何特性
class Wedge {
    constructor(thickness, observationWindow, thetaDegrees) {
        this.thickness = thickness;
        this.observationWindow = observationWindow;
        this.thetaRadians = this.degreesToRadians(thetaDegrees); // 将theta转换为弧度
        console.log(`thetaRadians: ${this.thetaRadians}`);
    }
    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }


    zFunc() {
        const tanTheta = Math.tan(this.thetaRadians); // 使用tan(theta)作为斜率
        console.log(`tanTheta: ${tanTheta}`);
        return (x, y) => tanTheta * x;
    }
}

// 球冠类，用于模拟球冠的几何特性
class SphericalCap {
    constructor(radius, height, observationWindow) {
        if (height > observationWindow.sideLengthM) {
            throw new Error("球冠高度不能超过观测窗口的高度");
        }
        this.radius = radius;
        this.height = height;
        this.observationWindow = observationWindow;
    }

    zFunc() {
        return (x, y) => this.radius - math.sqrt(math.pow(this.radius, 2) - math.pow(x, 2) - math.pow(y, 2));
    }
}

/**
 * 异步函数，用于绘制干涉图样
 * @param {ObservationWindow} observationWindow 观测窗口
 * @param {Function} zFunc 函数，用于计算某点的高度
 * @param {ThinFilm} thinFilm 薄膜
 * @param {number[]} wavelengths 波长
 * @param {number} A1 波的振幅
 * @param {number} A2 波的振幅
 * @param {number} sideLengthPixels  canvas的像素
 * @param {string} canvasId  canvas的id
 */
async function drawInterferencePattern(observationWindow, zFunc, thinFilm, wavelengths, A1, A2, sideLengthPixels, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const imgData = ctx.createImageData(sideLengthPixels, sideLengthPixels);

    for (let x = 0; x < sideLengthPixels; x++) {
        for (let y = 0; y < sideLengthPixels; y++) {
            const windowX = (x - sideLengthPixels / 2) * (observationWindow.sideLengthM / sideLengthPixels);
            const windowY = (y - sideLengthPixels / 2) * (observationWindow.sideLengthM / sideLengthPixels);

            if (wavelengths.length === 1) {
                // 灰度模式
                const phaseDifference = (2 * Math.PI * (thinFilm.n * (2 * (thinFilm.h - zFunc(windowX, windowY))) / wavelengths[0])) + Math.PI;
                const combinedAmplitude = calculateCombinedAmplitude(A1, A2, phaseDifference);
                const grayValue = Math.round((combinedAmplitude / (A1 + A2)) * 255);
                //console.log(`Position (${x},${y}): phaseDifference=${phaseDifference}, combinedAmplitude=${combinedAmplitude}`);
                imgData.data[y * sideLengthPixels * 4 + x * 4] = grayValue;
                imgData.data[y * sideLengthPixels * 4 + x * 4 + 1] = grayValue;
                imgData.data[y * sideLengthPixels * 4 + x * 4 + 2] = grayValue;
                imgData.data[y * sideLengthPixels * 4 + x * 4 + 3] = 255;
            } else {
                // 彩色模式
                const rgb = wavelengths.map(wavelength => {
                    const opd = thinFilm.n * (2 * (thinFilm.h - zFunc(windowX, windowY))) ;
                    const phaseDifference = (2 * Math.PI * opd / wavelength) + Math.PI;
                    const combinedAmplitude = calculateCombinedAmplitude(A1, A2, phaseDifference);
                    //console.log(`Position (${x},${y}): OPD=${opd}, phaseDifference=${phaseDifference}, combinedAmplitude=${combinedAmplitude}`);
                    return Math.round((combinedAmplitude / (A1 + A2)) * 255);
                });
                imgData.data[y * sideLengthPixels * 4 + x * 4] = rgb[0]; // Red
                imgData.data[y * sideLengthPixels * 4 + x * 4 + 1] = rgb[1]; // Green
                imgData.data[y * sideLengthPixels * 4 + x * 4 + 2] = rgb[2]; // Blue
                imgData.data[y * sideLengthPixels * 4 + x * 4 + 3] = 255; // Alpha
            }
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

// 更新参数的函数
function updateParameters() {
    const wavelengthNm = parseFloat(document.getElementById('wavelength').value);
    const thicknessUm = parseFloat(document.getElementById('thickness').value);
    const windowSizeUm = parseFloat(document.getElementById('windowSize').value);
    const radiusM = parseFloat(document.getElementById('radius').value);
    const thetaDegrees = parseFloat(document.getElementById('theta_part2').value);
    console.log(`wavelengthNm: ${wavelengthNm}, thicknessUm: ${thicknessUm}, windowSizeUm: ${windowSizeUm}, radiusM: ${radiusM}, thetaDegrees: ${thetaDegrees}`);
    document.getElementById('wavelengthValue').textContent = wavelengthNm;
    document.getElementById('thicknessValue').textContent = thicknessUm;
    document.getElementById('windowSizeValue').textContent = windowSizeUm;
    document.getElementById('radiusValue').textContent = radiusM;
    document.getElementById('thetaValue').textContent = thetaDegrees; // 更新theta值
}

// 定义波长数组
const wavelengths = [450e-9, 550e-9, 700e-9]; // 蓝光、绿光、红光

// 根据模式类型绘制干涉图样的函数
function drawPattern(patternType, isColorMode) {
    const wavelengthNm = parseFloat(document.getElementById('wavelength').value);
    const thicknessUm = parseFloat(document.getElementById('thickness').value);
    const windowSizeUm = parseFloat(document.getElementById('windowSize').value);
    const wavelengthM = wavelengthNm * 1e-9;
    const thicknessM = thicknessUm * 1e-6;
    const windowSizeM = windowSizeUm * 1e-6;
    const radiusM = parseFloat(document.getElementById('radius').value);
    const theta_part2 = parseFloat(document.getElementById('theta_part2').value); // 获取theta值
    const A1 = 1.0;
    const A2 = 1.0;
    const filmRefractiveIndex = 1.5;
    const observationWindow = new ObservationWindow(windowSizeM);
    const thinFilmInstance = new ThinFilm(thicknessM, filmRefractiveIndex, isColorMode ? undefined : wavelengthM);

    if (patternType === 'wedge') {
        const wedgeInstance = new Wedge(thicknessM, observationWindow, theta_part2); // 传递theta
        document.getElementById('wedgeStatus').textContent = '正在计算中';
        drawInterferencePattern(observationWindow, wedgeInstance.zFunc(), thinFilmInstance, isColorMode ? wavelengths : [wavelengthM], A1, A2, 1024, 'wedgeCanvas');
        document.getElementById('wedgeStatus').textContent = '绘制成功';
    } else if (patternType === 'sphericalCap') {
        const sphericalCapInstance = new SphericalCap(radiusM, thicknessM, observationWindow);
        document.getElementById('sphericalCapStatus').textContent = '正在计算中';
        drawInterferencePattern(observationWindow, sphericalCapInstance.zFunc(), thinFilmInstance, isColorMode ? wavelengths : [wavelengthM], A1, A2, 1024, 'sphericalCapCanvas');
        document.getElementById('sphericalCapStatus').textContent = '绘制成功';
    }
}

// 绘制楔形图样的函数
function drawWedgePattern() {
    const isColorMode = document.getElementById('colorToggle').checked;
    drawPattern('wedge', isColorMode);
}

// 绘制球冠图样的函数
function drawSphericalCapPattern() {
    const isColorMode = document.getElementById('colorToggle').checked;
    drawPattern('sphericalCap', isColorMode);
}

// 导出图像的函数
function exportImage(canvasId) {
    const canvas = document.getElementById(canvasId);
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${canvasId}.png`;
    link.href = dataURL;
    link.click();
}