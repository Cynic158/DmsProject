<template>
  <section class="loginpage">
    <span v-for="i in 264" :key="i" class="bgbox"></span>
    <div class="signin">
      <Nightmode class="nightmode"></Nightmode>
      <div class="content">
        <h2>登录</h2>
        <form class="form">
          <div class="input-box">
            <input type="text" required v-model="dsname" />
            <i>用户名</i>
          </div>
          <div class="input-box">
            <input type="password" required v-model="dspassword" />
            <i>密码</i>
          </div>
          <div class="links">
            <a href="javascript:;" @click="logincardturn">忘记密码</a>
            <!-- <a href="javascript:;">注册</a> -->
          </div>
          <div class="input-box">
            <input type="submit" value="登录" @click="dslogin" />
          </div>
        </form>
      </div>
    </div>
    <div class="signin">
      <Nightmode class="nightmode"></Nightmode>
      <div class="content">
        <h2>忘记密码</h2>
        <form class="form">
          <div class="input-box">
            <input type="text" required v-model="dsemail" />
            <i>邮箱</i>
          </div>
          <div class="input-box">
            <input type="password" required v-model="dsnewpwd" />
            <i>新密码</i>
          </div>
          <div class="input-box">
            <input type="text" required v-model="dsemailcode" />
            <i>验证码</i>
          </div>
          <div class="links">
            <a href="javascript:;" @click="forgetcardturn">返回登录</a>
            <a href="javascript:;" @click="requestcode" v-if="countdown == 30"
              >发送验证码</a
            >
            <a href="javascript:;" v-if="countdown != 30">{{ countdown }}</a>
          </div>
          <div class="input-box">
            <input type="submit" value="验证" @click="dsforget" />
          </div>
        </form>
      </div>
    </div>
  </section>
  <Toast v-model:tmessage="tmessage"></Toast>
</template>

