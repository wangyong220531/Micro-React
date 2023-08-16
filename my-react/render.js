function createDOM(fiber) {
    // 创建元素
    const dom = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)

    // 赋予属性
    Object.keys(element.props)
        .filter(key => key !== "children")
        .forEach(key => (dom[key] = element.props[key]))

    // 递归渲染子元素
    element.props.children.forEach(child => render(child, dom))

    // 追加到父元素节点上
    container.append(dom)
}

function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        },
        sibiling: null,
        child: null,
        parent: null
    }
}

let nextUnitOfWork = null

// 调度函数
function workLoop(deadline) {
    // 应该退出
    let shouldYield = false
    // 有工作且不应该退出
    while (nextUnitOfWork && !shouldYield) {
        // 做工作
        performUnitOfWork(fiber)
        // 判断还有没有足够的时间
        shouldYield = deadline.timeRemaining() < 1
    }
    // 没有足够的时间，请求下一次空闲的时候执行
    requestIdleCallback(workLoop)
}

// 第一次请求
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    // 创建DOM元素
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }

    // 追加到父节点
    if (fiber.parent) {
        fiber.parent.dom.append(fiber.dom)
    }

    // 给children新建fiber
    
}

export default render
