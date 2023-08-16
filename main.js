import { createElement, render } from "./my-react/index"

const element = createElement("h1", { id: "title", style: "background:skyblue", class: "hello" }, "Hello World", createElement("a", { href: "https://bilibili.com", style: "color: yellow" }, "BiliBili"))

const container = document.getElementById("root")

render(element, container)
