/**
 *
 * @param obj : Object
 */
export const objectToStyle = (obj) => {
  return Object.keys(obj).map((key) => {
    return `${key}: ${obj[key]};`;
  }).join('')
}