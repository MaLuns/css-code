(function () {
    const dom = document;
    const layouts = ['top', 'left', 'bottom', 'right']
    let currentLayout = 'left';
    // 按钮
    const layoutButton = dom.getElementById('layout-button')
    const runCodeButton = dom.getElementById('run-code')
    const saveCodeButton = dom.getElementById('save-code')
    const logButton = dom.getElementById('log-button')
    // 布局区域
    const layoutMain = dom.getElementById('layout-main')
    const resizerBar = dom.getElementById('resizer-bar')
    const editorContainer = dom.getElementById('editor-container')
    const outputContainer = dom.getElementById('output-container')
    const outputLogTitle = dom.getElementById('output-log-title')
    const outputLogBody = dom.getElementById('output-log-body')

    const next = (item, arr) => {
        if (arr.length === 0) return
        let index = arr.findIndex(e => e === item);
        return index === -1 || index === arr.length - 1 ? arr[0] : arr[index + 1]
    }

    const toggle = (el, className) => {
        if (el) {
            let key = el.classList.contains(className) ? 'remove' : 'add'
            el.classList[key](className)
        }
    }

    const editor = new VEditor(
        window._CODE_INFO,
        {
            config: {
                vs_path: window._VS_PATH,
            },
            container: editorContainer,
            preview: '#output-iframe',
            cssCDN: window._CODE_CDN && _CODE_CDN.css ? _CODE_CDN.css : [],
            jsCDN: window._CODE_CDN && _CODE_CDN.js ? _CODE_CDN.js : [],
        },
    );

    // 初始化编辑器
    editor.init().then(() => {
        // 注册插件
    })

    // 编辑器加载完成
    editor.addEventListener('reader', function () {
        this.runCode();
        dom.body.classList.remove('loading');
    })

    // 折叠
    editorContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('editor-title')) {
            let p = e.target.parentNode;
            toggle(p, 'folding');
            if (p.dataset.resizer) {
                let resizer = this.querySelector(`.resizer-x[data-editor='${p.dataset.resizer}']`)
                toggle(resizer, 'hide');
            }
        }
    })

    // 运行代码
    runCodeButton.addEventListener('click', function () {
        editor.runCode()
    })

    // 切换布局
    layoutButton.addEventListener('click', function () {
        layoutMain.classList.remove(`layout-${currentLayout}`)

        this.dataset.type = currentLayout = next(currentLayout, layouts)

        layoutMain.classList.add(`layout-${currentLayout}`)
        editorContainer.style = ''
    })

    // 拖动 代码区域-预览区域 大小
    resizerBar.addEventListener('mousedown', function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);

        // 容器宽高
        let winY = dom.body.clientHeight;
        let winX = dom.body.clientWidth;
        // 鼠标在 resizer 内 偏移坐标
        let disY = e.clientY - this.offsetTop;
        let disX = e.clientX - this.offsetLeft
        // resizer 宽高
        let h = this.offsetHeight
        let w = this.offsetWidth

        // 距离顶部距离
        let oft = layoutMain.offsetTop

        dom.onmousemove = e => {
            switch (currentLayout) {
                case 'top':
                    editorContainer.style.height = Math.min(Math.max(e.clientY - disY - oft, 0), winY - oft) + 'px'
                    break;
                case 'bottom':
                    editorContainer.style.height = Math.min(Math.max((winY - e.clientY + disY - h), 0), winY - oft) + 'px'
                    break;
                case 'left':
                    editorContainer.style.width = Math.max((e.clientX - disX), 0) + 'px'
                    break;
                case 'right':
                    editorContainer.style.width = Math.max(winX - e.clientX + disX - w, 0) + 'px'
                    break;
                default:
                    break;
            }
        };

        dom.onmouseup = () => {
            dom.onmousemove = null;
            dom.onmouseup = null;
            dom.getElementById('output-iframe').classList.remove('disable-mouse-events')
        };

        dom.getElementById('output-iframe').classList.add('disable-mouse-events')
    });

    // 拖动 预览区域-日志区域 大小
    outputLogTitle.addEventListener('mousedown', function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);

        let oh = outputContainer.offsetHeight // 整块区域高度
        let th = this.offsetHeight // 控制台 标题高度
        let dh = this.parentNode.offsetHeight // 控制台高度
        let oldY = e.clientY
        dom.onmousemove = e => {
            this.parentNode.style.height = Math.min(Math.max(dh + oldY - e.clientY, th), oh) + 'px'
        };

        dom.onmouseup = () => {
            dom.onmousemove = null;
            dom.onmouseup = null;
            dom.getElementById('output-iframe').classList.remove('disable-mouse-events')
        };

        dom.getElementById('output-iframe').classList.add('disable-mouse-events')
    });

    // 显示日志
    logButton.addEventListener('click', function () {
        toggle(dom.querySelector('.output-log'), 'hide');
    })


    // 保存
    saveCodeButton.addEventListener('click', function () {
        editor.saveAs((dom.title || 'demo') + '.html')
    })

    // 日志列表
    const getLogInfo = ({ type, message }) => {
        let div = document.createElement('div')
        div.className = `console-log console-log-${type}`
        div.innerText = message
        return div
    }

    // 清理日志
    const clearLog = () => {
        outputLogBody.innerHTML = ''
    }

    // 关闭日志面板
    dom.getElementById('close-log').addEventListener('click', function () {
        toggle(dom.querySelector('.output-log'), 'hide');
    })

    dom.getElementById('clear-log').addEventListener('click', clearLog)

    // 日志消息
    window.addEventListener('message', function (e) {
        let data = e.data
        if (data.type === 'iframe-error') {
            outputLogBody.append(getLogInfo({ type: 'error', message: data.message.trim() }))
        } else if (data.type === 'runcode-console') {
            if (data.method === 'clear') {
                clearLog()
            } else {
                outputLogBody.append(getLogInfo({ type: data.method, message: data.args.join('') }))
            }
        }
    })
})()