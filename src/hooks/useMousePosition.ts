import { ref, reactive, toRefs, onMounted, onUnmounted } from 'vue'
// 其实就是一个函数， 其他地方导入这个函数就可以了
// 逻辑脱离了组件 跟组件没有关系
// 不需要模板
function useMousePosition() {
  const data = reactive({
    x: 10,
    y: 0
  })
  // const x = ref(0)
  // const y = ref(0)

  const updateMouse = (e: MouseEvent) => {
    // x.value = e.pageX
    // y.value = e.pageY
    data.x = e.pageX
    data.y = e.pageY
  }
  onMounted(() => {
    // document.addEventListener('click', updateMouse)
    console.log('useMousePosition.ts onMounted:::');
    document.addEventListener('mousemove', updateMouse) // mouse move
  })
  onUnmounted(() => {
    document.removeEventListener('click', updateMouse)
  })
  return toRefs(data)
}

export default useMousePosition
