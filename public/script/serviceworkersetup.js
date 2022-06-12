try {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker
                .register("/sw.js?v=1.1")
                .then((res) => console.log("service worker registered"))
                .catch((err) => console.log("service worker not registered", err));
        });
    }
    if (!navigator.onLine) {
        window.location.assign("/offline.html");
    }

    const AddToHomeScreen = (event) => {
        event.userChoice.then((choiceResult) => {
            console.log(choiceResult);
        });
        //This is to prevent `beforeinstallprompt` event that triggers again on `Add` or `Cancel` click
        window.removeEventListener("beforeinstallprompt", AddToHomeScreen);
    };
    window.addEventListener("beforeinstallprompt", AddToHomeScreen);
} catch (e) {
    alert("Your browser does not support current ES6 js module.Consider updating it or use another compatible browser like chrome,firefox.");
    document.body.innerHTML = "";
}