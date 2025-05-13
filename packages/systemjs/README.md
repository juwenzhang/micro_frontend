* 简单使用属于自己的一个模块加载器 systemjs 的简单使用
* 使用数据结构
  * set 
  * map
  * promise
  * array
  * object
  * string

* 主要实现逻辑
  * 先加载资源列表
  * 再去执行真真的执行代码的逻辑
  * 内部通过我们的script脚本实现脚本的加载资源
  * 通过给 window 实现拍照，从而实现获取得到新的 window 属性