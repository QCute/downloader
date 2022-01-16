let increment = 0;
let app = Vue.createApp({
    setup() {
        return {
            "url": Vue.ref("http://mirror.nl.leaseweb.net/speedtest/1000mb.bin"),
            "userAgent": Vue.ref(localStorage.userAgent || navigator.userAgent),
            "thread": Vue.ref(localStorage.thread || 1),
            "taskList": Vue.ref({}),
            "lang": navigator.language,
            "activeTab": Vue.ref('add'),
            "text": {
                "en": {
                    "add": "Add",
                    "cancel": "Cancel",
                    "day": "Day",
                    "download": "Download",
                    "hour": "Hour",
                    "minute": "Minute",
                    "ok": "Ok",
                    "reset": "Reset",
                    "save": "Save",
                    "saveSettings": "Save Success",
                    "second": "Second",
                    "settings": "Settings",
                    "speed": "Speed",
                    "thread": "Thread",
                    "url": "URL",
                    "userAgent": "User Agent",
                    "waiting": "waiting",
                },
                "zh-CN": {
                    "add": "添加",
                    "cancel": "取消",
                    "day": "天",
                    "download": "下载",
                    "hour": "小时",
                    "minute": "分钟",
                    "ok": "确定",
                    "reset": "重置",
                    "save": "保存",
                    "saveSettings": "保存成功",
                    "second": "秒",
                    "settings": "设置",
                    "speed": "速度",
                    "thread": "线程",
                    "url": "链接",
                    "userAgent": "标识",
                    "waiting": "等待中",
                }
            }
        }
    },
    mounted() {
        setChromeUserAgent(this.userAgent);
        this.showSpeed();
        return {};
    },
    "methods": {
        download() {
            this.activeTab = "download";
            let downloader = new Downloader(this.url, this.thread);
            downloader.start();
            this.taskList[downloader.id] = downloader;
            this.url = "";
        },
        cancelTask(id) {
            this.taskList[id].stop();
            delete this.taskList[id];
        },
        resetSettings() {
            // user agent
            this.userAgent = localStorage.userAgent = navigator.userAgent;
            setChromeUserAgent(this.userAgent);
            // thread
            this.thread = localStorage.thread = 1;
        },
        saveSettings() {
            // user agent
            localStorage.userAgent = this.userAgent;
            setChromeUserAgent(this.userAgent);
            // thread
            localStorage.thread = this.thread;
            // tips
            antd.message.info(this.text[this.lang]['saveSettings']);
        },
        showSpeed() {
            setInterval(() => {
                for (let key in this.taskList) {
                    this.taskList[key].speed = this.taskList[key].acc; 
                    this.taskList[key].acc = 0;
                }
            }, 1000);
        },
        formatSize(size) {
            if (size < 1024) {
                return `${size}B`;
            } else if (size < 1024 * 1024) {
                return `${Math.floor(size / 1024 * 100) / 100}KB`;
            } else if (size < 1024 * 1024 * 1024) {
                return `${Math.floor(size / 1024 / 1024 * 100) / 100}MB`;
            } else {
                return `${Math.floor(size / 1024 / 1024 / 1024 * 100) / 100}GB`;
            }
        },
        formatTime(time) {
            if (isNaN(time)) {
                return this.text[this.lang]['waiting'];
            } else if (time < 60) {
                return `${Math.floor(time)}${this.text[this.lang]['second']}`;
            } else if (time < 60 * 60) {
                return `${Math.floor(time / 60 * 100) / 100}${this.text[this.lang]['minute']}`;
            } else if (time < 60 * 60 * 60) {
                return `${Math.floor(time / 60 / 60 * 100) / 100}${this.text[this.lang]['hour']}`;
            } else {
                return `${Math.floor(time / 60 / 60 / 24 * 100) / 100}${this.text[this.lang]['day']}`;
            }
        },
    },
    "template": `
<a-layout>
    
    <a-layout-content style="min-height:100vh;background-color:white;">
        <a-row>
            
            <a-col :span="24" style="background-color:white;">
                <a-tabs tab-position="left" v-model:activeKey="activeTab" size="large">
                    <a-tab-pane key="add" :tab="text[lang]['add']" tabClick="showAddModal">
                        <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 8 }">
                            <a-form-item :label="text[lang]['url']">
                                <a-textarea :placeholder="text[lang]['url']" :rows="4" v-model:value='url' />
                            </a-form-item>
                            <a-form-item :wrapper-col="{ offset: 2, span: 8 }">
                                <a-button type="primary" @click="download">{{text[lang]['download']}}</a-button>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>
                    <a-tab-pane key="download" :tab="text[lang]['download']">
                        <a-row>
                            <a-col :span="10">
                                <a-card v-for="(task) in taskList" :title="task.name" size="small">
                                    <template #extra>
                                        <a style='display:none;'>{{task.acc}}</a><a-button type="primary" danger @click="cancelTask(task.id)">{{text[lang]['cancel']}}</a-button>
                                    </template>
                                    <a-list item-layout="horizontal">
                                        <a-list-item v-for="(block, index) in task.data"><a-progress style="padding-right:1em;" :percent="Math.floor(block.loaded / block.size * 100 * 100) / 100" /></a-list-item>
                                        <a-list-item></a-list-item>
                                    </a-list>
                                    <a-card-meta title="">
                                        <template #description>
                                            <a-row>
                                                <a-col :span="8">{{formatTime((task.size - task.loaded) / task.speed)}}</a-col>
                                                <a-col :span="8">{{formatSize(task.speed)}}/s</a-col>
                                                <a-col :span="8">{{formatSize(task.loaded)}} / {{formatSize(task.size)}}</a-col>
                                            </a-row>
                                        </template>
                                    </a-card-meta>
                                </a-card>
                            </a-col>
                        </a-row>
                    </a-tab-pane>
                    <a-tab-pane key="settings" :tab="text[lang]['settings']">
                        <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 8 }">
                            <a-form-item :label="text[lang]['userAgent']">
                                <a-textarea :placeholder="userAgent" :rows="4" v-model:value='userAgent' />
                            </a-form-item>
                            <a-form-item :label="text[lang]['thread']">
                                <a-input-number type='number' :min="1" v-model:value="thread" />
                            </a-form-item>
                            <a-form-item :wrapper-col="{ offset: 2, span: 8 }">
                                <a-button @click="resetSettings">{{text[lang]['reset']}}</a-button>
                                <a-button type="primary" style="margin-left: 1em;" @click="saveSettings">{{text[lang]['save']}}</a-button>
                            </a-form-item>
                        </a-form>
                    </a-tab-pane>
                </a-tabs>
            </a-col>
            
        </a-row>
    </a-layout-content>
    
</a-layout>

    `
});

