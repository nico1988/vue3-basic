<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>{{count}}</h1>
    <!--ref引用 模板中默认展示count.value-->
    <h1>{{double}}</h1>
    <h1>{{triple}}</h1>
    <h1>{{greetings}}</h1>
    <button @click="increase">👍+1</button><br/>
    {{numbers}}
    <button @click="push">push numbers</button><br/>
    <p>{{error}}</p>
    <Suspense>
      <template #default>
        <async-show />
        <dog-show />
      </template>
      <template #fallback>
        <h1>Loading !...</h1>
      </template>
    </Suspense>
    <button @click="openModal">Open Modal</button><br/>
    <modal :isOpen="modalIsOpen" @close-modal="onModalClose"></modal>
    <h1 v-if="loading">Loading!...</h1>
    <img v-if="loaded" :src="result[0].url" >
    <h1>X: {{x}}, Y: {{y}}</h1>
    <button @click="updateGreeting">Update Title</button>
  </div>
</template>

<script lang="ts">
// ref 主要用于原始类型
// reactive 也是函数 参数是object
import { ref, computed, reactive, toRefs, watch, onErrorCaptured, onMounted, onUpdated, onRenderTracked, onRenderTriggered } from 'vue'
import useMousePosition from './hooks/useMousePosition'
import useURLLoader from './hooks/useURLLoader'
import Modal from './components/Modal.vue'
import AsyncShow from './components/AsyncShow.vue'
import DogShow from './components/DogShow.vue'
interface DataProps {
  count: number;
  double: number;
  increase: () => void;
  push: () => void;
  numbers: Array;
}
interface DogResult {
  message: string;
  status: string;
}
interface CatResult {
  id: string;
  url: string;
  width: number;
  height: number;
}
export default {
  name: 'App',
  components: {
    Modal,
    AsyncShow,
    DogShow,
  },
  setup() { // 这个方法中没有this 在data props watch computed methods 之前运行
    const error = ref(null)
    onErrorCaptured((e: any) => {
      error.value = e
      return true
    })
    onMounted(() => {
      console.log('vue3 lifeCycle::: ');
    });
    onUpdated(() => {
      console.log('onUpdated lifeCycle:::')
    });
    onRenderTracked(() => {
      // console.log('onRenderTracked lifeCycle:::', e)
    });
    onRenderTriggered(() => {
      // console.log('onRenderTriggered lifeCycle:::', e)
    });

    const data: DataProps  = reactive({
      count: 0,
      increase: () => { data.count++},
      push: () => {
        (data.numbers.push(+(Math.random() * 10).toFixed(0)));
      },
      double: computed(() => data.count * 2),
      triple: computed(() => data.count << 2),
      numbers: [1,2,3]
    })
    const { x, y } = useMousePosition()
    const { result, loading, loaded } = useURLLoader<CatResult[]>('https://api.thecatapi.com/v1/images/search?limit=1')
    watch(result, () => {
      if (result.value) {
        console.log('value', result.value[0].url)
      }
    })
    const greetings = ref('')
    const updateGreeting = () => {
      greetings.value += 'Hello! '
    }

    watch(greetings, (newV, oldV) => {
      console.log('new:::', newV);
      console.log('oldV:::', oldV);
      document.title = 'update:: ' + greetings.value;
    });
    watch([result, greetings], (newV, oldV) => { // 多个watch
      console.log('new:::', newV);
      console.log('old:::', oldV);
    });
    const refData = toRefs(data)
    const modalIsOpen = ref(false)
    const openModal = () => {
      modalIsOpen.value = true
    }
    const onModalClose = () => {
      modalIsOpen.value = false
    }
    return {
      ...refData, // 展开对象
      greetings,
      updateGreeting,
      x,
      y,
      result,
      loading,
      loaded,
      modalIsOpen,
      openModal,
      onModalClose,
      error
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1 {
  font-size: 5rem;
}
button {
  font-size: 3rem;
}
</style>
