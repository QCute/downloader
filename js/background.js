chrome.browserAction.onClicked.addListener((tab) => { chrome.tabs.create({ url: "main.html" }); });

// const i18n = "zhCN";
// const language = {
//     en: {
//         "true": "true",
//         "false": "false",
//     },
//     zhCN: {
//         "true": "是",
//         "false": "否",
//     },
// };


// function readStream(resolve, block) {
//     reader.read().then((response) => {
//         if(response.done) return;
//         // resolve data
//         resolve({ "block": block, "data": new Uint8Array(response.data) })
//         // continue
//         readStream(resolve, block);
//     });
// }

// function downloadRange(url, block, start, end) {
//     // "https://cdn.jsdelivr.net/npm/antd@4.16.13/dist/antd.min.js.map"
//     return new Promise((resolve) => {
//         fetch(url, {
//             "headers": { "range": `bytes=${start}-${end}` },
//         }).then((response) => {
//             if (response.ok) {
//                 readStream(response.body.getReader(), block);
//             } else {
//                 console.log(response);    
//             }
//         }).catch((error) => {
//             console.log(error);
//         });
//     });

//     //     const reader = response.body.getReader();
//     //     const stream = new ReadableStream({
//     //             start(controller) {
//     //             // The following function handles each data chunk
//     //             function push() {
//     //                 // "done" is a Boolean and value a "Uint8Array"
//     //                 return reader.read().then(({ done, value }) => {
//     //                     // Is there no more data to read?
//     //                     if (done) {
//     //                         // Tell the browser that we have finished sending data
//     //                         controller.close();
//     //                         return;
//     //                     }
//     //                     // Get the data and send it to the browser via the controller
//     //                     controller.enqueue(value);
//     //                 }).then(push);
//     //             };
//     //             push();
//     //         }
//     //     });

//     //     return new Response(stream, { headers: { "Content-Type": "text/html" } });
//     //   }).then((response) => {
//     //       console.log(response);
//     //   });

//     // Promise.all([promise]);
// }

// let app = Vue.createApp({
//     setup() {
//         return {
//             "userAgent": Vue.ref(localStorage.userAgent || navigator.userAgent),
//             "thread": Vue.ref(localStorage.thread || 1),
//             "progressList": Vue.ref([...Array(parseInt(localStorage.thread || 1))].map((_, i) => { return { "block": i + 1, "progress": 0, "data": new ArrayBuffer() } })),
//             "lang": navigator.language,
//             "text": {
//                 "en": {
//                     "url": "URL",
//                     "userAgent": "User Agent",
//                     "reset": "Reset",
//                     "download": "Download",
//                 },
//                 "zh-CN": {
//                     "url": "链接",
//                     "userAgent": "用户标识",
//                     "reset": "重置",
//                     "download": "下载",
//                 }
//             }
//         }
//     },
//     data() {
//         return {
//             "url": Vue.ref("http://fake.me/ideaIU.zip"),
//         }
//     },
//     mounted() {
//         // this.updateThreadProgress();
//     },
//     "computed": {
//         urlPlaceholder() {
//             return this.text[this.lang].url;
//         },
//         userAgentPlaceholder() {
//             return this.text[this.lang].userAgent;
//         },
//         resetUserAgentText() {
//             return this.text[this.lang].reset;
//         },
//         downloadText() {
//             return this.text[this.lang].download;
//         }
//     },
//     "methods": {
//         setUserAgent() {
//             localStorage.userAgent = this.userAgent;
//             setChromeUserAgent(this.userAgent);
//         },
//         resetUserAgent() {
//             this.userAgent = localStorage.userAgent = navigator.userAgent;
//             setChromeUserAgent(this.userAgent);
//         },
//         setThread() {
//             localStorage.thread = this.thread;
//             this.progressList = (new Array(parseInt(this.thread))).fill(0).map(() => { return { "progress": 0 } });
//         },
//         download() {
//             downloadPrepare(this.url, this.onProgress)
//         },
//         onProgress(block, loaded, total, data) {
//             this.progressList[parseInt(block - 1)].progress = Math.floor(loaded / total * 100 * 100) / 100;
//             // this.progressList[parseInt(block - 1)].data = data.slice(0, loaded);
//             // console.log(this.progressList[parseInt(block - 1)]);
//         },
//     },
//     "template": `
// <a-textarea :placeholder="urlPlaceholder" :rows="4" v-model:value='url' />
// <a-textarea :placeholder="userAgentPlaceholder" :rows="4" v-model:value='userAgent' @change="setUserAgent" />
// <a-button type="primary" @click="resetUserAgent">{{resetUserAgentText}}</a-button>
// <br>
// <a-input-number type='number' :min="1" v-model:value="thread" @change="setThread" />
// <ul style="list-style-type:decimal"><li v-for="(item, index) in progressList" :key="index"><a-progress :percent="item.progress" /></li></ul>
// <a-button type="primary" @click="download">{{downloadText}}</a-button>
//     `
// });
// for (let module in antd) {
//     if (module.toLocaleLowerCase() == module) continue;
//     app.use(module);
// }
// app.use(antd.Button);
// app.use(antd.Input);
// app.use(antd.InputNumber);
// app.use(antd.Progress);
// app.use(antd.Textarea);
// app.mount('#container');

