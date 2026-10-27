export default function () {
  if (!Array.prototype.flat) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.flat = function (depth = 1) {
      depth = isNaN(Number(depth)) ? 1 : Number(depth)
      function flatten (arr) {
        let result = []
        if (depth) {
          for (let i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
              result = result.concat(flatten(arr[i], --depth))
            } else {
              result.push(arr[i])
            }
          }
        } else {
          result = result.concat(arr)
        }
        return result
      }
      return flatten(this)
    }
  }

  if (!Array.prototype.flatMap) {
    // eslint-disable-next-line no-extend-native
    Array.prototype.flatMap = function (callback) {
      return this.reduce(function (result, item) {
        const mapped = callback(item)
        return result.concat(mapped)
      }, [])
    }
  }
}
