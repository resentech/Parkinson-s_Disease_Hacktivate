function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = [];
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  const request = new XMLHttpRequest();
  const loader = this;

  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          // Handle error
          const error = new Error('Error decoding file data: ' + url);
          loader.onerror(error);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount === loader.urlList.length) {
          loader.onload(loader.bufferList);
        }
      },
      function(error) {
        // Handle decode error
        const decodeError = new Error('decodeAudioData error: ' + error);
        loader.onerror(decodeError);
      }
    );
  };

  request.onerror = function() {
    // Handle XHR error
    const xhrError = new Error('BufferLoader: XHR error');
    loader.onerror(xhrError);
  };

  request.send();
};

BufferLoader.prototype.onerror = function(error) {
  // Error handling
  console.error(error);
};

BufferLoader.prototype.load = function() {
  for (let i = 0; i < this.urlList.length; ++i) {
    this.loadBuffer(this.urlList[i], i);
  }
};