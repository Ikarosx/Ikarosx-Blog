(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{534:function(s,a,e){"use strict";e.r(a);var n=e(3),t=Object(n.a)({},(function(){var s=this,a=s.$createElement,e=s._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("h2",{attrs:{id:"起因"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#起因"}},[s._v("#")]),s._v(" 起因")]),s._v(" "),e("p",[s._v("因为要使用maven打包SpringBoot项目为docker镜像并上传到远程服务器"),e("br"),s._v("\n跟着教程开了2375端口"),e("br"),s._v("\n结果在某一天收到了告警"),e("br"),s._v("\ncpu占用100%"),e("br"),s._v("\n交了工单后")]),s._v(" "),e("img",{attrs:{src:"https://ikaros-picture.oss-cn-shenzhen.aliyuncs.com/typora/Ikaros/20200812123117.png"}}),s._v(" "),e("p",[s._v("给大佬点赞"),e("br"),s._v("\n给菜鸡踩踩（我）")]),s._v(" "),e("p",[s._v("默认开启2375端口是无认证的，这样子就很不安全"),e("br"),s._v("\n实际上我们应该使用TLS传输并使用CA认证")]),s._v(" "),e("h2",{attrs:{id:"目标"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#目标"}},[s._v("#")]),s._v(" 目标")]),s._v(" "),e("p",[s._v("推送到私服")]),s._v(" "),e("h2",{attrs:{id:"生成ca"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#生成ca"}},[s._v("#")]),s._v(" 生成CA")]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 创建CA证书私钥")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# genrsa 生成rsa私钥")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# -aes256 指定加密方式为aes256")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# -out 输出文件名   ")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 4096 生成4096bit的私钥")]),s._v("\nopenssl genrsa -aes256 -out ca-key.pem "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("4096")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 根据私钥创建CA证书")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# req 证书请求和生成的工具")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# -new 生成一个新的证书请求，提示让用户输入相关的字段，字段的配置在配置文件和其他的扩展里")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# -x509 输出自签证书而不是证书请求")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# -days 当使用-x509选项时，此选项指定要为其验证证书的天数。默认值为30天")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# -key 指定要读取私钥的地方")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# -sha256 指定用于签名的摘要算法，可以使用openssl dgst -h 查看所有可用的")]),s._v("\nopenssl req -new -x509 -days "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("365")]),s._v(" -key ca-key.pem -sha256 -out ca.pem\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br"),e("span",{staticClass:"line-number"},[s._v("7")]),e("br"),e("span",{staticClass:"line-number"},[s._v("8")]),e("br"),e("span",{staticClass:"line-number"},[s._v("9")]),e("br"),e("span",{staticClass:"line-number"},[s._v("10")]),e("br"),e("span",{staticClass:"line-number"},[s._v("11")]),e("br"),e("span",{staticClass:"line-number"},[s._v("12")]),e("br"),e("span",{staticClass:"line-number"},[s._v("13")]),e("br"),e("span",{staticClass:"line-number"},[s._v("14")]),e("br")])]),e("h2",{attrs:{id:"生成服务器密钥和证书签名请求-csr"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#生成服务器密钥和证书签名请求-csr"}},[s._v("#")]),s._v(" 生成服务器密钥和证书签名请求(CSR)")]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 生成服务器私钥")]),s._v("\nopenssl genrsa -out server-key.pem "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("4096")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 生成证书签名请求(CSR)")]),s._v("\nopenssl req -sha256 -new -key server-key.pem -out server.csr\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br")])]),e("h2",{attrs:{id:"创建ca证书签名好的服务端证书"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#创建ca证书签名好的服务端证书"}},[s._v("#")]),s._v(" 创建CA证书签名好的服务端证书")]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("openssl x509 -req -days "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("365")]),s._v(" -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])])])}),[],!1,null,null,null);a.default=t.exports}}]);