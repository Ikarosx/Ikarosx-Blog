(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{545:function(s,t,a){"use strict";a.r(t);var n=a(3),e=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"起因"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#起因"}},[s._v("#")]),s._v(" 起因")]),s._v(" "),a("p",[s._v("有时候我们可能想把多个仓库合并在一起")]),s._v(" "),a("p",[s._v("比如一个前端一个后端")]),s._v(" "),a("p",[s._v("但由于创建时没想太多")]),s._v(" "),a("p",[s._v("所以需要弥补一下")]),s._v(" "),a("h2",{attrs:{id:"操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#操作"}},[s._v("#")]),s._v(" 操作")]),s._v(" "),a("p",[s._v("现在有A仓库和B仓库")]),s._v(" "),a("p",[s._v("我们想把A和B合并在C")]),s._v(" "),a("p",[s._v("A仓库的内容放在C/A文件夹下")]),s._v(" "),a("p",[s._v("B仓库的内容放在C/B文件夹下")]),s._v(" "),a("h3",{attrs:{id:"创建c仓库"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#创建c仓库"}},[s._v("#")]),s._v(" 创建C仓库")]),s._v(" "),a("p",[s._v("在github上操作一下创建仓库")]),s._v(" "),a("p",[s._v("本地拉取下来")]),s._v(" "),a("p",[a("code",[s._v("git clone c.git")])]),s._v(" "),a("h3",{attrs:{id:"合并a仓库"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#合并a仓库"}},[s._v("#")]),s._v(" 合并A仓库")]),s._v(" "),a("div",{staticClass:"language-shell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 在C仓库下添加A仓库的git地址")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" remote "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" A a.git\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# fetch")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" fetch A\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 拉取A仓库的master分支到本地分支localA")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch -b localA A/master\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 切换到本地master")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout master\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 合并localA到master")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" merge localA\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 删除多余的branch和remote")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" remote remove A\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" branch -d localA\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 但此时我们合并过来的A仓库代码是在根目录，需要移动位置")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 代表将xxx移动到A文件夹下")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("mv")]),s._v(" xxx A\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br"),a("span",{staticClass:"line-number"},[s._v("11")]),a("br"),a("span",{staticClass:"line-number"},[s._v("12")]),a("br"),a("span",{staticClass:"line-number"},[s._v("13")]),a("br"),a("span",{staticClass:"line-number"},[s._v("14")]),a("br"),a("span",{staticClass:"line-number"},[s._v("15")]),a("br"),a("span",{staticClass:"line-number"},[s._v("16")]),a("br")])]),a("p",[s._v("移动位置借助powershell遍历")]),s._v(" "),a("div",{staticClass:"language-powershell line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-powershell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Get-ChildItem . 表示列出当前目录下的文件")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# | 管道操作")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# ForEach-Object -Process 遍历")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("Get-ChildItem")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("ForEach-Object")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("Process")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 判断文件名字不等于A")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$_")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("name "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-ne")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v("'A'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 执行git mv操作")]),s._v("\n\t\tgit "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("mv")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$_")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("name A"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br")])]),a("h3",{attrs:{id:"合并b仓库"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#合并b仓库"}},[s._v("#")]),s._v(" 合并B仓库")]),s._v(" "),a("p",[s._v("同上")])])}),[],!1,null,null,null);t.default=e.exports}}]);