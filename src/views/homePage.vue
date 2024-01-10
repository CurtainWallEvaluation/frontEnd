<script setup>
import {ref, watch, onMounted, onBeforeMount, getCurrentInstance, reactive} from "vue";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";

// 上边栏相关控制
const router = useRouter();
const activeIndex = ref('1');

// 菜单切换处理函数
function handleSelect(index) {
  // console.log(index);
  activeIndex.value = index;
  router.push(`/homepage/${index}`);
}

onMounted(() => {
  // TODO：从localStorage中拿取当前用户数据
  currentUserInfo.name = localStorage.getItem('name');
  currentUserInfo.userID = '12321';
})

// 个人信息弹窗与修改相关
const profileDiaVisible = ref(false);
const isModifying = ref(false);
const modifyLoading = ref(false);
const hasChanged = ref(false);
const currentUserInfo = reactive({
  userID: '123141',
  name: '王小明',
});

const nProfileInfoForm = reactive({
  name: '',
  password: '',
  confirmPassword: '',
})

watch(isModifying, (newValue) => {
  // 更新表格结构体
  if (newValue === true) {
    nProfileInfoForm.name = currentUserInfo.name;
  }
})
const confirmPasswordValidator = (rule, value, cb) => {
  if (!value) {
    return cb(new Error('密码不能为空'));
  } else if (value !== nProfileInfoForm.password) {
    return cb(new Error('两次输入密码不相同'));
  }
}

function confirmClickHandler() {
  modifyLoading.value = true;
  // TODO：点击确认后向后端进行个人数据的修改


  // 测试修改用户时候的按钮更新
  setTimeout(() => {
    modifyLoading.value = false;
    isModifying.value = false;

    ElMessage({
      message: '修改成功',
      type: 'success',
    })
  }, 2000)

  // TODO：更新currentUserInfo中的信息
  currentUserInfo.name = nProfileInfoForm.name;
}

// 管理用户信息更改时候弹框退出
function dialogCloseHandler(done) {
  // 若用户正在进行个人信息修改且已经修改
  if (isModifying.value && hasChanged.value) {
    ElMessageBox.confirm('存在为保存的数据，要退出吗', 'Warning', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
        .then(() => {
          isModifying.value = false;
          hasChanged.value = false;
          done();
        })
        .catch(() => {
        })
  } else {
    isModifying.value = false;
    hasChanged.value = false;
    done();
  }
}

</script>

<template>
  <main>
    <div id="topBar">
      <el-menu
          :default-active="activeIndex"
          :ellipsis="false"
          default-active=" "
          mode="horizontal"
          @select="handleSelect"
      >
        <div id="LOGO">
          幕墙韧性评估系统
        </div>
        <el-menu-item index="">图片上传</el-menu-item>
        <el-menu-item index="taskHistory">任务历史</el-menu-item>
        <div class="flex-grow"/>
        <div id="topBarBtnContainer">
          <el-button type="text" size="large" @click="profileDiaVisible=true">修改个人信息</el-button>
        </div>
      </el-menu>
    </div>
    <el-dialog v-model="profileDiaVisible" title="个人信息" :before-close="dialogCloseHandler">
      <!--默认是查看用户ID和用户名-->
      <el-descriptions v-if="isModifying===false" size="large" direction="horizontal" column="1">
        <el-descriptions-item label="用户ID">{{ currentUserInfo.userID }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ currentUserInfo.name }}</el-descriptions-item>
      </el-descriptions>
      <!--点击按钮后，修改用户名和密码-->
      <el-form v-else :model="nProfileInfoForm" label-width="auto" show-message size="large">
        <el-form-item label="用户名" prop="name" :rules="{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
          }">
          <el-input
              v-model="nProfileInfoForm.name"
              placeholder="请输入要注册的用户名"
              @change="hasChanged=true"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="{
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          }">
          <el-input
              v-model="nProfileInfoForm.password"
              placeholder="请输入密码"
              show-password
              @change="hasChanged=true"
          />
        </el-form-item>
        <el-form-item label="重新输入密码" prop="confirmPassword" :rules="{
            required: true,
            validator: confirmPasswordValidator,
            trigger: ['blur', 'change'],
          }">
          <el-input
              v-model="nProfileInfoForm.confirmPassword"
              placeholder="请再次输入密码"
              show-password
              @change="hasChanged=true"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button v-if="isModifying===false" type="primary" size="large" @click="isModifying=true">
          修改个人信息
        </el-button>
        <div v-else id="groupBtns">
          <el-button type="danger" @click="isModifying=false" size="large">取消</el-button>
          <el-button type="success" @click="confirmClickHandler" size="large" :loading="modifyLoading">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <div id="content">
      <router-view/>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
}

#LOGO {
  background: #024f67;

  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 5px 15px;

  font-size: x-large;
  color: whitesmoke;
}

.flex-grow {
  flex-grow: 1;
}

#topBarBtnContainer {
  display: flex;
  margin: auto 0;
  font-size: xx-large;
}
</style>