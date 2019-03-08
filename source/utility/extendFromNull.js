// inherit from null
export default function(constructor) {
    Object.setPrototypeOf(constructor, null)
    Object.setPrototypeOf(constructor.prototype, null)
}
