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

  var FormValidator = function(formNameorNode,option) {
  	this.options = {};
  	this.valified = true;
  	this.message = "";
    this.error = {}
    that = this;

  	//TODO 使用更灵活的form对象
  	this.form = this.findForm(formNameorNode);

  	this._addValidateOptions(option||[]);

  	//匿名函数中的this值不是FormValidator的实例
  	this.form.onsubmit = function(event) {
            that.resetBorder();
	  	  		if(!that._validateForm()){
                  that.displayMessage();
	                event.preventDefault();
	            }
  			}
  }

  FormValidator.prototype._addValidateOptions = function(option) {
  	for (var i = 0; i < option.length; i++) {
  		this.options[option[i].identy] = option[i];
  	}
  }

  FormValidator.prototype.findForm = function(form) {
  	return typeof form == 'object' ? form : doc.forms[form];
  }

  FormValidator.prototype._validateForm = function() {
    this.valified = true;
    this.message = "";
    this.error = {};
  	for(var key in this.options){
  		total_rule = this.options[key].rule.split(":");
  		var rule = total_rule[0];
  		var length = total_rule[1] || "";
  		if(!this._hooks[rule].call(this,this.findInput(key).value,length)){
        this.error['message'] = this.options[key].message;
        this.error['identy'] = this.findInput(key);
  			this.valified = false;
  			break;
  		}
  	}
  	return this.valified;
  }

  FormValidator.prototype.findInput = function(identy) {
    if (classRex.test(identy) ||idRex.test(identy)) {
      return doc. querySelector(identy) || null;
    }else{
      return this.form[identy] || null;
    }
  };

  FormValidator.prototype.addValidateOption = function(option) {
    this._addValidateOptions(option);
  };

  FormValidator.prototype.addValidateItem = function(name,callback) {
    this._hooks[name] = callback;
  };

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

  FormValidator.prototype.displayMessage = function() {
    this.error.identy.style.border = "1px solid red";
    this.error.identy.value = "";
    this.error.identy.placeholder = this.error.message;
  };

  FormValidator.prototype.resetBorder = function() {
    // console.log(this.form)
    for(var key in this.options){
      if (this.findInput(key).style) {
        this.findInput(key).style.border = "1px solid black"
      }
    }
  };

  win.FormValidator = FormValidator;
})(window,document)