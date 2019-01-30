'use strict';

const Fs = require('fire-fs');
const Path = require('fire-path');

Editor.Panel.extend({
    style: Fs.readFileSync(
        Editor.url("packages://excel2json/panel/index.css"),
        "utf-8"
    ),

    template: Fs.readFileSync(
        Editor.url("packages://excel2json/panel/index.html"),
        "utf-8"
    ),

    $: {},

    ready() {
        new window.Vue({
            el: this.shadowRoot,
            data: {
                txtUpdate: '点击更新Excel',
                txtConvert: '全部生成Json',
                txtConvertOne: '生成',
                items: [
                ]
            },
            methods: {
                onClickUpdate(event) {
                    event.stopPropagation();
                    let localExcelDir = "excel";
                    Editor.Ipc.sendToMain('excel2json:update-excel', localExcelDir, (err, data) => {
                        if (err) {
                            Editor.log(err);
                            return;
                        }
                        this.items = [];

                        let prefixSpace = function (str, length) {
                            return (str + "                    ").substr(0, length);
                        };
                        for (let i = 0; i < data.length; i++) {
                            if (Path.extname(data[i]) === ".xlsx") {
                                this.items.push({
                                    message: prefixSpace(data[i], 20)//Path.join(Editor.projectInfo.path, localExcelDir, data[i])
                                });
                            }
                        }
                    });
                },

                onClickConvert(event) {
                    event.stopPropagation();
                    Editor.log("Convert");
                },

                onClickConvertOne(index) {
                    Editor.log("Convert ", index);
                }
            },
        });
    },

    messages: {
        'greeting'(event, question) {
            Editor.log(question);
            if (event.reply) {
                //if no error, the first argument should be null
                event.reply(null, 'Fine, thank you!');
            }
        }
    },
});