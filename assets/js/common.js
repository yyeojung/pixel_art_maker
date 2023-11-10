const body = document.body;
const container = document.querySelector(".container");
const gridSize = document.getElementById("gridNum");
let size = gridSize.value;
const color = document.querySelector(".color_picker");
const resetBtn = document.querySelector(".reset");
const eraserBtn = document.querySelector(".eraser");

let isDrawing = false;
let isErasing = false;

container.addEventListener("mousedown", () => {
    isDrawing = true;
});

container.addEventListener("mouseup", () => {
    isDrawing = false;
});

//container 넘어가면 drawing 취소
window.addEventListener("mousemove", (e) => {
    if (e.target.className == "pixel" || e.target.className == "container") {
        return;
    } else {
        isDrawing = false;
    }
});

//reset 빈화면으로 만들기
resetBtn.addEventListener("click", () => {
    container.innerHTML = "";
    makeContainer(size);
});

//reset event
function resetContainer() {
    container.innerHTML = "";
};

//지우개
eraserBtn.addEventListener("click", () => {
    isErasing = !isErasing
    body.classList.replace('painting', 'eraser');
})

//input size event
gridSize.addEventListener("change", (e) => {
    if (e.target.value < 1 || e.target.value > 60) { //1보다 작거나 60보다 크면 경고!
        gridSize.value = 30; //기본값
        alert("1 ~ 60까지 입력 가능합니다.");
        setPixelSize(30);
    } else {
        size = e.target.value;
        setPixelSize(size);
    }

    function setPixelSize(num) { //pixelSize 이벤트
        resetContainer();
        makeContainer(num);
    }
});

//그림 pixel table 만들기
function makeContainer(s) {
    let tableRows = ''; //tableRows에 tr, td 추가
    for (let h = 0; h < s; h++) {
        tableRows += '<tr>';
        for (let w = 0; w <= s; w++) {
            tableRows += `<td class="pixel" style="width: ${100 / size}%; height: ${100 / size}%"></td>`
        }
        tableRows += '</tr>'
    }
    const table = document.createElement('table');
    table.innerHTML = tableRows;
    container.appendChild(table); //table 생성 후 pixel tr, td 추가

    const pixels = document.querySelectorAll('.container table td');

    //지우개, 그리기 이벤트
    pixels.forEach(pixel => {
        pixel.addEventListener("mouseover", () => {
            if (isDrawing && isErasing) { //isDrawing이 자꾸 false로 나와서 이유 찾음 ㅜ
                pixel.style.backgroundColor = '#fff';
            } else if (isDrawing) { 
                pixel.style.backgroundColor = color.value;
            }
        });
        pixel.addEventListener("mousedown", () => {
            if (isErasing) {
                pixel.style.backgroundColor = '#fff';   
            } else {
                pixel.style.backgroundColor = color.value;
            }
        })
    })
}
makeContainer(size);//그림 그리깅

//color data 가져오기
async function getColorData() {
    const response = await fetch("../assets/data/colors.json"); //경로때문에 헤맴 ㅜ
    const json = await response.json();
    return json.colors;
}

getColorData()
    .then((items) => {
        const colors = document.querySelector(".colors");
        colors.innerHTML = items
            .map((item) => {
                return `<li class="color_chip" style="background-color:${item.color}" data-color="${item.color}"></li>`
            })
            .join(""); //join을 사용하지 않으면 배열에 ,가 들어감. ["<li>red</li>", "<li>green</li>"]
        colors.addEventListener("click", (e) => {
            isErasing = false; //그리기 이벤트에서 했는데 자꾸 true로 나와서 클릭에 추가!
            body.classList.replace('eraser', 'painting');
            const targetColor = e.target.dataset.color;
            color.value = targetColor;
        });
    })
    .catch(console.log)

//user-select:none; 마우스가 금지표시로 종종 나와서 td에 css 추가!
