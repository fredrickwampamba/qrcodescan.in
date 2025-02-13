import QRReader from './vendor/qrscan.js';
import snackbar from './snackbar.js';
import { isURL, hasProtocolInUrl } from './utils';

import '../css/styles.css';

//If service worker is installed, show offline usage notification
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        // console.log('SW registered: ', reg);
        if (!localStorage.getItem('offline')) {
          localStorage.setItem('offline', true);
          snackbar.show('App is ready for offline usage.', 5000);
        }
      })
      .catch((regError) => {
        console.log('SW registration failed: ', regError);
      });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  //To check the device and add iOS support
  window.iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
  window.isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;
  window.noCameraPermission = false;

  var copiedText = null;
  var frame = null;
  var selectPhotoBtn = document.querySelector('.app__select-photos');
  var dialogElement = document.querySelector('.app__dialog');
  var dialogOverlayElement = document.querySelector('.app__dialog-overlay');
  var dialogOpenBtnElement = document.querySelector('.app__dialog-open');
  var dialogCloseBtnElement = document.querySelector('.app__dialog-close');
  var scanningEle = document.querySelector('.custom-scanner');
  var appScanningEle = document.querySelector('.app__scanner-img');
  var textBoxEle = document.querySelector('#result');

  var helpTextEle = document.querySelector('.app__help-text');
  var infoSvg = document.querySelector('.app__header-icon svg');
  var videoElement = document.querySelector('video');

  var headerIcon = document.querySelector('.app__header-icon');
  var infoDialogElement = document.querySelector('.app__infodialog');
  var infoDialogCloseBtnElement = document.querySelector('.app__infodialog-close');
  var infoDialogOverlayElement = document.querySelector('.app__infodialog-overlay');

  window.appOverlay = document.querySelector('.app__overlay');

  //Initializing qr scanner
  window.addEventListener('load', (event) => {
    QRReader.init(); //To initialize QR Scanner
    // Set camera overlay size
    setTimeout(() => {
      setCameraOverlay();
      if (window.isMediaStreamAPISupported) {
        scan();
      }
    }, 1000);

    // To support other browsers who dont have mediaStreamAPI
    selectFromPhoto();
  });

  function setCameraOverlay() {
    window.appOverlay.style.borderStyle = 'solid';
  }

  function createFrame() {
    frame = document.createElement('img');
    frame.src = '';
    frame.id = 'frame';
  }

  //Dialog close btn event
  dialogCloseBtnElement.addEventListener('click', hideDialog, false);
  infoDialogCloseBtnElement.addEventListener('click', closeInfoDialog, false);
  dialogOpenBtnElement.addEventListener('click', openInBrowser, false);
  headerIcon.addEventListener('click', showInfo, false);

  //To open result in browser
  function openInBrowser() {
    // console.log('Result: ', copiedText);

    if (!hasProtocolInUrl(copiedText)) {
      copiedText = `//${copiedText}`;
    }

    window.open(copiedText, '_blank', 'toolbar=0,location=0,menubar=0');
    copiedText = null;
    hideDialog();
  }

  //Scan
  function scan(forSelectedPhotos = false) {
    if (window.isMediaStreamAPISupported && !window.noCameraPermission) {
      scanningEle.style.display = 'block';
      appScanningEle.style.display = 'block';
    }

    if (forSelectedPhotos) {
      scanningEle.style.display = 'block';
      appScanningEle.style.display = 'block';
    }

    var xhr = null;

    QRReader.scan((result) => {
      // copiedText = result;
      // textBoxEle.value = result;
      // textBoxEle.select();
      // scanningEle.style.display = 'none';
      // appScanningEle.style.display = 'none';

      // console.log(result)

      if(xhr){
        xhr.abort();
      }

      xhr = $.ajax({
          url : "https://sys.culchrpass.com/attendance_api/",
          cache : false,
          data : {id : result},
          method : "POST",
          success : function(res){
            // console.log(res.msg);
            // Hide the showing of the request process
            // return of json data only
            
            remove_iframe();
  
            Swal.fire({
              title: 'Error!',
              text: res.msg,
              icon: 'Success',
              confirmButtonText: 'Okay'
            });
  
          },error : function(err){
            // console.log(err.responseJSON.errorMsg);
            // Hide the showing of the request process
            // notify that something went wrong for a limited time, like 5 seconds
            remove_iframe();
  
            Swal.fire({
              title: 'Error!',
              text: "Something went wrong",
              icon: 'error',
              confirmButtonText: 'Close'
            });
            
          }
        });

      // if (isURL(result)) {
      //   dialogOpenBtnElement.style.display = 'inline-block';
      // }
      // dialogElement.classList.remove('app__dialog--hide');
      // dialogOverlayElement.classList.remove('app__dialog--hide');
    }, forSelectedPhotos);
  }

  function remove_iframe(){
    $("#frame").remove();
    $("#camera").val("");
  }

  //Hide dialog
  function hideDialog() {
    copiedText = null;
    textBoxEle.value = '';

    if (!window.isMediaStreamAPISupported) {
      frame.src = '';
      frame.className = '';
    }

    dialogElement.classList.add('app__dialog--hide');
    dialogOverlayElement.classList.add('app__dialog--hide');
    scan();
  }

  function selectFromPhoto() {
    //Creating the camera element
    if ($("#camera").length > 0) {
      $("#camera").remove();
    }
    var camera = document.createElement('input');
    camera.setAttribute('type', 'file');
    camera.setAttribute('capture', 'camera');
    camera.id = 'camera';
    window.appOverlay.style.borderStyle = '';
    selectPhotoBtn.style.display = 'flex';
    createFrame();

    //Add the camera and img element to DOM
    var pageContentElement = document.querySelector('.app__layout-content');
    pageContentElement.appendChild(camera);
    pageContentElement.appendChild(frame);

    //Click of camera fab icon
    selectPhotoBtn.addEventListener('click', () => {
      scanningEle.style.display = 'none';
      appScanningEle.style.display = 'none';
      document.querySelector('#camera').click();
    });

    //On camera change
    camera.addEventListener('change', (event) => {
      if (event.target && event.target.files.length > 0) {
        frame.className = 'app__overlay';
        frame.src = URL.createObjectURL(event.target.files[0]);
        if (!window.noCameraPermission) {
          scanningEle.style.display = 'block';
          appScanningEle.style.display = 'block';
        }
        window.appOverlay.style.borderColor = 'rgb(62, 78, 184)';
        scan(true);
      }
    });
  }

  function showInfo() {
    infoDialogElement.classList.remove('app__infodialog--hide');
    infoDialogOverlayElement.classList.remove('app__infodialog--hide');
  }

  function closeInfoDialog() {
    infoDialogElement.classList.add('app__infodialog--hide');
    infoDialogOverlayElement.classList.add('app__infodialog--hide');
  }
});
