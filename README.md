# validate-copy
###一个表单验证插件，又一个轮子，在复制轮子的过程中，提高下自己

###用法

```javascript
//初始化
	validator = new FormValidator(document.forms[0],[{identy:".heihei",rule:"required",message:"不能为空"},
			                       {identy:"#heihei1",rule:"lt:20",message:"字符串长度不能多于20"},
			                       {identy:"heihei2",rule:"gt:6",message:"字符串长度不能少于6"}]
			             ]);
//添加新的验证项目
    validator.addItems([{identy:".heihei",rule:"required",message:"不能为空"},
			                       {identy:"#heihei1",rule:"lt:20",message:"字符串长度不能多于20"},
			                       {identy:"heihei2",rule:"gt:6",message:"字符串长度不能少于6"}]
			                   );
//添加新的验证规则
	validator.addRule(phoneNumber,function(value){
								return /^1[3|5|7|8]\d{9}$/.test(value)
							})
```
