const path = require("path");
const JSDOM = require("jsdom").JSDOM;
const parse = require("@vue/compiler-sfc").parse;

module.exports = function (source) {
  const filePath = this.resourcePath; // 获取当前正在处理的文件的完整路径
  const fileName = path.basename(filePath, ".vue"); // 获取文件名，去掉 .vue 扩展名

  // 使用你的转换逻辑对源文件内容进行转换
  const { descriptor } = parse(source, { filename: filePath });

  if (descriptor.template) {
    const dom = new JSDOM(`<body>${descriptor.template.content}</body>`);
    const templateElement = dom.window.document.body;
    // 检查是否有根标签

    if (
      templateElement.children.length !== 1 ||
      templateElement.firstElementChild?.nodeName !== "VIEW"
    ) {
      // 创建新的根标签view
      const viewElement = dom.window.document.createElement("view");
      viewElement.classList.add(`page-${fileName}-scoped`);
      while (templateElement.firstChild) {
        viewElement.appendChild(templateElement.firstChild); // 移动所有子元素到新的根标签view
      }

      // 直接处理viewElement的outerHTML来进行缩进
      let completeHTML = viewElement.outerHTML
        .split("\n") // 按行分割
        .map((line) => (line ? `  ${line}` : line)) // 对非空行添加两个空格的缩进
        .join("\n"); // 重组字符串
      // 考虑到我们在使用outerHTML，我们需要在结果的开头和结尾分别加上 '\n' 表示新的空行
      completeHTML = `\n${completeHTML}\n`;

      templateElement.innerHTML = completeHTML; // 把新的根标签view加回到template中
    } else {
      templateElement.firstElementChild.classList.add(
        `page-${fileName}-scoped`,
      );
    }

    // 将编译后的模板代码替换原始模板代码
    descriptor.template.content = templateElement.innerHTML;

    // 构建新的SFC内容
    const newContent = [`<template>${descriptor.template.content}</template>`];
    // if (descriptor.script) {
    //   newContent.push(
    //     `<script${descriptor.script.attrs.lang ? ` lang="${descriptor.script.attrs.lang}"` : ''}>${descriptor.script.content}</script>`,
    //   );
    // }
    if (descriptor.scriptSetup) {
      newContent.push(
        `<script setup${descriptor.scriptSetup.attrs.lang ? ` lang="${descriptor.scriptSetup.attrs.lang}"` : ""}>${descriptor.scriptSetup.content}</script>`,
      );
    } else {
      newContent.push(
        `<script setup${descriptor.script?.attrs.lang ? ` lang="${descriptor.script.attrs.lang}"` : ""}></script>`,
      );
    }

    if (descriptor.styles.length === 0) {
      newContent.push('<style lang="less"></style>');
    } else {
      descriptor.styles.forEach((style) => {
        const wrapperClassName = `.page-${fileName}-scoped`;
        const scopedStyleContent = `\n${wrapperClassName} {${style.content}}\n`;
        // 分割、缩进处理和结构重组

        const indentedContent = scopedStyleContent
          .split("\n")
          .map((line, index, arr) => {
            // 对于第一行和最后一行（包裹器行）和排除两个头尾换行的无用分割，不做缩进处理
            if (
              index === 0 ||
              index === 1 ||
              index === arr.length - 2 ||
              index === arr.length - 1
            ) {
              return line;
            }
            // 对于其他行，添加两个空格的缩进
            return `  ${line}`;
          })
          .join("\n");
        if (style.scoped) {
          newContent.push(
            `<style${style.attrs.lang ? ` lang="${style.attrs.lang}"` : ""}>${indentedContent}</style>`,
          );
        } else {
          newContent.push(
            `<style${style.attrs.lang ? ` lang="${style.attrs.lang}"` : ""}>${style.content}</style>`,
          );
        }
      });
    }

    return `${newContent}.join('\n\n')}\n`;
  } else {
    return source;
  }
};
