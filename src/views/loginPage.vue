<script setup>
import {ref, reactive, watch, onMounted, onBeforeMount, getCurrentInstance} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
// 注册用表格
const isSignIn = ref(true);
const signInForm = reactive({
  name: '',
  password: '',
  confirmPassword: '',
})

// 重新输入密码的验证
const confirmPasswordValidator = (rule, value, cb) => {
  if(!value) {
    return cb(new Error('密码不能为空'));
  }
  else if(value !== signInForm.password) {
    return cb(new Error('两次输入密码不相同'));
  }
}

// 登录用表格
const logInForm = reactive({
  name: '',
  password: '',
})

// 注册中点击“确认”后进行注册
function signIn() {
  // TODO：向后端请求后，在localStorage中存储登录信息，并进行跳转

}

// 登录中点击“确认”后进行登录
function logIn() {
  // TODO：向后端请求后，在localStorage中存储登录信息，并进行跳转

}

</script>
<template>
  <main>
    <h1 id="title">欢迎来到幕墙韧性评估系统</h1>
    <div id="inputArea">
      <el-card v-if="isSignIn" class="signIn">
        <template #header>
          <div class="card-header">
            <h1>幕墙韧性评估系统</h1>
            <span>用户注册</span>
          </div>
        </template>
        <el-form :model="signInForm" label-width="auto" show-message size="large">
          <el-form-item label="用户名" prop="name" :rules="{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
          }">
            <el-input
                v-model="signInForm.name"
                placeholder="请输入要注册的用户名"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password" :rules="{
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          }">
            <el-input
                v-model="signInForm.password"
                placeholder="请输入密码"
                show-password
            />
          </el-form-item>
          <el-form-item label="重新输入密码" prop="confirmPassword" :rules="{
            required: true,
            validator: confirmPasswordValidator,
            trigger: ['blur', 'change'],
          }">
            <el-input
                v-model="signInForm.confirmPassword"
                placeholder="请再次输入密码"
                show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button size="large" type="text" @click="isSignIn=false">切换为登录</el-button>
          <el-button size="large">确认</el-button>
        </template>
      </el-card>
      <el-card v-else class="logIn">
        <template #header>
          <div class="card-header">
            <h1>幕墙韧性评估系统</h1>
            <span>用户登录</span>
          </div>
        </template>
        <el-form :model="logInForm" label-width="auto" show-message size="large">
          <el-form-item label="用户名" prop="name">
            <el-input
                v-model="logInForm.name"
                placeholder="请输入要注册的用户名"
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
                v-model="logInForm.password"
                placeholder="请输入密码"
                show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button size="large" type="text" @click="isSignIn=true">切换为注册</el-button>
          <el-button size="large">确认</el-button>
        </template>
      </el-card>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  height: 100vh;

  background: linear-gradient(to bottom right, lightblue, 50%, whitesmoke);
}

#title {
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  color: whitesmoke;
}

#inputArea {
  width: 500px;
  height: 500px;

  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
}
</style>