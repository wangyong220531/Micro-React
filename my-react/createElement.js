export default function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => (child instanceof Object ? child : createTextElement(child)))
        }
    }
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: {}
        }
    }
}
