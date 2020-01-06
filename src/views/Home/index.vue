<template>
  <div class="index">
    <el-button @click="nextStep" type="success" style="float: right">下一阶段 3D</el-button>
    <!-- 上传 -->
    <el-divider>2D 阶段，上传图片</el-divider>
    <!--  element ui 上传文件 https://element.eleme.cn/#/zh-CN/component/upload -->
    <el-upload
      class="avatar-uploader"
      :action="apiUrl+'/api/v1/img/img_upload_ui'"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :before-upload="beforeAvatarUpload">
      <el-tooltip content="点击图片可以换另一张哦" placement="top">
        <el-image v-if="imageUrl" :src="imageUrl" fit="scale-down" class="avatar"></el-image>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-tooltip>
    </el-upload>
    <el-button @click="analyze" type="primary" :loading="loading">进行分析</el-button>
    <el-divider>分析结果
      <!--      <el-button @click="explain" type="primary"> 展开/关闭 解释</el-button>-->
    </el-divider>
    <div v-if="analyzeRes">
      <el-row class="card" type="flex" justify="space-around">
        <!--   脸型 -->
        <el-col :span="11">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="publicPath+'facepp/lx.png'" class="image">
            <div style="padding: 14px;">
              <span>脸型</span>
              <el-collapse style="text-align: left;" value="1">
                <el-collapse-item title="结果" name="1">
                  <div>颞部宽度: {{analyzeRes.face.tempus_length}}mm</div>
                  <div> 颧骨宽度: {{analyzeRes.face.zygoma_length}}mm</div>
                  <div> 脸部长度: {{analyzeRes.face.face_length}}mm</div>
                  <div> 下颌角宽度: {{analyzeRes.face.mandible_length}}mm</div>
                  <div> ABD_ratio: {{analyzeRes.face.ABD_ratio}}</div>
                  <div> 右下颌角度数: {{analyzeRes.face.E}}°</div>
                </el-collapse-item>
                <el-collapse-item title="黄金三角" name="2">
                  <div>颞部宽度: 两侧太阳穴之间的水平距离，如图中的A</div>
                  <div> 颧骨宽度: 脸颊两侧最高位置的水平距离，如图中的B</div>
                  <div> 脸部长度: 额顶到下巴底的长度，如图中的C</div>
                  <div> 下颌角宽度: 两侧下颌角之间的水平距离，如图中的D</div>
                  <div> ABD_ratio：颞部宽度、颧部宽度（固定颧部为1）、下颌角宽度比</div>
                  <div> 右下颌角度数: 右侧下颌角的角度，如图中的∠E，角度范围[90,180]</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
        <!--    三庭五眼-->
        <el-col :span="11">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="publicPath+'facepp/3t5y.png'" class="image">
            <div style="padding: 14px;">
              <span>三庭五眼</span>
              <el-collapse style="text-align: left;" value="1">
                <el-collapse-item title="结果" name="1">
                  <div> 上庭：{{analyzeRes.three_parts.one_part.faceup_length}}mm</div>
                  <div> 中庭：{{analyzeRes.three_parts.two_part.facemid_length}}mm</div>
                  <div> 下庭：{{analyzeRes.three_parts.three_part.facedown_length}}mm</div>
                  <div> 三庭比例：{{analyzeRes.three_parts.parts_ratio}}</div>
                  <div>右外眼角颧弓留白：{{analyzeRes.five_eyes.one_eye.righteye_empty_length}}mm</div>
                  <div>右眼宽度：{{analyzeRes.five_eyes.righteye}}mm</div>
                  <div>内眼角间距：{{analyzeRes.five_eyes.three_eye.eyein_length}}mm</div>
                  <div>左外眼角颧弓留白：{{analyzeRes.five_eyes.five_eye.lefteye_empty_length}}mm</div>
                  <div>左眼宽度: {{analyzeRes.five_eyes.lefteye}}mm</div>
                  <div>五眼比例：{{analyzeRes.five_eyes.eyes_ratio}}</div>
                </el-collapse-item>
                <el-collapse-item title="三庭" name="2">
                  <div> 上庭：指上轮廓中心点位到眉心的垂直距离，如图中的L1</div>
                  <div> 中庭：指眉心点位到鼻尖点位的垂直距离，如图中的L2</div>
                  <div> 下庭：指鼻尖点位到下巴边缘中心点位的垂直距离，如图中的L3</div>
                  <div> 三庭比例：即 l1:l2:l3，l1=L1/C，l2=L2/C，l3=L3/C 【C为脸部长度，见图(脸型)的C，下同】</div>
                </el-collapse-item>
                <el-collapse-item title="五眼" name="3">
                  <div>右外眼角颧弓留白:右眼外眼角到脸部轮廓的水平距离,如图中的E1</div>
                  <div>右眼宽度：如图中的E2</div>
                  <div>内眼角间距：如图中的E3</div>
                  <div>左外眼角颧弓留白:左眼外眼角到脸部轮廓的水平距离,如图中的E5</div>
                  <div>左眼宽度: 如图中的E4</div>
                  <div>五眼比例：即E1:E2:E3:E4:E5，其中将E2和E4固定为1。最佳黄金比例为 E1:E2:E3:E4:E5 = 0.80:1:1.20:1:0.80</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="card" type="flex" justify="space-around">
        <!--   唇型 -->
        <el-col :span="11">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="publicPath+'facepp/chunxing.png'" class="image">
            <div style="padding: 14px;">
              <span>唇型</span>
              <el-collapse style="text-align: left;" value="1">
                <el-collapse-item title="结果" name="1">
                  <div>嘴唇高度： {{analyzeRes.mouth.mouth_height}}mm</div>
                  <div>嘴唇宽度： {{analyzeRes.mouth.mouth_width}}mm</div>
                  <div>嘴角弯曲度： {{analyzeRes.mouth.angulus_oris}}°</div>
                  <div>嘴唇厚度： {{analyzeRes.mouth.lip_thickness}}mm</div>
                </el-collapse-item>
                <el-collapse-item title="黄金三角" name="2">
                  <div>嘴唇高度： 上红唇单个唇峰与下红唇底的垂直距离，如图中的Z1Z2</div>
                  <div>嘴唇宽度： 两侧嘴角的水平距离，如图中的Z2Z3</div>
                  <div>嘴角弯曲度： 嘴角线与向上垂线之间的夹角，如图中的∠Z5Z4Z6，角度范围[0,180]</div>
                  <div>嘴唇厚度： 嘴唇厚度 =（上唇厚度+下唇厚度）/2</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
        <!--   下巴 -->
        <el-col :span="11">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="publicPath+'facepp/xb.png'" class="image">
            <div style="padding: 14px;">
              <span>下巴</span>
              <el-collapse style="text-align: left;" value="1">
                <el-collapse-item title="结果" name="1">
                  <div>下巴宽度： {{analyzeRes.jaw.jaw_width}}mm</div>
                  <div>下巴长度： {{analyzeRes.jaw.jaw_length}}mm</div>
                  <div>下巴角度： {{analyzeRes.jaw.jaw_angle}}°</div>
                </el-collapse-item>
                <el-collapse-item title="黄金三角" name="2">
                  <div>下巴宽度： 如图中的X1</div>
                  <div>下巴长度： 唇底点位与下巴底点位之间的垂直距离，如图中的X2</div>
                  <div>下巴角度： 如图中的∠X</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="card" type="flex" justify="space-around">
        <!--   眉型 -->
        <el-col :span="11">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="publicPath+'facepp/meixing.png'" class="image">
            <div style="padding: 14px;">
              <span>眉型</span>
              <el-collapse style="text-align: left;" value="1">
                <el-collapse-item title="结果" name="1">
                  <div>眉毛宽度： {{analyzeRes.eyebrow.brow_width}}mm</div>
                  <div>眉毛高度： {{analyzeRes.eyebrow.brow_height}}mm</div>
                  <div>眉毛挑度： {{analyzeRes.eyebrow.brow_uptrend_angle}}°</div>
                  <div>眉毛弯度： {{analyzeRes.eyebrow.brow_camber_angle}}°</div>
                  <div> 眉毛粗细： {{analyzeRes.eyebrow.brow_thick}}mm</div>
                </el-collapse-item>
                <el-collapse-item title="黄金三角" name="2">
                  <div>眉毛宽度： 眉头与眉梢之间的水平距离，如图中的M0M6</div>
                  <div>眉毛高度： 眉峰与眉肚之间的垂直距离，如图中的M4M6</div>
                  <div>眉毛挑度： 眉头与眉峰的角度，如图中的∠M3M2M4，角度范围[-90,90]</div>
                  <div>眉毛弯度： 眉头和眉梢的连线与水平线的夹角，如图中的∠M1M5M0，角度范围[-90,90]</div>
                  <div> 眉毛粗细： 眉峰与眉心之间的距离，如图中的M2M7</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
        <!--   眼型 -->
        <el-col :span="11">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="publicPath+'facepp/yanxing.png'" class="image">
            <div style="padding: 14px;">
              <span>眼型</span>
              <el-collapse style="text-align: left;" value="1">
                <el-collapse-item title="结果" name="1">
                  <div>眼睛宽度： {{analyzeRes.eyes.eye_width}}mm</div>
                  <div>眼睛高度： {{analyzeRes.eyes.eye_height}}mm</div>
                  <div>内眦角： {{analyzeRes.eyes.angulus_oculi_medialis}}°</div>
                </el-collapse-item>
                <el-collapse-item title="黄金三角" name="2">
                  <div>眼睛宽度： 内外眼角顶点之间的水平距离，如图中的Y1Y3</div>
                  <div>眼睛高度： 上眼睑顶点与下眼睑顶点之间的垂直距离，如图中的Y1Y4</div>
                  <div>内眦角： 内眼角的角度，如图中的∠Y2Y3Y5，角度范围[0,180]</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="card" type="flex" justify="space-around">
        <!--   黄金三角 -->
        <el-col :span="11">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="publicPath+'facepp/hj3j.png'" class="image">
            <div style="padding: 14px;">
              <span>黄金三角</span>
              <el-collapse style="text-align: left;" value="1">
                <el-collapse-item title="结果" name="1">
                  <div> 黄金三角度数：{{analyzeRes.golden_triangle}}°</div>
                </el-collapse-item>
                <el-collapse-item title="黄金三角" name="2">
                  <div> 黄金三角：左右两个瞳孔与鼻尖三个点所构成的三角形，如图中的三角形 W1W3W2 。</div>
                  <div> 黄金三角度数：黄金三角中鼻尖所在的顶角的度数，即如图中的∠W1W3W2，范围在[0,180]</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
        <!--   鼻型 -->
        <el-col :span="11">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="publicPath+'facepp/bixing.png'" class="image">
            <div style="padding: 14px;">
              <span>鼻型</span>
              <el-collapse style="text-align: left;" value="1">
                <el-collapse-item title="结果" name="1">
                  <div>鼻翼宽度： {{analyzeRes.nose.nose_width}}mm</div>
                </el-collapse-item>
                <el-collapse-item title="黄金三角" name="2">
                  <div>鼻翼宽度： 两侧鼻翼之间的水平距离，如图中的N</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { faceAnalyze } from '@/http/api.js'

