import { ref, onMounted, onUnmounted } from 'vue'
function useMousePosition() { // 其实就是一个函数， 其他地方导入这个函数就可以了
  const x = ref(0)
  const y = ref(0)
  const updateMouse = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }
  onMounted(() => {
    // document.addEventListener('click', updateMouse)
    console.log('useMousePosition.ts onMounted:::');
    document.addEventListener('mousemove', updateMouse) // mouse move
  })
  onUnmounted(() => {
    document.removeEventListener('click', updateMouse)
  })
  return {x, y}
}

export default useMousePosition