<script>
import Toast from "@/components/Toast.vue";
import Nightmode from "@/components/Nightmode.vue";
import { login, forget, reqemailcode } from "@/api/user";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import md5 from "js-md5";
export default {
  name: "login",
  components: {
    Toast,
    Nightmode,
  },
  setup() {
    const dsname = ref("");
    const dspassword = ref("");
    const dsemail = ref("");
    const dsemailcode = ref("");
    const dsnewpwd = ref("");
    const countdown = ref(30);
    const tmessage = ref("");
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const dscountdown = () => {
      let timer = null;
      timer = setInterval(() => {
        countdown.value--;
        if (countdown.value < 0) {
          clearInterval(timer);
          countdown.value = 30;
        }
      }, 1000);
    };

    const dslogin = (e) => {
      e.preventDefault();
      if (dsname.value == "" || dspassword.value == "") {
        tmessage.value = "用户名和密码不能为空";
      } else {
        let md5pwd = md5(dspassword.value);
        login({ dsname: dsname.value, dspassword: md5pwd })
          .then((res) => {
            // console.log(res);
            if (res.status == 0) {
              tmessage.value = res.message;
              store.commit("dsuser/setUser", {
                id: res.id,
                dsuserName: res.dsuserName,
                token: res.token,
                type: res.type,
                job: res.job,
              });
              setTimeout(() => {
                router.push(route.query.redirectUrl || "/");
              }, 2000);
            } else {
              tmessage.value = res.message;
              console.log(tmessage.value);
            }
          })
          .catch((err) => {
            tmessage.value = err.message;
          });
      }
    };

    const dsforget = (e) => {
      e.preventDefault();
      let exp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      let exp2 = /^[a-zA-Z]\w{5,17}$/;
      if (
        dsemail.value == "" ||
        dsemailcode.value == "" ||
        dsnewpwd.value == ""
      ) {
        tmessage.value = "邮箱和验证码和新密码不能为空";
      } else if (!exp.test(dsemail.value)) {
        tmessage.value = "邮箱格式不正确";
      } else if (dsemailcode.value.length != 6) {
        tmessage.value = "验证码为六位数字";
      } else if (!exp2.test(dsnewpwd.value)) {
        tmessage.value =
          "密码必须以字母开头，长度在6~18之间，只能包含字母、数字和下划线";
      } else {
        console.log("pass");
        // 验证验证码以及验证码是否过期
        let md5pwd = md5(dsnewpwd.value);
        forget({
          dsemail: dsemail.value,
          dsemailcode: dsemailcode.value,
          dspassword: md5pwd,
        })
          .then((res) => {
            // console.log(res);
            if (res.status == 0) {
              tmessage.value = "修改密码成功，即将回转到登录";
              setTimeout(() => {
                let forgetdom = document.querySelectorAll(".signin")[1];
                if (forgetdom.classList.contains("forgetturn")) {
                  forgetcardturn();
                }
              }, 2000);
            } else {
              tmessage.value = res.message;
            }
          })
          .catch((err) => {
            tmessage.value = err.message;
          });
      }
    };

    const requestcode = () => {
      let exp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (dsemail.value == "") {
        tmessage.value = "邮箱不能为空";
      } else if (!exp.test(dsemail.value)) {
        tmessage.value = "邮箱格式不正确";
      } else {
        console.log("sendcode");
        // 根据返回的结果决定是否切换发送验证码为倒计时
        reqemailcode({ dsemail: dsemail.value })
          .then((res) => {
            if (res.status == 0) {
              dscountdown();
            }
            tmessage.value = res.message;
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    };

    const logincardturn = () => {
      let logindom = document.querySelectorAll(".signin")[0];
      let forgetdom = document.querySelectorAll(".signin")[1];
      logindom.className = "signin loginturn";
      forgetdom.className = "signin forgetturn";
    };

    const forgetcardturn = () => {
      let logindom = document.querySelectorAll(".signin")[0];
      let forgetdom = document.querySelectorAll(".signin")[1];
      logindom.className = "signin loginreturn";
      forgetdom.className = "signin forgetreturn";
    };

    return {
      dsname,
      dspassword,
      dsemail,
      dsemailcode,
      dsnewpwd,
      dslogin,
      dsforget,
      tmessage,
      logincardturn,
      forgetcardturn,
      requestcode,
      countdown,
    };
  },
};
</script>

<style scoped>
/* 谷歌字体线上 */
@import url("https://fonts.googleapis.com/css?family=Quicksand:wght@300;400;500;600;700;&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.loginturn {
  transform: translate(-50%, -50%) rotateY(-180deg) !important;
}
.forgetturn {
  transform: translate(-50%, -50%) rotateY(0deg) !important;
}
.loginreturn {
  transform: translate(-50%, -50%) rotateY(0deg) !important;
}
.forgetreturn {
  transform: translate(-50%, -50%) rotateY(-180deg) !important;
}
.loginpage {
  font-family: "Quicksand" sans-serif;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  gap: 2px;
  flex-wrap: wrap;
  overflow: hidden;
  left: 0;
  top: 0;
  background-color: var(--primary-black);
}
.loginpage::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  animation: animate 5s linear infinite;
  background: linear-gradient(
    var(--primary-black),
    var(--primary-green),
    var(--primary-black)
  );
}
@keyframes animate {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}
.loginpage .bgbox {
  position: relative;
  display: block;
  width: calc(6.25vw - 2px);
  height: calc(6.25vw - 2px);
  z-index: 2;
  transition: 1.5s;
  background-color: var(--primary-deep-black);
}
.loginpage .bgbox:hover {
  background-color: var(--primary-green);
  transition: 0s;
}
.loginpage .signin {
  position: absolute;
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-radius: 4px;
  box-shadow: 0 15px 35px var(--shadow);
  background-color: var(--primary-gray-black);
  z-index: 1000;
  backface-visibility: hidden;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: all 1s;
}
.loginpage .signin:nth-of-type(2) {
  z-index: 999;
  transform: translate(-50%, -50%) rotateY(-180deg);
  backface-visibility: hidden;
}

.loginpage .signin .content {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
}

.loginpage .signin .content h2 {
  font-size: 2em;
  text-transform: uppercase;
  color: var(--text-green);
}

.loginpage .signin .content .form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.loginpage .signin .content .form .input-box {
  position: relative;
  width: 100%;
}
.loginpage .signin .content .form .input-box input {
  position: relative;
  width: 100%;
  border: none;
  outline: none;
  padding: 25px 10px 7.5px;
  border-radius: 4px;
  font-size: 1em;
  font-weight: 500;
  background-color: var(--primary-light-gray);
  color: var(--text-white);
}
.loginpage .signin .content .form .input-box input::selection {
  background-color: var(--text-gray);
  color: var(--text-green);
}
.loginpage .signin .content .form .input-box i {
  position: absolute;
  left: 0;
  padding: 15px 10px;
  font-style: normal;
  transition: 0.5s;
  pointer-events: none;
  color: var(--text-gray);
  backface-visibility: hidden;
}

.signin .content .form .links {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.signin .content .form .links a {
  color: var(--text-white);
  text-decoration: none;
}

.signin .content .form .links a:first-child:hover {
  color: var(--text-green);
}
.signin .content .form .links a:nth-of-type(2) {
  color: var(--text-green);
  font-weight: 600;
}

.signin .content .form .input-box input:focus ~ i,
.signin .content .form .input-box input:valid ~ i {
  transform: translateY(-7.5px);
  font-size: 0.5em;
  color: var(--text-green);
}

.signin .content .form .input-box input[type="submit"] {
  padding: 10px;
  font-weight: 600;
  font-size: 1.25em;
  letter-spacing: 0.05em;
  cursor: pointer;
  background-color: var(--primary-green);
  color: var(--text-gray-black);
}

@media (max-width: 900px) {
  .loginpage .bgbox {
    width: calc(10vw - 2px);
    height: calc(10vw - 2px);
  }
}
@media (max-width: 600px) {
  .loginpage .bgbox {
    width: calc(20vw - 2px);
    height: calc(20vw - 2px);
  }
}

.nightmode {
  position: absolute;
  right: 7px;
  top: 5px;
  z-index: 1001;
  font-size: 2.5em;
}
</style>