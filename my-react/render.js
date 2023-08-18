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
        parent: null,
        alternate: currentRoot
    }
}

let nextUnitOfWork = null
let wipRoot = null

// commit阶段
function commitRoot() {
    deletion.forEach(commitWork)
    commitWork(wipRoot.child)
    wipRoot = null
}

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
    if (nextUnitOfWork && wipRoot) {
        commitRoot()
    }
}

// 第一次请求
requestIdleCallback(workLoop)

// function wipRoot() {}

function commitRoot() {
    commitWork(wipRoot.child)
}

function updateDOM() {
    const isEvent = key => key.slice(0, 2) === "on"
    // 删除已经没有的props或者发生变化的处理函数
    Object.keys(prevProps)
        .filter(key => key !== "children")
        .filter(key => !key in nextProps)
        .forEach(key => {
            const eventType = key.toLowerCase().substring(2)
            dom.removeEventListener(eventType, prevProps[key])
        })

    // 添加事件处理函数
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(key => prevProps[key] !== nextProps[key])
        .forEach(key => {
            dom[key] = ""
        })

    // 赋予新的或者改变的props
    Object.keys(nextProps)
        .filter(key => key !== "children")
        .filter(key => !key in prevProps || prevProps(key) !== nextProps[key])
        .forEach(key => {
            dom[key] = nextProps[key]
        })
}

function commitWork(fiber) {
    if (!fiber) {
        return
    }

    let domParentFiber = fiber.parent
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent
    }

    const parentDOM = fiber.parent.dom
    if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
        parentDOM.append(fiber.dom)
        return
    }
    if (fiber.effectTag === "DELETION" && fiber.dom) {
        parentDOM.removeChild(fiber.dom)
        return
    }
    if (fiber.effectTag === "UPDATE" && fiber.dom) {
        updateDOM(fiber.dom, fiber.alternate.props, fiber.props)
        return
    }
    parentDOM.append(parent.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibiling)
}

function performUnitOfWork(fiber) {
    // 创建DOM元素
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }

    const isFunctionComponent = fiber.type instanceof Function
    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    // 追加到父节点
    if (fiber.parent) {
        fiber.parent.dom.append(fiber.dom)
    }

    // 给children新建fiber
    const elements = fiber.props.children
    let prevSibling = null

    for (let i = 0; i < elements.length; i++) {
        const newFiber = {
            type: elements[i].type,
            props: elements[i].props,
            parent: fiber,
            dom: null,
            child: null,
            sibiling: null
        }
    }
}

// 处理非函数式组件
function updateHostComponent(fiber) {
    // 创建DOM元素
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }

    // 给children新建fiber
    const elements = fiber.props.children

    // 新建newFiber，构建fiber
    reconcileChildren(fiber, children)
}

function reconcileChildren(wipFiber, element) {
    let index = 0
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null

    while (index < element.length || oldFiber !== null) {
        const element = elements(index)
        const sameType = element && oldFiber && element.type === oldFiber.type
        let newFiber = null

        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE"
            }
        }

        if (element && !sameType) {
            // 新建
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT"
            }
        }

        if (oldFiber && !sameType) {
            // 删除
            oldFiber.effectTag = "DELETION"
            deletion.push(oldFiber)
        }

        // if (oldFiber) {
        //     oldFiber = oldFiber.sibiling
        // }
    }
}

export default render
