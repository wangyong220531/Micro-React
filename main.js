import { createElement, render } from "./my-react/index"

// const handleInput = e => {
//     render(e.target.value)
// }

// const container = document.getElementById("root")

// render(element, container)

// const renderer = value => {
//     const container = document.querySelector("#root")
//     const element = createElement("div", null, createElement("input", { oninput: handleInput }, null), createElement("h1", null, "hello"))
//     render(element, container)
// }

const App = props => {
    return createElement("h1", null, "Hi", props.name)
}

const element = createElement(App)

const container = document.querySelector("#root")

/* 
  diff算法
  获取旧Fiber和新Fiber
  
 */

/* 
调用栈
render()，初始化rootFiber，并设为nextUnitWork
workLoop -> performUnitOfWork
performUnitOfWork(fiber) -> reconcileChildren
reconcileChidlren，同时遍历oldFiber和elements，并开始diffing
1、type相同：直接继承dom，然后用自己的新属性
2、还有孩子，但是类型不同：新建一个fiber，PLACEMENT
3、还有Fiber，但是类型不同：删除这个fiber, DELETION
创建好新的fiber，构建Fiber Tree
出reconcileChildren，这个Fiber已经构建完成
performUnitOfWork，返回下一个fiber

循环。直到Fiber Tree形成
进入commitRoot
先处理deletion，直接从DOM树中移除
然后处理子节点
如果是PLACEMENT，直接append
如果是UPDATE，进入updateDOM
updateDOM做这么几件事
1、删除已经丢失的props
2、添加新增的属性和修改变化的属性
3、删除丢失的。或者有变化的事件处理函数
4、添加新的事件处理函数

最后，把currentRoot赋值为当前的渲染，也就是wipRoot，然后初始化wipRoot为null，等待下一次渲染
 */
