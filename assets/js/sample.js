const container = document.querySelector(".container");
const sizeEl = document.querySelector(".size");
let size = sizeEl.value;
const color = document.querySelector(".color-picker");
const resetBtn = document.querySelector(".resetBtn");

let isDrawing = false;

container.addEventListener("mousedown", () => {
  isDrawing = true;
});

container.addEventListener("mouseup", () => {
  isDrawing = false;
});

// container를 넘어가면 drawing 취소하기
window.addEventListener("mousemove", (e) => {
  if (e.target.className == "pixel" || e.target.className == "container") {
    return;
  } else {
    isDrawing = false;
  }
});

// reset button click event
resetBtn.addEventListener("click", () => {
  container.innerHTML = "";
  divideContainer(size);
});

// reset container event
function resetContainer() {
  container.innerHTML = "";
}

// input size change event
sizeEl.addEventListener("change", (e) => {
  if (e.target.value < 1) {
    sizeEl.value = 1;
    alert("1 ~ 60까지 입력 가능합니다.");
    setPixelSize(1);
  } else if (e.target.value > 60) {
    sizeEl.value = 60;
    alert("1 ~ 60까지 입력 가능합니다.");
    setPixelSize(60);
  } else {
    size = e.target.value;
    setPixelSize(size);
  }
  function setPixelSize(x) {
    resetContainer();
    divideContainer(x);
  }
});

// div pixel 만들기
function divideContainer(s) {
  container.style.setProperty("--size", s);
  for (let i = 0; i < s * s; i++) {
    const div = document.createElement("div");
    div.classList.add("pixel");
    container.appendChild(div);
    div.addEventListener("mouseover", () => {
      if (isDrawing) {
        div.style.backgroundColor = color.value;
      }
    });
    div.addEventListener("mousedown", () => {
      div.style.backgroundColor = color.value;
    });
  }
}

divideContainer(size);

async function getColorData() {
  const response = await fetch("data/colors.json");
  const json = await response.json();
  return json.colors;
}

getColorData()
  .then((items) => {
    const colors = document.querySelector(".colors");
    colors.innerHTML = items
      .map((items) => {
        return `<div class="color-chips" style="background-color:${items.color}" data-color="${items.color}"></div>`;
      })
      .join("");
    colors.addEventListener("click", (e) => {
      const targetColor = e.target.dataset.color;
      color.value = targetColor;
    });
  })
  .catch(console.log);