app.use(antd.Button);
app.use(antd.Card);
app.use(antd.Col);
app.use(antd.Form);
app.use(antd.Input);
app.use(antd.InputNumber);
app.use(antd.Layout);
app.use(antd.List);
app.use(antd.Modal);
app.use(antd.Progress);
app.use(antd.Row);
app.use(antd.Select);
app.use(antd.Tabs);
// app.use(antd.Textarea);
app.mount('#container');

// set user anget
function setChromeUserAgent(userAgent) {
    // hook user agent
    const userAgentHook = (details) => {
        for (let i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                details.requestHeaders[i].value = userAgent || navigator.userAgent;
            }
        }
        return { "requestHeaders": details.requestHeaders };
    }
    // set user agent
    chrome.webRequest.onBeforeSendHeaders.addListener(userAgentHook, { urls: ["<all_urls>"] }, ["blocking", "requestHeaders"]);
}

class Downloader {
    // prop
    url = "";
    name = "";
    type = "";
    id = 0;
    loaded = 0;
    size = 0;
    thread = 1;
    acc = 0;
    speed = 0;
    data = {};
    blob = undefined;

    constructor(url, thread) {
        this.url = url;
        this.name = this.url.split("/").reverse().map((s) => s.split("?")).flat()[0];
        this.id = increment++;
        this.thread = parseInt(thread);
        this.data = [...new Array(this.thread)].reduce((acc, v, i) => { 
            acc[i + 1] = { "block": i + 1, "start": 0, "end": 0, "size": 0, "loaded": 0, "pause": false, "promise": undefined, "stream": []};
            return acc;
        }, {});
    }

