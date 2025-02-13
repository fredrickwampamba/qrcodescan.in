"use strict";
var e = {},
    t = document.querySelector(".app__snackbar"),
    a = null;
e.show = (e, o = 4e3) => {
    e && (a && a.remove(), (a = document.createElement("div")).className = "app__snackbar-msg", a.textContent = e, t.appendChild(a), setTimeout((() => {
        a.remove()
    }), o))
};
var o = {};

function i(e) {
    !e && window.isMediaStreamAPISupported ? o.webcam = document.querySelector("video") : o.webcam = document.querySelector("img")
}
o.active = !1, o.webcam = null, o.canvas = null, o.ctx = null, o.decoder = null, o.setCanvas = () => {
    o.canvas = document.createElement("canvas"), o.ctx = o.canvas.getContext("2d")
}, o.init = () => {
    var t = !1;

    function a() {
        o.canvas.width = window.innerWidth, o.canvas.height = window.innerHeight
    }

    function n(e) {
        navigator.mediaDevices.getUserMedia(e).then((function(e) {
            o.webcam.srcObject = e, o.webcam.setAttribute("playsinline", !0), o.webcam.setAttribute("controls", !0), setTimeout((() => {
                document.querySelector("video").removeAttribute("controls")
            }))
        })).catch((function(e) {
            console.log("Error occurred ", e), d()
        }))
    }

    function d() {
        window.noCameraPermission = !0, document.querySelector(".custom-scanner").style.display = "none", e.show("Unable to access the camera", 1e4)
    }
    i(), o.setCanvas(), o.decoder = new Worker("decoder.js"), window.isMediaStreamAPISupported ? o.webcam.addEventListener("play", (function(e) {
        t || (a(), t = !0)
    }), !1) : a(), window.isMediaStreamAPISupported && navigator.mediaDevices.enumerateDevices().then((function(e) {
        var t, a = e.filter((function(e) {
            if (e.label.split(",")[1], "videoinput" == e.kind) return e
        }));
        a.length > 1 ? (t = {
            video: {
                mandatory: {
                    sourceId: a[a.length - 1].deviceId ? a[a.length - 1].deviceId : null
                }
            },
            audio: !1
        }, window.iOS && (t.video.facingMode = "environment"), n(t)) : a.length ? (t = {
            video: {
                mandatory: {
                    sourceId: a[0].deviceId ? a[0].deviceId : null
                }
            },
            audio: !1
        }, window.iOS && (t.video.facingMode = "environment"), t.video.mandatory.sourceId || window.iOS ? n(t) : n({
            video: !0
        })) : n({
            video: !0
        })
    })).catch((function(e) {
        d(), console.error("Error occurred : ", e)
    }))
}, o.scan = function(e, t) {
    function a() {
        if (o.active) try {
            o.ctx.drawImage(o.webcam, 0, 0, o.canvas.width, o.canvas.height);
            var e = o.ctx.getImageData(0, 0, o.canvas.width, o.canvas.height);
            e.data && o.decoder.postMessage(e)
        } catch (e) {
            "NS_ERROR_NOT_AVAILABLE" == e.name && setTimeout(a, 0)
        }
    }
    o.active = !0, o.setCanvas(), o.decoder.onmessage = function(t) {
        if (t.data.length > 0) {
            var i = t.data[0][2];
            o.active = !1, e(i)
        }
        setTimeout(a, 0)
    }, setTimeout((() => {
        i(t)
    })), a()
};
"serviceWorker" in navigator && window.addEventListener("load", (() => {
    navigator.serviceWorker.register("/service-worker.js").then((t => {
        localStorage.getItem("offline") || (localStorage.setItem("offline", !0), e.show("App is ready for offline usage.", 5e3))
    })).catch((e => {
        console.log("SW registration failed: ", e)
    }))
})), window.addEventListener("DOMContentLoaded", (() => {
    window.iOS = ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) >= 0, window.isMediaStreamAPISupported = navigator && navigator.mediaDevices && "enumerateDevices" in navigator.mediaDevices, window.noCameraPermission = !1;
    var e = null,
        t = null,
        a = document.querySelector(".app__select-photos"),
        i = document.querySelector(".app__dialog"),
        n = document.querySelector(".app__dialog-overlay"),
        d = document.querySelector(".app__dialog-open"),
        r = document.querySelector(".app__dialog-close"),
        c = document.querySelector(".custom-scanner"),
        l = document.querySelector(".app__scanner-img"),
        s = document.querySelector("#result");
    document.querySelector(".app__help-text"), document.querySelector(".app__header-icon svg"), document.querySelector("video");
    var u = document.querySelector(".app__header-icon"),
        p = document.querySelector(".app__infodialog"),
        m = document.querySelector(".app__infodialog-close"),
        v = document.querySelector(".app__infodialog-overlay");

    function y(t = !1) {
        window.isMediaStreamAPISupported && !window.noCameraPermission && (c.style.display = "block", l.style.display = "block"), t && (c.style.display = "block", l.style.display = "block"), o.scan((t => {
            e = t, s.value = t, s.select(), c.style.display = "none", l.style.display = "none", ((e = "") => !(!e || "string" != typeof e) && new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$", "i").test(e))(t) && (d.style.display = "inline-block"), i.classList.remove("app__dialog--hide"), n.classList.remove("app__dialog--hide")
        	console.log(t);
        }), t)
    }

    function w() {
        e = null, s.value = "", window.isMediaStreamAPISupported || (t.src = "", t.className = ""), i.classList.add("app__dialog--hide"), n.classList.add("app__dialog--hide"), y()
    }
    window.appOverlay = document.querySelector(".app__overlay"), window.addEventListener("load", (e => {
        o.init(), setTimeout((() => {
                window.appOverlay.style.borderStyle = "solid", window.isMediaStreamAPISupported && y()
            }), 1e3),
            function() {
                var e = document.createElement("input");
                e.setAttribute("type", "file"), e.setAttribute("capture", "camera"), e.id = "camera", window.appOverlay.style.borderStyle = "", a.style.display = "flex", (t = document.createElement("img")).src = "", t.id = "frame";
                var o = document.querySelector(".app__layout-content");
                o.appendChild(e), o.appendChild(t), a.addEventListener("click", (() => {
                    c.style.display = "none", l.style.display = "none", document.querySelector("#camera").click()
                })), e.addEventListener("change", (e => {
                    e.target && e.target.files.length > 0 && (t.className = "app__overlay", t.src = URL.createObjectURL(e.target.files[0]), window.noCameraPermission || (c.style.display = "block", l.style.display = "block"), window.appOverlay.style.borderColor = "rgb(62, 78, 184)", y(!0))
                }))
            }()
    })), r.addEventListener("click", w, !1), m.addEventListener("click", (function() {
        p.classList.add("app__infodialog--hide"), v.classList.add("app__infodialog--hide")
    }), !1), d.addEventListener("click", (function() {
        ((e = "") => new RegExp("^(https?:\\/\\/)", "i").test(e))(e) || (e = `//${e}`);
        window.open(e, "_blank", "toolbar=0,location=0,menubar=0"), e = null, w()
    }), !1), u.addEventListener("click", (function() {
        p.classList.remove("app__infodialog--hide"), v.classList.remove("app__infodialog--hide")
    }), !1)
}));