export default {
  name: 'index',
  data () {
    return {
      publicPath: process.env.BASE_URL,
      apiUrl: 'http://api.ailemong.com',
      loading: false,
      imageUrl: '',
      remoteImgUrl: '',
      analyzeRes: null
      // analyzeRes: {
      //   'eyebrow': {
      //     'brow_camber_angle': -0.41,
      //     'brow_height': 8.0,
      //     'brow_thick': 7.75,
      //     'brow_uptrend_angle': 11.6,
      //     'brow_width': 37.0,
      //     'eyebrow_type': 'bushy_eyebrows'
      //   },
      //   'eyes': {
      //     'angulus_oculi_medialis': 84.16,
      //     'eye_height': 9.5,
      //     'eye_width': 26.5,
      //     'eyes_type': 'big_eyes'
      //   },
      //   'face': {
      //     'ABD_ratio': '1.02:1:0.89',
      //     'E': 140.88,
      //     'face_length': 190.25,
      //     'face_type': 'long_face',
      //     'mandible_length': 116.75,
      //     'tempus_length': 133.5,
      //     'zygoma_length': 131.0
      //   },
      //   'five_eyes': {
      //     'eyes_ratio': '0.78:1.0:1.35:1:0.96',
      //     'five_eye': {
      //       'lefteye_empty_length': 25.5,
      //       'lefteye_empty_ratio': 0.96,
      //       'lefteye_empty_result': 'lefteye_empty_long'
      //     },
      //     'lefteye': 26.5,
      //     'one_eye': {
      //       'righteye_empty_length': 20.75,
      //       'righteye_empty_ratio': 0.78,
      //       'righteye_empty_result': 'righteye_empty_normal'
      //     },
      //     'righteye': 26.5,
      //     'three_eye': {
      //       'eyein_length': 35.75,
      //       'eyein_ratio': 1.35,
      //       'eyein_result': 'eyein_long'
      //     }
      //   },
      //   'golden_triangle': 56.71,
      //   'jaw': {
      //     'jaw_angle': 156.84,
      //     'jaw_length': 33.5,
      //     'jaw_type': 'square_jaw',
      //     'jaw_width': 62.75
      //   },
      //   'mouth': {
      //     'angulus_oris': 90.41,
      //     'lip_thickness': 8.38,
      //     'mouth_height': 17.25,
      //     'mouth_type': 'normal_lip',
      //     'mouth_width': 45.25
      //   },
      //   'nose': {
      //     'nose_type': 'thick_nose',
      //     'nose_width': 43.75
      //   },
      //   'three_parts': {
      //     'one_part': {
      //       'faceup_length': 60.25,
      //       'faceup_ratio': 0.32,
      //       'faceup_result': 'faceup_normal'
      //     },
      //     'parts_ratio': '0.32:0.32:0.36',
      //     'three_part': {
      //       'facedown_length': 68.75,
      //       'facedown_ratio': 0.36,
      //       'facedown_result': 'facedown_long'
      //     },
      //     'two_part': {
      //       'facemid_length': 61.25,
      //       'facemid_ratio': 0.32,
      //       'facemid_result': 'facemid_normal'
      //     }
      //   }
      // }
    }
  },
  methods: {
    nextStep () {
      this.$router.push({ path: '/home' })
    },
    uploadSuccess (res, file, fileList) {
      console.log(res, file, fileList)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.remoteImgUrl = res.result.sm_url
      console.log(this.imageUrl)
    },
    // 判断上传文件类型，并且限制大小
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    analyze () {
      let _this = this
      if (!this.remoteImgUrl) {
        this.loading = true
        this.$message.error('请先上传图片')
      }
      this.loading = true
      console.log(this.remoteImgUrl)
      faceAnalyze({ faceUrl: this.remoteImgUrl }).then(response => {
        if (response.status === 200) {
          _this.analyzeRes = response.data
        } else {
          _this.$message.error(response.error_message)
        }
        _this.loading = false
      }).catch(error => {
        _this.$message.error(error)
        console.log(error)
        _this.loading = false
      })
    },
    explain () {
      console.log('todo')
    }
  }
  // components: {
  //   HelloWorld
  // }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 50vw;
    height: auto;
    overflow: hidden;
    /*width: 178px;*/
    /*height: 178px;*/
    /*display: block;*/
  }

  .card {
    margin-top: 20px;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