// // set user anget
// function setChromeUserAgent(userAgent) {
//     // hook user agent
//     const userAgentHook = (details) => {
//         for (let i = 0; i < details.requestHeaders.length; ++i) {
//             if (details.requestHeaders[i].name === 'User-Agent') {
//                 details.requestHeaders[i].value = userAgent || navigator.userAgent;
//             }
//         }
//         return { "requestHeaders": details.requestHeaders };
//     }
//     // set user agent
//     chrome.webRequest.onBeforeSendHeaders.addListener(userAgentHook, { urls: ["<all_urls>"] }, ["blocking", "requestHeaders"]);
// }

// // download 
// function downloadPrepare(url, handleProgress) {
//     const opts = {
//         "url": url,
//         "method": "GET",
//         "withCredentials": true,
//         "crossdomain": true,
//         "headers": { "range": "bytes=0-0" }
//     };
//     axios(opts).then((response) => {
//         const type = response.headers["content-type"];
//         const range = response.headers["content-range"];
//         if (typeof (range) == "undefined") {
//             // single thread
//             const size = response.headers["content-length"];
//             downloadFile(url, type, size, localStorage.thread, handleProgress);
//         } else {
//             // multi thread
//             const size = Number(range.split("/").reverse()[0]);
//             downloadFile(url, type, size, localStorage.thread, handleProgress);
//         }
//     });
// }

// // real download 
// function downloadFile(url, type, size, thread, handleProgress) {
//     console.log(`url: ${url}, type: ${type}, file size: ${size}, thread: ${thread}`);
//     // download
//     const array = split(size - 1, thread || 1).map((slice) => downloadRange(url, slice.block, slice.start, slice.end, handleProgress));
//     const name = url.split("/").reverse().map((s) => s.split("?")).flat()[0];
//     // merge
//     Promise.all(array).then((response) => {
//         // sort and to array buffer list
//         const dataArray = response.sort((item) => item.block - item.block).map((item) => item.data);
//         const blob = concatenate(dataArray, type);
//         // download incomplete
//         if (blob.size != size) return;
//         console.log(`download completed: ${blob.size == size}`);
//         let aTag = document.createElement("a");
//         aTag.setAttribute("download", name);
//         aTag.setAttribute("href", URL.createObjectURL(blob));
//         aTag.click();
//         URL.revokeObjectURL(blob);
//     });
// }

// // download range
// function downloadRange(url, block, start, end, handleProgress) {
//     console.log(`block: ${block} start: ${start} end: ${end}`);
//     return new Promise((resolve, reject) => {
//         const opts = {
//             "url": url,
//             "method": "GET",
//             "withCredentials": true,
//             "crossdomain": true,
//             "responseType": "arraybuffer",
//             "headers": { "range": `bytes=${start}-${end}` },
//             "onDownloadProgress": (progress) => {
//                 // console.log(progress);
//                 handleProgress(block, progress.loaded, progress.total, progress.target.response);
//                 // let block = progress.target.response.slice(0, progress.loaded);
//                 // console.log(progress);
//                 // handle_progress({"block": block, "loaded": progress.loaded, "total": progress.total});
//                 // console.log(`progress: ${progress.loaded}/${progress.total}`);
//                 // document.getElementById("progress").value = progress.loaded / progress.total;
//             }
//         };
//         return axios(opts).then((response) => {
//             resolve({ "block": block, "data": new Uint8Array(response.data) })
//         }).catch((error) => {
//             if (error.response) {
//                 // The request was made and the server responded with a status code
//                 // that falls out of the range of 2xx
//                 console.log('data', error.response.data);
//                 console.log('stsu', error.response.status);
//                 console.log('hdr', error.response.headers);
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//                 // http.ClientRequest in node.js
//                 console.log('req', error.request);
//             } else {
//                 // Something happened in setting up the request that triggered an Error
//                 console.log('msg', error.message);
//             }
//             console.log('cfg', error.config);
//         });
//     });
// }

// // split block size
// function split(size, block) {
//     const offset = Math.trunc(size / block);
//     const rest = size - offset;
//     if (block > 1) {
//         const slice = split(rest, block - 1);
//         return [...slice, { "block": block, "start": rest + 1, "end": size }];
//     } else {
//         return [{ "block": block, "start": 0, "end": size }];
//     }
// }

// // concatenate block buffer
// function concatenate(arrays, type) {
//     let total = arrays.reduce((acc, data) => { return acc + data.length; }, 0);
//     let buffer = new Uint8Array(total);
//     arrays.reduce((acc, data) => { buffer.set(data, acc); return acc + data.length; }, 0);
//     return new Blob([buffer], { "type": type });;
// }
