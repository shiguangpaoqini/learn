
  
  (function (doc, win) {

    var baseRatio = 16/9 + 0.001;
    // 多页情况下，尽量不要太低
    var minRatio = 1.4;
    var maxRatio = 2.2;
    // page scroll
    var format = 'page';
    var clientInfo = window.clientInfo = {};
    var maxClientWidth = 640;

    var docEl = doc.documentElement,
      recalc = function () {
        var clientWidth = docEl.clientWidth;
        var clientHeight = docEl.clientHeight;
        if( clientWidth > maxClientWidth ) clientWidth = maxClientWidth;
        if( !clientWidth ) return;
        var ratio = clientHeight / clientWidth;
        // 修复横屏，会屏幕太胖的情况
        if( format === 'page'){
          if(ratio < minRatio){
            clientWidth = clientWidth * ratio / minRatio
            ratio = minRatio;
          }else if(ratio > maxRatio){
            clientHeight = clientHeight / ratio * maxRatio;
            ratio = maxRatio
          } 
        }
        
        if( ratio > baseRatio && format === 'page' ) {
          fontSize = clientHeight / baseRatio / 10; 
        } else {
          fontSize = clientWidth /10;
        }

        if( format === 'page' ) {
          var wrapEle = doc.querySelector('.format-page .n-act .wrap');
          if(wrapEle){
            var tLeft = -(fontSize - clientWidth /10) * 5;
            var tTop = -Math.round((17.77777778 * fontSize - clientHeight) / 2);
            wrapEle.style.webkitTransform = 'translate(' + tLeft + 'px,' + tTop + 'px)';
            wrapEle.style.transform = 'translate(' + tLeft + 'px,' + tTop + 'px)';
          }
        }

        clientInfo.clientWidth = clientWidth;
        clientInfo.clientHeight = clientHeight;
        clientInfo.fontSize = fontSize;
        clientInfo.baseRatio = baseRatio;

        docEl.style.fontSize = fontSize + 'px';

        var realfz = parseFloat(win.getComputedStyle(doc.getElementsByTagName("html")[0]).fontSize) || fontSize;
        if (Math.abs(fontSize - realfz) > 1) {
            docEl.style.fontSize = fontSize * (fontSize / realfz) + "px";
        }
        document.body.style.opacity = 1;
      };
    
    if (!doc.addEventListener) return;
    var resizeTimer;
    window.addEventListener('resize', function() {
      if(resizeTimer){
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(function() {
        recalc();
      }, 200);
    });

    
    
    doc.addEventListener('DOMContentLoaded', recalc, false);

  })(document, window);
  