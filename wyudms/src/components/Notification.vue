<template>
  <ul class="box"></ul>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, watch } from "vue";
export default {
  name: "notification",
  setup() {
    // 使用vuex
    const store = useStore();

    // 通知列表组件生成时触发
    onMounted(() => {
      // 获取通知列表元素
      const box = document.querySelector(".box");
      // 通知列表内有通知项被移除时触发该回调函数
      const callback = (obj) => {
        // 如果有通知项被移除且能搜索到通知列表内还有通知项
        if (
          obj[0].removedNodes.length != 0 &&
          document.querySelector(".boxitem")
        ) {
          // 循环所有通知项，让所有通知项上移第一个通知项距离父盒子顶端+10的高度
          for (let v of document.querySelectorAll(".boxitem")) {
            v.style.top =
              v.offsetTop -
              document.querySelector(".boxitem").offsetTop +
              10 +
              "px";
          }
          // 为第一个通知项添加延迟消失的动画，2.8秒后移除第一个通知项
          // 当移除通知项后，会再次出发callback回调函数，如此往复
          document.querySelector(".boxitem").classList.add("boxitemhide");
          setTimeout(() => {
            box.removeChild(document.querySelector(".boxitemhide"));
          }, 2800);
        } else if (
          obj[0].removedNodes.length != 0 &&
          !document.querySelector(".boxitem")
        ) {
          // 如果有通知项被移除且通知列表内没有通知项
          box.style.display = "none";
        }
      };
      // 观察器，观察通知列表内子节点变化
      const observer = new MutationObserver(callback);
      observer.observe(box, {
        childList: true, // 观察目标子节点的变化，是否有添加或者删除
      });

      // 创建子节点的函数，当vuex内传入的新通知后就触发
      const createItem = () => {
        // 获取vuex内新通知字符串
        let noticestr = store.state.noticeContent;
        // 创建li为新通知的容器
        let newitem = document.createElement("li");
        // 定义新通知的内容html字符模板
        let htmlstr = `<span class="iconfont icon-prompt"></span>
      <span class="itemtitle">通知</span>
      <p class="itemcontent">
        ${noticestr}
      </p>`;
        // 通知列表添加子节点到末尾
        box.appendChild(newitem);
        // 填充新通知的内容
        newitem.innerHTML = htmlstr;
        // 为新通知加上通知项样式以及动画
        newitem.classList.add("boxitem");
        // 初始化当前所有通知项的总高度
        let boxtotalheight = 0;
        // 每个通知项的高度可能是不一致的
        // 循环所有通知项累加每个通知项高度并额外累加10的外边距高度
        for (let v of box.children) {
          boxtotalheight += v.offsetHeight + 10;
        }
        // 得到并赋予新通知应当放置的位置
        newitem.style.top = boxtotalheight + "px";
        // 让新通知出现
        newitem.style.display = "block";
        // 清空vuex内接收通知的字符串，那么下次vuex即使传入同样的值
        // 也能触发vuex通知字符串更新的watch
        store.commit("setNoticeContent", "");
        // 如果当前通知列表内此次新增的新通知是第一个通知
        if (box.children.length == 1) {
          // 设置定时器
          setTimeout(() => {
            // 直接为第一个通知添加延迟消失的动画
            document.querySelector(".boxitem").classList.add("boxitemhide");
            // 在其消失后将移除组件，来触发上述观察器
            // 为下一个通知项触发回调函数callback循环往复
            setTimeout(() => {
              box.removeChild(document.querySelector(".boxitemhide"));
            }, 2800);
          }, 300);
        }
      };

      // 观察vuex内通知字符串变化
      watch(
        () => store.state.noticeContent,
        () => {
          // 如果是清空字符串则不触发
          if (store.state.noticeContent != "") {
            // 创建新通知
            box.style.display = "block";
            createItem();
          }
        }
      );
    });

    return {};
  },
};
</script>

<style>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.box {
  display: none;
  position: absolute;
  right: 0;
  top: 80px;
  width: 310px;
  /* height: 100%; */
  box-sizing: border-box;
  z-index: 1003;
}
.boxitem {
  position: absolute;
  left: 0;
  top: 0;
  background-color: var(--primary-light-gray);
  border-radius: 10px;
  padding: 2px 5px 5px 5px;
  width: 300px;
  color: var(--primary-green);
  box-sizing: border-box;
  animation: 0.3s linear show;
  display: none;
  transition: top 0.3s;
  z-index: 1004;
  border: 2px solid var(--primary-green);
  /* margin-bottom: 10px; */
}
.boxitemhide {
  animation: 0.3s linear 2.5s hide;
  animation-fill-mode: forwards;
}
.itemtitle {
  margin: 0 0 10px 5px;
  font-size: 20px;
}
.itemcontent {
  margin: 5px 0 0 25px;
  line-height: 24px;
  padding-right: 10px;
}
.icon-prompt {
  font-size: 25px;
}
@keyframes show {
  from {
    left: 310px;
  }
  100% {
    left: 0px;
  }
}
@keyframes hide {
  from {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>