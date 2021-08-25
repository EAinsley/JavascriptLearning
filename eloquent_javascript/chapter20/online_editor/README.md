# 注意事项和要做的事情

## 思路

server.js 应该在online_editor根目录下运行，用来模拟服务器。
不会写CORS也不会写content-negotiation.
现在的逻辑是，PUT，DELETE，MKCOL只能修改files下的文件，
GET可以获取files下的文件。
所有不访问files的请求，都会在访问链接之前加上/www/表示是网页内容。
访问其他地方的文件会获得403.

## todo

- [ ] PUT, DELETE, MKCOL 的权限
- [ ] 获取文件列表屏显示
- [ ] 支持选择文件/文件夹
- [ ] 新建文件/文件夹