    stop() {
        for(let key in this.data) {
            delete this.data[key]
        }
    }

    // download 
    start() {
        axios({
            "url": this.url,
            "method": "GET",
            "withCredentials": true,
            "crossdomain": true,
            "headers": { "range": "bytes=0-0" }
        }).then(response => {
            this.type = response.headers["content-type"];
            const range = response.headers["content-range"];
            if (typeof (range) == "undefined") {
                // single thread
                this.size = Number(response.headers["content-length"]);
            } else {
                // multi thread
                this.size = Number(range.split("/").reverse()[0]);
            }
            this.downloadFile();
        }).catch(error => {
            console.log(error);
        });
    }

    // real download 
    downloadFile() {
        console.log(`url: ${this.url}, type: ${this.type}, file size: ${this.size}, thread: ${this.thread}`);
        // download
        const array = this.split(this.size - 1, this.thread || 1).map((slice) => this.downloadRange(slice));
        // merge
        Promise.all(array).then(response => {
            // sort and to array buffer list
            const dataArray = response.sort((item) => item.block - item.block).map((item) => item.data);
            this.blob = new Blob([this.concatenate(dataArray)], { "type": this.type });
            // download incomplete
            console.log(`download completed: ${this.blob.size == this.size}`);
            if (this.blob.size != this.size) return;
            let aTag = document.createElement("a");
            aTag.setAttribute("download", this.name);
            aTag.setAttribute("href", URL.createObjectURL(this.blob));
            aTag.click();
            URL.revokeObjectURL(blob);
        }).catch((error) => {
            if (typeof(error) != "undefined") {
                console.log(error);
            }
        });
    }

    // download range
    downloadRange(slice) {
        this.data[slice.block].start = slice.start;
        this.data[slice.block].end = slice.end;
        this.data[slice.block].size = slice.end - slice.start;
        // promise 
        const promise = new Promise((resolve, reject) => {
            return fetch(this.url, { 
                "headers": { "range": `bytes=${this.data[slice.block].start}-${this.data[slice.block].end}` } 
            }).then((response) => {
                if (response.ok) {
                    this.readStream(slice.block, response.body.getReader(), resolve, reject);
                } else {
                    console.log(response);
                }
            }).catch((error) => {
                console.log(error);            
            });
        });
        return this.data[slice.block].promise = promise;
    }

    // read stream
    readStream(block, reader, resolve, reject) {
        return reader.read().then((response) => {
            if(response.done) {
                // resolve data
                return resolve({ "id": this.id, "block": block, "data": this.concatenate(this.data[block].stream)});
            }
            // progress
            while(true) {
                if (typeof(this.data[block]) == "undefined" || typeof(this.data[block].pause) == "undefined") {
                    return reject();
                } else if(this.data[block].pause) {
                    setTimeout(() => { response.value = new Uint8Array(); }, 1000);
                } else {
                    break;
                }
            }
            // data
            this.acc += response.value.byteLength;
            this.loaded += response.value.byteLength;
            this.data[block].loaded += response.value.byteLength;
            this.data[block].stream.push(response.value);
            // continue
            this.readStream(block, reader, resolve, reject);
        });
    }

    // split block size
    split(size, block) {
        const offset = Math.trunc(size / block);
        const rest = size - offset;
        if (block > 1) {
            const slice = this.split(rest, block - 1);
            return [...slice, { "block": block, "start": rest + 1, "end": size }];
        } else {
            return [{ "block": block, "start": 0, "end": size }];
        }
    }

    // concatenate block buffer
    concatenate(arrays) {
        let total = arrays.reduce((acc, data) => { return acc + data.length; }, 0);
        let buffer = new Uint8Array(total);
        arrays.reduce((acc, data) => { buffer.set(data, acc); return acc + data.length; }, 0);
        return buffer;
    }

}