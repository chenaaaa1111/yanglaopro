//GET请求
function GET(params,url,header={}) {
	let requestHandler={
		params, 
		url,
		header
	}
	return request('GET', requestHandler)
}
//POST请求
function POST(params, url, header = {}) {
	let requestHandler = {
		params,
		url,
    header
	}
	return request('POST', requestHandler)
}
//POST请求
function DELETE(params, url, header = {}) {
	let requestHandler = {
		params,
		url,
    	header
	}
	return request('DELETE', requestHandler)
}

function request(method, requestHandler) {
	var params = requestHandler.params;
	var url = requestHandler.url;
	var header = Object.assign({
		'content-type': 'application/x-www-form-urlencoded'
	},requestHandler.header)
	let promise = new Promise(function (resolve, reject) {
		wx.request({
			url: url,
			data: params,
			method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			success: function (res) {
				//注意：可以对参数解密等处理
				resolve(res);
			},
			header: header,
			fail: function (err) {
				reject(err);
			},
			complete: function () {
				// complete
			}
		})
	});
	return promise;
}

function UPLOAD(name, filePath, url, formData, header = {}){
  let promise=new Promise(function(resolve,reject){
    wx.uploadFile({
      url: url,
      filePath: filePath,
      name: name,
      header: Object.assign({
        'content-type': 'multipart/form-data'
      }, header),
      formData: formData,
      success:function(res){
        return resolve(res);
      },
      fail:function(err){
        console.log("UPLOAD:",err);
        return reject(err);
      }
    })
  });
  return promise;
}

module.exports = {
	GET: GET,
	POST: POST,
	DELETE: DELETE,
  UPLOAD: UPLOAD
}
