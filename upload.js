/**
 * 图片上传工具类
 * 负责将图片上传到s6z1.com服务器并获取URL
 */
(function() {
    'use strict';

    class ImageUploader {
        constructor() {
            this.apiUrl = 'https://s6z1.com/banwei/api/upload/';
            this.apiToken = 'cc9bc04d177231638f4a';
        }

        /**
         * 上传图片文件到服务器
         * @param {File} file - 要上传的图片文件
         * @returns {Promise<string>} - 返回上传后的图片URL
         */
        async uploadImage(file) {
            try {

                const formData = new FormData();
                formData.append('api_token', this.apiToken);
                formData.append('upload_format', 'file');
                formData.append('uploadedFile', file);

                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    body: formData
                });


                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('上传失败，响应内容:', errorText);
                    throw new Error(`上传失败: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();


                if (data.status !== 'success') {
                    throw new Error(`上传失败: ${data.resultData || '未知错误'}`);
                }

                return data.url; // 返回图片URL
            } catch (error) {
                console.error('图片上传过程中发生错误:', error);
                throw error;
            }
        }
    }

    // 暴露工厂函数供配置使用
    window.createImageUploader = () => new ImageUploader();
})();