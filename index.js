document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const originalUpload = document.getElementById('original-upload');
    const originalInput = document.getElementById('original-input');
    const originalPreview = document.getElementById('original-preview');
    const originalImg = document.getElementById('original-img');
    const removeOriginal = document.getElementById('remove-original');

    const targetUpload = document.getElementById('target-upload');
    const targetInput = document.getElementById('target-input');
    const targetPreview = document.getElementById('target-preview');
    const targetImg = document.getElementById('target-img');
    const removeTarget = document.getElementById('remove-target');

    const swapBtn = document.getElementById('swap-btn');
    const resultSection = document.getElementById('result-section');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultImage = document.getElementById('result-image');
    const resultImg = document.getElementById('result-img');
    const enhanceBtn = document.getElementById('enhance-btn');
    const downloadBtn = document.getElementById('download-btn');
    const historyContainer = document.getElementById('history-container');

    // 存储上传的图片和URL
    let originalFile = null;
    let targetFile = null;
    let originalImageUrl = null;
    let targetImageUrl = null;
    let resultImageUrl = null;
    let historyItems = [];

    // 初始化图片上传器
    const imageUploader = createImageUploader();

    // 初始化Coze客户端
    const coze = createCozeClient({
        appId: '1114217988273', // 请替换为实际的APP ID
        keyId: 'hxVWYZAx3na6qGqIEnS8YSyrmCN5KP7aXF5IM0wh-Bk', // 请替换为实际的KEY ID
        privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0D96oDNdpVWwG
Y0/Z+7xiWCqurcpBeHOsQEB3LsuVAubg3FYhamilHNUtBF0kmddXujJ4eFKzdgTQ
UoUUc1vHnrls3iCaaKwE1miEDTjHrPLlh/jSWVbW/FJHWDhBempol5rFRNHgGxzh
G2rINgw8tV9XM7+UUKiXkvDbMiegkBt67qfw9DtSSqngIWk6TJ5yxQjCJaIXBl8s
EtbC3rRWd6GSFSGElDSGP0W0DGpeAPDl8AIW5k/71pWKWeVY03izcERaGJUIEDdc
BdZO2TfcXhEN/swsQtrSvv9qbaV5Hv3vPMnX+JrBFoiwTAdekEY3C96EIDBrduKk
1V7WFM9vAgMBAAECggEATu66A18FuwYYQcCdS4hf75iItWQ3ynV796F+4QAhfGP2
Q9Iy65kS4HaAOKi2EApkbO+Rml/cmRD+UTgrYGilbh91V3UUQ7vo1IIM9P46ysVV
ASuW9tb1C282vlG8728zYEA9N4bQnfYktcVoDPYsbRxw+/ASZnjpPvDKJryYxHhL
ZwwSFIlerZ+5rkIwYmw/ojQ2tBSehUgMjEjz/dp0oM99HPx7P/BSTzDbnAFweUDn
mAVVl/5iHKw1/Oy7fGZ0bGyYZWdO7zbkNFO7d3FmyurbCvQKUGu4jBZIkvFeQalT
WslwyAWWNxVSwfO507+sDgVpUmAqYkqDUe50jc3lWQKBgQDXahx0V0D8twr+UH+W
wYFLOwOVoIui9GSornf41vDdnD2oUhItxPnYxvGdudfrvI9vvNyebaCcqXu9mvbQ
gbd/GfEQvYtFS5Y+0DfeUgRKCSetLTa4bKv1dvTH7WWKFgmpDVyWOCmYt4KVsVu0
2SpBwULxWTAJgaZc/WN2nqlqGwKBgQDV/KJASLbcRnMMJV8OaORB1CR+pn7EwtpM
Xkdg6/zJcqmOWeaz3ya2CVMH+/E2ojcaqNcaFNOWTG0faGqyT86vDW1NIdolkwZS
ch/BHzYFBGUFYU+eKBh8nz8hVYDtcUFcJw++s2Z7Q35i56Q3eO/KOLJhAHk4j8oA
t8xiNCwFPQKBgFEmj1ugt0G87y5JQxeXBE9EByCqH5CfAwCs4VNkHc9Omce8S07k
wr7Qi5tAtMABBAQzIOWqJPR/wLb4Fv0LsQX3zuHglgPf6tT0+ecN/MGrW0AZJWEq
x0ksrCBZJYR0suT1vKh2tezrTQ15iDPED/A/jyl+0OLz7algZ8T7FpV7AoGAVwq2
bPOm/h7h+VTSP6hHAMfsOGA9PIgOB/ZpjnEvmDm94puLDit9MZrFXYAL9C8zvvJi
3McP8hkQYjA1BmcUKXyKs09LzvDpJ2woooOxk4TgGrokiq7AlyCnq0V+dhcVgQia
jPWogAdKR6z1zWKyF03MsUxiArHqdzRMPL4AEfkCgYBuLqRKgtl/ZowEj0IWxOvG
+QoaOwuFeMxa4KKnKDaBJWKqcT2VWezt5ucmU6kmRkAjvuWW4UK9q9ldVXCKvSza
j5ZXuBKy/YqzdXoB4y7TL/6pyvzUm6Xxuy/POcuDVvEV+/tr+z+/HDE9KxDTJAma
+MvlOc6fDRvGy6UQvlWyuQ==
-----END PRIVATE KEY-----` // 请替换为实际的私钥
    });

    // 上传底图 - 修改点击事件处理方式
    if (originalUpload) {
        // 只为整个上传区域添加一个点击事件
        originalUpload.addEventListener('click', function(e) {
            // 阻止事件冒泡，防止多次触发
            e.preventDefault();
            e.stopPropagation();
            originalInput.click();
        });
    }

    // 防止input元素的点击事件冒泡
    originalInput.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    originalInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            originalFile = e.target.files[0];
            const localImageUrl = URL.createObjectURL(originalFile);
            originalImg.src = localImageUrl;
            originalPreview.style.display = 'block';
            originalUpload.style.display = 'none';
            
            // 显示上传中状态
            const originalLoadingText = document.createElement('div');
            originalLoadingText.className = 'loading-text';
            originalLoadingText.textContent = '上传中...';
            originalPreview.appendChild(originalLoadingText);
            
            // 上传图片到服务器
            imageUploader.uploadImage(originalFile)
                .then(url => {
                    originalImageUrl = url;
                    originalLoadingText.remove();
                    checkEnableSwapButton();
                })
                .catch(error => {
                    console.error('底图上传失败:', error);
                    alert('底图上传失败: ' + error.message);
                    originalLoadingText.remove();
                });
        }
    });

    removeOriginal.addEventListener('click', function() {
        originalFile = null;
        originalImageUrl = null;
        originalImg.src = '';
        originalPreview.style.display = 'none';
        originalUpload.style.display = 'block';
        originalInput.value = '';
        checkEnableSwapButton();
    });

    // 上传目标脸图 - 修改点击事件处理方式
    if (targetUpload) {
        // 只为整个上传区域添加一个点击事件
        targetUpload.addEventListener('click', function(e) {
            // 阻止事件冒泡，防止多次触发
            e.preventDefault();
            e.stopPropagation();
            targetInput.click();
        });
    }

    // 防止input元素的点击事件冒泡
    targetInput.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    targetInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            targetFile = e.target.files[0];
            const localImageUrl = URL.createObjectURL(targetFile);
            targetImg.src = localImageUrl;
            targetPreview.style.display = 'block';
            targetUpload.style.display = 'none';
            
            // 显示上传中状态
            const targetLoadingText = document.createElement('div');
            targetLoadingText.className = 'loading-text';
            targetLoadingText.textContent = '上传中...';
            targetPreview.appendChild(targetLoadingText);
            
            // 上传图片到服务器
            imageUploader.uploadImage(targetFile)
                .then(url => {
                    targetImageUrl = url;
                    targetLoadingText.remove();
                    checkEnableSwapButton();
                })
                .catch(error => {
                    console.error('目标脸图上传失败:', error);
                    alert('目标脸图上传失败: ' + error.message);
                    targetLoadingText.remove();
                });
        }
    });

    removeTarget.addEventListener('click', function() {
        targetFile = null;
        targetImageUrl = null;
        targetImg.src = '';
        targetPreview.style.display = 'none';
        targetUpload.style.display = 'block';
        targetInput.value = '';
        checkEnableSwapButton();
    });

    // 检查是否可以启用换脸按钮
    function checkEnableSwapButton() {
        swapBtn.disabled = !(originalImageUrl && targetImageUrl);
    }

    // 开始换脸处理
    swapBtn.addEventListener('click', function() {
        if (originalImageUrl && targetImageUrl) {
            // 显示结果区域和加载指示器
            resultSection.style.display = 'block';
            loadingIndicator.style.display = 'flex';
            resultImage.style.display = 'none';
            
            // 滚动到结果区域
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
            // 调用Coze API进行换脸
            coze.swapFace(originalImageUrl, targetImageUrl)
                .then(resultUrl => {
                    // 解析API返回的结果
                    try {
                        // resultUrl已经是解析后的对象，不需要再次解析
                        const parsedData = resultUrl;
                        
                        if (parsedData.success === true) {
                            // 成功情况，检查data字段
                            if (parsedData.data) {
                                // 有结果图片URL
                                resultImageUrl = parsedData.data;
                                resultImg.src = resultImageUrl;
                                loadingIndicator.style.display = 'none';
                                resultImage.style.display = 'block';
                                addToHistory(resultImageUrl);
                            } else {
                                // data为null但success为true，显示msg
                                alert(parsedData.msg || '处理成功，但未返回图片');
                                loadingIndicator.style.display = 'none';
                            }
                        } else {
                            // 处理失败，显示错误信息
                            alert(parsedData.opera_msg || '换脸处理失败');
                            loadingIndicator.style.display = 'none';
                        }
                    } catch (parseError) {
                        console.error('解析返回数据失败:', parseError);
                        // 如果解析失败，尝试直接使用返回的URL
                        resultImageUrl = resultUrl;
                        resultImg.src = resultImageUrl;
                        loadingIndicator.style.display = 'none';
                        resultImage.style.display = 'block';
                        addToHistory(resultImageUrl);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('换脸处理失败，请重试: ' + error.message);
                    loadingIndicator.style.display = 'none';
                });
        }
    });

    // 高清修复
    enhanceBtn.addEventListener('click', function() {
        if (resultImageUrl) {
            // 显示加载指示器
            loadingIndicator.style.display = 'flex';
            resultImage.style.display = 'none';
            
            // 模拟API调用（实际项目中替换为真实API）
            setTimeout(function() {
                // 这里应该是实际的高清修复API调用
                // fetch('https://your-api-endpoint.com/enhance', {
                //     method: 'POST',
                //     body: JSON.stringify({ imageUrl: resultImageUrl }),
                //     headers: {
                //         'Content-Type': 'application/json'
                //     }
                // })
                // .then(response => response.json())
                // .then(data => {
                //     // 处理API返回的结果
                //     resultImageUrl = data.enhancedImageUrl;
                //     resultImg.src = resultImageUrl;
                //     loadingIndicator.style.display = 'none';
                //     resultImage.style.display = 'block';
                //     addToHistory(resultImageUrl);
                // })
                // .catch(error => {
                //     console.error('Error:', error);
                //     alert('高清修复失败，请重试');
                //     loadingIndicator.style.display = 'none';
                //     resultImage.style.display = 'block';
                // });
                
                // 模拟成功响应
                loadingIndicator.style.display = 'none';
                resultImage.style.display = 'block';
                alert('高清修复完成！');
            }, 1500); // 模拟1.5秒的处理时间
        }
    });

    // 下载图片
    downloadBtn.addEventListener('click', function() {
        if (resultImageUrl) {
            const a = document.createElement('a');
            a.href = resultImageUrl;
            a.download = 'swapped-face-' + new Date().getTime() + '.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    // 添加到历史记录
    function addToHistory(imageUrl) {
        // 创建历史记录项
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // 创建历史记录图片
        const historyImg = document.createElement('img');
        historyImg.src = imageUrl;
        historyImg.alt = '历史记录';
        historyImg.addEventListener('click', function() {
            resultImg.src = imageUrl;
            resultImageUrl = imageUrl;
            resultSection.style.display = 'block';
            resultImage.style.display = 'block';
            loadingIndicator.style.display = 'none';
            resultSection.scrollIntoView({ behavior: 'smooth' });
        });
        
        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-history-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            historyItem.remove();
            // 从历史记录数组中移除
            const index = historyItems.findIndex(item => item.url === imageUrl);
            if (index !== -1) {
                historyItems.splice(index, 1);
            }
        });
        
        // 添加到历史记录项
        historyItem.appendChild(historyImg);
        historyItem.appendChild(deleteBtn);
        
        // 添加到历史记录容器
        historyContainer.appendChild(historyItem);
        
        // 添加到历史记录数组
        historyItems.push({
            url: imageUrl,
            element: historyItem
        });
    }
    
    // 支持拖放上传
    function setupDragAndDrop(dropArea, fileInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropArea.classList.add('highlight');
        }

        function unhighlight() {
            dropArea.classList.remove('highlight');
        }

        dropArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                // 直接触发input的change事件处理程序
                fileInput.files = files; // 这行在某些浏览器中可能不起作用，因为FileList是只读的
                
                // 手动处理文件
                if (fileInput === originalInput) {
                    originalFile = files[0];
                    const localImageUrl = URL.createObjectURL(files[0]);
                    originalImg.src = localImageUrl;
                    originalPreview.style.display = 'block';
                    originalUpload.style.display = 'none';
                    
                    // 显示上传中状态
                    const originalLoadingText = document.createElement('div');
                    originalLoadingText.className = 'loading-text';
                    originalLoadingText.textContent = '上传中...';
                    originalPreview.appendChild(originalLoadingText);
                    
                    // 上传图片到服务器
                    imageUploader.uploadImage(files[0])
                        .then(url => {
                            originalImageUrl = url;
                            originalLoadingText.remove();
                            checkEnableSwapButton();
                        })
                        .catch(error => {
                            console.error('底图上传失败:', error);
                            alert('底图上传失败: ' + error.message);
                            originalLoadingText.remove();
                        });
                } else if (fileInput === targetInput) {
                    targetFile = files[0];
                    const localImageUrl = URL.createObjectURL(files[0]);
                    targetImg.src = localImageUrl;
                    targetPreview.style.display = 'block';
                    targetUpload.style.display = 'none';
                    
                    // 显示上传中状态
                    const targetLoadingText = document.createElement('div');
                    targetLoadingText.className = 'loading-text';
                    targetLoadingText.textContent = '上传中...';
                    targetPreview.appendChild(targetLoadingText);
                    
                    // 上传图片到服务器
                    imageUploader.uploadImage(files[0])
                        .then(url => {
                            targetImageUrl = url;
                            targetLoadingText.remove();
                            checkEnableSwapButton();
                        })
                        .catch(error => {
                            console.error('目标脸图上传失败:', error);
                            alert('目标脸图上传失败: ' + error.message);
                            targetLoadingText.remove();
                        });
                }
            }
        }
    }

    // 设置拖放上传
    setupDragAndDrop(originalUpload, originalInput);
    setupDragAndDrop(targetUpload, targetInput);
});