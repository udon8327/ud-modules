<template lang="pug">
#tree-demo
  .tree-area
    .tree-trigger-area
      .tree-trigger
        h6 觸發條件
        p 加入好友
    .tree-line
    .tree-condition-area
      tree(:data="treeList")
</template>

<script>
import Tree from "@/components/Tree.vue";

export default {
  name: "TreeDemo",
  components: {
    Tree
  },
  data() {
    return {
      treeName: "",
      treeList: [
        {
          type: "",
          name: "條件",
          days: 1,
          condition: {},
          children: []
        }
      ]
    };
  },
  mounted() {
    document.querySelector(".container").style.maxWidth = "100%";
    this.$mitt.on("addItem", val => {
      // console.log("addItem", val);
      val.item.push({
        type: "",
        name: "條件",
        days: 1,
        condition: {},
        children: []
      });
    });
    this.$mitt.on("addChildren", val => {
      // console.log("addChildren", val);
      val.item.children.push({
        type: "",
        name: "條件",
        days: 1,
        condition: {},
        children: []
      });
    });
    this.$mitt.on("removeItem", val => {
      // console.log("removeItem", val);
      val.item.splice(val.index, 1);
    });
    this.$mitt.on("testItem", val => {
      // console.log("testItem", val);
      val.item.days++;
    });
  },
  unmounted() {
    document.querySelector(".container").style.maxWidth = "460px";
  },
  methods: {}
};
</script>

<style lang="sass" scoped>
h6, p
  font-size: 14px
.link-button
  position: absolute
  right: 10px
  top: 10px
.tree-area
  padding: 15px 15px 60px 15px
  overflow-x: auto
  .tree-trigger-area
    .tree-trigger
      width: 140px
      border: 1px solid #ccc
      text-align: center
      cursor: pointer
      h6
        background-color: #eee
        padding: 4px
      p
        padding: 8px
  .tree-line
    width: 1px
    height: 50px
    background-color: #000
    margin-left: 70px
    position: relative
    &::after
      content: "v"
      position: absolute
      bottom: -6px
      transform: translate(-45%, 0%)
  .tree-condition-area
    display: flex
    align-items: flex-start
</style>
