/*
 * 这是一个基于原声JavaScript语言编写的表单验证插件，
 * 未考虑相关浏览器的兼容性问题，旨在实践JavaScript
 * 基础知识及设计模式
 */


(function(win,doc,undefined) {
  /*
   * defaults变量提供了一些默认的提示消息
   */
  var defaults = {
  	required: "%s 不能为空",
  }
  
  //option = [{name/class/id:"",rule:"",message:"heiheihei"},{},{},{}]
  var classRex = /^\.\w/i;
  var idRex = /^\#\w/i;
  var classOrIdReg = /^[\.|\#]\w/i;

  var FormValidator = function(formNameorNode,item) {
  	this.items = {};  // 存储需要进行验证的表单项目
  	this.valified = true; // 表单提交标志，当其为true时，表单可以提交
  	this.message = ""; // 表单验证错误信息 ###TODO目前每次验证，只存储第一个碰到的错误，并结束验证，终止表单提交。
    this.error = {} // 用来展示错误信息 ###TODO行为有待提高
    that = this; // 引用验证器对象，方便onsubmit事件调用。


  	//根据validator的构造器传入的第一个参数，返回validator对应的表单对象。
  	this.form = this.findForm(formNameorNode);


    //将validator构造器出入的待验证表单项存入到this.items对象中。
  	this.addItems(item||[]);


  	//匿名函数中的this值不是FormValidator的实例
  	this.form.onsubmit = function(event) {
      that.resetBorder();
  		if(!that._validateForm()){
        that.displayMessage();
        event.preventDefault();
      }
		}
  }


  //将表单验证项目添加到this.items对象中
  //开发人员可以自己通过addItems函数继续想validator对象实例中添加规则
  FormValidator.prototype.addItems = function(items) {
  	for (var i = 0; i < items.length; i++) {
  		this.items[items[i].identy] = items[i];
  	}
  }


  //根据传入参数，返回validator对应的form。传入参数可以是表单对象或者是表单的name值
  FormValidator.prototype.findForm = function(form) {
  	return typeof form == 'object' ? form : doc.forms[form];
  }


  //对this.items对象中存储的待验证表单项目逐个进行验证，并且在第一次验证失败时退出验证，记录失败信息。
  FormValidator.prototype._validateForm = function() {

    //重置验证器，清空保存的验证信息及验证状态
    this.reset(this);

    for(var key in this.items){
      total_rule = this.items[key].rule.split(":");
      var rule = total_rule[0];
      var length = total_rule[1] || "";
      if(this.validateItems(rule,key)){
        this.onValidateFalse(key);
        break;
      }
    }

  	return this.valified;
  }

  //重置验证器，清空保存的验证信息及验证状态
  FormValidator.prototype.reset = function(that) {
    that.valified = true;
    that.message = "";
    that.error = {};
  };


  //根据验证策略库对应函数，验证对应项目是否符合要求
  FormValidator.prototype.validateItems = function(rule,key) {
    return !this._hooks[rule].call(this,this.findItem(key).value,length)
  };

  //
FormValidator.prototype.onValidateFalse = function(key) {
    this.error['message'] = this.items[key].message;
    this.error['identy'] = this.findItem(key);
    this.valified = false;
  };

  //根据identy参数返回待验证表单DOM对象，identy单数可以是类名，ID名或者name值
  //TODO: 考虑此处的浏览器兼容性，保证向后兼容
  FormValidator.prototype.findItem = function(identy) {
    // if (classRex.test(identy) ||idRex.test(identy)) {
    if (classOrIdReg.test(identy)) {
      return doc. querySelector(identy) || null;
    }else{
      return this.form[identy] || null;
    }
  };


  //开发人员自己定制的验证规则
  FormValidator.prototype.addRule = function(name,callback) {
    this._hooks[name] = callback;
  };

  //验证规则的策略库，方便validdate函数调用
  FormValidator.prototype._hooks = {
  	required: function(value) {
  		return (value != null && value != "" && value !== undefined)
  	},
  	lt: function(value,length) {
  		return (value.length <= length);
  	},
  	gt: function(value,length) {
  		return (value.length >= length)
  	},
  	eq: function(value,length) {
  		return (value.length === length)
  	}
  }


  //展示验证不通过时的提示信息
  //TODO 改变展示信息的方式或者增加展示信息的方式
  FormValidator.prototype.displayMessage = function() {
    this.error.identy.style.border = "1px solid red";
    this.error.identy.value = "";
    this.error.identy.placeholder = this.error.message;
  };

  FormValidator.prototype.resetBorder = function() {
    for(var key in this.items){
      if (this.findItem(key).style) {
        this.findItem(key).style.border = "1px solid black"
      }
    }
  };

  win.FormValidator = FormValidator;
})(window,document)