export default function stringToNodes(keyWord, searchValue) {
  const nodes = []
  if(keyWord.startsWith(searchValue)) {
    const key1 = keyWord.slice(0, searchValue.length)
    const node1 = {
      name: 'span',
      attrs: {
        style: 'color: #26ce8a;'
      },
      children: [{
        type: 'text',
        text: key1
      }]
    }
    nodes.push(node1)
    const key2 = keyWord.slice(searchValue.length)
    const node2 = {
      name: 'span',
      attrs: {
        style: 'color: #000;'
      },
      children: [{
        type: 'text',
        text: key2
      }]
    }
    nodes.push(node2)
  } else {
    const node2 = {
      name: 'span',
      attrs: {
        style: 'color: #000000;'
      },
      children: [{
        type: 'text',
        text: keyWord
      }]
    }
    nodes.push(node2)
  }
  return nodes
}