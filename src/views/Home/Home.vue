<template>
  <div>
    <el-button @click="backStep" type="success" style="float: left">返回 2D阶段</el-button>
    <el-divider>3D 阶段</el-divider>
    <img alt="Vue logo" src="../../assets/logo.png" @click="shot">
    <div id="mycontainer"></div>
  </div>
</template>
<script>
import * as Three from 'three' // 导入three.js
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js' // 导入OBJLoader 读取obj模型
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js' // 导入MTLLoader 读取mtl材质
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' // 使用OrbitControls控制模型的旋转,放大,缩小
export default {
  name: 'home',
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      light: null,
      controls: null
    }
  },
  methods: {
    backStep () {
      this.$router.push({ path: '/index' })
    },
    // 拍照
    shot () {
      let image = new Image()
      this.renderer.render(this.scene, this.camera) // renderer为three.js里的渲染器，scene为场景 camera为相机
      // 这里可以选择png格式jpeg格式
      image.src = this.renderer.domElement.toDataURL('image/jpeg')
      document.body.appendChild(image) // 这样就可以查看截出来的图片了
    },
    // 外部模型加载函数
    loadObj () {
      let that = this
      // 材质读取,包含材质
      new MTLLoader().load('/head3d/head3d.obj.mtl', materials => {
        materials.preload()
        // 模型读取
        new OBJLoader().setMaterials(materials).load('/head3d/head3d.obj', obj => {
          // 更改模型的尺寸
          obj.scale.set(5, 5, 5)
          obj.position.set(0, 0, 0)
          // 在场景中加入坐标系
          let axes = new Three.AxesHelper(100)
          that.scene.add(obj)
          that.scene.add(axes)
        }, function (xhr) {
          // onProgress回调
          console.log((xhr.loaded / xhr.total * 100) + '% loaded')
        }, function (err) {
          // onError回调
          console.log(err)
        })
      })
    },
    init: function () {
      console.log('init')
      this.scene = new Three.Scene()
      this.scene.add(new Three.AmbientLight(0x999999))// 环境光
      this.light = new Three.DirectionalLight(0xdfebff, 0.45)// 从正上方（不是位置）照射过来的平行光，0.45的强度
      this.light.position.set(0, 2800, 2800)
      this.light.position.multiplyScalar(0.3)
      this.scene.add(this.light)
      // 初始化相机
      console.log(window.innerWidth)
      console.log(window.innerHeight)
      this.camera = new Three.PerspectiveCamera(50, window.innerWidth / 2 / window.innerHeight, 1, 2800)
      this.camera.position.set(0, 0, 2800)
      this.camera.lookAt(this.scene.position)
      // 渲染模型 alpha为透明背景
      this.renderer = new Three.WebGLRenderer({
        alpha: true
      })
      // this.renderer.setClearColor(0x000000)
      this.renderer.setPixelRatio(window.devicePixelRatio)// 为了兼容高清屏幕
      this.renderer.setSize(window.innerWidth / 2, window.innerHeight)
      // 初始化控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.target.set(0, 0, 100)
      this.controls.minDistance = 1500
      this.controls.maxDistance = 2800
      this.controls.maxPolarAngle = Math.PI / 2
      this.controls.update()
      console.log('init111')
      const container = document.getElementById('mycontainer')
      console.log('init222222')
      console.log(container)
      container.appendChild(this.renderer.domElement)

      // this.renderer = new Three.WebGLRenderer({
      //   antialias: true,
      //   alpha: true // 默认情况下为黑色场景，此处设置为透明（即白色场景）
      // })
      console.log('init after')
    },
    animate: function () {
      console.log('animate')
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    }
  },
  mounted () {
    this.init()
    this.loadObj()
    this.animate()
  }
}
</script>
<style scoped>
  #mycontainer {
    width: 50vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
