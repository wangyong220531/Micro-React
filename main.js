import { createElement, render } from "./my-react/index"

const handleInput = e => {
    render(e.target.value)
}

const element = createElement("div", null, createElement("input", { oninput: handleInput }, null), createElement("h1", null, "hello"))

const container = document.getElementById("root")

render(element, container)

/* 
  diff算法
  获取旧Fiber和新Fiber
  
 */
