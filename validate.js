/*
 *
 *
 *
 */


(function(win,doc,undefined) {
  /*
   * defaults变量提供了一些默认的提示消息
   */
  var defaults = {
  	required: "%s 不能为空",
  }
  
  //option = [{name/class/id:"",rule:"",message:"heiheihei"},{},{},{}]

  var FormValidator = function(formNameorNode,option) {
  	this.options = {};
  	this.valified = true;
  	this.message = "";

  	//TODO 使用更灵活的form对象
  	this.form = this.findForm(formNameorNode);

  	this._addValidateOption(option||[]);

  	//匿名函数中的this值不是FormValidator的实例
  	this.form.onsubmit = (function(that) {
  			return function(event) {
	  	  		if(!that._validateForm()){
	  	  			console.log(that.message)
	                event.preventDefault();
	            }
  			}
  	  	})(this);
  }

  FormValidator.prototype._addValidateOption = function(option) {
  	for (var i = 0; i < option.length; i++) {
  		this.options[option[i].identy] = option[i];
  	}
  }

  FormValidator.prototype.findForm = function(form) {
  	return doc.forms[form];
  }

  FormValidator.prototype._validateForm = function() {
    this.valified = true;
    this.message = "";
  	for(var key in this.options){
  		total_rule = this.options[key].rule.split(":");
  		var rule = total_rule[0];
  		var length = total_rule[1] || "";
  		if(!this._hooks[rule].call(this,this.form[key].value,length)){
  			this.message = this.options[key].message
  			this.valified = false;
  			break;
  		}
  	}
  	return this.valified;
  }

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
		return (value != null && value != "" && value !== undefined)
	}
  }

  win.FormValidator = FormValidator;
})(window,document)