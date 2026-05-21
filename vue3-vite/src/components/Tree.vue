<template lang="pug">
.tree-wrapper(v-for="(item, index) in data" :key="item.id")
  .condition-wrapper
    .condition
      .days(:class="{'hidden': index > 0}")
        .days-wrapper
          p {{ item.days }}天後
          ud-button(@click="testItem(index, item)" circle plain v-if="index === 0") ＋
        .line-v
      .content-wrapper
        h6 {{ item.name + (index + 1) }}
        .button-wrapper
          ud-button(@click="addChildren(index, item)" circle plain :class="{'disabled': item.children?.length !== 0}") ↓
          ud-button(@click="addItem(index)" circle plain :class="{'disabled': index !== data.length - 1 || index > 2}") →
          ud-button(@click="removeItem(index)" circle plain) ✕
        .line-v
        .tree-end(v-if="item.children?.length === 0")
          p 結束
    .line-h(v-if="index < data.length - 1")
  .children-wrapper
    tree(:data="item.children" v-if="item.children?.length > 0")
</template>

<script>
export default {
  name: "Tree",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    addItem(index) {
      this.$mitt.emit("addItem", {
        item: this.data,
        index
      });
    },
    addChildren(index, item) {
      this.$mitt.emit("addChildren", {
        item,
        index
      });
    },
    removeItem(index) {
      this.$mitt.emit("removeItem", {
        item: this.data,
        index
      });
    },
    testItem(index, item) {
      this.$mitt.emit("testItem", {
        item,
        index
      });
    }
  }
};
</script>

<style lang="sass" scoped>
:deep(.ud-button)
  button
    width: 30px !important
    height: 30px !important
    padding: 0
.tree-wrapper
  position: relative
  .condition-wrapper
    padding: 0px 0px 50px 0px
    display: flex
    .condition
      width: 140px
      flex: 0 0 140px
      display: block
      position: relative
      p
        width: 100%
      .days
        margin: 0 auto
        border-radius: 50px
        border: 1px solid #ccc
        width: 100px
        margin-bottom: 20px
        position: relative
        &.hidden
          visibility: hidden
        .days-wrapper
          display: flex
          align-items: center
          padding: 3px
          p
            font-size: 14px
            cursor: pointer
            transform: translate(5px, 0)
          :deep(.ud-button)
            button
              width: 25px !important
              height: 25px !important
              padding: 0
        .line-v
          width: 1px
          background-color: #000
          min-height: 20px
          position: absolute
          left: 50%
          bottom: -21px
          transform: translate(-50%, 0%)
      .content-wrapper
        border: 1px solid #ccc
        padding: 8px
        h6
          font-size: 14px
          background-color: #eee
          margin: -8px -8px 8px -8px
          padding: 4px
          cursor: pointer
        .button-wrapper
          display: flex
          justify-content: space-between
          :deep(.ud-button)
            button
              &.disabled
                opacity: 0.2
                pointer-events: none
        .line-v
          width: 1px
          background-color: #000
          min-height: 50px
          position: absolute
          left: 50%
          bottom: -50px
          transform: translate(-50%, 0%)
          &::after
            content: "v"
            position: absolute
            bottom: -6px
            transform: translate(-45%, 0%)
    .line-h
      height: 1px
      background-color: #000
      margin-top: 84px
      flex: 1 1 0
      min-width: 50px
      position: relative
      &::after
        content: "其他"
        background-color: #fff
        padding: 0 3px
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%,-50%)
        font-size: 12px
        white-space: nowrap
        z-index: 10
  .children-wrapper
    display: flex
    align-items: flex-start
  .tree-end
    border: 1px solid #ccc
    padding: 5px 15px
    position: absolute
    left: 50%
    bottom: -86px
    transform: translate(-50%, 0%)
.condition
  display: flex
</style>
